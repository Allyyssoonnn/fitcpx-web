import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { stateAluno, stateEmpresa, useNotificacao } from "../../../states/states";
import { PRODUCAO } from "../../../api/api";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import CardIconFitCpxPay from "../../baseComponents/CardIconFitCpxPay";
import { useQuery } from "react-query";
import { getCards } from "../../../api/aluno";
import SavedCards from "../savedCards";

function NewPayment({ close, onPay, callback, atSigth, clientId }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const { nLoading, endLoading, nConfirm } = useNotificacao();
    const [savedCards, setSavedCards] = useState(false);
    const [typePayment, setTypePayment] = useState('BOLETO');
    const [formaPagamento, setFormaPagamento] = useState('RECORRENTE'); //MENSAL - RECORRENTE - UNICA
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cardSelected, setCardSelected] = useState();
    const [formCard, setFormCard] = useState({
        number: PRODUCAO ? '' : '4111111111111111',
        month: PRODUCAO ? '' : '11',
        year: PRODUCAO ? '' : '2030',
        code: PRODUCAO ? '' : '123',
        installments: 1
    });

    const updateFormCard = (field, value) => setFormCard((prev) => ({ ...prev, [field]: value }));

    async function clickPay() {
        nConfirm(null, 'Confirma a finalização da contratação?', async () => {
            nLoading(null, 'Gerando contratação...');

            const card = { ...formCard, cod_aluno_cartao: cardSelected?.cod_aluno_cartao };
            
            if (typePayment == 'CREDIT') {
                await onPay(formaPagamento, endLoading, null, card, typePayment);
                if (callback) callback();
                endLoading();
                return;
            }

            await onPay(formaPagamento, endLoading, null, null, typePayment);
            if (callback) callback();
            endLoading();
        })
    }

    async function onClose() {
        close();
    }

    if (savedCards) return (
        <SavedCards
            select={(card) => setCardSelected(card)}
            close={() => setSavedCards(false)}
            clientId={clientId}
        />
    )

    return (
        <div className="card" style={{ height: formaPagamento != 'MANUAL' ? '90vh' : '' }}>
            <div className="card-body m-0 overflow-scroll">
                <h5 className="text-center">Novo pagamento</h5>

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

                {(typePayment == 'CREDIT' && !cardSelected) && (
                    <>
                        <div className="d-flex col-6">
                            <button className="btn btn-sm btn-outline-info mt-2"
                                onClick={() => setSavedCards(true)}
                            >
                                Cartões salvos
                            </button>
                        </div>

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

                {cardSelected && (
                    <div className="card">
                        <div className="card-body d-flex flex-col">
                            <h5>Cartão selecionado</h5>
                            <label>**** *** {cardSelected.final_aluno_cartao}</label>
                            <label>{cardSelected.expiracao_aluno_cartao}</label>
                            <button className="btn btn-sm btn-danger mt-3"
                                onClick={() => setCardSelected()}
                            >Remover</button>
                        </div>
                    </div>
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
                
                <button className="btn btn-success rounded" onClick={clickPay}>
                    <i className="bi bi-cart me-2" />
                    Finalizar
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
                    className='btn btn-outline-success rounded d-flex flex-column justify-content-center align-items-center'
                    onClick={() => setTypePayment('PIX')}
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

export default NewPayment;