import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { useToggleSidebar } from "../states/states";
import { useEffect, useState } from "react";

function Header() {
    const { toggleSidebar } = useToggleSidebar();
    const navigate = useNavigate();

    const [tema, setTema] = useState(localStorage.getItem('tema') ?? 'light');

    function sair() {
        destroyCookie(null, 'token');
        navigate('/entrar');
    }

    useEffect(() => {
        const tema = localStorage.getItem('tema');
        if (!tema) localStorage.setItem('tema', 'light');

        document.documentElement.setAttribute("data-bs-theme", tema);
    }, []);

    function alteraTema() {
        const novoTema = tema === 'light' ? 'dark' : 'light';
        localStorage.setItem('tema', novoTema);
        setTema(novoTema);
        document.documentElement.setAttribute("data-bs-theme", novoTema);
    }

    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    <li onClick={toggleSidebar} className="nav-item d-block d-xl-none">
                        <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse">
                            <i className="bi bi-list fs-6 m-3"></i>
                        </a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link nav-icon-hover" href="javascript:void(0)">
                            <i className="ti ti-bell-ringing"></i>
                            <div className="notification bg-primary rounded-circle"></div>
                        </a>
                    </li> */}
                </ul>

                <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        <a href="#" onClick={() => navigate('/cadaluno')} className="btn btn-success me-2">
                            <span className="d-none d-md-block"><i className="bi bi-plus-circle me-2"></i>Novo aluno</span>
                            <span className="d-block d-md-none"><i className="bi bi-plus-circle me-2"></i>Aluno</span>
                        </a>

                        <button onClick={alteraTema} className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex">
                            {/* <iconify-icon icon="solar:moon-bold-duotone" className="moon fs-6 d-flex"></iconify-icon> */}
                            {localStorage.getItem('tema') === 'light'
                                ? <i className="bi bi-moon-fill"></i>
                                : <i className="bi bi-sun-fill"></i>
                            }                            
                        </button>
                        
                        {/* <a href="#" target="_blank"
                            className="btn btn-success"><span className="d-none d-md-block">Financeiro</span> <span className="d-block d-md-none">Fin.</span></a> */}
                    
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <img src="../assets/images/profile/user-1.jpg" alt="" width="35" height="35" className="rounded-circle" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                            <div className="message-body">
                                <a href="minhaconta" className="d-flex align-items-center gap-2 dropdown-item">
                                <i className="bi bi-person-fill fs-6"></i>
                                <p className="mb-0 fs-3">Minha conta</p>
                                </a>
                                {/* <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                                <i className="ti ti-mail fs-6"></i>
                                <p className="mb-0 fs-3">My Account</p>
                                </a> */}
                                {/* <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                                <i className="ti ti-list-check fs-6"></i>
                                <p className="mb-0 fs-3">My Task</p>
                                </a> */}
                                <a className="btn btn-outline-danger mx-3 mt-2 d-block" onClick={sair}>
                                    <i className="bi bi-box-arrow-left me-2"></i>Sair
                                </a>
                            </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;