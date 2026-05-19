import { getDashboardInfo } from "@/api/companies";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableRow } from "@/components/ui/table";
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
      label: "Alunos",
      description: "Quantidade de alunos ativos",
      key: "clients",
      Icon: Users,
      route: "/alunos",
      arrayKey: "clients",
      onClick: (navigate: ReturnType<typeof useNavigate>, id: any) => navigate("/aluno", { state: { cod_aluno: id } }),
   },
   {
      label: "Avaliações",
      description: "Quantidade de avaliações cadastradas",
      key: "physicalAssessments",
      Icon: ClipboardList,
      route: "#",
      arrayKey: "physicalAssessments",
   },
   {
      label: "Treinos",
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
      },
   });

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
         {metrics.map(({ label, description, route, Icon, key, arrayKey, onClick }, i) => (
            <Card key={i} className="cursor-pointer transition-transform hover:scale-97">
               <CardHeader>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-3xl p-2">
                     {dashboard?.lengths[key] ?? 0}
                  </CardTitle>

                  <CardAction>
                     <Badge variant="outline">
                        {/* <TrendingUp />0 % */}
                        <Icon color="green" />
                     </Badge>
                  </CardAction>
               </CardHeader>

               <CardFooter className="flex-col items-start gap-1.5 text-sm border-t p-0">
                  {/* <div className="text-muted-foreground">{description}</div> */}
                  {arrayKey && dashboard?.list?.[arrayKey] && (
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
                  )}
               </CardFooter>
            </Card>
         ))}
      </div>
   );
}
