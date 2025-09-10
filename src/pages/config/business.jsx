import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { changeEmpresaIMG, setEmpresa } from "../../api/usuario";
import ImageCropModal from "../../components/cutImg";
import { useNotificacao } from "../../states/states";
import { dataURLToBlob } from "../../utils";

function Business({ empresa, setempresa, usuario }) {
   const { nSuccess } = useNotificacao();
   const { register, setValue, handleSubmit } = useForm();
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
         changeEmpresaIMG(formData, { cod_empresa: empresa.cod_empresa })
            .then((resp) => {
               if (resp.id) setempresa({ ...empresa, imagem_empresa: resp.id });
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
      const empresa = await setEmpresa(data);
      setempresa(empresa);
      nSuccess("Alteração confirmada");
   }

   return (
      <div className="row">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <div className="col-lg-6 d-flex align-items-stretch">
            <div className="card w-100 border position-relative overflow-hidden">
               <div className="card-body p-4">
                  <h4 className="card-title">Foto da empresa</h4>
                  <p className="card-subtitle mb-4">Altere a foto da empresa aqui!</p>
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
               </div>
            </div>
         </div>

         <div className="col-lg-6 d-flex align-items-stretch">
            <div className="card w-100 border position-relative overflow-hidden">
               <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                  <h4 className="card-title">Fit Cpx</h4>
                  <img
                     src="/assets/images/logos/logo.png"
                     alt="Foto da Empresa"
                     className="img-fluid"
                     loading="lazy"
                     width="150"
                  />
                  <p className="card-subtitle text-center">
                     Agradecemos por testar nosso app e por apoiar nosso desenvolvimento. Isso significa muito pra
                     gente!
                  </p>
               </div>
            </div>
         </div>

         <div className="col-12">
            <div className="card w-100 border position-relative overflow-hidden mb-0">
               <div className="card-body p-4">
                  <h4 className="card-title">Informações da empresa</h4>
                  <p className="card-subtitle mb-4">Para alterar informações da empresa edite e salve aqui!</p>
                  <form onSubmit={handleSubmit(HandleConfirm)}>
                     <div className="row">
                        <div className="col-lg-6">
                           <div className="mb-3">
                              <label htmlFor="exampleInputtext" className="form-label">
                                 CNPJ/CPF
                              </label>
                              <input
                                 id="cnpj"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("doc_empresa")}
                              />
                           </div>
                        </div>

                        <div className="col-lg-6">
                           <div className="mb-3">
                              <label className="form-label">Chave PIX</label>
                              <input
                                 id="pix"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("pix_empresa")}
                              />
                              <p className="text-info fs-2" role="alert">
                                 Enviaremos os repasses para essa conta
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="row">
                        <div className="col-lg-6">
                           <div className="mb-3">
                              <label htmlFor="exampleInputtext" className="form-label">
                                 Nome
                              </label>
                              <input
                                 id="name"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("nome_empresa")}
                              />
                           </div>

                           <div className="mb-3">
                              <label htmlFor="exampleInputtext" className="form-label">
                                 Descrição
                              </label>
                              <input
                                 id="description"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("descricao_empresa")}
                              />
                           </div>

                           <div className="mb-3">
                              <label htmlFor="exampleInputtext1" className="form-label">
                                 Telefone
                              </label>
                              <input
                                 id="phone"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("telefone_empresa")}
                              />
                           </div>

                           <div className="mb-3">
                              <label htmlFor="exampleInputtext" className="form-label">
                                 CEP
                              </label>
                              <input
                                 id="cep"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("cep_empresa")}
                              />
                           </div>
                        </div>

                        <div className="col-lg-6">
                           <div className="mb-3">
                              <label htmlFor="exampleInputtext1" className="form-label">
                                 Email
                              </label>
                              <input id="email" disabled className="form-control" {...register("email_empresa")} />
                           </div>

                           <div className="mb-3">
                              <label htmlFor="exampleInputtext" className="form-label">
                                 Razão social
                              </label>
                              <input
                                 id="razao-social"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("razao_social_empresa")}
                              />
                           </div>

                           <div className="mb-3">
                              <label htmlFor="exampleInputtext3" className="form-label">
                                 Celular
                              </label>
                              <input
                                 id="cellphone"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("celular_empresa")}
                              />
                           </div>

                           <div className="mb-3 row">
                              <div className="mb-3 col-6">
                                 <label className="form-label">Cidade</label>
                                 <input
                                    id="city"
                                    disabled={usuario.admin_usuario !== "S"}
                                    className="form-control"
                                    {...register("cidade_empresa")}
                                 />
                              </div>

                              <div className="mb-3 col-6">
                                 <label className="form-label">Estado</label>
                                 <input
                                    id="state"
                                    disabled={usuario.admin_usuario !== "S"}
                                    className="form-control"
                                    {...register("estado_empresa")}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="col-12 row">
                           <div className="col-10">
                              <label htmlFor="exampleInputtext4" className="form-label">
                                 Endereço
                              </label>
                              <input
                                 id="address"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("endereco_empresa")}
                              />
                           </div>

                           <div className="col-2">
                              <label htmlFor="exampleInputtext4" className="form-label">
                                 Número
                              </label>
                              <input
                                 id="number"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="form-control"
                                 {...register("numero_empresa")}
                              />
                           </div>
                        </div>

                        <div className="col-12">
                           <div className="d-flex align-items-center justify-content-end mt-4 gap-6">
                              <button
                                 id="submit"
                                 disabled={usuario.admin_usuario !== "S"}
                                 className="btn btn-success"
                                 type="submit"
                              >
                                 Salvar
                              </button>
                              {/* <button disabled={usuario.admin_usuario !== 'S'} className="btn bg-danger-subtle text-danger">Descartar</button> */}
                           </div>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Business;
