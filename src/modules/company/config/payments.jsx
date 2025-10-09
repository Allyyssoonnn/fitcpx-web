import { CreditCard } from "lucide-react";
import { useQuery } from "react-query";
import { getCompaniesLicenses } from "../../../api/companies";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { formatarData, formatarMoeda } from "../../../utils";

function Payments() {
   const { data: licenses } = useQuery({
      queryKey: ["payments"],
      queryFn: getCompaniesLicenses,
      initialData: [],
   });

   return (
      <div className="container-fluid">
         <p className="text-center text-muted">Seus pagamentos serão listados aqui</p>

         {licenses.map((license, i) => (
            <Card key={i} className="mt-3">
               <CardHeader>
                  <CardTitle className="mb-3 fw-semibold text-dark">
                     Plano: {license?.licenca?.nome_licenca}
                     {license.status_empresa_licenca === "Active" && (
                        <span className="badge bg-success-subtle text-success ms-2">Ativa</span>
                     )}
                     {(license.status_empresa_licenca === "Blocked" ||
                        license.status_empresa_licenca === "requires_payment_method") && (
                        <span className="badge bg-warning-subtle text-warning ms-2">Bloqueado</span>
                     )}
                     {license.status_empresa_licenca === "Canceled" && (
                        <span className="badge bg-danger-subtle text-danger ms-2">Cancelado</span>
                     )}
                  </CardTitle>
               </CardHeader>

               <CardContent>
                  {license?.payments?.length < 1 ? (
                     <p className="text-muted">Nenhum registro de pagamento</p>
                  ) : (
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableCell>Vencimento</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Data Encerramento</TableCell>
                              <TableCell>Valor</TableCell>
                              <TableCell></TableCell>
                           </TableRow>
                        </TableHeader>

                        <TableBody>
                           {license.payments.map((payment, index) => (
                              <TableRow key={index} className="border-top">
                                 <TableCell>{formatarData(payment.data_empresa_licenca_pagamento)}</TableCell>
                                 <TableCell>
                                    {payment.status_empresa_licenca_pagamento === "succeeded" && (
                                       <span className="badge bg-success-subtle text-success">Pago</span>
                                    )}
                                    {(payment.status_empresa_licenca_pagamento === "Pendente" ||
                                       payment.status_empresa_licenca_pagamento === "Pending") && (
                                       <span className="badge bg-warning-subtle text-warning">Pendente</span>
                                    )}
                                    {payment.status_empresa_licenca_pagamento === "refund" && (
                                       <span className="badge bg-danger-subtle text-danger">Reembolsado</span>
                                    )}
                                    {payment.status_empresa_licenca_pagamento === "Canceled" && (
                                       <span className="badge bg-danger-subtle text-danger">Cancelado</span>
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    <span className="badge bg-light text-dark">
                                       {formatarData(payment.expiracao_empresa_licenca_pagamento)}
                                    </span>
                                 </TableCell>
                                 <TableCell>
                                    <span className="text-muted">
                                       {formatarMoeda(payment.valor_empresa_licenca_pagamento)}
                                    </span>
                                 </TableCell>

                                 <TableCell className="text-end">
                                    {payment.status_empresa_licenca_pagamento !== "succeeded" &&
                                       payment.status_empresa_licenca_pagamento !== "confirmed" &&
                                       payment.status_empresa_licenca_pagamento !== "Canceled" && (
                                          <Button
                                             onClick={() =>
                                                window.open(payment?.asaas_url, "_blank", "noopener,noreferrer")
                                             }
                                             className="btn btn-sm btn-outline-success"
                                          >
                                             <CreditCard />
                                             Pagar
                                          </Button>
                                       )}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  )}
               </CardContent>
            </Card>
         ))}
      </div>
   );
}

export default Payments;
