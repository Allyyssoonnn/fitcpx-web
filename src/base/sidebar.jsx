import { useEffect, useState } from "react";
import { stateApp, useToggleSidebar } from "../states/states";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const { toggleSidebar } = useToggleSidebar();
    const [{ openedSidebar }] = useRecoilState(stateApp);

    const [dropTreino, setDropTreino] = useState(false);

    useEffect(() => {
        //Verifica se a tela é grande e aciona a SideBar caso o state esteja false
        if (window.screen.width > 1600 && !openedSidebar) toggleSidebar();
    }, []);

    function go(route) {
        toggleSidebar();
        setDropTreino(false)
        navigate(route);
    }

    return (
        <aside className="left-sidebar with-vertical" style={{ borderLeft: '0.30rem solid #85D446', overflowY: 'auto', overflowX: 'hidden' }}>
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <a href="/" className="text-nowrap logo-img d-flex">
                        <h1 style={{ borderLeft: '0.30rem solid #85D446' }}>FitG</h1>
                    </a>
                    <img src="../assets/images/app/logo2.png" alt="" width='100' style={{ padding: '10px' }} />
                    <a onClick={toggleSidebar} className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="bi bi-x fs-8"></i>
                    </a>
                </div>

                <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                    <ul id="sidebarnav">
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu">Acesso rápido</span>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/')} aria-expanded="false">
                                <i className="bi bi-house-fill fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Dashboard</span>
                            </a>
                        </li>

                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu ps-1">Menu</span>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/alunos')} aria-expanded="false">
                                <i className="bi bi-person-lines-fill fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Lista de alunos</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/agenda')} aria-expanded="false">
                                <i className="bi bi-calendar-check-fill fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Agenda</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a className={`sidebar-link p-3 has-arrow ${dropTreino ? 'active' : ''}`} href="#" onClick={() => setDropTreino(!dropTreino)}>
                                <i className="bi bi-card-checklist fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Treino</span>
                            </a>

                            <ul className={`collapse first-level ${dropTreino ? 'in' : ''}`}>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/grupoexercicios')} aria-expanded="false">
                                        <i className="bi bi-collection fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Grupo exercícios</span>
                                    </a>
                                </li>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/exercicios')} aria-expanded="false">
                                        <i className="bi bi-activity fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Exercícios</span>
                                    </a>
                                </li>
                                {/* <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/sessoes')} aria-expanded="false">
                                        <i className="bi bi-alphabet-uppercase fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Sessões</span>
                                    </a>
                                </li> */}
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/treinos')} aria-expanded="false">
                                        <i className="bi bi-card-checklist fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Treinos</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        {/* <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/agenda')} aria-expanded="false">
                                <i className="bi bi-cash-stack fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Financeiro</span>
                            </a>
                        </li> */}

                        {/* <li className="sidebar-item">
                            <a className="sidebar-link" href="/avaliacoes" aria-expanded="false">
                                <span>
                                <iconify-icon icon="solar:layers-minimalistic-bold-duotone" className="fs-6"></iconify-icon>
                                </span>
                                <span className="hide-menu">Avaliações física</span>
                            </a>
                        </li> */}

                    </ul>

                    {/* bg-light-subtle */}
                    <div className="hide-menu bg-light position-relative mt-7 rounded-3">
                        <div className="d-flex p-2">
                            <div className="mt-2">
                                <h4 className="mb-6 text-dark">Uso gratuito</h4>
                                <h6 className="fw-semibold fs-3 mb-6 text-dark">Uso gratuito para profissionais com até 3 alunos</h6>
                                <button onClick={() => navigate('/licenca')} className="btn btn-success fs-2 fw-semibold lh-sm">Contratar plano</button>
                            </div>
                            
                            <div>
                                <img height={100} width={100} src="../assets/images/app/gratis.png" alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                    
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;