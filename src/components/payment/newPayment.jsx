import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { stateEmpresa, useNotificacao } from "../../states/states";
import { PRODUCAO } from "../../api/api";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { getCards, getSetupIntent, getSetupIntentCard, updateMethodPayment, updatePaymentIntentStatus } from "../../api/pagamento";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import CardIconFitCpxPay from "../baseComponents/CardIconFitCpxPay";

function PagamentoInterno({ client, close, onPay, callback, licenca, atSigth }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const { nLoading, endLoading, nConfirm } = useNotificacao();
    const [typePayment, setTypePayment] = useState('BOLETO');
    const [formaPagamento, setFormaPagamento] = useState('RECORRENTE'); //MENSAL - RECORRENTE - UNICA
    const [savedCards, setSavedCards] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [formCard, setFormCard] = useState({
        number: PRODUCAO ? '' : '4111111111111111',
        month: PRODUCAO ? '' : '11',
        year: PRODUCAO ? '' : '2030',
        code: PRODUCAO ? '' : '123',
        installments: 1
    });

    const updateFormCard = (field, value) => setFormCard((prev) => ({ ...prev, [field]: value }));

    const stripe = useStripe();
    const elements = useElements();

    async function clickPayCard() {
        nConfirm(null, 'Confirma a finalização da contratação?', async () => {
            nLoading(null, 'Enviando contrato...');

            if (formaPagamento == 'PARCELADO') {
                await onPay(formaPagamento, endLoading, null, formCard, typePayment);
                if (callback) callback();
                endLoading();
                return;
            }
    
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
                await onPay(formaPagamento, endLoading, paymentMethodId, null, typePayment);
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

    if (savedCards) return <Cartoes client={client} onConfirm={onSelectCard} licenca={licenca} />

    return (
        <div className="card" style={{ height: formaPagamento != 'MANUAL' ? '90vh' : '' }}>
            <div className="card-body m-0">
                <h5 className="text-center">Pagamento</h5>

                <div className="border border-bottom-3 border-gray m-1"></div>

                <div className="form-check form-switch ms-3 mb-3 mt-3">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                        checked={formaPagamento != 'MANUAL'} onChange={e => setFormaPagamento(e.target.checked ? 'MENSAL' : 'MANUAL')}
                    />
                    <CardIconFitCpxPay>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">[FitCpx Pay] - Receber pagamento pelo app?</label>
                    </CardIconFitCpxPay>
                </div>
                

                {formaPagamento != 'MANUAL' && (
                    <>
                        <p>Forma do pagamento</p>

                        <FormaPagamento
                            formaPagamento={formaPagamento}
                            setFormaPagamento={setFormaPagamento}
                            licenca={licenca}
                            atSigth={atSigth}
                            typePayment={typePayment}
                            setTypePayment={setTypePayment}
                        />

                        <div className="border border-bottom-3 border-gray m-1 mt-3 mb-3"></div>
                    </>
                )}

                {formaPagamento != 'MANUAL' && (
                    <>
                        <p>Modalidade do pagamento</p>

                        <div className="d-flex flex-wrap justify-content-around gap-3 w-100">
                            <motion.button
                                className='btn btn-outline-info rounded'
                                onClick={() => setFormaPagamento('RECORRENTE')}
                            >
                                <input className="mt-2 me-2" type="radio" checked={formaPagamento === 'RECORRENTE'} />
                                Recorrente
                            </motion.button>

                            <motion.button
                                className='btn btn-outline-info rounded'
                                onClick={() => setFormaPagamento('UNICA')}
                            >
                                <input className="mt-2 me-2" type="radio" checked={formaPagamento === 'UNICA'} />
                                Á vista
                            </motion.button>

                            {typePayment == 'CREDIT' && (
                                <motion.button
                                    className='btn btn-outline-info rounded'
                                    onClick={() => setFormaPagamento('PARCELADO')}
                                >
                                    <input className="mt-2 me-2" type="radio" checked={formaPagamento === 'PARCELADO'} />
                                    Parcelado
                                </motion.button>
                            )}
                        </div>

                        <div className="border border-bottom-3 border-gray m-1 mt-3 mb-3"></div>
                    </>
                )}

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

                {formaPagamento == 'PARCELADO' && (
                    <>
                        <div className="col-md-6 w-100 mt-3 border p-3 shadow rounded">
                            <p className="mb-0">Preencher dados do cartão</p>

                            <label className="col-5 fs-2" placeholder="Número do cartão">Número</label>
                            <label className="col-1 fs-2" placeholder="Mes">Mês</label>
                            <label className="col-2 fs-2" placeholder="Ano">Ano</label>
                            <label className="col-2 fs-2" placeholder="CCV">CCV</label>
                            <label className="col-2 fs-2" placeholder="Parcelas">Parcelas</label>

                            <input value={formCard.number} onChange={e => updateFormCard('number', e.target.value)} className="col-5" placeholder="Número do cartão" />
                            <input value={formCard.month} onChange={e => updateFormCard('month', e.target.value)} className="col-1" placeholder="Mes" />
                            <input value={formCard.year} onChange={e => updateFormCard('year', e.target.value)} className="col-2" placeholder="Ano" />
                            <input value={formCard.code} onChange={e => updateFormCard('code', e.target.value)} className="col-2" placeholder="CCV" />
                            <input type="number" max={12} min={1} value={formCard.installments} onChange={e => updateFormCard('installments', e.target.value)}  className="col-2" placeholder="Parcelas" />
                        </div>
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

            <div className="card-footer d-flex p-3 align-items-center justify-content-between">
                <button className='btn btn-danger rounded' onClick={onClose}>Fechar</button>
                
                <button className="btn btn-success rounded" onClick={clickPayCard}>
                    <i className="bi bi-cart me-2" />
                    Finalizar
                </button>
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
        <div className="card d-flex flex-column w-100">
            <div className="card-body d-flex flex-column w-100">
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
            </div>

            <div className="card-footer d-flex justify-content-between">
                <button  className="btn btn-danger rounded" onClick={() => onConfirm(null)}>
                    Fechar
                </button>

                <button  className="btn btn-success rounded" disabled={!selectedCardId} onClick={confirm}>
                    Confirmar
                </button>
            </div>
        </div>
    );
}

function FormaPagamento({ typePayment, setTypePayment }) {

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-around gap-3 w-100">
                <motion.button
                    className='btn btn-outline-warning rounded d-flex flex-column justify-content-center align-items-center'
                    onClick={() => setTypePayment('BOLETO')}
                >
                    <iconify-icon icon='bi:receipt' width='50' height='50'/>
                    Boleto
                    <input className="mt-2" type="radio" checked={typePayment === 'BOLETO'} />
                </motion.button>

                <motion.button
                    className='btn btn-outline-gray rounded d-flex flex-column justify-content-center align-items-center'
                    onClick={() => setTypePayment('PIX')}
                    disabled
                >
                    <iconify-icon icon='bi-clipboard-check' width='50' height='50'/>
                    PIX
                    <input className="mt-2" type="radio" checked={typePayment === 'PIX'} />
                </motion.button>

                <motion.button
                    className='btn btn-outline-info rounded d-flex flex-column justify-content-center align-items-center'
                    onClick={() => setTypePayment('CREDIT')}
                >
                    <iconify-icon icon='bi:credit-card' width='50' height='50'/>
                    Cartão de crédito
                    <input className="mt-2" type="radio" checked={typePayment === 'CREDIT'} />
                </motion.button>
            </div>
        </div>
    );
}

export default PagamentoInterno;