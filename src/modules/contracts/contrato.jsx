import JoditEditor from "jodit-react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { deleteContract, downloadContract, getContract } from "../../api/contracts";
import { getStudent } from "../../api/student";
import { stateEmpresa, useNotificacao } from "../../states/states";
import { formatarData, formatarMoeda } from "../../utils";

function Contrato() {
   const { nConfirm, nLoading, endLoading } = useNotificacao();
   const [empresa] = useRecoilState(stateEmpresa);
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

   return (
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-8">
               <div className="card">
                  <div className="card-header">
                     <button onClick={() => navigate(-1)} className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                     </button>
                  </div>

                  <div className="card-body">
                     <p>
                        <strong>Aluno:</strong> {aluno?.nome_aluno}
                     </p>
                     {/* {PRODUCAO ? (
                                <p><strong>ID da assinatura:</strong> {alunoContrato?.stripe_id ?? (<label className="badge bg-danger">Não consta assinatura</label>)}</p>
                            ) : (
                                <p><strong>ID da assinatura:</strong> {alunoContrato?.dev_stripe_id ?? (<label className="badge bg-danger">Não consta assinatura</label>)}</p>
                            )} */}
                     <p>
                        <strong>ID do contrato:</strong>{" "}
                        {alunoContrato?.autentique_aluno_contrato ?? (
                           <label className="badge bg-danger">Não consta contrato</label>
                        )}
                     </p>
                     <p>
                        <strong>Valor total:</strong> {formatarMoeda(alunoContrato?.total_aluno_contrato)}
                     </p>
                     <p>
                        <strong>Expiração:</strong> {formatarData(alunoContrato?.expiracao_aluno_contrato)}
                     </p>
                     <p>
                        <strong>Forma de cobrança: </strong> {alunoContrato?.formapagamento_aluno_contrato}
                     </p>
                     <p>
                        <strong>Forma de pagamento: </strong> {alunoContrato?.tipopagamento_aluno_contrato}
                     </p>
                     <p>
                        <strong>Status: </strong>
                        <label className="badge bg-info">{alunoContrato?.status_aluno_contrato}</label>
                     </p>

                     <div className="d-flex gap-3">
                        {/* {(!alunoContrato?.stripe_id && !alunoContrato?.dev_stripe_id && !alunoContrato?.dev_invoice_stripe_id && !alunoContrato?.invoice_stripe_id) && (
                                    <button className="btn btn-sm btn-outline-success rounded" onClick={cancelContract}>Criar pagamento</button>
                                )} */}
                        <button className="btn btn-sm btn-outline-danger rounded" onClick={cancelContract}>
                           Solicitar cancelamento
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-md-4">
               <div className="d-flex flex-column gap-3">
                  {alunoContrato?.autentique_aluno_contrato != "Contrato recusado." &&
                     alunoContrato?.autentique_aluno_contrato && (
                        <>
                           <button
                              disabled={!alunoContrato?.autentique_aluno_contrato}
                              className="btn btn-info rounded w-100"
                              onClick={() => baixarContrato(false)}
                           >
                              Baixar contrato
                           </button>

                           <button
                              disabled={
                                 !alunoContrato?.autentique_aluno_contrato ||
                                 alunoContrato?.statusautentique_aluno_contrato !== "O aluno assinou o contrato."
                              }
                              className="btn btn-success rounded w-100"
                              onClick={() => baixarContrato(true)}
                           >
                              Baixar contrato (assinado)
                           </button>
                        </>
                     )}

                  {alunoContrato?.autentique_aluno_contrato == "Contrato recusado." &&
                     !alunoContrato?.autentique_aluno_contrato && (
                        <button className="btn btn-info" onClick={resendContrato}>
                           Reenviar contrato
                        </button>
                     )}
               </div>
            </div>
         </div>

         <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
               <h5 className="mb-3 fw-semibold text-dark">Pagamentos</h5>

               {alunoContrato?.pagamentos?.length < 1 ? (
                  <p className="text-muted">Nenhum pagamento registrado</p>
               ) : (
                  <div className="table-responsive">
                     <table className="table table-borderless align-middle">
                        <thead className="text-secondary small text-uppercase">
                           <tr>
                              <th>Data</th>
                              <th>Status</th>
                              <th>Expiração</th>
                              <th>Valor</th>
                              <th>Identificação</th>
                              <th className="text-end">Ações</th>
                           </tr>
                        </thead>
                        <tbody>
                           {alunoContrato?.pagamentos?.map((pagamento, index) => (
                              <tr key={index} className="border-top">
                                 <td>{formatarData(pagamento.data_aluno_contrato_pagamento)}</td>
                                 <td>
                                    <span className="d-block small text-muted">
                                       {pagamento.statustexto_aluno_contrato_pagamento}
                                    </span>

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
                                    {pagamento.status_aluno_contrato_pagamento === "recievedCash" && (
                                       <span className="badge bg-success-subtle text-success mt-1">
                                          Recebido manual
                                       </span>
                                    )}
                                    {(pagamento.status_aluno_contrato_pagamento === "Pendente" ||
                                       pagamento.status_aluno_contrato_pagamento === "Pending") && (
                                       <span className="badge bg-warning-subtle text-warning mt-1">Pendente</span>
                                    )}
                                 </td>
                                 <td>
                                    <span className="badge bg-light text-dark">
                                       {formatarData(pagamento.expiracao_aluno_contrato_pagamento)}
                                    </span>
                                 </td>
                                 <td className="text-muted">
                                    {formatarMoeda(pagamento?.valor_aluno_contrato_pagamento)}
                                 </td>
                                 <td>
                                    <span className="badge bg-warning-subtle text-dark">
                                       {pagamento.stripe_payment_id || pagamento.asaas_id}
                                    </span>
                                 </td>
                                 <td className="text-end">
                                    {pagamento.status_aluno_contrato_pagamento !== "confirmed" &&
                                       pagamento.asaas_id && (
                                          <a
                                             className="btn btn-sm btn-outline-success"
                                             href={pagamento?.asaas_url}
                                             target="_blank" // Se quiser abrir em nova aba
                                             rel="noopener noreferrer" // Segurança ao usar target="_blank"
                                          >
                                             <i className="bi bi-credit-card me-1" />
                                             Pagar
                                          </a>
                                       )}

                                    {pagamento.status_aluno_contrato_pagamento === "succeeded" &&
                                       !pagamento.asaas_id && (
                                          <button
                                             onClick={() => refund(pagamento)}
                                             className="btn btn-sm btn-outline-danger"
                                          >
                                             <i className="bi bi-arrow-counterclockwise me-1" />
                                             Reembolsar
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

         <div className="card">
            <div className="card-header d-flex justify-content-between">
               <h5 className="card-title">Contrato</h5>

               {/* <button className="btn btn-info rounded" onClick={sendEmail}>Enviar E-mail para assinatura</button> */}
            </div>

            <div className="card-body">
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
            </div>
         </div>
      </div>
   );
}

export default Contrato;
