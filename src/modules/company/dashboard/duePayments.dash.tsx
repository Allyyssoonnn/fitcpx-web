import { getDuePayments } from "@/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clipboard, MessageCircle } from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { formatarData } from "../../../utils/utils";

export default function DuePaymentsDash() {
   const navigate = useNavigate();

   const { data: duePayments } = useQuery({
      queryKey: "duePayments",
      queryFn: getDuePayments,
      initialData: [],
   });

   return (
      <Card>
         <CardHeader>
            <CardDescription>Pagamentos Vencidos</CardDescription>
         </CardHeader>

         <CardContent>
            <Table>
               <TableCaption>
                  Todos pagamentos vencidos disponível em{" "}
                  <a href="#" onClick={() => navigate("/financeOverview")} className="text-primary">
                     Resumo Financeiro
                  </a>
               </TableCaption>

               <TableHeader>
                  <TableRow>
                     <TableHead>Aluno</TableHead>
                     <TableHead>Data</TableHead>
                     <TableHead>Opções</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {duePayments.map((p: any) => {
                     const text = `Olá ${
                        p?.contract?.aluno?.nome_aluno
                     }, identificamos um pagamento pendente com vencimento em ${formatarData(
                        p?.expiracao_aluno_contrato_pagamento
                     )}. referente ao seu contrato ${
                        p?.contract?.descricao_aluno_contrato
                     }. Estou encaminhando o link de pagamento.\n\n${p?.asaas_url}`;
                     // Codifica o texto para URL
                     const encodedText = encodeURIComponent(text);

                     return (
                        <TableRow>
                           <TableCell className="w-2/3">{p?.contract?.aluno?.nome_aluno}</TableCell>
                           <TableCell>
                              {!!p?.expiracao_aluno_contrato_pagamento &&
                                 formatarData(p?.expiracao_aluno_contrato_pagamento)}
                           </TableCell>
                           <TableCell className="d-flex gap-3">
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => window.open(p?.asaas_url, "_blank", "noopener,noreferrer")}
                              >
                                 <Clipboard />
                                 Link
                              </Button>

                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() =>
                                    window.open(
                                       `https://wa.me/${p?.contract?.aluno?.telefone_aluno}?text=${encodedText}`,
                                       "_blank"
                                    )
                                 }
                              >
                                 <MessageCircle />
                                 Contato
                              </Button>
                           </TableCell>
                        </TableRow>
                     );
                  })}

                  {!duePayments.length && (
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
