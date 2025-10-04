import { AlarmClockIcon, AlarmClockOff } from "lucide-react";
import { destroyCookie, parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { imgProfile, PRODUCAO } from "../api/api";
import Notificacoes from "../components/notificacoes";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { stateUsuario, useStateApp, useToggleSidebar } from "../states/states";

function Header() {
   const cookies = parseCookies(null);
   const navigate = useNavigate();
   const { openedSidebar, closeSidebar, openSidebar } = useToggleSidebar();
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
            <ul className="navbar-nav d-flex flex-row flex-grow-1 ms-md-3">
               <li className="nav-item nav-icon-hover-bg rounded-circle shadow-lg rounded-circle bg-white">
                  <button
                     className="nav-link btn btn-outline-white rounded-pill"
                     onClick={openedSidebar ? closeSidebar : openSidebar}
                  >
                     {/* <iconify-icon icon="solar:list-bold-duotone" className="fs-6"></iconify-icon> */}
                     <i className={`bi ${openedSidebar ? "bi-arrow-bar-left" : "bi-arrow-bar-right"} fs-4`} />
                  </button>
               </li>
            </ul>

            <div className="navbar-collapse justify-content-end px-0 flex-grow-1" id="navbarNav">
               <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                  <li className={`d-md-none ${isInstalled || isIos ? "d-none" : ""}`}>
                     <Button onClick={handleInstallClick} size="sm">
                        <i className="bi bi-download"></i>
                        <i className="d-none d-md-flex ms-2">Baixar app</i>
                     </Button>
                  </li>

                  {["Trial Active", "Trial Expired", "Expired", "Cancelled"].includes(cookies.licenseStatus) && (
                     <Tooltip>
                        <TooltipTrigger>
                           <Button
                              variant={
                                 ["Trial Expired", "Expired", "Cancelled"].includes(cookies.licenseStatus)
                                    ? "destructive"
                                    : "default"
                              }
                              onClick={() => navigate("/configuracao?tab=3")}
                              size="sm"
                              className="ms-2"
                           >
                              {["Trial Expired", "Expired", "Cancelled"].includes(cookies.licenseStatus) && (
                                 <AlarmClockOff />
                              )}
                              {["Trial Active"].includes(cookies.licenseStatus) && <AlarmClockIcon />}

                              {cookies.licenseStatus == "Trial Active" && cookies.licenseTrialDaysLeft > 0 && (
                                 <>
                                    {cookies.licenseTrialDaysLeft} Dias{" "}
                                    <span className="d-none d-xl-block">restantes</span>
                                 </>
                              )}
                              {cookies.licenseStatus == "Trial Active" && cookies.licenseTrialDaysLeft == 0 && (
                                 <>Expira hoje</>
                              )}
                              {cookies.licenseStatus == "Trial Expired" && <>Teste expirado</>}
                              {cookies.licenseStatus == "Expired" && <>Licença expirada</>}
                              {cookies.licenseStatus == "Cancelled" && <>Licença cancelada</>}
                           </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                           {cookies.licenseStatus == "Trial Active" &&
                              cookies.licenseTrialDaysLeft == 0 &&
                              "Seu período de teste expira hoje."}
                           {cookies.licenseStatus == "Trial Active" &&
                              cookies.licenseTrialDaysLeft > 0 &&
                              `Seu período de teste em ${cookies.licenseTrialDaysLeft} dias.`}
                           {cookies.licenseStatus == "Trial Expired" &&
                              "O período de teste terminou. É necessário assinar um plano para continuar."}
                           {cookies.licenseStatus == "Expired" &&
                              "Sua licença expirou. Realize o pagamento para continuar utilizando."}
                           {cookies.licenseStatus == "Cancelled" &&
                              "Sua licença foi cancelada. É necessário assinar um plano para continuar."}
                        </TooltipContent>
                     </Tooltip>
                  )}

                  <button
                     onClick={alteraTema}
                     className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex mx-2"
                  >
                     {theme == "light" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
                  </button>

                  <Notificacoes />

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
                        style={{ height: "350px" }}
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

                           <div className="d-flex justify-center mx-7 py-2 border-bottom">
                              <LanguageSelect />
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
