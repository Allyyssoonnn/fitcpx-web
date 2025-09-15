import { useQuery } from "react-query";
import { getCompaniesLicenses } from "../../api/companies";
import { formatarData, formatarMoeda } from "../../utils";

function Payments() {
   const { data: licenses } = useQuery({
      queryKey: ["payments"],
      queryFn: getCompaniesLicenses,
      initialData: [],
   });

   return (
      <div className="container-fluid px-0">
         {licenses.map((license, i) => (
            <div key={i} className="card mb-4 border-0 shadow-sm">
               <div className="card-body">
                  <h5 className="mb-3 fw-semibold text-dark">
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
                  </h5>

                  {license?.payments?.length < 1 ? (
                     <p className="text-muted">Nenhum registro de pagamento</p>
                  ) : (
                     <div className="table-responsive">
                        <table className="table table-borderless align-middle">
                           <thead className="text-secondary small text-uppercase">
                              <tr>
                                 <th>Vencimento</th>
                                 <th>Status</th>
                                 <th>Expiração período</th>
                                 <th>Valor</th>
                                 <th>Forma</th>
                                 <th className="text-end">Ações</th>
                              </tr>
                           </thead>
                           <tbody>
                              {license.payments.map((payment, index) => (
                                 <tr key={index} className="border-top">
                                    <td>{formatarData(payment.data_empresa_licenca_pagamento)}</td>
                                    <td>
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
                                    </td>
                                    <td>
                                       <span className="badge bg-light text-dark">
                                          {formatarData(payment.expiracao_empresa_licenca_pagamento)}
                                       </span>
                                    </td>
                                    <td>
                                       <span className="text-muted">
                                          {formatarMoeda(payment.valor_empresa_licenca_pagamento)}
                                       </span>
                                    </td>
                                    <td>
                                       <span className="badge bg-warning-subtle text-dark">
                                          {payment.forma_empresa_licenca_pagamento}
                                       </span>
                                    </td>
                                    <td className="text-end">
                                       {payment.status_empresa_licenca_pagamento !== "succeeded" &&
                                          payment.status_empresa_licenca_pagamento !== "confirmed" &&
                                          payment.status_empresa_licenca_pagamento !== "Canceled" && (
                                             <button
                                                onClick={() =>
                                                   window.open(payment?.asaas_url, "_blank", "noopener,noreferrer")
                                                }
                                                className="btn btn-sm btn-outline-success"
                                             >
                                                <i className="bi bi-credit-card me-1" />
                                                Pagar
                                             </button>
                                          )}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
   );
}

export default Payments;
