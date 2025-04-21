import { useState } from "react";
import { Modal } from "react-bootstrap";
import { formatarMoeda } from "../utils";
import { motion } from 'framer-motion';
import NumberInput from "./numberInput";
import { useNotificacao } from "../states/states";
import CardInput from "./CardInput";

function Pagamento({ show, close, valor, cash = false, resumoItems = [], resumoName, resumoValue, onPay, duration, callback }) {
    const { nLoading, endLoading } = useNotificacao();
    const [index, setIndex] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState('PIX');
    const [pago, setPago] = useState(false);
    const [monthly, setMonthly] = useState(true);
    const [showCardInfo, setShowCardInfo] = useState(false);

    async function clickPay() {
        nLoading(null, 'Enviando contrato...');
        const resp = await onPay(formaPagamento, endLoading, monthly);
        if (resp) setPago(true);
    }

    async function clickPayCard(card) {
        nLoading(null, 'Enviando contrato...');
        const resp = await onPay(formaPagamento, endLoading, monthly, card);
        if (resp) setPago(true);
    }

    async function clickCard() {
        setShowCardInfo(true);
    }

    async function concluir() {
        if (callback) callback();
    }

    async function onClose() {
        setShowCardInfo(false);
        close();
    }

    return (
        <Modal show={show} size="xl">
            <div className="card bg-light" style={{ minHeight: '80vh' }}>
                <div className="card-body row m-0">
                    <div className="col-md-6 d-flex flex-column">
                        <h5 className="card-title">Pagamento</h5>

                        <div className="border border-warning bg-warning-subtle fs-3 p-3 rounded mt-3 shadow-md h-100 max-h-1/2">
                            <p className="text-center mb-0"><strong>Resumo</strong></p>

                            {resumoItems?.map((item, index) => (
                                <p className="mb-0" key={index}>{item[resumoName]} - <strong>{formatarMoeda(item[resumoValue])}</strong></p>
                            ))}

                            <p className="mb-0 mt-3 text-end">Total - <strong>{formatarMoeda(valor || 0)}</strong></p>
                        </div>

                        <div className="d-flex p-3 align-items-center">
                            <button className={`${index >= 1 ? 'd-none' : ''} btn btn-danger rounded`} onClick={onClose}>Fechar</button>
                            <button className={`${index < 1 ? 'd-none' : ''} btn btn-outline-danger rounded`}
                                onClick={() => setIndex(index - 1)}
                            >Voltar</button>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        {!showCardInfo && (
                            <div className="card d-flex justify-content-center w-100 h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <label className="mb-3">Forma de pagamento</label>
                                        <FormaPagamento
                                            formaPagamento={formaPagamento}
                                            setFormaPagamento={setFormaPagamento}
                                            cash={cash}
                                        />
                                        <div className="border border-bottom-5 border-info m-3"></div>

                                        {(formaPagamento == 'CREDIT_CARD' || formaPagamento == 'PIX') && (
                                            <div>
                                                <div className="btn-group d-flex" role="group">
                                                    <button
                                                        className={`btn btn-sm ${monthly ? "btn-primary" : "btn-outline-primary"}`} 
                                                        onClick={() => setMonthly(true)}
                                                    >Mensal
                                                    </button>

                                                    <button
                                                        className={`btn btn-sm ${!monthly ? "btn-primary" : "btn-outline-primary"}`} 
                                                        onClick={() => setMonthly(false)}
                                                    >Á vista
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    
                                    <div>
                                        {(!pago && formaPagamento !== 'CREDIT_CARD') && (
                                            <button className="btn btn-success w-100 mt-3" onClick={clickPay}>
                                                <i className="bi bi-cart me-2" />
                                                Pagar
                                            </button>
                                        )}

                                        {(!pago && formaPagamento == 'CREDIT_CARD') && (
                                            <button className="btn btn-info w-100 mt-3" onClick={clickCard}>
                                                <i className="bi bi-cart me-2" />
                                                Dados do cartão
                                            </button>
                                        )}

                                        {pago && (
                                            <button className="btn btn-info w-100 mt-3" onClick={concluir}>
                                                <i className="bi bi-cart me-2" />
                                                Concluir
                                            </button>
                                        )}

                                        {(!pago && formaPagamento !== 'CREDIT_CARD') && (
                                            <p className="text-danger fs-2 text-center mt-1">Contrato será gerado e enviado para assinatura!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {showCardInfo && (
                            <div className="col-md-6 w-100">
                                <CardInput submit={clickPayCard} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function FormaPagamento({ setFormaPagamento, formaPagamento, cash }) {
    function select(value) {
        setFormaPagamento(value);
    }

    const methods = [
        { name: 'PIX', value: 'PIX', color: 'success', icon: 'ic:baseline-pix' },
        { name: 'Crédito', value: 'CREDIT_CARD', color: 'info', icon: 'ion:card' },
        { name: 'Dinheiro', value: 'CASH', color: 'warning', icon: 'mdi:cash', visivel: cash },
    ];

    return (
        <div className="d-flex justify-content-around gap-3 w-100">
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