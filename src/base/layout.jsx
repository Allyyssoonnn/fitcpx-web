/* eslint-disable no-undef */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import BackToTop from "../components/backToTop";
import ChatUI from "../components/fitUI/chat.ui";
import { SidebarProvider } from "../components/ui/sidebar";
import { stateEmpresa, stateUsuario } from "../states/states";
import Header from "./header";
import Sidebar from "./sidebar";

function Layout() {
   const { t } = useTranslation("root");
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [empresa, setempresa] = useRecoilState(stateEmpresa);

   useEffect(() => {
      if ("serviceWorker" in navigator) {
         navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
         });
      }
   }, []);

   return (
      <SidebarProvider>
         <Sidebar />
         <BackToTop />
         <ChatUI />

         <main className="w-[100%] bg-secondary">
            <Header />

            {!(!usuario?.cod_usuario && !empresa?.cod_empresa) ? <Outlet /> : <a>Carregando...</a>}

            <div className="py-6 px-6 text-center">
               <p className="mb-0 fs-4">{t("footerText")}</p>
               {import.meta.env.MODE == "production" ? (
                  <p className="mb-0 fs-4">Version: {__APP_VERSION__}</p>
               ) : (
                  <p className="mb-0 fs-4">Version: {__APP_VERSION__} - DEV MODE</p>
               )}
            </div>
         </main>
      </SidebarProvider>
   );
}

export default Layout;
