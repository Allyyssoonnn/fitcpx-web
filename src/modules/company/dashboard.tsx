import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhysicalAssessmentType } from "@/types/physicalAssessment";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getDashboardInfo } from "../../api/companies";
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
      queryFn: getDashboardInfo,
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
               <UltimasAvaliacoes lastPhysicalAssessments={dashboard?.lastPhysicalAssessments} />
            </div>

            <div className="col-lg-4">
               <InfoTotais lengths={dashboard?.lengths} />
            </div>
         </div>
      </div>
   );
}

function InfoTotais({ lengths }: DashboardProps) {
   const { t } = useTranslation("dashboard");

   return (
      <Card>
         <CardHeader>
            <CardTitle>{t("overview")}</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="d-flex flex-column">
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
         </CardContent>
      </Card>
   );
}

function UltimasAvaliacoes({ lastPhysicalAssessments }) {
   const { t } = useTranslation("dashboard");

   return (
      <Card>
         <CardHeader>
            <CardTitle>{t("recentPhysicalAssessament")}</CardTitle>
         </CardHeader>

         <CardContent>
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
         </CardContent>
      </Card>
   );
}

export default Dashboard;
