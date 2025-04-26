import { useRecoilState } from "recoil";
import { stateEmpresa, useNotificacao } from "../states/states";
import { useEffect, useRef, useState } from "react";
import { setEmpresa } from "../api/usuario";
import { cashWithdrawal, getBalance, getBankExtract } from "../api/pagamento";
import { useQuery } from "react-query";
import { formatarData, formatarMoeda } from "../utils";

function ResumoFinanceiro() {
    const [empresa] = useRecoilState(stateEmpresa);

    const { data: balance } = useQuery({
        queryKey: ['balance', empresa.cod_empresa],
        queryFn: () => getBalance(empresa.cod_empresa),
        initialData: 0,
        enabled: !!empresa.cod_empresa,
    });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    <Pagamentos empresa={empresa} />
                </div>

                <div className="col-md-4">
                    <Taxas />
                    <DadosRecebimento balance={balance} />
                </div>
            </div>
        </div>
    )
}

function Pagamentos({ empresa }) {
    const [month, setMoth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const anoAtual = new Date().getFullYear();
    const anosDisponiveis = Array.from({ length: 6 }, (_, i) => anoAtual - i);

    const { data: bankExtract, refetch } = useQuery({
        queryKey: ['bankExtract', empresa.cod_empresa],
        queryFn: () => getBankExtract(empresa.cod_empresa, month, year),
        initialData: [],
        enabled: !!empresa.cod_empresa && !!month && !!year,
    });

    useEffect(() => {
        refetch();
    }, [month, year]);

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title mb-3">Resumo financeiro</h6>

                <div className="d-flex gap-2 mb-4 align-items-end">
                    <div className="flex-grow-1">
                        <label className="form-label">Mês</label>
                        <select className="form-select" value={month} onChange={e => setMoth(e.target.value)}>
                            {meses.map((mes, index) => (
                                <option key={index} value={index + 1}>{mes}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Ano</label>
                        <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
                            {anosDisponiveis.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <tbody>
                            {bankExtract.map((item, index) => {
                                const isReceived = item.value > 0;
                                const rowClass = isReceived ? 'border-start border-success' : 'border-start border-danger';
                                const valueClass = isReceived ? 'text-success' : 'text-danger';

                                return (
                                    <tr key={index} className={rowClass}>
                                        <td colSpan={2}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className={valueClass}>{formatarMoeda(item.value)}</strong>
                                                <span>Saldo: <strong>{formatarMoeda(item.balance)}</strong></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span>{item.description}</span>
                                                <small className="text-muted">Data: {formatarData(item.date)}</small>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Taxas() {
    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">Taxas</h6>
                <p>Taxa de saque: <strong>R$ 2,00/Saque</strong></p>
                <p className="text-center fs-2 m-0">Ao realizar o saque será descontado a taxa</p>
            </div>
        </div>
    )
}

function DadosRecebimento({ balance }) {
    const { nError, nLoading, endLoading } = useNotificacao();
    const pixRef = useRef(null);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const [pix, setpix] = useState(empresa?.pix_empresa || '');
    const [editPix, setEditPix] = useState(false);
    
    // Aplica o foco quando editPix muda para true
    useEffect(() => {
        if (editPix && pixRef.current) {
            pixRef.current.focus();
        }
    }, [editPix]);

    function validarPix(valor) {
        const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Formato CPF
        const regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/; // Formato CNPJ
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato E-mail

        return regexCpf.test(valor) || regexCnpj.test(valor) || regexEmail.test(valor);
    }

    async function confirmaPix() {        
        if (!validarPix(pix)) {
            nError('Chave PIX inválida!', 'Use um CPF, CNPJ ou E-mail válido.');
            return;
        }

        setEditPix(false);
        const respEmpresa = await setEmpresa({ ...empresa, pix_empresa: pix });
        setempresa(respEmpresa);
    }

    async function realizarsaque() {
        nLoading(null, 'Solicitando saque...');
        await cashWithdrawal(empresa.cod_empresa);
        endLoading();
    }

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title mb-3">Dados para recebimento</h6>

                <div>
                    <label className="form-label">Saldo</label>
                    <p className="text-dark text-center py-1 rounded border border-success bg-success-subtle">
                        <strong>{formatarMoeda(balance)}</strong>
                    </p>
                </div>

                <div>
                    <label className="form-label">CNPJ</label>
                    <p>{empresa.doc_empresa || 'Não informado'}</p>
                </div>

                <div>
                    <label className="form-label">Chave PIX <span className="text-muted">(CNPJ, CPF, E-mail)</span></label>
                    <div className="d-flex align-items-center gap-2">
                        <input ref={pixRef} disabled={!editPix} value={pix} onChange={e => setpix(e.target.value)} placeholder="Informar chave PIX" className="form-control" />
                        {!editPix && (
                            <button onClick={() => setEditPix(true)} className="btn btn-sm btn-outline-primary rounded">
                                <i className="bi bi-pen" />
                            </button>
                        )}
                        {editPix && (
                            <button
                                className="btn btn-sm btn-outline-success rounded"
                                onKeyDown={e => e.key == 'Enter' ? confirmaPix() : null}
                                onClick={confirmaPix}
                            >
                                <i className="bi bi-check-circle" />
                            </button>
                        )}
                    </div>
                </div>

                <button className="btn btn-success rounded mt-3 w-100" onClick={realizarsaque}>Solicitar Saque</button>
                <p className="text-center fs-2">Valor integral com desconto será enviado para o pix informado</p>
            </div>
        </div>
    )
}

export default ResumoFinanceiro;