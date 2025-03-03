import { useEffect, useState } from "react";
import { stateAluno, stateApp, useToggleSidebar } from "../../states/states";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import navigation from './_nav';

function Sidebar() {
    const navigate = useNavigate();
    const [aluno] = useRecoilState(stateAluno);
    const { toggleSidebar } = useToggleSidebar();
    const [{ openedSidebar }] = useRecoilState(stateApp);
    const [menus, setMenus] = useState({});

    useEffect(() => {
        //Verifica se a tela é grande e aciona a SideBar caso o state esteja false
        if (window.screen.width > 1600 && !openedSidebar) toggleSidebar();

        if (!aluno?.cod_aluno) {
            // navigate('/entrar');
        }
    }, [aluno]);

    function go(route) {
        toggleSidebar();
        navigate(route);
    }

    return (
        <aside className="left-sidebar with-vertical" style={{ borderLeft: '0.30rem solid #85D446', overflowY: 'auto', overflowX: 'hidden', zIndex: '999', width: openedSidebar ? '' : '0px' }}>
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <img src="/assets/images/logos/logo_horizontal.png" alt="" width='200' />
                    <a onClick={toggleSidebar} className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="bi bi-x fs-8"></i>
                    </a>
                </div>

                <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                    <ul id="sidebarnav">
                        {navigation.map((v, i) => {
                            if (v.divider) return (
                                <li className="nav-small-cap" key={i}>
                                    <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                                    <span className="hide-menu ps-1">{v.name}</span>
                                </li>
                            )

                            if (v.menu) return (
                                <li className="sidebar-item" key={i}>
                                    <a className={`sidebar-link p-3 has-arrow ${menus[v.name] ? 'active' : ''}`} href="#"
                                        onClick={() => setMenus(prev => ({ ...prev, [v.name]: !prev[v.name] }))}
                                    >
                                        {v.icon}
                                        <span className="hide-menu ps-1">{v.name}</span>
                                    </a>

                                    <ul className={`collapse first-level ${menus[v.name] ? 'in' : ''}`}>
                                        {v.items?.map((item, index) => (
                                            <li className="sidebar-item ms-5" key={index}>
                                                <a href="#" className="sidebar-link p-1" onClick={() => go(item.to)} aria-expanded="false">
                                                    {item.icon}
                                                    <span className="hide-menu ps-1">{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )

                            return (
                                <li className="sidebar-item" key={i}>
                                    <a href="#" className="sidebar-link p-3" onClick={() => go(v.to)} aria-expanded="false">
                                        {v.icon}
                                        <span className="hide-menu ps-1">{v.name}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;