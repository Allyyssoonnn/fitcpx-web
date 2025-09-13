import { getDashboard } from "@/api/app";
import { PhysicalAssessmentType } from "@/types/physicalAssessment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { createOrUpdateCompany } from "../../api/companies";
import { resendConfirmationCode } from "../../api/user";
import { stateEmpresa } from "../../states/states";
import { formatarData } from "../../utils";

type DashboardProps = {
   lengths: {
      users: number;
      workouts: number;
      physicalAssessments: number;
      clients: number;
   };
   lastPhysicalAssessments: PhysicalAssessmentType[];
};

function Dashboard() {
   const { data: dashboard } = useQuery<DashboardProps>({
      queryKey: ["dashboard"],
      queryFn: getDashboard,
      initialData: {
         lengths: {
            users: 0,
            workouts: 0,
            physicalAssessments: 0,
            clients: 0,
         },
         lastPhysicalAssessments: [],
      },
   });

   return (
      <div className="container-fluid">
         <div className="row">
            <div className="col-lg-8">
               <VerifyEmail />
            </div>

            <div className="col-lg-8">
               <UltimasAvaliacoes lastPhysicalAssessments={dashboard?.lastPhysicalAssessments} />
            </div>

            <div className="col-lg-4">
               <InfoTotais lengths={dashboard?.lengths} />
            </div>
         </div>
      </div>
   );
}

function VerifyEmail() {
   const [empresa, setempresa] = useRecoilState(stateEmpresa);
   const [code, setCode] = useState("");

   function verificarEmail() {
      const count = Number(localStorage.getItem("emailCount"));
      if (count >= 5) {
         toast.error("Muitos E-mail solicitado, aguarde para tentar novamente");
         return;
      }
      localStorage.setItem("emailCount", count ? count + 1 : 1);
      resendConfirmationCode(empresa.cod_empresa);
   }

   async function confirmEmail() {
      if (code !== empresa.email_codigo) {
         setCode("");
         toast.error("Código incorreto");
         return;
      }

      const attEmpresa = await createOrUpdateCompany({ cod_empresa: empresa.cod_empresa, email_confirmado: "S" });
      if (attEmpresa) setempresa({ ...empresa, email_confirmado: "S" });
      toast.success("Código confirmado, obrigado");
   }

   return (
      <ul>
         <li
            className={`${
               empresa.email_confirmado == "S" ? "d-none" : "d-flex"
            } flex-row align-items-start justify-content-between gap-1 bg-warning-subtle rounded-3 p-3 ps-3`}
         >
            <div className="col-lg-6">
               <div className="d-flex align-items-center mb-0">
                  <i className="bi bi-exclamation-triangle fs-6 px-2 rounded-5 text-warning"></i>
                  <h6 className="fs-3 mb-0">E-mail não verificado</h6>
               </div>
               <p className="mb-2">Confirme seu E-mail para aproveitar todos nosso recursos</p>
               <button onClick={verificarEmail} className="btn btn-sm btn-outline-info rounded ms-3">
                  Enviar código novamente
               </button>
            </div>

            <div className="col-lg-4">
               <div className="d-flex align-items-center">
                  <input
                     id="email-code"
                     className="form-control"
                     placeholder="XXXX"
                     maxLength={4}
                     onChange={(e) => setCode(e.target.value)}
                     value={code}
                  />
                  <button id="confirm-email" onClick={confirmEmail} className="btn btn-sm btn-info rounded ms-3">
                     Verificar
                  </button>
               </div>
            </div>
         </li>
      </ul>
   );
}

function InfoTotais({ lengths }: DashboardProps) {
   const { t } = useTranslation("dashboard");

   return (
      <div className="card shadow-sm rounded-4">
         <div className="card-body">
            <div className="d-flex flex-column">
               <h6 className="card-title">{t("overview")}</h6>

               <div className="d-flex border-bottom py-3">
                  <span className="rounded-circle round-48 mb-4 bg-success-subtle text-success d-flex align-items-center justify-content-center">
                     <i className="bi bi-person"></i>
                  </span>

                  <div className="ms-3">
                     <h6>{t("clientsOverview")}</h6>
                     <div className="d-flex align-items-center gap-2">
                        <h3 className="mb-0">{lengths?.clients}</h3>
                     </div>
                  </div>
               </div>

               <div className="d-flex border-bottom py-3">
                  <span className="rounded-circle round-48 mb-4 bg-info-subtle text-info d-flex align-items-center justify-content-center">
                     <i className="bi bi-bar-chart"></i>
                  </span>

                  <div className="ms-3">
                     <h6>{t("physicalAssessamentsOverview")}</h6>

                     <div className="d-flex align-items-center gap-2">
                        <h3 className="mb-0">{lengths?.physicalAssessments}</h3>
                     </div>
                  </div>
               </div>

               <div className="d-flex border-bottom py-3">
                  <span className="rounded-circle round-48 mb-4 bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                     <i className="bi bi-card-checklist"></i>
                  </span>

                  <div className="ms-3">
                     <h6>{t("workoutsOverview")}</h6>

                     <div className="d-flex align-items-center gap-2">
                        <h3 className="mb-0">{lengths.workouts}</h3>
                     </div>
                  </div>
               </div>

               <div className="d-flex border-bottom py-3">
                  <span className="rounded-circle round-48 mb-4 bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center">
                     <i className="bi bi-person-gear"></i>
                  </span>

                  <div className="ms-3">
                     <h6>{t("usersOverview")}</h6>

                     <div className="d-flex align-items-center gap-2">
                        <h3 className="mb-0">{lengths.users}</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function UltimasAvaliacoes({ lastPhysicalAssessments }) {
   const { t } = useTranslation("dashboard");

   return (
      <div className="card shadow-sm rounded-4">
         <div className="card-body">
            <h5 className="card-title">{t("recentPhysicalAssessament")}</h5>

            <div className="table-responsive">
               <table className="table text-nowrap align-middle mb-0">
                  <thead>
                     <tr className="border-2 border-bottom border-primary border-0">
                        <th scope="col" className="ps-0">
                           {t("student")}
                        </th>
                        <th scope="col" className="ps-0">
                           {t("date")}
                        </th>
                        <th scope="col">{t("heigth")}</th>
                        <th scope="col" className="text-center">
                           {t("weight")}
                        </th>
                     </tr>
                  </thead>

                  <tbody className="table-group-divider">
                     {!lastPhysicalAssessments.length && (
                        <tr>
                           <td colSpan={4} className="text-center py-5">
                              {t("noPhysicalAssessaments")}
                           </td>
                        </tr>
                     )}
                     {lastPhysicalAssessments.map((physicalAssessment: LastPhysicalAssessment) => (
                        // eslint-disable-next-line react/jsx-key
                        <tr>
                           <th scope="row" className="ps-0 fw-medium">
                              {physicalAssessment?.aluno?.nome_aluno}
                           </th>
                           <th scope="row" className="ps-0 fw-medium">
                              {formatarData(physicalAssessment?.data_avaliacao)}
                           </th>
                           <td>{physicalAssessment?.altura} M</td>
                           <td className="text-center fw-medium">{physicalAssessment?.peso} KG</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
