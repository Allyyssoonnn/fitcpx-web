import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateCompany } from "../../api/companies";
import { changeEmpresaIMG } from "../../api/usuario";
import ImageCropModal from "../../components/cutImg";
import { stateEmpresa } from "../../states/states";
import { dataURLToBlob } from "../../utils";

function MinhaEmpresa() {
   const { handleSubmit, register, setValue, watch } = useForm();
   const navigate = useNavigate();

   const [empresa, setempresa] = useRecoilState(stateEmpresa);
   const [showModal, setShowModal] = useState(false);
   const [image, setImage] = useState(null);
   const [cropper, setCropper] = useState(null);
   const [editing, setEditing] = useState(false);

   useEffect(() => {
      Object.keys(empresa).forEach((key) => {
         setValue(key, empresa[key]);
      });
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

   const handleModalClose = () => {
      setShowModal(false);
      if (cropper) {
         cropper.destroy();
      }
      setCropper(null);
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

   async function HandleConfirm(data) {
      const empresa = await createOrUpdateCompany(data);
      setempresa(empresa);
   }

   return (
      <div className="container-fluid">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <div className="card">
            <form onSubmit={HandleConfirm} className="card-body">
               <h5 className="card-title fw-semibold mb-4">Minha Empresa</h5>

               <div className="row mb-5">
                  <div className="col-sm-5 d-flex flex-column justify-content-center align-items-center">
                     <div className="text-center flex-column d-flex align-items-center justify-content-center h-50">
                        <img
                           src={
                              empresa.imagem_empresa
                                 ? `${empresa.imagem_empresa}?&t=${new Date().getTime()}`
                                 : "https://placehold.co/150x150?text=img"
                           }
                           alt="Foto da Empresa"
                           className="img-fluid rounded-circle shadow-md"
                           style={{ width: "150px", height: "150px" }}
                           loading="lazy"
                        />
                        <label className="btn btn-sm btn-info mt-2" htmlFor="img_aluno">
                           <i className="bi bi-camera me-2"></i>
                           Carregar
                        </label>

                        <input id="img_aluno" className="d-none" type="file" onChange={handleFileChange} />
                     </div>
                  </div>

                  <div className={`col-sm-5 mt-4`}>
                     <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <p className={`${editing ? "d-none" : ""}`}>{empresa.nome_empresa}</p>
                        <input className={`${!editing ? "d-none" : ""} form-control`} {...register("nome_usuario")} />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <p className={`${editing ? "d-none" : ""}`}>{empresa.email_empresa}</p>
                        <p className={`${!editing ? "d-none" : ""}`}>Não é possível editar o E-mail de cadastro</p>
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Telefone</label>
                        <p className={`${editing ? "d-none" : ""}`}>{empresa.telefone_empresa || "Não informado"}</p>
                        <input
                           className={`${!editing ? "d-none" : ""} form-control`}
                           {...register("telefone_usuario")}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Celular</label>
                        <p className={`${editing ? "d-none" : ""}`}>{empresa.celular_empresa || "Não informado"}</p>
                        <input
                           className={`${!editing ? "d-none" : ""} form-control`}
                           {...register("celular_usuario")}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Endereço</label>
                        <p className={`${editing ? "d-none" : ""}`}>{empresa.cep_empresa}</p>
                        <p className={`${editing ? "d-none" : ""}`}>
                           {empresa.endereco_empresa || "Não informado"} {empresa.numero_empresa}{" "}
                           {empresa.complemento_empresa}
                        </p>
                        <p className={`${editing ? "d-none" : ""}`}>
                           {empresa.cidade_empresa} {empresa.estado_empresa}
                        </p>
                     </div>
                  </div>
               </div>
            </form>

            <div className="card-footer d-flex justify-content-between">
               {!editing ? (
                  <button
                     className="btn btn-warning"
                     onClick={(e) => {
                        e.preventDefault();
                        setEditing(true);
                     }}
                  >
                     <i className="bi bi-pencil me-2"></i>Editar
                  </button>
               ) : (
                  <button className="btn btn-success" type="submit">
                     <i className="bi bi-pencil me-2"></i>Confirmar
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}

export default MinhaEmpresa;
