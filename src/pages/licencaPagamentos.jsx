import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { deletePagamento, getPagamentos, getPIXPagamento } from "../api/pagamento";
import { formatarData } from "../utils";
import Swal from "sweetalert2";

function LicencaPagamentos() {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: pagamentos, refetch } = useQuery({
        queryKey: ['pagamentos', usuario.cod_empresa],
        queryFn: () => getPagamentos(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    async function cancelarCobranca(cod_usuario_pagamento) {
        Swal.fire({
            title: "Tem certeza?",
            text: "O cancelamento da cobrança não pode ser revertido!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deletePagamento(cod_usuario_pagamento);
                refetch();
                Swal.fire("Cobrança cancelada!", "", "success");
            }
        });
    }

    async function pagarCobranca(pagamento) {
        Swal.fire({
            title: "Carregando...",
            text: "Aguarde enquanto buscamos os dados.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
        });
        if (pagamento.forma_usuario_pagamento === 'PIX') {
            const pix = await getPIXPagamento(pagamento.cod_usuario_pagamento);
            Swal.fire({
                title: `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pagamento?.valor_usuario_pagamento)}`,
                text: pix.payload,
                imageUrl: `data:image/png;base64,${pix.encodedImage}`,
                confirmButtonText: "Confirmar",
            })
        }
    }

    return (
        <div className="container-fluid">

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Licença pagamentos</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="display table table-striped table-hover">
                            {pagamentos.map((pagamento) => {
                                const assinatura = pagamento.assinatura_usuario_pagamento;
                                const pendente = pagamento.status_usuario_pagamento === 'PENDING';
                                const recebido = pagamento.status_usuario_pagamento === 'RECEIVED'
                                    || pagamento.status_usuario_pagamento === 'CONFIRMED'
                                    || pagamento.status_usuario_pagamento === 'ACTIVE';
                                const cancelado = pagamento.status_usuario_pagamento === 'DELETED';
                                return (
                                <tr key={pagamento.cod_usuario_pagamento} style={{ borderLeft: pendente ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <div className="col-md-6 d-flex flex-column">
                                            <label>{formatarData(pagamento.data_usuario_pagamento)}</label>
                                            <div className="d-flex gap-2 mt-2">
                                                <label className={`badge bg-warning ${assinatura ? '' : 'd-none'}`}>ASSINATURA</label>
                                                <label className="badge bg-info">{pagamento?.forma_usuario_pagamento === 'PIX' && 'PIX'}</label>
                                                <label className="badge bg-info">{pagamento?.forma_usuario_pagamento === 'CREDIT_CARD' && 'Cartão de crédito'}</label>
                                                <label className={`badge bg-warning ${pendente ? '' : 'd-none'}`}>PENDENTE</label>
                                                <label className={`badge bg-success ${recebido ? '' : 'd-none'}`}>PAGO</label>
                                                <label className={`badge bg-danger ${cancelado ? '' : 'd-none'}`}>Cancelado</label>
                                                <label className="badge bg-success">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pagamento?.valor_usuario_pagamento)}</label>
                                            </div>
                                        </div>
                                    </th>
                                    <td>
                                        <span className={`w-100 d-flex justify-content-end gap-2 ${recebido ? '' : 'd-none'}`}>
                                            <button disabled className="btn btn btn-outline-primary rounded">
                                                <i className="bi bi-check-circle me-2" />
                                                Exportar NF
                                            </button>
                                        </span>
                                        <span className={`w-100 d-flex justify-content-end gap-2 ${pendente ? '' : 'd-none'}`}>
                                            <button onClick={() => pagarCobranca(pagamento)} className={`btn btn btn-outline-success rounded ${pagamento?.forma_usuario_pagamento !== 'PIX' && 'd-none'}`}>
                                                <i className="bi bi-check-circle me-2" />
                                                Pagar
                                            </button>

                                            <button onClick={() => cancelarCobranca(pagamento.cod_usuario_pagamento)} className="btn btn btn-outline-danger rounded">
                                                <i className="bi bi-x-circle me-2" />
                                                Solicitar cancelamento
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            )})}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LicencaPagamentos;