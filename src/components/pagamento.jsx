import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { motion } from 'framer-motion';
import { stateEmpresa, useNotificacao } from "../states/states";

import { loadStripe } from '@stripe/stripe-js';
import { PRODUCAO } from "../api/api";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { getCards, getSetupIntent } from "../api/pagamento";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

function Pagamento({ show, close, onPay, callback, aluno }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [accountId, setaccountId] = useState(empresa?.dev_stripe_id || '');

    useEffect(() => {
        setaccountId(empresa?.dev_stripe_id || '');
    }, [empresa]);

    const stripePromise = PRODUCAO ?
    loadStripe('pk_live_51RKPzOBL0IrftB8edwNRflZ54s2UiIXnwufH4eU1pUV5IW2Dsr914qMWPtS5lSQQZuyA9qP4ekf13PpWxiqNsk2a00y5QIWyjU', { stripeAccount: accountId }):
    loadStripe('pk_test_51RKPzXPd9Pbt6nSARyfESdEWakvQyqlfBS9jdNvKlxPN9u6F8kcx5mISolo9eIzZkKLLt0iVEKm8Ikl0Hg5cfDDv00dG7f25k2', { stripeAccount: accountId });

    return (
        <Modal show={show} size="xl">
            <Elements stripe={stripePromise}>
                <PagamentoInterno
                    close={close}
                    onPay={onPay}
                    callback={callback}
                    aluno={aluno}
                />
            </Elements>
        </Modal>
    );
}

function PagamentoInterno({ aluno, close, onPay, callback }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const { nLoading, endLoading, nConfirm } = useNotificacao();
    const [formaPagamento, setFormaPagamento] = useState('MENSAL'); //MENSAL - RECORRENTE - UNICA
    const [savedCards, setSavedCards] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [geraContrato, setGeraContrato] = useState(true);

    const stripe = useStripe();
    const elements = useElements();

    async function clickPayCard() {
        nConfirm(null, 'Confirma a finalização da contratação?', async () => {
            nLoading(null, 'Enviando contrato...');
    
            var paymentMethodId;
            if (paymentMethod) paymentMethodId = paymentMethod.id;
    
            if (formaPagamento === 'RECORRENTE' && !paymentMethod) {
                const clientSecret = await getSetupIntent(empresa.cod_empresa, aluno.cod_aluno);
            
                const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });
                if (setupIntent?.payment_method) paymentMethodId = setupIntent?.payment_method;
                if (error) toast.error(error?.message);
                console.log(error);
            }
            
            const resp = await onPay(formaPagamento, endLoading, paymentMethodId, geraContrato);
            if (callback) callback();
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
                        />

                        <div className="form-check form-switch mt-5">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                checked={geraContrato} onChange={() => setGeraContrato(!geraContrato)}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">[Jurídico] - Gerar e enviar contrato para assinatura?</label>
                        </div>
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

                                    {geraContrato && (
                                        <p className="text-danger fs-2 text-center mt-1 mb-0">
                                            Contrato será gerado e enviado para assinatura!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : <Cartoes aluno={aluno} onConfirm={onSelectCard} />}
                </div>
            </div>
        </div>
    );
}

function Cartoes({ aluno, onConfirm }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        const loadCards = async () => {
            try {
                setIsLoading(true);
                const data = await getCards(empresa.cod_empresa, aluno.cod_aluno);
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
    }, [empresa.cod_empresa, aluno.cod_aluno]);
  
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

function FormaPagamento({ setFormaPagamento, formaPagamento }) {
    function select(value) {
        setFormaPagamento(value);
    }

    const methods = [
        { name: 'Mensal', value: 'MENSAL', color: 'success', icon: 'bi:receipt' },
        { name: 'Recorrente', value: 'RECORRENTE', color: 'info', icon: 'bi-arrow-repeat' },
        { name: 'Única', value: 'UNICA', color: 'secondary', icon: 'bi:clipboard-check' },
        { name: 'Manual', value: 'MANUAL', color: 'danger', icon: 'mdi:check' },
    ];

    return (
        <div className="d-flex flex-wrap justify-content-around gap-3 w-100">
            {methods.map((method, index) => (
                <motion.button key={index}
                    className={`btn btn-outline-${method.color} rounded d-flex flex-column justify-content-center align-items-center`}
                    onClick={() => select(method.value)}
                >
                    <iconify-icon icon={method.icon} width='50' height='50'/>
                    {method.name}
                    <input className="mt-2" type="radio" checked={method.value == formaPagamento} />
                </motion.button>
            ))}
        </div>
    );
}

export default Pagamento;