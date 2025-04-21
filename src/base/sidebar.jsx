import { useEffect, useState } from "react";
import { stateApp, useToggleSidebar } from "../states/states";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

function Sidebar() {
    const navigate = useNavigate();
    const { toggleSidebar } = useToggleSidebar();
    const [{ openedSidebar }] = useRecoilState(stateApp);

    const [dropTreino, setDropTreino] = useState(false);
    const [dropAdmin, setDropAdmin] = useState(false);
    const [dropFinanceiro, setdropFinanceiro] = useState(false);
    const [dropCardapio, setdropCardapio] = useState(false);

    useEffect(() => {
        //Verifica se a tela é grande e aciona a SideBar caso o state esteja false
        // if (window.screen.width > 1600 && !openedSidebar) toggleSidebar();
    }, []);

    function go(route) {
        // toggleSidebar();
        setDropTreino(false);
        setDropAdmin(false);
        setdropCardapio(false);
        navigate(route);
    }

    return (
        <aside className="left-sidebar with-vertical" style={{ borderLeft: '0.30rem solid #85D446', overflowY: 'auto', overflowX: 'hidden', zIndex: '999', width: openedSidebar ? '' : '0px' }}>
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between border-bottom shadow-sm">

                    <div className="d-flex align-items-center">
                        <img src="../assets/images/logos/logo.png" alt="" width='45' />
                        <Typewriter texts={['Bem-vindo', 'Fit Complex']} />
                    </div>

                    <a onClick={toggleSidebar} className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="bi bi-x fs-8"></i>
                    </a>
                </div>

                <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                    <ul id="sidebarnav">
                        {/* <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu">Acesso rápido</span>
                        </li> */}

                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-6"></i>
                            <span className="hide-menu ps-1">Menu</span>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/')} aria-expanded="false">
                                <i className="bi bi-house fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Dashboard</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/alunos')} aria-expanded="false">
                                <i className="bi bi-person-rolodex fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Lista de alunos</span>
                            </a>
                        </li>
                        
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/agenda')} aria-expanded="false">
                                <i className="bi bi-calendar-check fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Agenda</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/planilha')} aria-expanded="false">
                                <i className="bi bi-journal-bookmark-fill fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Planilha de treino</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link p-3" onClick={() => go('/avaliacoes')} aria-expanded="false">
                                <i className="bi bi-activity fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Avaliações</span>
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a className={`sidebar-link p-3 has-arrow ${dropCardapio ? 'active' : ''}`} href="#" onClick={() => setdropCardapio(!dropCardapio)}>
                                <i className="bi bi-book fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Cardápio</span>
                            </a>

                            <ul className={`collapse first-level ${dropCardapio ? 'in' : ''}`}>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/grupoalimentos')} aria-expanded="false">
                                        <i className="bi bi-collection fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Grupo alimentos</span>
                                    </a>
                                </li>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/alimentos')} aria-expanded="false">
                                        <i className="bi bi-collection fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Alimentos</span>
                                    </a>
                                </li>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/cardapios')} aria-expanded="false">
                                        <i className="bi bi-book fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Cardápios</span>
                                    </a>
                                </li>
                            </ul>
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

                        <li className="sidebar-item">
                            <a className={`sidebar-link p-3 has-arrow ${dropFinanceiro ? 'active' : ''}`} href="#" onClick={() => setdropFinanceiro(!dropFinanceiro)}>
                                <i className="bi bi-bank fs-6 me-1"></i>
                                <span className="hide-menu ps-1">Financeiro</span>
                            </a>

                            <ul className={`collapse first-level ${dropFinanceiro ? 'in' : ''}`}>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/resumofinanceiro')} aria-expanded="false">
                                        <i className="bi bi-cash-coin fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Resumo</span>
                                    </a>
                                </li>

                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/modalidades')} aria-expanded="false">
                                        <i className="bi bi-easel fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Modalidades</span>
                                    </a>
                                </li>

                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/modcontratos')} aria-expanded="false">
                                        <i className="bi bi-paperclip fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Mod. Contratos</span>
                                    </a>
                                </li>

                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/planos')} aria-expanded="false">
                                        <i className="bi bi-basket fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Planos</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="sidebar-item">
                            <a className={`sidebar-link p-3 has-arrow ${dropAdmin ? 'active' : ''}`} href="#" onClick={() => setDropAdmin(!dropAdmin)}>
                                <i className="bi bi-person-vcard fs-6 me-1"></i>
                                <span className="hide-menu ps-1">ADMIN</span>
                            </a>

                            <ul className={`collapse first-level ${dropAdmin ? 'in' : ''}`}>
                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/licencapagamentos')} aria-expanded="false">
                                        <i className="bi bi-cash fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Licença pagamentos</span>
                                    </a>
                                </li>

                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/usuarios')} aria-expanded="false">
                                        <i className="bi bi-person-lines-fill fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Lista de usuários</span>
                                    </a>
                                </li>

                                <li className="sidebar-item ms-5">
                                    <a href="#" className="sidebar-link p-1" onClick={() => go('/relatorios')} aria-expanded="false">
                                        <i className="bi bi-bar-chart fs-6 me-1"></i>
                                        <span className="hide-menu ps-1">Relatórios</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    {/* bg-light-subtle */}
                    <div className="hide-menu bg-light position-relative mt-7 rounded-3">
                        <div className="d-flex p-2 justify-content-between">
                            <div className="mt-2">
                                <h4 className="mb-6">Uso gratuito</h4>
                                {/* <h6 className="fw-semibold fs-3 mb-6 text-dark">Uso gratuito para profissionais com até 3 alunos e 1 usuário</h6> */}
                                <button onClick={() => navigate('/licenca')} className="btn btn-success fs-2 fw-semibold lh-sm">Contratar plano</button>
                            </div>
                            
                            <div>
                                <img height={50} width={50} src="../assets/images/app/gratis.png" alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                    
                </nav>
            </div>
        </aside>
    );
}


const Typewriter = ({ texts, speed = 100, delay = 2000, maxCycles = 2 }) => {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
  
    useEffect(() => {
        if (isFinished) {
            setDisplayText(texts[texts.length - 1]);
            return;
        }

        const currentText = texts[textIndex];

        if (!isDeleting) {
            if (charIndex < currentText.length) {
                setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
                }, speed);
            } else {
                setTimeout(() => setIsDeleting(true), delay);
            }
        } else {
            if (charIndex > 0) {
                setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
                }, speed / 2);
            } else {
                if (cycleCount + 1 >= maxCycles) {
                    setIsFinished(true);
                } else {
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                    setCycleCount((prev) => prev + 1);
                }
            }
        }
    }, [charIndex, isDeleting, textIndex, texts, speed, delay, cycleCount, maxCycles, isFinished]);
  
    return (
        <motion.h3
            className="ms-3 mb-0 fs-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {displayText}
        </motion.h3>
    );
};

export default Sidebar;