import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateUser } from "../../api/user";
import { changeUsuarioIMG } from "../../api/usuario";
import ImageCropModal from "../../components/cutImg";
import { stateUsuario } from "../../states/states";
import { dataURLToBlob } from "../../utils";

function MinhaConta() {
   const { handleSubmit, register, setValue, watch } = useForm();
   const navigate = useNavigate();

   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [showModal, setShowModal] = useState(false);
   const [image, setImage] = useState(null);
   const [cropper, setCropper] = useState(null);
   const [editing, setEditing] = useState(false);

   useEffect(() => {
      Object.keys(usuario).forEach((key) => {
         setValue(key, usuario[key]);
      });
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
         changeUsuarioIMG(formData, { cod_usuario: usuario.cod_usuario })
            .then((resp) => {
               if (resp.id) setusuario({ ...usuario, imagem_usuario: resp.id });
               setShowModal(false);
               setCropper(null);
            })
            .catch((error) => {
               console.error("Erro ao salvar imagem recortada:", error);
            });
      }
   };

   async function HandleConfirm(data) {
      const usuario = await createOrUpdateUser(data);
      setusuario(usuario);
   }

   return (
      <div className="container-fluid">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <div className="card">
            <form onSubmit={HandleConfirm} className="card-body">
               <h5 className="card-title fw-semibold mb-4">Minha Conta</h5>

               <div className="row mb-5">
                  <div className="col-sm-5 text-center flex-column d-flex align-items-center justify-content-center">
                     <img
                        src={
                           usuario.imagem_usuario
                              ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                              : "https://placehold.co/150x150?text=img"
                        }
                        alt="Foto do Usuário"
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

                  <div className={`col-sm-5 mt-4`}>
                     <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <p className={`${editing ? "d-none" : ""}`}>{usuario.nome_usuario}</p>
                        <input className={`${!editing ? "d-none" : ""} form-control`} {...register("nome_usuario")} />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <p className={`${editing ? "d-none" : ""}`}>{usuario.email_usuario}</p>
                        <p className={`${!editing ? "d-none" : ""}`}>Não é possível editar o E-mail de cadastro</p>
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Telefone</label>
                        <p className={`${editing ? "d-none" : ""}`}>{usuario.telefone_usuario || "Não informado"}</p>
                        <input
                           className={`${!editing ? "d-none" : ""} form-control`}
                           {...register("telefone_usuario")}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Celular</label>
                        <p className={`${editing ? "d-none" : ""}`}>{usuario.celular_usuario || "Não informado"}</p>
                        <input
                           className={`${!editing ? "d-none" : ""} form-control`}
                           {...register("celular_usuario")}
                        />
                     </div>
                     <div className="mb-3">
                        <label className="form-label">Endereço</label>
                        <p className={`${editing ? "d-none" : ""}`}>{usuario.cep_usuario}</p>
                        <p className={`${editing ? "d-none" : ""}`}>
                           {usuario.endereco_usuario || "Não informado"} {usuario.numero_usuario}{" "}
                           {usuario.complemento_usuario}
                        </p>
                        <p className={`${editing ? "d-none" : ""}`}>
                           {usuario.cidade_usuario} {usuario.estado_usuario}
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

export default MinhaConta;
