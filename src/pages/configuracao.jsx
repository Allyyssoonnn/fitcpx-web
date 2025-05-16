import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario, useNotificacao } from "../states/states";
import Account from "./config/account";
import Business from "./config/business";
import License from "./config/license";
import Payments from "./config/payments";

function Configuracao() {
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    return (
        <div className="container-fluid">
            <div className="card">
                <ul className="nav nav-pills user-profile-tab" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-account-tab" data-bs-toggle="pill" data-bs-target="#pills-account" type="button" role="tab" aria-controls="pills-account" aria-selected="true">
                            <i className="bi bi-person me-2"></i>
                            <span className="d-none d-md-block">Conta</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-notifications-tab" data-bs-toggle="pill" data-bs-target="#pills-notifications" type="button" role="tab" aria-controls="pills-notifications" aria-selected="false">
                            <i className="bi bi-building me-2"></i>
                            <span className="d-none d-md-block">Empresa</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-security-tab" data-bs-toggle="pill" data-bs-target="#pills-security" type="button" role="tab" aria-controls="pills-security" aria-selected="false">
                            <i className="bi bi-unlock me-2"></i>
                            <span className="d-none d-md-block">Licença</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-bills-tab" data-bs-toggle="pill" data-bs-target="#pills-bills" type="button" role="tab" aria-controls="pills-bills" aria-selected="false">
                            <i className="bi bi-cash me-2"></i>
                            <span className="d-none d-md-block">Pagamentos</span>
                        </button>
                    </li>
                </ul>

                <div className="card-body">
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-account" role="tabpanel" aria-labelledby="pills-account-tab" tabIndex="0">
                            <Account usuario={usuario} setusuario={setusuario} />
                        </div>

                        <div className="tab-pane fade" id="pills-notifications" role="tabpanel" aria-labelledby="pills-notifications-tab" tabIndex="0">
                            <Business empresa={empresa} setempresa={setempresa} usuario={usuario} />
                        </div>

                        <div className="tab-pane fade" id="pills-security" role="tabpanel" aria-labelledby="pills-security-tab" tabIndex="0">
                            <License />
                        </div>

                        <div className="tab-pane fade" id="pills-bills" role="tabpanel" aria-labelledby="pills-bills-tab" tabIndex="0">
                            <Payments cod_empresa={empresa.cod_empresa} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Configuracao;