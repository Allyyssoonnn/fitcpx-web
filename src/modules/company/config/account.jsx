import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createOrUpdateUser, updateImageUser } from "../../../api/user";
import ImageCropModal from "../../../components/cutImg";
import FitFormUI from "../../../components/fitUI/fitForm.ui";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { useNotificacao } from "../../../states/states";
import { dataURLToBlob } from "../../../utils";

function Account({ usuario, setusuario }) {
   const { nSuccess } = useNotificacao();
   const form = useForm({ defaultValues: usuario });
   const {
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = form;
   const [showModal, setShowModal] = useState(false);
   const [image, setImage] = useState(null);
   const [cropper, setCropper] = useState(null);

   useEffect(() => {
      if (usuario) {
         Object.keys(usuario).forEach((key) => {
            setValue(key, usuario[key]);
         });
      }
   }, [usuario]);

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
         updateImageUser(formData, { cod_usuario: usuario.cod_usuario })
            .then((url) => {
               if (url) setusuario({ ...usuario, imagem_usuario: url });
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
      const usuario = await createOrUpdateUser(data);
      setusuario(usuario);
      nSuccess("Alteração confirmada");
   }

   return (
      <div className="row">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
               <CardHeader>
                  <CardTitle>Foto de perfil</CardTitle>
                  <CardDescription>Altere sua foto do seu usuário</CardDescription>
               </CardHeader>

               <CardContent>
                  <div className="text-center d-flex flex-column align-items-center">
                     <img
                        src={
                           usuario.imagem_usuario
                              ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                              : "https://placehold.co/150x150?text=img"
                        }
                        alt="Foto do Usuário"
                        className="img-fluid rounded-circle shadow-md"
                        loading="lazy"
                        width="120"
                        height="120"
                     />

                     <div className="d-flex align-items-center justify-content-center my-4 gap-6">
                        <label className="btn btn-primary" htmlFor="img_aluno">
                           <i className="bi bi-camera me-2"></i>
                           Carregar imagem
                        </label>
                     </div>

                     <p className="mb-0">JPG, PNG ou JPEG</p>
                     <input id="img_aluno" className="d-none" type="file" onChange={handleFileChange} />
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
                  <CardTitle>Informações pessoais</CardTitle>
                  <CardDescription>Para alterar informações pessoais edite e salve aqui</CardDescription>
               </CardHeader>

               <CardContent>
                  <FormProvider {...form}>
                     <form onSubmit={handleSubmit(HandleConfirm)}>
                        <FitFormUI
                           errors={errors}
                           fields={[
                              {
                                 separator: true,
                                 cols: 2,
                                 fields: [
                                    {
                                       label: "CPF",
                                       fieldName: "cpf_usuario",
                                    },
                                    {
                                       label: "Chave PIX",
                                       id: "pix",
                                       fieldName: "pix_usuario",
                                       description: "Enviaremos os repasses para essa conta",
                                    },
                                    {
                                       label: "Nome",
                                       fieldName: "nome_usuario",
                                    },
                                    {
                                       label: "Celular",
                                       type: "phone",
                                       fieldName: "celular_usuario",
                                    },
                                    {
                                       label: "E-mail",
                                       inputType: "email",
                                       fieldName: "email_usuario",
                                       options: {
                                          disabled: true,
                                       },
                                    },
                                    {
                                       label: "CEP",
                                       fieldName: "cep_usuario",
                                    },
                                    {
                                       label: "Cidade",
                                       fieldName: "cidade_usuario",
                                    },
                                    {
                                       label: "Estado",
                                       fieldName: "estado_usuario",
                                    },
                                    {
                                       label: "Endereço",
                                       fieldName: "endereco_usuario",
                                    },
                                    {
                                       label: "Número",
                                       fieldName: "numero_usuario",
                                    },
                                    {
                                       label: "Bairro",
                                       fieldName: "bairro_usuario",
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

export default Account;
