import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
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
         <ul className="nav nav-pills flex gap-3 mb-3">
            {tabs.map((tab) => (
               <li key={tab.id} className="nav-item" role="presentation">
                  <Button
                     variant={tabAtiva === tab.id ? "default" : "outline"}
                     id={`tab-${tab.id}`}
                     // className={`nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3 ${
                     //    tabAtiva === tab.id ? "active" : ""
                     // }`}
                     type="button"
                     onClick={() => setTabAtiva(tab.id)}
                  >
                     <i className={`bi ${tab.icon}`}></i>
                     <span className="d-none d-md-block ms-2">{tab.label}</span>
                  </Button>
               </li>
            ))}
         </ul>

         <Card>
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
