import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { stateApp, stateEmpresa, stateUsuario, useStateApp, useToggleSidebar } from "../states/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { verifyEmail } from "../api/usuario";

function Header() {
    const { openedSidebar, toggleSidebar } = useToggleSidebar();
    const navigate = useNavigate();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);
    const { toggleTheme, theme } = useStateApp();

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
        document.documentElement.setAttribute("data-bs-theme", theme);
    }, []);

    function alteraTema() {
        toggleTheme();
        const novoTema = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute("data-bs-theme", novoTema);
    }

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
            <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between w-100">
                <ul className="navbar-nav d-flex flex-row flex-grow-1 w-50 ms-md-3">
                    <li onClick={toggleSidebar} className="nav-item d-block d-xl-none">
                        <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse">
                            <i className="bi bi-list fs-6 m-3"></i>
                        </a>
                    </li>

                    <li className="nav-item nav-icon-hover-bg rounded-circle d-none d-md-flex">
                        <button className="nav-link" onClick={toggleSidebar}>
                            {/* <iconify-icon icon="solar:list-bold-duotone" className="fs-6"></iconify-icon> */}
                            <i className={`bi bi-fullscreen${openedSidebar ? '' : '-exit'} fs-4`} />
                        </button>
                    </li>
                    
                    <li className="d-md-none">
                        <button onClick={handleInstallClick} className="btn btn-success">
                            <i className="bi bi-download me-2"></i>
                            Baixar app
                        </button>
                    </li>
                </ul>

                <div className="navbar-collapse justify-content-end px-0 w-50" id="navbarNav">
                    {/* <ul className="navbar-nav flex-row ms-3">
                        <li className={`${empresa.email_confirmado == 'S' ? 'd-none' : 'd-flex'} align-items-center gap-1 bg-warning-subtle rounded-3 p-2`}>
                            <i className="bi bi-exclamation-triangle fs-6 px-2 rounded-5 text-black"></i>
                            <h6 className="fs-3 mb-0">E-mail não verificado</h6>
                            <button onClick={verificarEmail} className="btn btn-sm btn-success">Verificar</button>
                        </li>
                    </ul> */}

                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        {/* <a href="#" onClick={() => navigate('/cadaluno')} className="btn btn-success me-2 d-none d-md-block">
                            <span className="d-none d-md-block"><i className="bi bi-plus-circle me-2"></i>Novo aluno</span>
                            <span className="d-block d-md-none"><i className="bi bi-plus-circle me-2"></i>Aluno</span>
                        </a> */}

                        <button onClick={alteraTema} className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex me-2">
                            {theme == 'light'
                                ? <i className="bi bi-moon-fill"></i>
                                : <i className="bi bi-sun-fill"></i>
                            }                            
                        </button>

                        <li className="nav-item dropdown me-2">
                            <a className="d-flex align-items-center nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                <img
                                    src={usuario.imagem_usuario ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                    alt=""
                                    width="35" height="35"
                                    className={`rounded-circle ${usuario.admin_usuario == 'S' ? 'border border-danger' : ''}`}
                                    loading="lazy"
                                />
                            </a>

                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                <div className="message-body">
                                    <div className="d-flex align-items-center mx-7 py-9 border-bottom">
                                        <img
                                            src={usuario.imagem_usuario ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                            alt=""
                                            width="70" height="35"
                                            className={`rounded-circle ${usuario.admin_usuario == 'S' ? 'border border-danger' : ''}`}
                                            loading="lazy"
                                        />
                                        <div className="ms-4">
                                            <h4 className="mb-0 fs-5">{usuario?.nome_usuario}</h4>
                                            {usuario.admin_usuario == 'S' && <span className="badge bg-danger fs-1">Admin</span>}
                                            <p className="mb-0 mt-1 d-flex align-items-center gap-1">
                                                <i className="bi bi-envelope" />
                                                {usuario?.email_usuario}
                                            </p>
                                        </div>
                                    </div>
                                    <a href="#" onClick={() => navigate('/minhaconta')} className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-person-fill fs-6"></i>
                                        <p className="mb-0 fs-3">Minha conta</p>
                                    </a>
                                    <a href="#" onClick={() => navigate('/licenca')} className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-unlock fs-6"></i>
                                        <p className="mb-0 fs-3">Licença</p>
                                    </a>
                                    <a href="https://fitcpx.com" className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="bi bi-house fs-6"></i>
                                        <p className="mb-0 fs-3">Acessar site</p>
                                    </a>
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