import { useLocation, useNavigate } from "react-router-dom";
import { cancelAlunoContrato, getAluno, getAlunoContrato, sendAlunoContrato } from "../api/aluno";
import { useQuery } from "react-query";
import { adicionarMesData, formatarData, formatarMoeda } from "../utils";
import JoditEditor from "jodit-react";
import { useRecoilState } from "recoil";
import { stateEmpresa, useNotificacao } from "../states/states";
import { useEffect } from "react";
import html2pdf from 'html2pdf.js';

function Contrato() {
    const { nConfirm } = useNotificacao();
    const [empresa] = useRecoilState(stateEmpresa);
    const navigate = useNavigate();
    const location = useLocation();

    const cod_aluno = location.state?.cod_aluno;
    const cod_aluno_contrato = location.state?.cod_aluno_contrato;

    const { data: aluno } = useQuery({
        queryKey: ['aluno'],
        queryFn: () => getAluno(cod_aluno),
        enabled: !!cod_aluno
    });

    const { data: alunoContrato } = useQuery({
        queryKey: ['alunoContrato'],
        queryFn: () => getAlunoContrato(cod_aluno_contrato, empresa?.cod_empresa),
        enabled: !!cod_aluno_contrato || !!empresa?.cod_empresa
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    async function sendEmail() {
        const pdfOptions = {
            margin: 10,
            filename: 'contrato.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().from(alunoContrato.arquivo_aluno_contrato).set(pdfOptions).outputPdf('blob');

        await sendAlunoContrato(alunoContrato.cod_aluno_contrato, pdfBlob);
    }

    async function cancelContract() {
        nConfirm(null, 'Tem certeza que deseja cancelar o contrato?', async () => {
            await cancelAlunoContrato(cod_aluno_contrato);
            navigate(-1);
        });
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
                            <p><strong>Aluno:</strong> {aluno?.nome_aluno}</p>
                            <p><strong>ID do contrato:</strong> {alunoContrato?.id_aluno_contrato}</p>
                            <p><strong>Valor total:</strong> {formatarMoeda(alunoContrato?.total_aluno_contrato)}</p>
                            <p><strong>Expiração:</strong> {formatarData(alunoContrato?.expiracao_aluno_contrato)}</p>
                            <p><strong>Status: </strong>
                                {alunoContrato?.status_aluno_contrato == 'P' && <label className="badge bg-warning">Pendente</label>}
                                {alunoContrato?.status_aluno_contrato == 'B' && <label className="badge bg-danger">Bloqueado</label>}
                                {alunoContrato?.status_aluno_contrato == 'B' && <label className="badge bg-danger">Cancelado</label>}
                                {alunoContrato?.status_aluno_contrato == 'B' && <label className="badge bg-success">Ativo</label>}
                            </p>

                            <button className="btn btn-sm btn-outline-danger rounded" onClick={cancelContract}>Solicitar cancelamento</button>
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
                                    <label key={index}>{index + 1} - {formatarMoeda(parcela)} - {adicionarMesData(alunoContrato.iniciopagamento_aluno_contrato, index)}</label>
                                ))}
                            </div>
                        </div>
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
                                        <div className="col-md-6 d-flex flex-column">
                                            <label>Pagamento</label>
                                            <div className="d-flex gap-2 mt-2">
                                                {pagamento.status_aluno_contrato_pagamento == 'PENDING' && <label className="badge bg-warning">Pendente</label>}
                                                {pagamento.status_aluno_contrato_pagamento == 'CONFIRMED' && <label className="badge bg-success">Pago</label>}
                                                {pagamento.status_aluno_contrato_pagamento == 'RECEIVED' && <label className="badge bg-success">Recebida</label>}
                                                
                                                <label className="badge bg-primary">{formatarData(pagamento.expiracao_aluno_contrato_pagamento)}</label>
                                                <label className="badge bg-info">{formatarMoeda(pagamento.valor_aluno_contrato_pagamento)}</label>

                                                {pagamento.forma_aluno_contrato_pagamento == 'PIX' && <label className="badge bg-warning">PIX</label>}
                                                {pagamento.forma_aluno_contrato_pagamento == 'CREDIT_CARD' && <label className="badge bg-warning">Cartão de crédito</label>}

                                            </div>
                                        </div>
                                    </th>
                                    <td>
                                        <span className={`w-100 d-flex justify-content-end gap-2`}>
                                            <button disabled className="btn btn btn-outline-primary rounded">
                                                <i className="bi bi-check-circle me-2" />
                                                Exportar NF
                                            </button>
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