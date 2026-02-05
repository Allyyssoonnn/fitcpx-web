import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createOrUpdateCompany, updateImageCompany } from "../../../api/companies";
import ImageCropModal from "../../../components/cutImg";
import FitFormUI from "../../../components/fitUI/fitForm.ui";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { useNotificacao } from "../../../states/states";
import { dataURLToBlob, searchCEP, states } from "../../../utils";

function Business({ empresa, setempresa, usuario }) {
   const { tSuccess } = useNotificacao();
   const form = useForm({ defaultValues: empresa });
   const {
      setValue,
      handleSubmit,
      watch,
      setFocus,
      formState: { errors },
   } = form;
   const [showModal, setShowModal] = useState(false);
   const [image, setImage] = useState(null);
   const [cropper, setCropper] = useState(null);

   useEffect(() => {
      if (empresa) {
         Object.keys(empresa).forEach((key) => {
            setValue(key, empresa[key]);
         });
      }
   }, [empresa]);

   const cepValue = watch("cep_empresa");

   useEffect(() => {
      const handleSearch = async () => {
         const cepLimpo = String(cepValue)?.replace(/\D/g, "") ?? "";

         if (cepLimpo.length === 8) {
            try {
               const data = await searchCEP(cepLimpo);

               if (data.city) setValue("cidade_empresa", data.city);
               if (data.neighbord) setValue("bairro_empresa", data.neighbord);
               if (data.state) setValue("estado_empresa", data.state);
               if (data.address) setValue("endereco_empresa", data.address);

               setTimeout(() => setFocus("numero_empresa"), 100);
            } catch (error) {
               console.error("Failed to fetch CEP:", error);
            }
         }
      };

      handleSearch(); // Execute it
   }, [cepValue, setValue, setFocus]); // Added setFocus to dependencies for safety

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         setImage(event.target.result);
         setShowModal(true); // Open the modal
      };

      reader.readAsDataURL(file);
   };

   const handleModalConfirm = (croppedImage) => {
      if (croppedImage) {
         const croppedBlob = dataURLToBlob(croppedImage);

         const formData = new FormData();
         formData.append("image", croppedBlob, "cropped_image.jpg");

         // Save the cropped image
         updateImageCompany(formData, { cod_empresa: empresa.cod_empresa })
            .then((url) => {
               if (url) setempresa({ ...empresa, imagem_empresa: url });
               setShowModal(false);
               setCropper(null);
            })
            .catch((error) => {
               console.error("Erro ao salvar imagem recortada:", error);
            });
      }
   };

   const handleModalClose = () => {
      setShowModal(false);
      if (cropper) {
         cropper.destroy();
      }
      setCropper(null);
   };

   async function HandleConfirm(data) {
      const empresa = await createOrUpdateCompany(data);
      setempresa(empresa);
      tSuccess("Alteração confirmada");
   }

   return (
      <div className="row">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
               <CardHeader>
                  <CardTitle>Foto Profissional</CardTitle>
                  <CardDescription>Altere a foto que será pública para os alunos</CardDescription>
               </CardHeader>

               <CardContent>
                  <div className="text-center d-flex flex-column align-items-center">
                     <img
                        src={
                           empresa.imagem_empresa
                              ? `${empresa.imagem_empresa}?&t=${new Date().getTime()}`
                              : "https://placehold.co/150x150?text=img"
                        }
                        alt="Foto da Empresa"
                        className="img-fluid rounded-circle shadow-md"
                        loading="lazy"
                        width="120"
                        height="120"
                     />

                     <div className="d-flex align-items-center justify-content-center my-4 gap-6">
                        <label className="btn btn-primary" htmlFor="img_empresa">
                           <i className="bi bi-camera me-2"></i>
                           Carregar imagem
                        </label>
                        {/* <button className="btn bg-danger-subtle text-danger">Reset</button> */}
                     </div>

                     <p className="mb-0">JPG, PNG ou JPEG</p>
                     <input id="img_empresa" className="d-none" type="file" onChange={handleFileChange} />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>FitCpx</CardTitle>
               </CardHeader>

               <CardContent className="flex justify-center">
                  <img
                     src="/assets/images/logos/logo.png"
                     alt="Foto da Empresa"
                     className="img-fluid"
                     loading="lazy"
                     width="150"
                  />
               </CardContent>

               <CardFooter>
                  <p className="card-subtitle text-center">
                     Agradecemos por testar nosso app e por apoiar nosso desenvolvimento. Isso significa muito pra
                     gente!
                  </p>
               </CardFooter>
            </Card>
         </div>

         <div className="col-12 mt-3">
            <Card>
               <CardHeader>
                  <CardTitle>Informações profissionais</CardTitle>
                  <CardDescription>Informações que serão utilizadas para contrato e venda para o aluno</CardDescription>
               </CardHeader>

               <CardContent>
                  <FormProvider {...form}>
                     <form
                        onSubmit={handleSubmit(HandleConfirm)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                              e.preventDefault();
                           }
                        }}
                     >
                        <FitFormUI
                           errors={errors}
                           fields={[
                              {
                                 separator: true,
                                 cols: 2,
                                 fields: [
                                    {
                                       label: "CNPJ/CPF",
                                       id: "cnpj",
                                       inputType: "number",
                                       fieldName: "doc_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Chave PIX",
                                       id: "pix",
                                       fieldName: "pix_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                       description: "Enviaremos os repasses para essa conta",
                                    },
                                    {
                                       label: "Nome",
                                       id: "name",
                                       fieldName: "nome_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Telefone",
                                       id: "phone",
                                       containerId: "phoneField",
                                       type: "phone",
                                       fieldName: "telefone_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    { label: "E-mail", id: "email", fieldName: "email_empresa" },
                                    {
                                       label: "CEP",
                                       id: "cep",
                                       type: "number",
                                       fieldName: "cep_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Cidade",
                                       id: "city",
                                       fieldName: "cidade_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Estado",
                                       id: "state",
                                       fieldName: "estado_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                       type: "select",
                                       selectOptions: states,
                                    },
                                    {
                                       label: "Endereço",
                                       id: "address",
                                       fieldName: "endereco_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Número",
                                       id: "number",
                                       type: "number",
                                       fieldName: "numero_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                    {
                                       label: "Bairro",
                                       id: "number",
                                       fieldName: "bairro_empresa",
                                       disabled: usuario.admin_usuario !== "S",
                                    },
                                 ],
                              },
                           ]}
                        />

                        <div className="d-flex justify-end">
                           <Button id="submit" type="submit">
                              <Check />
                              Confirmar
                           </Button>
                        </div>
                     </form>
                  </FormProvider>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}

export default Business;
