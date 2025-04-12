import { useState } from "react";
import { Modal } from "react-bootstrap";

function Pagamento({ show, close }) {
    const [index, setIndex] = useState(0);

    const [recorrente, setRecorrente] = useState(null);
    const [formaPagamento, setFormaPagamento] = useState('PIX');

    return (
        (<Modal show={show} size="lg">
            <div className="card bg-light">
                <div className="card-header">
                    <button className={`${index < 1 ? 'd-none' : ''} btn btn-outline-danger rounded`}
                        onClick={() => setIndex(index - 1)}
                    >Voltar</button>
                </div>

                <div className="card-body">
                    {index == 0 && <TipoPagamento setRecorrente={setRecorrente} setIndex={setIndex} />}
                    {index == 1 && <FormaPagamento setFormaPagamento={setFormaPagamento} setIndex={setIndex} />}
                </div>

                <div className="card-footer">
                    <button className="btn btn-danger rounded" onClick={close}>Fechar</button>
                </div>
            </div>
        </Modal>)
    );
}

function TipoPagamento({ setRecorrente, setIndex }) {

    function select(value) {
        setRecorrente(value);
        setIndex(1);
    }

    return (
        <div className="d-flex flex-column g-3">
            <div className="card border border-success col-md-12 shadow-xl hover:scale-105 duration-300">
                <div className="card-body">
                    <h5 className="card-title text-success">Pagamento Recorrente</h5>
                    <p className="card-text">
                        Pagamento mensal automático. Ideal para quem deseja acesso contínuo ao sistema.
                        Renova sua licença automaticamente a cada mês. Cancele a qualquer momento, sem taxas adicionais.
                    </p>
                    <button onClick={() => select(true)} className="btn btn-success w-100">
                        Escolher pagamento recorrente
                    </button>
                </div>
            </div>

            <div className="card border border-info col-md-12 shadow-xl hover:scale-105 duration-300">
                <div className="card-body">
                    <h5 className="card-title text-info">Pagamento Único</h5>
                    <p className="card-text">
                        Pagamento único para 1 mês de acesso. Perfeito para quem precisa do sistema por um período específico.
                        Após 1 mês, a licença expira.
                    </p>
                    <button onClick={() => select(false)} className="btn btn-info w-100">
                        Escolher pagamento único
                    </button>
                </div>
            </div>
        </div>
    )
}

function FormaPagamento({ setFormaPagamento, setIndex }) {

    function select(value) {
        setFormaPagamento(value);
        setIndex(2);
    }

    return (
        <div className="row gap-3 justify-content-around">
            <button className="col-md-3 btn btn-outline-success rounded d-flex justify-content-center align-items-center" onClick={() => select('PIX')}>
                <iconify-icon icon="ic:baseline-pix" width="50" height="50"></iconify-icon>
                PIX
            </button>
            
            <button className="col-md-3 btn btn-outline-info rounded d-flex justify-content-center align-items-center" onClick={() => select('CREDIT_CARD')}>
                <iconify-icon icon="ion:card" width="50" height="50"></iconify-icon>
                Cartão
            </button>

            <button className="col-md-3 btn btn-outline-warning rounded d-flex justify-content-center align-items-center" onClick={() => select('CASH')}>
                <iconify-icon icon="mdi:cash" width="50" height="50"></iconify-icon>
                Dinheiro
            </button>
        </div>
    )
}

export default Pagamento;