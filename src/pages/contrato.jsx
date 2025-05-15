import { useLocation, useNavigate } from "react-router-dom";
import { cancelAlunoContrato, downloadAlunoContrato, getAluno, getAlunoContrato, resendAlunoContrato, sendAlunoContrato } from "../api/aluno";
import { useQuery } from "react-query";
import { adicionarMesData, formatarData, formatarMoeda } from "../utils";
import JoditEditor from "jodit-react";
import { useRecoilState } from "recoil";
import { stateEmpresa, useNotificacao } from "../states/states";
import { useEffect, useState } from "react";
import html2pdf from 'html2pdf.js';
import { PRODUCAO } from "../api/api";
import Pagamento from "../components/pagamento";
import { doRefundPayment, getIntentPayment } from "../api/pagamento";

function Contrato() {
    const { nConfirm, nLoading, endLoading } = useNotificacao();
    const [empresa] = useRecoilState(stateEmpresa);
    const navigate = useNavigate();
    const location = useLocation();

    const [pagando, setPagando] = useState(false);
    const [payment, setPayment] = useState(null);

    const cod_aluno = location.state?.cod_aluno;
    const cod_aluno_contrato = location.state?.cod_aluno_contrato;

    const { data: aluno } = useQuery({
        queryKey: ['aluno'],
        queryFn: () => getAluno(cod_aluno),
        enabled: !!cod_aluno
    });

    const { data: alunoContrato, refetch } = useQuery({
        queryKey: ['alunoContrato'],
        queryFn: () => getAlunoContrato(cod_aluno_contrato, empresa?.cod_empresa),
        enabled: !!cod_aluno_contrato || !!empresa?.cod_empresa
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    async function cancelContract() {
        nConfirm(null, 'Tem certeza que deseja cancelar o contrato?', async () => {
            nLoading();
            await cancelAlunoContrato(cod_aluno_contrato);
            endLoading();
            navigate(-1);
        });
    }

    async function baixarContrato(signed) {
        const url = await downloadAlunoContrato(alunoContrato?.cod_aluno_contrato, signed);
        window.open(url, '_blank');
    }

    async function resendContrato() {
        const pdfOptions = {
            margin: 10,
            filename: 'contrato.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().from(alunoContrato?.arquivo_aluno_contrato).set(pdfOptions).outputPdf('blob');

        await resendAlunoContrato(alunoContrato.cod_aluno_contrato, pdfBlob);
    }

    async function pay(pagamento) {
        const resp = await getIntentPayment(empresa.cod_empresa, pagamento.cod_aluno_contrato_pagamento);
        setPayment(resp);
        setPagando(true);
    }

    async function onPay(formaPagamento, closeLoading, paymentMethodId, geraContrato) {
        //
    }

    async function refund(pagamento) {
        nConfirm(null, 'Confirma reembolso?', async () => {
            const resp = await doRefundPayment(empresa.cod_empresa, pagamento.cod_aluno_contrato_pagamento);
            refetch();
        })
    }

    return (
        <div className="container-fluid">
            <Pagamento
                payment={payment}
                show={pagando}
                close={() => setPagando(false)}
                onPay={onPay}
                callback={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}
                aluno={aluno}
            />

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
                            <p><strong>Aluno:</strong> {aluno?.nome_aluno}</p>
                            {/* {PRODUCAO ? (
                                <p><strong>ID da assinatura:</strong> {alunoContrato?.stripe_id ?? (<label className="badge bg-danger">Não consta assinatura</label>)}</p>
                            ) : (
                                <p><strong>ID da assinatura:</strong> {alunoContrato?.dev_stripe_id ?? (<label className="badge bg-danger">Não consta assinatura</label>)}</p>
                            )} */}
                            <p><strong>ID do contrato:</strong> {alunoContrato?.autentique_aluno_contrato ?? (<label className="badge bg-danger">Não consta contrato</label>)}</p>
                            <p><strong>Valor total:</strong> {formatarMoeda(alunoContrato?.total_aluno_contrato)}</p>
                            <p><strong>Expiração:</strong> {formatarData(alunoContrato?.expiracao_aluno_contrato)}</p>
                            <p><strong>Forma de cobrança: </strong> {alunoContrato?.formapagamento_aluno_contrato}</p>
                            <p><strong>Status: </strong>
                                <label className="badge bg-info">{alunoContrato?.status_aluno_contrato}</label>
                            </p>

                            <div className="d-flex gap-3">
                                {/* {(!alunoContrato?.stripe_id && !alunoContrato?.dev_stripe_id && !alunoContrato?.dev_invoice_stripe_id && !alunoContrato?.invoice_stripe_id) && (
                                    <button className="btn btn-sm btn-outline-success rounded" onClick={cancelContract}>Criar pagamento</button>
                                )} */}
                                <button className="btn btn-sm btn-outline-danger rounded" onClick={cancelContract}>Solicitar cancelamento</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Resumo</h5>
                        </div>

                        <div className="card-body">
                            <div className="d-flex flex-column bg-light p-3 rounded fs-3">
                                {alunoContrato?.parcela_aluno_contrato && JSON.parse(alunoContrato?.parcela_aluno_contrato).map((parcela, index) => (
                                    <label key={index} className={(alunoContrato?.pagamentos?.filter((p) => p.status_aluno_contrato_pagamento == 'Pago'))?.length >= index && 'text-decoration-line-through'}>
                                        {index + 1} - {formatarMoeda(parcela)} - {adicionarMesData(alunoContrato.iniciopagamento_aluno_contrato, index)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {(alunoContrato?.autentique_aluno_contrato != 'Contrato recusado.' && alunoContrato?.autentique_aluno_contrato) && (
                            <>
                                <button
                                    disabled={!alunoContrato?.autentique_aluno_contrato}
                                    className="btn btn-info rounded w-100"
                                    onClick={() => baixarContrato(false)}
                                >
                                    Baixar contrato
                                </button>

                                <button
                                    disabled={!alunoContrato?.autentique_aluno_contrato || alunoContrato?.statusautentique_aluno_contrato !== 'O aluno assinou o contrato.'}
                                    className="btn btn-success rounded w-100"
                                    onClick={() => baixarContrato(true)}
                                >
                                    Baixar contrato (assinado)
                                </button>
                            </>
                        )}

                        {(alunoContrato?.autentique_aluno_contrato == 'Contrato recusado.' && !alunoContrato?.autentique_aluno_contrato) && (
                            <button
                                className="btn btn-info"
                                onClick={resendContrato}
                            >
                                Reenviar contrato
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Pagamentos</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="display table table-striped table-hover">
                            {alunoContrato?.pagamentos.map((pagamento, index) => (
                                <tr key={index} className={`border rounded ${pagamento.status_aluno_contrato_pagamento == 'CONFIRMED' ? 'border-success' : 'border-warning'}`}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <div className="col-md-12 d-flex flex-column">
                                            <label>{formatarData(pagamento.data_aluno_contrato_pagamento)}</label>
                                            <label className="fs-2 text-muted">{pagamento.statustexto_aluno_contrato_pagamento}</label>
                                            <div className="d-flex gap-2 mt-2">
                                                {pagamento.status_aluno_contrato_pagamento == 'Pendente' && <label className="badge bg-warning">Pendente</label>}
                                                {pagamento.status_aluno_contrato_pagamento == 'requires_payment_method' && <label className="badge bg-warning">Pendente</label>}
                                                {pagamento.status_aluno_contrato_pagamento == 'succeeded' && <label className="badge bg-success">Pago</label>}
                                                {pagamento.status_aluno_contrato_pagamento == 'refund' && <label className="badge bg-danger">Reembolsado</label>}
                                                {/* {pagamento.status_aluno_contrato_pagamento == 'RECEIVED' && <label className="badge bg-success">Recebida</label>} */}
                                                
                                                <label className="badge bg-danger">{formatarData(pagamento.expiracao_aluno_contrato_pagamento)}</label>
                                                <label className="badge bg-info">{formatarMoeda(pagamento.valor_aluno_contrato_pagamento)}</label>
                                                <label className="badge bg-success">{pagamento.forma_aluno_contrato_pagamento}</label>

                                                {pagamento.forma_aluno_contrato_pagamento == 'PIX' && <label className="badge bg-warning">PIX</label>}
                                                {pagamento.forma_aluno_contrato_pagamento == 'CREDIT_CARD' && <label className="badge bg-warning">Cartão de crédito</label>}
                                            </div>
                                        </div>
                                    </th>
                                    <td>
                                        <span className={`w-100 d-flex justify-content-end gap-2`}>
                                            {pagamento.status_aluno_contrato_pagamento == 'requires_payment_method' && (
                                                <button onClick={() => pay(pagamento)} className="btn btn btn-outline-success rounded">
                                                    <i className="bi bi-check-circle me-2" />
                                                    Pagar
                                                </button>
                                            )}
                                            {pagamento.status_aluno_contrato_pagamento == 'succeeded' && (
                                                <button onClick={() => refund(pagamento)} className="btn btn btn-outline-danger rounded">
                                                    <i className="bi bi-check-circle me-2" />
                                                    Reembolsar
                                                </button>
                                            )}
                                        </span>
                                        {/* <span className={`w-100 d-flex justify-content-end gap-2 ${pagamento.status_aluno_contrato_pagamento == 'CONFIRMED' ? '' : 'd-none'}`}>
                                            <button disabled className="btn btn btn-outline-primary rounded">
                                                <i className="bi bi-check-circle me-2" />
                                                Exportar NF
                                            </button>
                                        </span> */}
                                        {/* <span className={`w-100 d-flex justify-content-end gap-2 ${pagamento.status_aluno_contrato_pagamento == 'PENDING' ? '' : 'd-none'}`}>
                                            <button className={`btn btn btn-outline-success rounded ${pagamento?.forma_aluno_contrato_pagamento !== 'PIX' && 'd-none'}`}>
                                                <i className="bi bi-check-circle me-2" />
                                                Pagar
                                            </button>
                                        </span> */}
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
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
    )
}

export default Contrato;