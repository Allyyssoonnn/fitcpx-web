import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { motion } from 'framer-motion';
import { stateEmpresa, useNotificacao } from "../states/states";

import { loadStripe } from '@stripe/stripe-js';
import { PRODUCAO } from "../api/api";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { getCards, getSetupIntent, getSetupIntentCard, updateMethodPayment, updatePaymentIntentStatus } from "../api/pagamento";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

function Pagamento({ show, close, onPay, callback, client, payment, licenca, atSigth }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        if (licenca) {
            const promise = loadStripe(
                PRODUCAO
                    ? 'pk_live_51RKPzOBL0IrftB8edwNRflZ54s2UiIXnwufH4eU1pUV5IW2Dsr914qMWPtS5lSQQZuyA9qP4ekf13PpWxiqNsk2a00y5QIWyjU'
                    : 'pk_test_51RKPzXPd9Pbt6nSARyfESdEWakvQyqlfBS9jdNvKlxPN9u6F8kcx5mISolo9eIzZkKLLt0iVEKm8Ikl0Hg5cfDDv00dG7f25k2',
            );
            setStripePromise(promise);
        } else {
            const accountId = PRODUCAO ? empresa?.stripe_id : empresa?.dev_stripe_id;
            
            if (!accountId) {
                toast.error('Preencher formulário para FitCpx Pay.');
                return;
            }
            const promise = loadStripe(
                PRODUCAO
                    ? 'pk_live_51RKPzOBL0IrftB8edwNRflZ54s2UiIXnwufH4eU1pUV5IW2Dsr914qMWPtS5lSQQZuyA9qP4ekf13PpWxiqNsk2a00y5QIWyjU'
                    : 'pk_test_51RKPzXPd9Pbt6nSARyfESdEWakvQyqlfBS9jdNvKlxPN9u6F8kcx5mISolo9eIzZkKLLt0iVEKm8Ikl0Hg5cfDDv00dG7f25k2',
                { stripeAccount: accountId }
            );
            setStripePromise(promise);
        }
    }, [empresa]);

    return (
        <Modal show={show} size="xl">
            <Elements stripe={stripePromise}>
                {payment ? (
                    <PagamentoIntent
                        close={close}
                        callback={callback}
                        client={client}
                        payment={payment}
                        licenca={licenca}
                    />
                ) : (
                    <PagamentoInterno
                        close={close}
                        onPay={onPay}
                        callback={callback}
                        client={client}
                        licenca={licenca}
                        atSigth={atSigth}
                    />
                )}
            </Elements>
        </Modal>
    );
}

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
                                if (methodPayment === 'pix') {
                                    return (
                                        <button key={index}
                                            className='btn btn-outline-success rounded d-flex flex-column justify-content-center align-items-center'
                                            onClick={() => setFormaPagamento(methodPayment)}
                                        >
                                            <iconify-icon icon='ic:baseline-pix' width='50' height='50'/>
                                            PIX
                                            <input className="mt-2" type="radio" checked={methodPayment == formaPagamento} />
                                        </button>
                                    )
                                }
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

function PagamentoInterno({ client, close, onPay, callback, licenca, atSigth }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const { nLoading, endLoading, nConfirm } = useNotificacao();
    const [formaPagamento, setFormaPagamento] = useState('MENSAL'); //MENSAL - RECORRENTE - UNICA
    const [savedCards, setSavedCards] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    async function clickPayCard() {
        nConfirm(null, 'Confirma a finalização da contratação?', async () => {
            nLoading(null, 'Enviando contrato...');
    
            var errorPayment = null;
            var paymentMethodId;
            if (paymentMethod) paymentMethodId = paymentMethod.id;
    
            if (formaPagamento === 'RECORRENTE' && !paymentMethod) {
                const clientSecret = await getSetupIntentCard(empresa.cod_empresa, client.cod_aluno, licenca);
            
                const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });
                if (setupIntent?.payment_method) paymentMethodId = setupIntent?.payment_method;
                if (error) {
                    endLoading();
                    toast.error(error?.message);
                    errorPayment = error;
                    console.log(error);
                }
            }

            if (!errorPayment) {
                await onPay(formaPagamento, endLoading, paymentMethodId);
                if (callback) callback();
                endLoading();
            }
        })
    }

    function onSelectCard(card) {
        setSavedCards(false);
        setPaymentMethod(card);
    }

    async function onClose() {
        close();
    }

    return (
        <div className="card bg-light" style={{ minHeight: '80vh' }}>
            <div className="card-body row m-0">
                <div className="col-md-6 d-flex flex-column card">
                    <h5 className="mt-3 text-center">Pagamento</h5>

                    <div className="card-body d-flex flex-column">
                        <label className="mb-3">Forma de pagamento</label>
                        <FormaPagamento
                            formaPagamento={formaPagamento}
                            setFormaPagamento={setFormaPagamento}
                            licenca={licenca}
                            atSigth={atSigth}
                        />
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
                                        {formaPagamento === 'MENSAL' && 'Uma cobrança mensal será gerada podendo ser paga via PIX/Boleto/Cartão'}
                                        {formaPagamento === 'RECORRENTE' && 'Cobrança automática no cartão de crédito até o vencimento do contrato'}
                                        {formaPagamento === 'UNICA' && 'Uma cobrança no valor total do contrato será gerada podendo ser paga via PIX/Boleto/Cartão'}
                                        {formaPagamento === 'MANUAL' && 'Pagamento não será controlado pelo sistema'}
                                    </p>
                                    <div className="border border-bottom-5 border-info m-3"></div>

                                    {formaPagamento === 'RECORRENTE' && (
                                        <div className="d-flex col-6">
                                            <button className="btn btn-sm btn-outline-info mt-2"
                                                onClick={() => setSavedCards(true)}
                                            >
                                                Cartões salvos
                                            </button>
                                        </div>
                                    )}

                                    {(formaPagamento == 'RECORRENTE' && !paymentMethod) && (
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
                                </div>

                                
                                <div>
                                    <button className="btn btn-success w-100" onClick={clickPayCard}>
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
    );
}

function Cartoes({ client, onConfirm, licenca }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCards = async () => {
            try {
                setIsLoading(true);
                const data = await getCards(empresa.cod_empresa, client.cod_aluno, licenca);
                setCards(data || []);
                
                // Seleciona o primeiro cartão por padrão, se existir
                if (data && data.length > 0) {
                    setSelectedCardId(data[0].id);
                }
                } catch (error) {
                console.error('Erro ao carregar cartões:', error);
            } finally {
                setIsLoading(false);
            }
        };
  
        loadCards();
    }, [empresa.cod_empresa, client]);
  
    const handleCardSelection = (cardId) => {
        setSelectedCardId(cardId);
    };
  
    // Formatação simples do nome da bandeira
    const formatCardBrand = (brand) => {
        if (!brand) return 'Cartão';
        return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
    };
  
    if (isLoading) {
        return <div className="text-center py-3">Carregando cartões...</div>;
    }

    function confirm() {
        const card = cards.find((card) => card.id === selectedCardId);
        onConfirm(card);
    }
  
    return (
        <div className="d-flex flex-column w-100">
            {cards.map((card, index) => (
                <div 
                    key={card.id || index} 
                    className={`card mb-2 ${selectedCardId === card.id ? 'border-primary' : ''}`}
                    onClick={() => handleCardSelection(card.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="card-body d-flex align-items-center">
                        <div className="form-check me-3">
                            <input 
                                type="radio" 
                                className="form-check-input" 
                                id={`card-${card.id}`}
                                name="paymentCard"
                                checked={selectedCardId === card.id}
                                onChange={() => {}} // Handled by parent div onClick
                                readOnly
                            />
                        </div>
                        
                        <div>
                            <div className="d-flex align-items-center">
                                <strong className="me-2">{formatCardBrand(card?.card?.brand)}</strong>
                                <span className="text-muted">**** {card?.card?.last4}</span>
                            </div>
                            <small className="text-muted">
                                Validade: {card?.card?.exp_month}/{card?.card?.exp_year}
                            </small>
                        </div>
                    </div>
                </div>
            ))}

            {cards.length === 0 && <div className="text-center py-3">Nenhum cartão cadastrado.</div>}

            <div className="d-flex justify-content-between">
                <button  className="btn btn-danger rounded mt-3" onClick={() => onConfirm(null)}>
                    Fechar
                </button>
                <button  className="btn btn-success rounded mt-3" disabled={!selectedCardId} onClick={confirm}>
                    Confirmar
                </button>
            </div>
        </div>
    );
}

function FormaPagamento({ setFormaPagamento, formaPagamento, licenca, atSigth }) {
    function select(value) {
        setFormaPagamento(value);
    }

    const methods = [
        { name: 'Mensal', value: 'MENSAL', color: 'success', icon: 'bi:receipt', disabled: atSigth },
        { name: atSigth ? 'Cartão' : 'Recorrente', value: 'RECORRENTE', color: 'info', icon: 'bi-arrow-repeat' },
        { name: atSigth ? 'Fatura' : 'Única', value: 'UNICA', color: 'secondary', icon: 'bi:clipboard-check', disabled: licenca },
        { name: 'Manual', value: 'MANUAL', color: 'danger', icon: 'mdi:check', disabled: licenca },
    ];

    return (
        <div className="d-flex flex-wrap justify-content-around gap-3 w-100">
            {methods.map((method, index) => {
                if (!method.disabled) return (
                    <motion.button key={index}
                        className={`btn btn-outline-${method.color} rounded d-flex flex-column justify-content-center align-items-center`}
                        onClick={() => select(method.value)}
                    >
                        <iconify-icon icon={method.icon} width='50' height='50'/>
                        {method.name}
                        <input className="mt-2" type="radio" checked={method.value == formaPagamento} />
                    </motion.button>
                )
            })}
        </div>
    );
}

export default Pagamento;