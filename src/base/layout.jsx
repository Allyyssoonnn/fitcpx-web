/* eslint-disable no-undef */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import BackToTop from "../components/backToTop";
import ChatUI from "../components/fitUI/chat.ui";
import { Label } from "../components/ui/label";
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

            <Outlet />

            <div className="py-6 px-6 text-center">
               <div className="flex justify-center py-3">
                  <Label className="text-center text-muted">
                     Ao utilizar o <span className="text-primary font-medium">FitCpx</span> você concorda com os{" "}
                     <a
                        href="https://fitcpx.com/terms-conditions-br"
                        className="text-primary inline-flex items-center gap-1 cursor-pointer hover:underline"
                     >
                        Termos de uso
                     </a>
                     .
                  </Label>
               </div>
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
