import { getLastActivities } from "@/api/companies";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

export default function LastActivitiesDash() {
   const { data: LastActivities } = useQuery({
      queryKey: "lastActivities",
      queryFn: getLastActivities,
      initialData: [],
   });

   return (
      <Card>
         <CardHeader>
            <CardDescription>Últimas atividades</CardDescription>
         </CardHeader>

         <CardContent>
            <Table>
               <TableCaption>
                  Limitado em 5 <span className="text-primary">Atividades</span>
               </TableCaption>

               <TableHeader>
                  <TableRow>
                     <TableHead>Aluno</TableHead>
                     <TableHead>Atividade</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {LastActivities.map((item: any) => (
                     <TableRow>
                        <TableCell className="w-2/3">{item.name}</TableCell>
                        <TableCell>
                           {item.type == "student" && "Novo aluno"}
                           {item.type == "assessment" && "Nova avaliação"}
                           {item.type == "workout" && "Novo treino"}
                        </TableCell>
                     </TableRow>
                  ))}

                  {!LastActivities.length && (
                     <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                           Nenhuma atividade recente
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}
