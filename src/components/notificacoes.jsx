import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getNotifications } from "../api/companies";
import { stateEmpresa } from "../states/states";

function Notificacoes() {
   const [empresa] = useRecoilState(stateEmpresa);
   const navigate = useNavigate();

   const { data: notifications } = useQuery({
      queryKey: ["notifications"],
      queryFn: getNotifications,
      initialData: [],
      enabled: !!empresa.cod_empresa,
   });

   function clickNotify(type) {
      if (type === "Licença") navigate("/configuracao?tab=4");
   }

   return (
      <li className="nav-item dropdown nav-icon-hover-bg rounded-circle me-2">
         <a
            className="nav-link position-relative"
            href="javascript:void(0)"
            data-bs-toggle="dropdown"
            id="drop3"
            aria-expanded="false"
         >
            <i className="bi bi-bell-fill" />

            {/* Badge pequeno */}
            {notifications.length > 0 && (
               <span
                  className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                  style={{ fontSize: "0.6rem", padding: "2px 4px" }}
               >
                  {notifications.length}
               </span>
            )}

            <div className={`pulse ${notifications.length > 0 ? "" : "d-none"}`}>
               <span className="heartbit border-success"></span>
               <span className="point text-bg-success"></span>
            </div>
         </a>

         <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop3">
            <div className="d-flex align-items-center py-3 px-7 gap-6">
               <h3 className="mb-0 fs-5">Notificações</h3>
               <span className="badge bg-success-subtle text-success rounded-pill">{notifications.length}</span>
            </div>

            <div className="message-body" data-simplebar="">
               {notifications.map((notificacao, index) => (
                  <a
                     onClick={() => clickNotify(notificacao.type)}
                     key={index}
                     href="javascript:void(0)"
                     className="dropdown-item px-7 d-flex align-items-center py-6"
                  >
                     <span className="flex-shrink-0 position-relative">
                        <i className={notificacao.icon} />
                        {/* <img src=".//seodash/dist/assets/images/profile/user-4.jpg" alt="user" width="45" className="rounded-circle" /> */}
                        <span
                           className={`position-absolute top-0 start-100 translate-middle p-1 bg-${notificacao.color} border border-light rounded-circle`}
                        >
                           <span className="visually-hidden">New alerts</span>
                        </span>
                     </span>
                     <div className="w-100 d-inline-block v-middle ps-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <h6 className="mb-0">{notificacao.title}</h6>
                           <span className="fs-2 text-nowrap d-block">{notificacao.type}</span>
                        </div>
                        <span className="text-nowrap d-block mt-1 fs-11">{notificacao.content}</span>
                     </div>
                  </a>
               ))}
               {!notifications.length && <div className="d-flex justify-content-center p-3">Sem notificações</div>}
            </div>
         </div>
      </li>
   );
}

export default Notificacoes;
