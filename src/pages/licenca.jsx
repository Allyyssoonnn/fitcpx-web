import { useState } from "react";
import MercadoPago from "../components/mercadopago";


function Licenca() {
    const [renovando, setRenovando] = useState(false);

    const [status, setStatus] = useState('Licença gratuita');
    // const [status, setStatus] = useState('Licença gratuita');
    // const [status, setStatus] = useState('Licença expirada');

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Licença de uso</h5>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="text-center p-5 bg-success-subtle rounded-5 d-flex align-items-center">
                                <img height={50} width={50} src="../assets/images/app/gratis.png" alt="" className="img-fluid" />
                                <h1 className="ms-2">{status}</h1>
                                {/* <h1 className="ms-2">15</h1>
                                <h5 className="mt-2 ms-2">Dias restantes</h5> */}
                            </div>
                        </div>

                        <div className={`col-md-6 ${!renovando ? 'd-flex' : 'd-none'} justify-content-center align-items-center`}>
                            <button className="btn btn-success" onClick={() => setRenovando(true)}>
                                <i className="bi bi-arrow-clockwise me-2"></i>Renovar licença
                            </button>
                        </div>

                        <div className={`col-md-6 ${renovando ? 'd-inline-block' : 'd-none'} justify-content-center`}>
                            <button className="btn btn-danger" onClick={() => setRenovando(false)}>
                                <i className="bi bi-x-circle me-2"></i>Voltar
                            </button>
                            <MercadoPago />
                        </div>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-danger">
                        <i className="bi bi-x-circle me-2"></i>Cancelar plano
                    </button>

                    {/* <button className="btn btn-success">
                        <i className="bi bi-arrow-clockwise me-2"></i>Renovar
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default Licenca;