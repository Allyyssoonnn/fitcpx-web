import { useEffect } from "react";
import { stateApp, useToggleSidebar } from "../states/states";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const { toggleSidebar } = useToggleSidebar();
    const [{ openedSidebar }] = useRecoilState(stateApp);

    useEffect(() => {
        //Verifica se a tela é grande e aciona a SideBar caso o state esteja false
        if (window.screen.width > 1600 && !openedSidebar) toggleSidebar();
    }, []);

    function go(route) {
        toggleSidebar();
        navigate(route);
    }

    return (
        <aside className="left-sidebar with-vertical" style={{ borderLeft: '0.30rem solid #85D446' }}>
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <a href="/" className="text-nowrap logo-img ">
                        <img src="../assets/images/logos/log.png" alt="" width='200' style={{ padding: '10px' }} />
                        {/* <h1>EducApp</h1> */}
                    </a>
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
                                <i className="bi bi-house-fill fs-6"></i>
                                <span className="hide-menu ps-1">Dashboard</span>
                            </a>
                        </li>

                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu ps-1">Menu</span>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/alunos')} aria-expanded="false">
                                <i className="bi bi-person-lines-fill fs-6"></i>
                                <span className="hide-menu ps-1">Lista de alunos</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/agenda')} aria-expanded="false">
                                <i className="bi bi-calendar-check-fill fs-6"></i>
                                <span className="hide-menu ps-1">Agenda</span>
                            </a>
                        </li>

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
                                <h6 className="fw-semibold fs-3 mb-6 text-dark">Complete seu cadastro e ganhe +10 dias de teste</h6>
                                <button onClick={() => navigate('/minhaconta')} className="btn btn-success fs-2 fw-semibold lh-sm">Cadastrar</button>
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