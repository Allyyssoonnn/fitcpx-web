import { getOlderPhysicalAssessments } from "@/api/companies";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function OlderPhysicalDash() {
   const navigate = useNavigate();

   const { data: physicalAssessments } = useQuery({
      queryKey: "olderPhysical",
      queryFn: getOlderPhysicalAssessments,
      initialData: [],
   });

   return (
      <Card>
         <CardHeader>
            <CardDescription>Período sem avaliação</CardDescription>
         </CardHeader>

         <CardContent>
            <Table>
               <TableCaption>
                  Limitado em 5 <span className="text-primary">Avaliações</span>
               </TableCaption>

               <TableHeader>
                  <TableRow>
                     <TableHead>Aluno</TableHead>
                     <TableHead>Data</TableHead>
                     <TableHead>Período</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {physicalAssessments.map((p: any) => (
                     <TableRow>
                        <TableCell className="w-2/3">{p?.aluno?.nome_aluno}</TableCell>
                        <TableCell>
                           {!!p?.ultima_avaliacao && new Date(p?.ultima_avaliacao).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                           <Badge>{p?.dias_sem_avaliacao} Dias</Badge>
                        </TableCell>
                     </TableRow>
                  ))}

                  {!physicalAssessments.length && (
                     <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                           Sem resultados
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}
