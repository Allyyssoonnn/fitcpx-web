import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { stateEmpresa, stateUsuario } from "../../states/states";
import Account from "./config/account";
import Business from "./config/business";
import License from "./config/license";
import Payments from "./config/payments";

function Configuracao() {
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [empresa, setempresa] = useRecoilState(stateEmpresa);

   const [tabAtiva, setTabAtiva] = useState("account");

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");

      const map = {
         1: "account",
         2: "business",
         3: "security",
         4: "bills",
      };

      if (tab && map[tab]) setTabAtiva(map[tab]);
   }, []);

   const tabs = [
      { id: "account", label: "Conta", icon: "bi-person" },
      { id: "business", label: "Dados profissionais", icon: "bi-building" },
      { id: "security", label: "Licença", icon: "bi-unlock" },
      { id: "bills", label: "Pagamentos", icon: "bi-cash" },
   ];

   return (
      <div className="container-fluid">
         <Card>
            <CardHeader>
               <ul className="nav nav-pills user-profile-tab" id="pills-tab" role="tablist">
                  {tabs.map((tab) => (
                     <li key={tab.id} className="nav-item" role="presentation">
                        <button
                           id={`tab-${tab.id}`}
                           className={`nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3 ${
                              tabAtiva === tab.id ? "active" : ""
                           }`}
                           type="button"
                           onClick={() => setTabAtiva(tab.id)}
                        >
                           <i className={`bi ${tab.icon} me-2`}></i>
                           <span className="d-none d-md-block">{tab.label}</span>
                        </button>
                     </li>
                  ))}
               </ul>
            </CardHeader>

            <CardContent>
               <div className="tab-content" id="pills-tabContent">
                  {tabAtiva === "account" && (
                     <div className="tab-pane fade show active">
                        <Account usuario={usuario} setusuario={setusuario} />
                     </div>
                  )}
                  {tabAtiva === "business" && (
                     <div className="tab-pane fade show active">
                        <Business empresa={empresa} setempresa={setempresa} usuario={usuario} />
                     </div>
                  )}
                  {tabAtiva === "security" && (
                     <div className="tab-pane fade show active">
                        <License />
                     </div>
                  )}
                  {tabAtiva === "bills" && (
                     <div className="tab-pane fade show active">
                        <Payments cod_empresa={empresa.cod_empresa} />
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default Configuracao;
