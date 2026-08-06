import { getDashboardInfo } from "@/api/companies";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Dumbbell, LucideIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardProps = {
   lengths: {
      users: number;
      workouts: number;
      physicalAssessments: number;
      clients: number;
   };
   list: {
      clients: { id: string; label: string; label2: string }[];
      physicalAssessments: { id: string; label: string; label2: string }[];
      workouts: { id: string; label: string; label2: string }[];
   };
   monthLengths: {
      users: number;
      workouts: number;
      physicalAssessments: number;
      clients: number;
   };
};

const metrics: {
   label: string;
   description: string;
   Icon: LucideIcon;
   route: string;
   key: keyof DashboardProps["lengths"];
   arrayKey?: keyof DashboardProps["list"];
   onClick?: (navigate: ReturnType<typeof useNavigate>, id: any) => void;
}[] = [
   // { label: "Usuários", description: "Quantidade de usuários ativos", key: "users", Icon: User, route: "/users" },
   {
      label: "Alunos ativos",
      description: "Quantidade de alunos ativos",
      key: "clients",
      Icon: Users,
      route: "/alunos",
      arrayKey: "clients",
      onClick: (navigate: ReturnType<typeof useNavigate>, id: any) => navigate("/aluno", { state: { cod_aluno: id } }),
   },
   {
      label: "Avaliações realizadas",
      description: "Quantidade de avaliações cadastradas",
      key: "physicalAssessments",
      Icon: ClipboardList,
      route: "#",
      arrayKey: "physicalAssessments",
   },
   {
      label: "Treinos cadastrados",
      description: "Quantidade de treinos cadastrados",
      key: "workouts",
      Icon: Dumbbell,
      route: "/treinos",
      arrayKey: "workouts",
   },
];

export default function OverviewDash() {
   const navigate = useNavigate();
   const { data: dashboard, isLoading } = useQuery<DashboardProps>({
      queryKey: ["dashboard"],
      queryFn: getDashboardInfo,
      initialData: {
         lengths: {
            users: 0,
            workouts: 0,
            physicalAssessments: 0,
            clients: 0,
         },
         list: {
            clients: [],
            physicalAssessments: [],
            workouts: [],
         },
         monthLengths: {
            users: 0,
            workouts: 0,
            physicalAssessments: 0,
            clients: 0,
         },
      },
   });

   return (
      <Card className="mb-3">
         <CardContent className="grid grid-cols-3 gap-4">
            {metrics.map(({ label, description, route, Icon, key, arrayKey, onClick }, i) => (
               <div
                  key={i}
                  className="cursor-pointer transition-transform hover:scale-99 border-l-4 border-l-green-200"
               >
                  <CardHeader>
                     <CardDescription>{label}</CardDescription>
                     <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {dashboard?.lengths[key] ?? 0}
                     </CardTitle>
                  </CardHeader>

                  <CardFooter>
                     <span className="text-green-600 font-bold me-1">+ {dashboard?.monthLengths[key] ?? 0} </span> este
                     mês
                     {/* <div className="text-muted-foreground">{description}</div> */}
                     {/* {arrayKey && dashboard?.list?.[arrayKey] && (
                     <Table>
                        <TableRow className="text-[12px] flex justify-between">
                           <TableCell className="fw-bold">Nome</TableCell>
                           <TableCell className="fw-bold">Data Cadastro</TableCell>
                        </TableRow>
                        {dashboard?.list?.[arrayKey].map((client) => (
                           <TableRow
                              key={client.id}
                              className="text-[12px] flex justify-between"
                              onClick={() => onClick?.(navigate, client.id)}
                           >
                              <TableCell>{client.label}</TableCell>
                              <TableCell>{client.label2}</TableCell>
                           </TableRow>
                        ))}
                     </Table>
                  )} */}
                  </CardFooter>
               </div>
            ))}
         </CardContent>
      </Card>
   );
}
