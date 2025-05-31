import { useLocation, useNavigate } from "react-router-dom";
import { getAluno } from "../../api/aluno";
import { useQuery } from "react-query";
import { adicionarMesData, formatarData, formatarMoeda } from "../../utils";
import JoditEditor from "jodit-react";
import { useRecoilState } from "recoil";
import { stateEmpresa, useNotificacao } from "../../states/states";
import { useEffect, useState } from "react";
import html2pdf from 'html2pdf.js';
import Pagamento from "../../components/payment/pagamento";
import { doRefundPayment, getIntentPayment } from "../../api/pagamento";
import { getAlunoSessaoPacote } from "../../api/sessao";

function PacoteSessao() {
    const { nConfirm, nLoading, endLoading } = useNotificacao();
    const [empresa] = useRecoilState(stateEmpresa);
    const navigate = useNavigate();
    const location = useLocation();

    const [pagando, setPagando] = useState(false);
    const [payment, setPayment] = useState(null);

    const cod_aluno = location.state?.cod_aluno;
    const cod_aluno_sessao_pacote = location.state?.cod_aluno_sessao_pacote;

    const { data: aluno } = useQuery({
        queryKey: ['aluno'],
        queryFn: () => getAluno(cod_aluno),
        enabled: !!cod_aluno
    });

    const { data: alunoSessao, refetch } = useQuery({
        queryKey: ['alunoContrato'],
        queryFn: () => getAlunoSessaoPacote(cod_aluno_sessao_pacote),
        enabled: !!cod_aluno_sessao_pacote || !!empresa?.cod_empresa
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
                client={aluno}
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
                            <p><strong>Pacote:</strong> {alunoSessao?.nome_aluno_sessao_pacote}</p>
                            <p><strong>Valor total:</strong> {formatarMoeda(alunoSessao?.valor_aluno_sessao_pacote)}</p>
                            <p><strong>Expiração:</strong> {formatarData(alunoSessao?.expiracao_aluno_sessao_pacote)}</p>
                            <p><strong>Forma de cobrança: </strong> {alunoSessao?.formapagamento_aluno_sessao_pacote}</p>
                            <p><strong>Status: </strong>
                                <label className="badge bg-info">{alunoSessao?.status_aluno_sessao_pacote === 'succeeded' && 'Pago'}</label>
                                <label className="badge bg-info">{alunoSessao?.status_aluno_sessao_pacote === 'requires_payment_method' && 'Pendente'}</label>
                            </p>

                            <div className="d-flex gap-3">
                                {/* {(!alunoContrato?.stripe_id && !alunoContrato?.dev_stripe_id && !alunoContrato?.dev_invoice_stripe_id && !alunoContrato?.invoice_stripe_id) && (
                                    <button className="btn btn-sm btn-outline-success rounded" onClick={cancelContract}>Criar pagamento</button>
                                )} */}
                                {/* <button className="btn btn-sm btn-outline-danger rounded" onClick={cancelContract}>Solicitar cancelamento</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3 fw-semibold text-dark">Pagamentos</h5>

                    {alunoSessao?.sessoes?.length < 1 ? (
                        <p className="text-muted">Nenhum pagamento registrado</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle">
                                <thead className="text-secondary small text-uppercase">
                                    <tr>
                                        <th>Data</th>
                                        <th>Status</th>
                                        <th>Modalidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alunoSessao?.sessoes?.map((sessao, index) => (
                                        <tr key={index} className="border-top">
                                            <td>{sessao.data_aluno_sessao_modalidade ? formatarData(sessao.data_aluno_sessao_modalidade) : 'Agendar'}</td>
                                            <td>
                                                <span className="d-block small text-muted">{sessao.statustexto_aluno_contrato_pagamento}</span>

                                                {sessao.status_aluno_sessao_modalidade === 'Pending' && (
                                                    <span className="badge bg-warning-subtle text-warning mt-1">Sessão pendente</span>
                                                )}

                                                {sessao.status_aluno_sessao_modalidade === 'Used' && (
                                                    <span className="badge bg-success-subtle text-success mt-1">Sessão realizada</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {sessao.modalidade?.nome_modalidade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PacoteSessao;