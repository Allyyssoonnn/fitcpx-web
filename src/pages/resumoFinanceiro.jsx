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
                                const isReceived = item.amount > 0;
                                const rowClass = isReceived ? 'border-start border-success' : 'border-start border-danger';
                                const valueClass = isReceived ? 'text-success' : 'text-danger';

                                return (
                                    <tr key={index} className={rowClass}>
                                        <td colSpan={2}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className={valueClass}>{formatarMoeda(item.amount / 100)}</strong>
                                                <span>Saldo: <strong>{formatarMoeda(item.net / 100)}</strong></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span>{item.description}</span>
                                                <small className="text-muted">Data: {formatarData(new Date(item.created * 1000))}</small>
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
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

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
                    <label className="form-label">Liquido</label>
                    <p className="text-dark text-center py-1 rounded border border-success bg-success-subtle">
                        <strong>{formatarMoeda(balance?.available?.[0]?.amount / 100)}</strong>
                    </p>
                    <label className="form-label">Pendente</label>
                    <p className="text-dark text-center py-1 rounded border border-success bg-info-subtle">
                        <strong>{formatarMoeda(balance?.pending?.[0]?.amount / 100)}</strong>
                    </p>
                </div>

                <div>
                    <label className="form-label">Agência - Conta</label>
                    <p>{empresa.agencia_banco_conta} - {empresa.numero_banco_conta || 'Não informado'}</p>
                </div>

                <button disabled={(balance?.available?.[0]?.amount / 100) < 10} className="btn btn-success rounded mt-3 w-100" onClick={realizarsaque}>Solicitar Saque</button>
                <p className="text-center fs-2 mb-0">Valor integral com desconto será enviado para conta informada</p>
                <p className="text-center fs-2 text-danger">Valor mínimo para saque R$10,00</p>
            </div>
        </div>
    )
}

export default ResumoFinanceiro;