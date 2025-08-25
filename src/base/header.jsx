import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { stateApp, stateEmpresa, stateUsuario, useStateApp, useToggleSidebar } from "../states/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Notificacoes from "../components/notificacoes";
import { useTranslation } from "react-i18next";
import { imgProfile, PRODUCAO } from "../api/api";

function Header() {
   const { openedSidebar, closeSidebar, openSidebar } = useToggleSidebar();
   const navigate = useNavigate();
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const { toggleTheme, theme } = useStateApp();

   const [deferredPrompt, setDeferredPrompt] = useState(null);
   const [isInstalled, setIsInstalled] = useState(false);
   const [isIos, setIsIos] = useState(false);

   useEffect(() => {
      const handler = (event) => {
         event.preventDefault();
         setDeferredPrompt(event);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => {
         window.removeEventListener("beforeinstallprompt", handler);
      };
   }, []);

   useEffect(() => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
         setIsInstalled(true);
      }
   }, []);

   useEffect(() => {
      const isIosDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIos(isIosDevice);
   }, []);

   function sair() {
      destroyCookie(null, "user");
      destroyCookie(null, "token");
      destroyCookie(null, "refreshToken");
      localStorage.removeItem("recoil-persist");
      setusuario({});
      navigate("/entrar");
   }

   useEffect(() => {
      document.documentElement.setAttribute("data-bs-theme", theme);
   }, []);

   function alteraTema() {
      toggleTheme();
      const novoTema = theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", novoTema);
   }

   const handleInstallClick = async () => {
      if (isIos) {
         alert("Para instalar este app, abra o menu de compartilhamento e selecione 'Adicionar à Tela de Início'.");
         return;
      }
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
         console.log("Usuário aceitou a instalação do PWA");
         setIsInstalled(true);
      } else {
         console.log("Usuário recusou a instalação do PWA");
      }
      setDeferredPrompt(null);
   };

   return (
      <header className="app-header mb-3">
         <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between w-100 shadow-sm bg-white min-h-[70px]">
            <ul className="navbar-nav d-flex flex-row flex-grow-1 w-40 ms-md-3">
               <li onClick={openedSidebar ? closeSidebar : openSidebar} className="nav-item d-block d-xl-none">
                  <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse">
                     <i className="bi bi-list fs-6 m-3"></i>
                  </a>
               </li>

               <li className="nav-item nav-icon-hover-bg rounded-circle d-none d-md-flex shadow-lg rounded-circle bg-white">
                  <button
                     className="nav-link btn btn-outline-white rounded-pill"
                     onClick={openedSidebar ? closeSidebar : openSidebar}
                  >
                     {/* <iconify-icon icon="solar:list-bold-duotone" className="fs-6"></iconify-icon> */}
                     <i className={`bi ${openedSidebar ? "bi-arrow-bar-left" : "bi-arrow-bar-right"} fs-4`} />
                  </button>
               </li>

               <li className={`d-md-none ${isInstalled || isIos ? "d-none" : ""}`}>
                  <button onClick={handleInstallClick} className="btn btn-success">
                     <i className="bi bi-download me-2"></i>
                     Baixar app
                  </button>
               </li>
            </ul>

            <div className="navbar-collapse justify-content-end px-0 w-60" id="navbarNav">
               <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                  {/* <a href="#" onClick={() => navigate('/cadaluno')} className="btn btn-success me-2 d-none d-md-block">
                            <span className="d-none d-md-block"><i className="bi bi-plus-circle me-2"></i>Novo aluno</span>
                            <span className="d-block d-md-none"><i className="bi bi-plus-circle me-2"></i>Aluno</span>
                        </a> */}

                  <button
                     onClick={alteraTema}
                     className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex me-2"
                  >
                     {theme == "light" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
                  </button>

                  <Notificacoes />

                  <LanguageSelect />

                  <li className="nav-item dropdown me-2">
                     <a
                        className="d-flex align-items-center nav-link nav-icon-hover"
                        href="javascript:void(0)"
                        id="imgMenu"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                     >
                        <img
                           src={
                              usuario.imagem_usuario
                                 ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                                 : !PRODUCAO
                                 ? imgProfile
                                 : "https://placehold.co/150x150?text=img"
                           }
                           alt=""
                           width="35"
                           height="35"
                           className={`rounded-circle ${usuario.admin_usuario == "S" ? "border border-danger" : ""}`}
                           loading="lazy"
                        />
                     </a>

                     <div
                        style={{ height: "280px" }}
                        className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                        aria-labelledby="imgMenu"
                     >
                        <div className="message-body">
                           <div className="d-flex align-items-center mx-7 py-9 border-bottom">
                              <img
                                 src={
                                    usuario.imagem_usuario
                                       ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                                       : !PRODUCAO
                                       ? imgProfile
                                       : "https://placehold.co/150x150?text=img"
                                 }
                                 alt=""
                                 width="70"
                                 height="35"
                                 className={`rounded-circle ${
                                    usuario.admin_usuario == "S" ? "border border-danger" : ""
                                 }`}
                                 loading="lazy"
                              />
                              <div className="ms-4">
                                 <h4 className="mb-0 fs-5">{usuario?.nome_usuario}</h4>
                                 {usuario.admin_usuario == "S" && <span className="badge bg-danger fs-1">Admin</span>}
                                 <p className="mb-0 mt-1 d-flex align-items-center gap-1">
                                    <i className="bi bi-envelope" />
                                    {usuario?.email_usuario}
                                 </p>
                              </div>
                           </div>

                           <a
                              id="imgMenu-config"
                              href="#"
                              onClick={() => navigate("/configuracao")}
                              className="d-flex align-items-center gap-2 dropdown-item"
                           >
                              <i className="bi bi-gear fs-6"></i>
                              <p className="mb-0 fs-3">Configuração</p>
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

function LanguageSelect() {
   const { i18n } = useTranslation();
   const [open, setOpen] = useState(false);

   const changeLanguage = (lng, event) => {
      event.stopPropagation();
      i18n.changeLanguage(lng);
      setOpen(false);
   };

   const toggleMenu = (event) => {
      event.stopPropagation();
      setOpen(!open);
   };

   return (
      <div className="position-relative d-inline-block">
         <button className="btn btn-sm d-flex align-items-center gap-2" onClick={toggleMenu}>
            <iconify-icon icon={i18n.language === "pt" ? "cif:br" : "cif:us"} width="20"></iconify-icon>
            {i18n.language === "pt" ? "Português" : "English"}
            <iconify-icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} width="20"></iconify-icon>
         </button>

         {open && (
            <div
               className="position-absolute bg-white rounded shadow-sm mt-2"
               style={{ zIndex: 999, minWidth: "160px" }}
               onClick={(e) => e.stopPropagation()}
            >
               <button
                  onClick={(e) => changeLanguage("pt", e)}
                  className="dropdown-item d-flex align-items-center gap-2"
               >
                  <iconify-icon icon="cif:br" width="20"></iconify-icon> Português
               </button>

               {/* <button onClick={(e) => changeLanguage('en', e)} className="dropdown-item d-flex align-items-center gap-2">
                        <iconify-icon icon="cif:us" width="20"></iconify-icon> English
                    </button> */}
            </div>
         )}
      </div>
   );
}

export default Header;
