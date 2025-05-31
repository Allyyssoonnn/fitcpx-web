import { useEffect, useState } from "react";
import { stateEmpresa, useNotificacao } from "../../states/states";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { getCards, getSetupIntent, getSetupIntentCard, updateMethodPayment, updatePaymentIntentStatus } from "../../api/pagamento";
import { useRecoilState } from "recoil";

function PagamentoIntent({ client, close, callback, payment, licenca }) {
    const { nLoading, endLoading } = useNotificacao();
    const [empresa] = useRecoilState(stateEmpresa);

    const [formaPagamento, setFormaPagamento] = useState('');
    const [cobrarRecorrente, setCobrarRecorrente] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [savedCards, setSavedCards] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    async function onClose() {
        close();
    }

    function onSelectCard(card) {
        setSavedCards(false);
        setPaymentMethod(card);
    }

    async function clickPay() {
        if (!stripe || !payment?.client_secret) return;
        nLoading();

        if (formaPagamento === 'card') {
            if (paymentMethod) {
                // Cartão salvo
                const result = await stripe.confirmCardPayment(payment.client_secret, {
                    payment_method: paymentMethod.id,
                    setup_future_usage: cobrarRecorrente ? 'off_session' : undefined,
                });
                console.log(result);
                
                if (result?.paymentIntent?.status) await updatePaymentIntentStatus(payment.id, result.paymentIntent.status, cobrarRecorrente, licenca);
                if (paymentMethod.id && !licenca) await updateMethodPayment(empresa.cod_empresa, client.cod_aluno, paymentMethod.id);
                callback?.(result);
            } else {
                // Cartão novo
                const result = await stripe.confirmCardPayment(payment.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: client.nome_aluno ?? client.nome_empresa,
                            email: client.email_aluno ?? client.email_empresa,
                        },
                    },
                    setup_future_usage: cobrarRecorrente ? 'off_session' : undefined,
                });
                const paymentMethodId = result.paymentIntent.payment_method;
                
                if (result?.paymentIntent?.status) await updatePaymentIntentStatus(payment.id, result.paymentIntent.status, cobrarRecorrente, licenca);
                if (paymentMethodId && !licenca) await updateMethodPayment(empresa.cod_empresa, client.cod_aluno, paymentMethodId);
                callback?.(result);
            }
        }

        // if (formaPagamento === 'boleto') {
        //     const result = await stripe.confirmPayment({
        //         clientSecret: payment.client_secret,
        //         payment_method: {
        //             type: 'boleto',
        //             billing_details: {
        //                 name: aluno.nome_aluno,
        //                 email: aluno.email_aluno,
        //                 address: {
        //                     line1: aluno.endereco_aluno,
        //                     city: aluno.cidade_aluno,
        //                     state: aluno.estado_aluno,
        //                     postal_code: aluno.cep_aluno,
        //                     country: 'BR',
        //                 },
        //             },
        //             boleto: {
        //                 tax_id: aluno.cpf_aluno?.replace(/\D/g, ''), // CPF só números
        //             },
        //         },
        //         return_url: window.location.href,
        //     });

        //     if (result?.paymentIntent?.next_action?.boleto_display_details?.hosted_voucher_url) {
        //         window.open(result.paymentIntent.next_action.boleto_display_details.hosted_voucher_url, '_blank');
        //     }

        //     callback?.(result);
        // }

        // if (formaPagamento === 'pix') {
        //     const result = await stripe.confirmPayment({
        //         clientSecret: payment.client_secret,
        //         payment_method: {
        //             type: 'pix',
        //             billing_details: {
        //                 name: aluno.nome_aluno,
        //                 email: aluno.email_aluno,
        //             },
        //         },
        //         return_url: window.location.href,
        //     });

        //     if (result?.paymentIntent?.next_action?.pix_display_qr_code?.data) {
        //         const qrCodeBase64 = result.paymentIntent.next_action.pix_display_qr_code.data;
        //         const qrImage = `data:image/png;base64,${qrCodeBase64}`;
        //         const newWindow = window.open();
        //         newWindow.document.write(`<img src="${qrImage}" />`);
        //     }

        //     callback?.(result);
        // }

        endLoading();
        close();
    }

    return (
        <div className="card bg-light" style={{ minHeight: '80vh' }}>
            <div className="card-body row m-0">
                <div className="col-md-6 d-flex flex-column card">
                    <h5 className="mt-3 text-center">Pagamento</h5>

                    <div className="card-body d-flex flex-column">
                        <label className="mb-3">Forma de pagamento</label>

                        <div className="d-flex flex-wrap justify-content-around gap-3 w-100">
                            {payment?.payment_method_types?.map((methodPayment, index) => {
                                if (methodPayment === 'card') {
                                    return (
                                        <button key={index}
                                            className='btn btn-outline-warning rounded d-flex flex-column justify-content-center align-items-center'
                                            onClick={() => setFormaPagamento(methodPayment)}
                                        >
                                            <iconify-icon icon='famicons:card-outline' width='50' height='50'/>
                                            Cartão
                                            <input className="mt-2" type="radio" checked={methodPayment == formaPagamento} />
                                        </button>
                                    )
                                }
                                // ADICIONAR OPÇÃO PAGAR BOLETO ANTES DE TIRA COMENTARIO
                                // if (methodPayment === 'boleto') {
                                //     return (
                                //         <button key={index}
                                //             className='btn btn-outline-info rounded d-flex flex-column justify-content-center align-items-center'
                                //             onClick={() => setFormaPagamento(methodPayment)}
                                //         >
                                //             <iconify-icon icon='iconamoon:invoice' width='50' height='50'/>
                                //             Boleto
                                //             <input className="mt-2" type="radio" checked={methodPayment == formaPagamento} />
                                //         </button>
                                //     )
                                // }
                                // if (methodPayment === 'pix') {
                                //     return (
                                //         <button key={index}
                                //             className='btn btn-outline-success rounded d-flex flex-column justify-content-center align-items-center'
                                //             onClick={() => setFormaPagamento(methodPayment)}
                                //         >
                                //             <iconify-icon icon='ic:baseline-pix' width='50' height='50'/>
                                //             PIX
                                //             <input className="mt-2" type="radio" checked={methodPayment == formaPagamento} />
                                //         </button>
                                //     )
                                // }
                            })}
                        </div>

                        {formaPagamento === 'card' && (
                            <div className="form-check form-switch mt-5 ms-3">
                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                    checked={cobrarRecorrente} onChange={() => setCobrarRecorrente(!cobrarRecorrente)}
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Salvar cartão para cobrança recorrente?</label>
                            </div>
                        )}
                    </div>

                    <div className="d-flex p-3 align-items-center">
                        <button className='btn btn-danger rounded' onClick={onClose}>Fechar</button>
                    </div>
                </div>

                <div className="col-md-6 d-flex">
                    {!savedCards ? (
                        <div className="card d-flex justify-content-center w-100 h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <p className="mt-2 text-center">
                                        {formaPagamento === 'card' && 'Pagamento via cartão'}
                                        {formaPagamento === 'boleto' && 'Pagamento via boleto'}
                                    </p>
                                    {(formaPagamento === 'card' && cobrarRecorrente) && (
                                        <p className="mt-2 text-center">
                                            Cartão será salvo para recorrência
                                        </p>
                                    )}
                                    <div className="border border-bottom-5 border-info m-3"></div>

                                    {formaPagamento === 'card' && (
                                        <div className="d-flex col-6">
                                            <button className="btn btn-sm btn-outline-info mt-2"
                                                onClick={() => setSavedCards(true)}
                                            >
                                                Cartões salvos
                                            </button>
                                        </div>
                                    )}

                                    {(formaPagamento == 'card' && !paymentMethod) && (
                                        <>
                                            <div className="col-md-6 w-100 mt-3 border p-3 shadow rounded">
                                                <p>Preencher dados do cartão</p>
                                                <CardElement
                                                    options={{ disableLink: true }}
                                                />
                                            </div>
                                            <p className="text-danger text-center mb-0">Dados de cartão não passam por nossos servidores.</p>
                                        </>
                                    )}

                                    {paymentMethod && (
                                        <div className="card">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="d-flex align-items-center">
                                                        <strong className="me-2">{paymentMethod?.card?.brand}</strong>
                                                        <span className="text-muted">**** {paymentMethod?.card?.last4}</span>
                                                    </div>
                                                    <small className="text-muted">
                                                        Validade: {paymentMethod?.card?.exp_month}/{paymentMethod?.card?.exp_year}
                                                    </small>
                                                </div>

                                                <button className="btn btn-sm btn-danger" onClick={() => setPaymentMethod(null)}>
                                                    <i className="bi bi-x" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {formaPagamento === 'boleto' && (
                                        <>
                                            {/* ADICIONAR PAGAMENTO VIA BOLETO */}
                                        </>
                                    )}

                                    {formaPagamento === 'pix' && (
                                        <>
                                            {/* ADICIONAR PAGAMENTO VIA PIX */}
                                        </>
                                    )}
                                </div>

                                <div>
                                    <button className="btn btn-success w-100" onClick={clickPay}>
                                        <i className="bi bi-cart me-2" />
                                        Finalizar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : <Cartoes client={client} onConfirm={onSelectCard} licenca={licenca} />}
                </div>
            </div>
        </div>
    )
}

export default PagamentoIntent;