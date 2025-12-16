import JoditEditor from "jodit-react";
import { Check, Clipboard, MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteContract, downloadContract, getContract } from "../../api/contracts";
import { markPaymentReceived } from "../../api/payments";
import { getStudent } from "../../api/student";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTrigger,
} from "../../components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useNotificacao } from "../../states/states";
import { formatarData, formatarMoeda } from "../../utils";

function Contrato() {
   const { nConfirm, nLoading, endLoading } = useNotificacao();
   const navigate = useNavigate();
   const location = useLocation();

   const cod_aluno = location.state?.cod_aluno;
   const cod_aluno_contrato = location.state?.cod_aluno_contrato;

   const { data: aluno } = useQuery({
      queryKey: ["aluno"],
      queryFn: () => getStudent(cod_aluno),
      enabled: !!cod_aluno,
   });

   const { data: alunoContrato } = useQuery({
      queryKey: ["alunoContrato"],
      queryFn: () => getContract(cod_aluno_contrato),
      enabled: !!cod_aluno_contrato,
   });

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

   async function cancelContract() {
      nConfirm(null, "Tem certeza que deseja cancelar o contrato?", async () => {
         nLoading();
         await deleteContract(cod_aluno_contrato);
         endLoading();
         navigate(-1);
      });
   }

   async function baixarContrato(signed) {
      const url = await downloadContract(alunoContrato?.autentique_aluno_contrato, signed);
      window.open(url, "_blank");
   }

   async function onRecieved(id) {
      await markPaymentReceived(id);
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <Card>
            <CardHeader>
               <CardTitle>
                  Contrato do aluno <strong>{aluno?.nome_aluno}</strong>
               </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-3">
               <div className="grid grid-cols-1 lg:col-span-2 gap-3">
                  <Label>
                     ID do contrato:{" "}
                     <strong>{alunoContrato?.autentique_aluno_contrato ?? "Não consta contrato"}</strong>
                  </Label>

                  <Label>
                     Valor total: <strong>{formatarMoeda(alunoContrato?.total_aluno_contrato)}</strong>
                  </Label>

                  <Label>
                     Vencimento: <strong>{formatarData(alunoContrato?.expiracao_aluno_contrato)}</strong>
                  </Label>

                  <Label>
                     Forma de cobrança: <strong>{alunoContrato?.formapagamento_aluno_contrato}</strong>
                  </Label>

                  <Label>
                     Forma de pagamento: <strong>{alunoContrato?.tipopagamento_aluno_contrato}</strong>
                  </Label>

                  <Label>
                     Status do contrato:{" "}
                     <strong>
                        {(() => {
                           if (new Date(alunoContrato?.expiracao_aluno_contrato) < new Date())
                              return <Badge className="bg-yellow-400 text-white">Expirado</Badge>;
                           if (alunoContrato?.status_aluno_contrato == "Ativo")
                              return <Badge className="text-white">Ativo</Badge>;
                           if (alunoContrato?.status_aluno_contrato == "Inative")
                              return <Badge className="bg-red-400 text-white">Inativo</Badge>;
                           if (alunoContrato?.status_aluno_contrato == "Canceled")
                              return <Badge className="bg-red-400 text-white">Cancelado</Badge>;
                           return <Badge className="bg-yellow-400 text-white">Pendente</Badge>;
                        })()}
                     </strong>
                  </Label>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  <CardTitle>Ações</CardTitle>

                  <Button onClick={() => baixarContrato(false)} disabled={!alunoContrato?.autentique_aluno_contrato}>
                     Baixar contrato
                  </Button>
                  <Button
                     onClick={() => baixarContrato(true)}
                     disabled={
                        !alunoContrato?.autentique_aluno_contrato ||
                        alunoContrato?.statusautentique_aluno_contrato !== "O aluno assinou o contrato."
                     }
                  >
                     Baixar contrato (Assinado)
                  </Button>
                  <Button onClick={cancelContract} variant="destructive">
                     Solicitar Cancelamento
                  </Button>
               </div>
            </CardContent>
         </Card>

         <Card className="mt-3">
            <CardHeader>
               <CardTitle>Pagamentos</CardTitle>
            </CardHeader>

            <CardContent>
               {alunoContrato?.pagamentos?.length < 1 ? (
                  <p className="text-muted">Nenhum pagamento registrado</p>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableCell>Data</TableCell>
                           <TableCell>Status</TableCell>
                           <TableCell>Vencimento</TableCell>
                           <TableCell>Valor</TableCell>
                           <TableCell>A Receber</TableCell>
                           <TableCell>Identificação</TableCell>
                           <TableCell></TableCell>
                        </TableRow>
                     </TableHeader>

                     <TableBody>
                        {alunoContrato?.pagamentos?.map((pagamento, index) => (
                           <TableRow key={index} className="border-top">
                              <TableCell>{formatarData(pagamento.data_aluno_contrato_pagamento)}</TableCell>
                              <TableCell>
                                 <span className="d-block small text-muted">
                                    {pagamento.statustexto_aluno_contrato_pagamento}
                                 </span>

                                 {pagamento.status_aluno_contrato_pagamento === "refunded" && (
                                    <span className="badge bg-warning-subtle text-warning mt-1">Reembolsada</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "deleted" && (
                                    <span className="badge bg-danger-subtle text-danger mt-1">Removida</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "overdue" && (
                                    <span className="badge bg-danger-subtle text-danger mt-1">Vencido</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "confirmed" && (
                                    <span className="badge bg-info-subtle text-info mt-1">Confirmado</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "succeeded" && (
                                    <span className="badge bg-success-subtle text-success mt-1">Disponível</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "paid" && (
                                    <span className="badge bg-success-subtle text-success mt-1">Repassado</span>
                                 )}
                                 {pagamento.status_aluno_contrato_pagamento === "receivedCash" && (
                                    <span className="badge bg-success-subtle text-success mt-1">Recebido manual</span>
                                 )}
                                 {(pagamento.status_aluno_contrato_pagamento === "Pendente" ||
                                    pagamento.status_aluno_contrato_pagamento === "Pending") && (
                                    <span className="badge bg-warning-subtle text-warning mt-1">Pendente</span>
                                 )}
                              </TableCell>
                              <TableCell>
                                 <span className="badge bg-light text-dark">
                                    {formatarData(pagamento.expiracao_aluno_contrato_pagamento)}
                                 </span>
                              </TableCell>
                              <TableCell className="text-muted">
                                 {formatarMoeda(pagamento?.valor_aluno_contrato_pagamento)}
                              </TableCell>
                              <TableCell className="text-muted">
                                 {formatarMoeda(pagamento?.liquido_aluno_contrato_pagamento)}
                              </TableCell>
                              <TableCell>
                                 <span className="badge bg-warning-subtle text-dark">
                                    {pagamento.stripe_payment_id || pagamento.asaas_id}
                                 </span>
                              </TableCell>
                              <TableCell>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger>
                                       <Button variant="ghost" size="icon">
                                          <MoreHorizontal />
                                       </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                       <DropdownMenuItem
                                          className="cursor-pointer"
                                          onClick={() =>
                                             window.open(pagamento?.asaas_url, "_blank", "noopener,noreferrer")
                                          }
                                       >
                                          <Clipboard />
                                          Link de pagamento
                                       </DropdownMenuItem>

                                       {(pagamento.status_aluno_contrato_pagamento === "Pending" ||
                                          pagamento.status_aluno_contrato_pagamento === "overdue" ||
                                          pagamento.status_aluno_contrato_pagamento === "Pendente") && (
                                          <div>
                                             <Dialog>
                                                <DialogTrigger asChild>
                                                   <Button variant="ghost" className="ps-2 py-0.5">
                                                      <Check />
                                                      Marcar como recebido
                                                   </Button>
                                                </DialogTrigger>

                                                <DialogContent className="col-md-3 col-12">
                                                   <DialogHeader>
                                                      <h5 className="text-start card-title">
                                                         Confirmação de pagamento recebido
                                                      </h5>
                                                   </DialogHeader>

                                                   <p>
                                                      Ao confirmar o pagamento, a cobrança será cancelada
                                                      automaticamente, pois entendemos que você recebeu o valor por
                                                      outro meio manualmente.
                                                   </p>

                                                   <DialogFooter>
                                                      <DialogClose>
                                                         <button className="btn btn-danger rounded">Fechar</button>
                                                      </DialogClose>

                                                      <button
                                                         className="btn btn-success rounded"
                                                         onClick={() => onRecieved(pagamento.asaas_id)}
                                                      >
                                                         Confirmar
                                                      </button>
                                                   </DialogFooter>
                                                </DialogContent>
                                             </Dialog>
                                          </div>
                                       )}
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}
            </CardContent>
         </Card>

         <Card className="mt-3">
            <CardHeader>
               <CardTitle>Contrato</CardTitle>
            </CardHeader>

            <CardContent>
               {alunoContrato?.arquivo_aluno_contrato && (
                  <JoditEditor
                     value={alunoContrato?.arquivo_aluno_contrato}
                     config={{
                        readonly: true, // ou true, se for só para visualização
                        toolbar: false, // esconde a barra de ferramentas
                        toolbarInline: false,
                        showXPathInStatusbar: false,
                        showCharsCounter: false,
                        showWordsCounter: false,
                        showStatusbar: false,
                        buttons: [], // garante que nenhum botão será carregado
                        removeButtons: "*", // remove todos os botões mesmo se algo vier do default
                     }}
                  />
               )}
            </CardContent>
         </Card>
      </div>
   );
}

export default Contrato;
