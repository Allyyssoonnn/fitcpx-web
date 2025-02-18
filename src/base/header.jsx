import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { stateEmpresa, stateUsuario, useToggleSidebar } from "../states/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { verifyEmail } from "../api/usuario";

function Header() {
    const { toggleSidebar } = useToggleSidebar();
    const navigate = useNavigate();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);

    const [tema, setTema] = useState(localStorage.getItem('tema') ?? 'light');

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    function sair() {
        destroyCookie(null, 'user');
        destroyCookie(null, 'token');
        destroyCookie(null, 'refreshToken');
        setusuario({});
        navigate('/entrar');
    }

    useEffect(() => {
        const tema = localStorage.getItem('tema');
        if (!tema) localStorage.setItem('tema', 'light');

        document.documentElement.setAttribute("data-bs-theme", tema);
    }, []);

    useEffect(() => {
        const gridElement = document.getElementById('ag-grid-table');
        if (gridElement) gridElement.className = tema === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
    }, [tema]);

    function alteraTema() {
        const novoTema = tema === 'light' ? 'dark' : 'light';
        localStorage.setItem('tema', novoTema);
        setTema(novoTema);
        document.documentElement.setAttribute("data-bs-theme", novoTema);
    }

    const tooltip = (
        <Tooltip id="tooltip">
            <div>Admin</div>
        </Tooltip>
    );

    function verificarEmail() {
        verifyEmail(empresa.cod_empresa);
    }

    const handleInstallClick = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("Usuário aceitou instalar o PWA");
            } else {
              console.log("Usuário recusou instalar o PWA");
            }
            setDeferredPrompt(null);
          });
        }
    };

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
                    {/* <ul className="navbar-nav flex-row ms-3">
                        <li className={`${empresa.email_confirmado == 'S' ? 'd-none' : 'd-flex'} align-items-center gap-1 bg-warning-subtle rounded-3 p-2`}>
                            <i className="bi bi-exclamation-triangle fs-6 px-2 rounded-5 text-black"></i>
                            <h6 className="fs-3 mb-0">E-mail não verificado</h6>
                            <button onClick={verificarEmail} className="btn btn-sm btn-success">Verificar</button>
                        </li>
                    </ul> */}

                    <ul className="navbar-nav flex-row ms-3">
                        <li>
                            <i className="bi bi-donwload fs-6 px-2 rounded-5 text-black"></i>
                            <button onClick={handleInstallClick} className="btn btn-success">Baixar app</button>
                        </li>
                    </ul>

                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        {/* <a href="#" onClick={() => navigate('/cadaluno')} className="btn btn-success me-2 d-none d-md-block">
                            <span className="d-none d-md-block"><i className="bi bi-plus-circle me-2"></i>Novo aluno</span>
                            <span className="d-block d-md-none"><i className="bi bi-plus-circle me-2"></i>Aluno</span>
                        </a> */}

                        <button onClick={alteraTema} className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex me-2">
                            {/* <iconify-icon icon="solar:moon-bold-duotone" className="moon fs-6 d-flex"></iconify-icon> */}
                            {localStorage.getItem('tema') === 'light'
                                ? <i className="bi bi-moon-fill"></i>
                                : <i className="bi bi-sun-fill"></i>
                            }                            
                        </button>
                        
                        {/* <a href="#" target="_blank"
                            className="btn btn-success"><span className="d-none d-md-block">Financeiro</span> <span className="d-block d-md-none">Fin.</span></a> */}

                        <li className="nav-item dropdown me-2">
                            <a className="d-flex align-items-center nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                <img
                                    src={usuario.imagem_usuario ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                    alt=""
                                    width="35" height="35"
                                    className={`rounded-circle ${usuario.admin_usuario == 'S' ? 'border border-danger' : ''}`}
                                    loading="lazy"
                                />
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <i className={`bi bi-unlock-fill text-danger ms-2 ${usuario.admin_usuario == 'S' ? '' : 'd-none'}`}></i>
                                </OverlayTrigger>
                            </a>

                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                <div className="message-body">
                                    <a href="minhaconta" className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-person-fill fs-6"></i>
                                        <p className="mb-0 fs-3">Minha conta</p>
                                    </a>
                                    <a href="licenca" className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-unlock fs-6"></i>
                                        <p className="mb-0 fs-3">Licença</p>
                                    </a>
                                    <a href="https://fitcpx.com" className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-house fs-6"></i>
                                        <p className="mb-0 fs-3">Acessar site</p>
                                    </a>
                                    {/* <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                                    <i className="ti ti-list-check fs-6"></i>
                                    <p className="mb-0 fs-3">My Task</p>
                                    </a> */}
                                    <a className="btn btn-outline-danger mx-3 mt-2 d-block" onClick={sair}>
                                        <i className="bi bi-box-arrow-left me-2"></i>Sair da conta
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