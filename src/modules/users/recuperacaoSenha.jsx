import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { updatePassword } from "../../api/user";

function RecuperacaoSenha() {
   const { register, handleSubmit } = useForm();
   const location = useLocation();
   const [token, setToken] = useState("");
   const [senhaAlterada, setSenhaAlterada] = useState(false);

   useEffect(() => {
      (async function load() {
         const token = new URLSearchParams(location.search).get("token");
         setToken(token);
      })();
   }, []);

   async function submit(data) {
      if (data.nova_senha !== data.repete_nova_senha) {
         toast.error("A senhas não são iguais!");
         return;
      }

      const resp = await updatePassword(token, data.nova_senha);
      if (resp) setSenhaAlterada(true);
   }

   return (
      <div className="page-wrapper p-0 bg-success" id="main-wrapper" style={{ marginLeft: "0" }}>
         <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex justify-content-center align-items-center">
            <div className="d-flex align-items-center justify-content-center w-100">
               <div className="row justify-content-center w-100">
                  <div className="col-md-8 col-lg-6 col-xxl-3">
                     <div className="card mb-0 shadow-lg">
                        {!senhaAlterada && (
                           <form onSubmit={handleSubmit(submit)} className="card-body">
                              <div className="text-nowrap logo-img d-flex py-2 d-flex justify-content-center align-items-center">
                                 <img src="../assets/images/logos/logo.png" width="60" alt="" />
                                 <h1 className="mb-0 ms-3">Fit Cpx</h1>
                              </div>

                              <h5 className="text-center">Recuperar senha</h5>

                              <div className="border mb-3" />

                              <div className="mb-3">
                                 <label className="form-label">Nova senha</label>
                                 <input
                                    type="password"
                                    {...register("nova_senha", { required: "Nova senha obrigarória!" })}
                                    className="form-control"
                                 />
                              </div>

                              <div className="mb-3">
                                 <label className="form-label">Repetir nova senha</label>
                                 <input
                                    type="password"
                                    {...register("repete_nova_senha", { required: "Repetir nova senha obrigarória!" })}
                                    className="form-control"
                                 />
                              </div>

                              <button type="submit" className="btn btn-success w-100">
                                 Confirmar
                              </button>
                           </form>
                        )}

                        {senhaAlterada && (
                           <div className="card-body text-center d-flex flex-column gap-3">
                              <i className="bi bi-check-circle fs-10 text-success" />

                              <h5 className="card-title">Senha alterada!</h5>

                              <a href="https://fitcpx.com" className="btn btn-success rounded">
                                 Voltar ao site
                              </a>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default RecuperacaoSenha;
