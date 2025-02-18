import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { stateAluno, useToggleSidebar } from "../../states/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import navigation from './_nav';

function Header() {
    const { toggleSidebar } = useToggleSidebar();
    const navigate = useNavigate();
    const [aluno, setaluno] = useRecoilState(stateAluno);
    const [menus, setMenus] = useState({});

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
        setaluno({});
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
        <header className="app-header bg-success rounded-bottom-3 shadow-md mb-3 mb-sm-0">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    {/* <li className="nav-item d-block d-xl-none">
                        <a className="nav-link nav-icon-hover" href="javascript:void(0)" id="drop3" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-list fs-6 m-3"></i>
                        </a>
                    </li> */}

                    <li className="nav-item dropdown me-2 nav-item d-block d-xl-none">
                        <a className="nav-link nav-icon-hover" href="javascript:void(0)" id="drop3" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-list fs-6 m-3"></i>
                        </a>

                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop3">
                            <div className="sidebar-nav scroll-sidebar">
                                <ul className="sidebarnav p-2">
                                    {navigation.map((v, i) => {
                                        if (v.divider) return (
                                            <li className="nav-small-cap" key={i}>
                                                <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                                                <span className="hide-menu ps-1">{v.name}</span>
                                            </li>
                                        )

                                        if (v.menu) return (
                                            <li className="sidebar-item" key={i}>
                                                <a 
                                                    className="sidebar-link p-3 has-arrow" 
                                                    href="#"
                                                    onClick={(e) => { e.stopPropagation(); setMenus(prev => ({ ...prev, [v.name]: !prev[v.name] })) }}
                                                    data-bs-toggle="collapse"
                                                    aria-expanded="false"
                                                >
                                                    {v.icon}
                                                    <span className="hide-menu ps-1">{v.name}</span>
                                                </a>
                                        
                                                <ul className={`collapse first-level ${menus[v.name] ? 'in' : ''}`}>
                                                    {v.items?.map((item, index) => (
                                                        <li className="sidebar-item ms-5" key={index}>
                                                            <a href="#" className="sidebar-link p-1" onClick={() => navigate(item.to)}>
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
                                                <a href="#" className="sidebar-link p-3" onClick={() => navigate(v.to)} aria-expanded="false">
                                                    {v.icon}
                                                    <span className="hide-menu ps-1">{v.name}</span>
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
                    {/* <ul className="navbar-nav flex-row ms-3">
                        <li>
                            <i className="bi bi-donwload fs-6 px-2 rounded-5 text-black"></i>
                            <button onClick={handleInstallClick} className="btn btn-success">Baixar app</button>
                        </li>
                    </ul> */}

                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">

                        <button onClick={alteraTema} className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex me-2">
                            {/* <iconify-icon icon="solar:moon-bold-duotone" className="moon fs-6 d-flex"></iconify-icon> */}
                            {localStorage.getItem('tema') === 'light'
                                ? <i className="bi bi-moon-fill"></i>
                                : <i className="bi bi-sun-fill"></i>
                            }                            
                        </button>

                        <li className="nav-item dropdown me-2">
                            <a className="d-flex align-items-center nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                <img
                                    src={aluno.imagem_aluno ? `${aluno.imagem_aluno}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                    alt=""
                                    width="35" height="35"
                                    className='rounded-circle shadow-md'
                                    loading="lazy"
                                />
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