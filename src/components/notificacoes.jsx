import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useNavigate } from "react-router-dom";

function Notificacoes() {
    const navigate = useNavigate();
    const [usuario] = useRecoilState(stateUsuario);
    const [notificacoes, setNotificacoes] = useState([]);
    
    useEffect(() => {
        const tempNotificacoes = [];
        setNotificacoes(tempNotificacoes);
    }, []);

    return (
        (<li className="nav-item dropdown nav-icon-hover-bg rounded-circle me-2">
            <a className="nav-link position-relative" href="javascript:void(0)" data-bs-toggle="dropdown" id="drop3" aria-expanded="false">
                <i className="bi bi-bell-fill" />
                <div className={`pulse ${notificacoes.length > 0 ? '' : 'd-none'}`}>
                    <span className="heartbit border-success"></span>
                    <span className="point text-bg-success"></span>
                </div>
            </a>
            <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop3">
                <div className="d-flex align-items-center py-3 px-7 gap-6">
                    <h3 className="mb-0 fs-5">Notificações</h3>
                    <span className="badge bg-success-subtle text-success rounded-pill">{notificacoes.length}</span>
                </div>

                <div className="message-body" data-simplebar="">
                    {notificacoes.map((notifcacao, index) => (
                        <a onClick={notifcacao.onClick} key={index} href="javascript:void(0)" className="dropdown-item px-7 d-flex align-items-center py-6">
                            <span className="flex-shrink-0 position-relative">
                                {/* <img src=".//seodash/dist/assets/images/profile/user-4.jpg" alt="user" width="45" className="rounded-circle" /> */}
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            </span>
                            <div className="w-100 d-inline-block v-middle ps-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="mb-0">{notifcacao.title}</h6>
                                    {/* <span className="fs-2 text-nowrap d-block">9:08 AM</span> */}
                                </div>
                                <span className="text-nowrap d-block mt-1 fs-11">{notifcacao.content}</span>
                            </div>
                        </a>
                    ))}
                    {!notificacoes.length && (
                        <div className="d-flex justify-content-center p-3">Sem notificações</div>
                    )}
                </div>
            </div>
        </li>)
    );
}

export default Notificacoes;