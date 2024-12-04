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

    return (
        <aside className="left-sidebar with-vertical">
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
                            <a href="#" className="sidebar-link p-3" onClick={() => navigate('/')} aria-expanded="false">
                                <i className="bi bi-house-fill fs-6"></i>
                                <span className="hide-menu ps-1">Dashboard</span>
                            </a>
                        </li>

                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu ps-1">Menu</span>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => navigate('/alunos')} aria-expanded="false">
                                <i className="bi bi-person-lines-fill fs-6"></i>
                                <span className="hide-menu ps-1">Lista de alunos</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => navigate('/agenda')} aria-expanded="false">
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


                    {/* <div className="unlimited-access hide-menu bg-primary-subtle position-relative mb-7 mt-7 rounded-3">  */}
                        {/* <div className="d-flex"> */}
                            {/* <div className="unlimited-access-title me-3"> */}
                                {/* <h6 className="fw-semibold fs-4 mb-6 text-dark w-75">Libere mais acessos</h6> */}
                                {/* <a href="#" target="_blank" className="btn btn-primary fs-2 fw-semibold lh-sm">Liberar</a> */}
                            {/* </div> */}
                            
                            {/* <div className="unlimited-access-img">
                                <img src="../assets/images/backgrounds/rocket.png" alt="" className="img-fluid" />
                            </div> */}
                        {/* </div> */}
                    {/* </div> */}
                    
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;