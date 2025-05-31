import { useQuery } from "react-query";
import { getPayments } from "../../api/licenca";
import { formatarData, formatarMoeda } from "../../utils";
import Pagamento from "../../components/payment/pagamento";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { stateEmpresa } from "../../states/states";
import { getIntentPayment } from "../../api/pagamento";

function Payments({ cod_empresa }) {
    const [empresa] = useRecoilState(stateEmpresa);

    const [pagando, setPagando] = useState(false);
    const [payment, setPayment] = useState(null);

    const { data: licenses } = useQuery({
        queryKey: ['payments'],
        queryFn: () => getPayments(cod_empresa),
        initialData: [],
        enabled: !!cod_empresa
    });

    async function pay(payment) {
        const resp = await getIntentPayment(empresa.cod_empresa, null, payment.cod_empresa_licenca_pagamento);
        setPayment(resp);
        setPagando(true);
    }

    async function onPay(formaPagamento, closeLoading, paymentMethodId, geraContrato) {
        //
    }

    async function refund() {

    }

    return (
        <div className="container-fluid px-0">
            <Pagamento
                payment={payment}
                show={pagando}
                close={() => setPagando(false)}
                onPay={onPay}
                callback={() => {}}
                client={empresa}
                licenca={true}
            />

            {licenses.map((license, i) => (
                <div key={i} className="card mb-4 border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="mb-3 fw-semibold text-dark">
                            Plano: {license?.licenca?.nome_licenca}
                            {license.status_empresa_licenca === 'Active' && (
                                <span className="badge bg-success-subtle text-success ms-2">Ativa</span>
                            )}
                            {(license.status_empresa_licenca === 'Blocked' ||
                                license.status_empresa_licenca === 'requires_payment_method') && (
                                <span className="badge bg-warning-subtle text-warning ms-2">Bloqueado</span>
                            )}
                            {license.status_empresa_licenca === 'Canceled' && (
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
                                                    {payment.status_empresa_licenca_pagamento === 'succeeded' && (
                                                        <span className="badge bg-success-subtle text-success">Pago</span>
                                                    )}
                                                    {(payment.status_empresa_licenca_pagamento === 'Pendente' ||
                                                        payment.status_empresa_licenca_pagamento === 'requires_payment_method') && (
                                                        <span className="badge bg-warning-subtle text-warning">Pendente</span>
                                                    )}
                                                    {payment.status_empresa_licenca_pagamento === 'refund' && (
                                                        <span className="badge bg-danger-subtle text-danger">Reembolsado</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark">
                                                        {formatarData(payment.expiracao_empresa_licenca_pagamento)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-muted">{formatarMoeda(payment.valor_empresa_licenca_pagamento)}</span>
                                                </td>
                                                <td>
                                                    {payment.forma_empresa_licenca_pagamento === 'PIX' && (
                                                        <span className="badge bg-warning-subtle text-dark">PIX</span>
                                                    )}
                                                    {payment.forma_empresa_licenca_pagamento === 'CREDIT_CARD' && (
                                                        <span className="badge bg-primary-subtle text-dark">Cartão</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    {payment.status_empresa_licenca_pagamento === 'requires_payment_method' && (
                                                        <button
                                                            onClick={() => pay(payment)}
                                                            className="btn btn-sm btn-outline-success"
                                                        >
                                                            <i className="bi bi-credit-card me-1" />
                                                            Pagar
                                                        </button>
                                                    )}
                                                    {payment.status_empresa_licenca_pagamento === 'succeeded' && (
                                                        <button
                                                            onClick={() => refund(payment)}
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
            ))}
        </div>
    )
}

export default Payments;