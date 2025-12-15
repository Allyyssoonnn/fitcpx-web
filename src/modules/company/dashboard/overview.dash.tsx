import { getDashboardInfo } from "@/api/companies";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Dumbbell, LucideIcon, User, Users } from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

type DashboardProps = {
   lengths: {
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
}[] = [
   { label: "Usuários", description: "Quantidade de usuários ativos", key: "users", Icon: User, route: "/users" },
   {
      label: "Treinos",
      description: "Quantidade de treinos cadastrados",
      key: "workouts",
      Icon: Dumbbell,
      route: "/treinos",
   },
   { label: "Alunos", description: "Quantidade de alunos ativos", key: "clients", Icon: Users, route: "/alunos" },
   {
      label: "Avaliações",
      description: "Quantidade de avaliações cadastradas",
      key: "physicalAssessments",
      Icon: ClipboardList,
      route: "#",
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
      },
   });

   return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
         {metrics.map(({ label, description, route, Icon, key }, i) => (
            <Card
               key={i}
               className="cursor-pointer transition-transform hover:scale-97"
               onClick={() => navigate(route)}
            >
               <CardHeader>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                     {dashboard?.lengths[key] ?? 0}
                  </CardTitle>

                  <CardAction>
                     <Badge variant="outline">
                        {/* <TrendingUp />0 % */}
                        <Icon color="green" />
                     </Badge>
                  </CardAction>
               </CardHeader>

               <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  {/* <div className="line-clamp-1 flex gap-2 font-medium">
                     Trending up this month <TrendingUp className="size-4" />
                  </div> */}
                  <div className="text-muted-foreground">{description}</div>
               </CardFooter>
            </Card>
         ))}
      </div>
   );
}
