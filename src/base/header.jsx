import { AlarmClockIcon, AlarmClockOff, ArrowRight, DoorClosed, HelpCircle, Moon, Sun } from "lucide-react";
import { destroyCookie, parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { get } from "../api/api";
import ChangelogUI from "../components/fitUI/changelog.ui";
import Notificacoes from "../components/notificacoes";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "../components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import routes from "../routes/routes";
import { stateUsuario, useStateApp } from "../states/states";
import { getYouTubeEmbedUrl } from "../utils";

function Header() {
   const { pathname } = useLocation();
   // const [openBanner, setOpenBanner] = useState(false);
   const [openChangelog, setOpenChangelog] = useState(false);
   const [changelog, setChangelog] = useState(null);

   // busca a primeira rota cujo padrão case com a URL atual
   const matched = routes.find((r) => {
      // matchPath retorna não-null se casar
      return matchPath({ path: r.path, end: r.exact ?? true }, pathname);
   });

   const pageName = matched?.name ?? "";
   const videoHelp = matched?.videoHelp ?? "";

   const cookies = parseCookies(null);
   const navigate = useNavigate();
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const { toggleTheme, theme } = useStateApp();

   const [deferredPrompt, setDeferredPrompt] = useState(null);
   const [isInstalled, setIsInstalled] = useState(false);
   const [isIos, setIsIos] = useState(false);

   // useEffect(() => {
   //    if (localStorage.getItem("Banner-BlackFriday") === "hidden") return;
   //    setOpenBanner(true);
   // }, []);

   useEffect(() => {
      (async () => {
         const version = __APP_VERSION__.substring(0, __APP_VERSION__.lastIndexOf(".")) + ".x";
         const response = await get(`changelog?v=${version}`);

         const lastSeenVersion = localStorage.getItem("lastSeenChangelogVersion");
         if (response && Object.keys(response).length > 0) {
            localStorage.setItem("lastSeenChangelogVersion", version);
            setChangelog(response);
         }
         if (lastSeenVersion === version) return;

         setOpenChangelog(true);
      })();
   }, []);

   // const openSmooth = () => {
   //    setOpenBanner(false); // garante mount limpo do Portal
   //    requestAnimationFrame(() => {
   //       setOpenBanner(true);
   //    });
   // };

   const openChangeloSmooth = () => {
      setOpenChangelog(false); // garante mount limpo do Portal
      requestAnimationFrame(() => {
         setOpenChangelog(true);
      });
   };

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
      if (theme == "dark") {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   }, []);

   function alteraTema() {
      toggleTheme();
      const novoTema = theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", novoTema);
      if (novoTema == "dark") {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
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
      <div className="mb-3">
         <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between items-center w-100 shadow-sm min-h-[70px] bg-sidebar">
            <div className="d-flex items-center ms-3 gap-3">
               <SidebarTrigger />

               {!!videoHelp && (
                  <Dialog>
                     <DialogTrigger>
                        <Button size="sm">
                           <HelpCircle />
                           <span className="hidden lg:flex">{pageName}</span>
                        </Button>
                     </DialogTrigger>

                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Vídeo de ajuda</DialogTitle>
                        </DialogHeader>

                        <div className="relative w-full h-0 pb-[56.25%]">
                           <iframe
                              src={getYouTubeEmbedUrl(videoHelp)}
                              title={name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute top-0 left-0 w-full h-full"
                           ></iframe>
                        </div>

                        <DialogFooter>
                           <DialogClose>
                              <Button size="sm" variant="destructive">
                                 Fechar
                              </Button>
                           </DialogClose>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               )}
            </div>

            <div className="justify-content-end px-0" id="navbarNav">
               <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                  <li className={`d-md-none ${isInstalled || isIos ? "d-none" : ""}`}>
                     <Button onClick={handleInstallClick} size="sm">
                        <i className="bi bi-download"></i>
                        <i className="d-none d-md-flex ms-2">Baixar app</i>
                     </Button>
                  </li>

                  {/* <Button className="bg-black ms-3" onClick={openSmooth}>
                     <BadgeDollarSign />
                     <span className="d-none d-md-flex">Black Friday</span>
                     <span className="d-flex d-md-none">Black</span>
                  </Button> */}
                  {/* <BannerUI show={openBanner} closeControlled={() => setOpenBanner(false)} /> */}

                  <ChangelogUI
                     changelog={changelog}
                     show={openChangelog}
                     closeControlled={() => setOpenChangelog(false)}
                  />

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
                              `Seu período de teste expira em ${cookies.licenseTrialDaysLeft} dias.`}
                           {cookies.licenseStatus == "Trial Expired" &&
                              "O período de teste terminou. É necessário assinar um plano para continuar."}
                           {cookies.licenseStatus == "Expired" &&
                              "Sua licença expirou. Realize o pagamento para continuar utilizando."}
                           {cookies.licenseStatus == "Cancelled" &&
                              "Sua licença foi cancelada. É necessário assinar um plano para continuar."}
                        </TooltipContent>
                     </Tooltip>
                  )}

                  <Button size="sm" variant="ghost" onClick={alteraTema}>
                     {theme == "light" ? <Moon /> : <Sun />}
                  </Button>

                  <Notificacoes />

                  <DropdownMenu>
                     <DropdownMenuTrigger id="avatar">
                        <Avatar className="ms-3 me-3">
                           <AvatarImage
                              className={`rounded-circle ${usuario.admin_usuario == "S" ? "border border-danger" : ""}`}
                              src={
                                 usuario.imagem_usuario
                                    ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                                    : "https://placehold.co/150x150?text=img"
                              }
                           />
                           <AvatarFallback>
                              {(usuario?.nome_usuario ?? "US").substring(0, 2)?.toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent className="p-3 me-3 w-80">
                        <div className="d-flex align-items-center">
                           <Avatar className="h-14 w-14">
                              <AvatarImage
                                 className={`rounded-circle ${
                                    usuario.admin_usuario == "S" ? "border border-danger" : ""
                                 }`}
                                 src={
                                    usuario.imagem_usuario
                                       ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}`
                                       : "https://placehold.co/150x150?text=img"
                                 }
                              />
                              <AvatarFallback>
                                 {(usuario?.nome_usuario ?? "US").substring(0, 2)?.toUpperCase()}
                              </AvatarFallback>
                           </Avatar>

                           <div className="ms-3">
                              <h4 className="mb-0 fs-5">{usuario?.nome_usuario}</h4>
                              {usuario.admin_usuario == "S" && <Badge>Admin</Badge>}
                              <p className="mb-0 mt-1 d-flex align-items-center gap-1">
                                 <i className="bi bi-envelope" />
                                 {usuario?.email_usuario}
                              </p>
                           </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="d-flex justify-center">
                           <LanguageSelect />
                        </div>

                        <Separator className="my-2" />

                        <DropdownMenuItem id="avatar-config" onClick={() => navigate("/configuracao")}>
                           Configuração
                           <DropdownMenuShortcut>
                              <ArrowRight />
                           </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={openChangeloSmooth}>
                           Notas de atualização
                           <DropdownMenuShortcut>
                              <ArrowRight />
                           </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <a href="https://fitcpx.com">Acessar site</a>
                           <DropdownMenuShortcut>
                              <ArrowRight />
                           </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={sair}>
                           Sair da conta
                           <DropdownMenuShortcut>
                              <DoorClosed />
                           </DropdownMenuShortcut>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </ul>
            </div>
         </nav>
      </div>
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
         <button disabled className="btn btn-sm d-flex align-items-center gap-2" onClick={toggleMenu}>
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
