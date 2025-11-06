/* eslint-disable no-undef */
import axios from "axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { baseURL } from "../api/api";
import BackToTop from "../components/backToTop";
import ChatUI from "../components/fitUI/chat.ui";
import { SidebarProvider } from "../components/ui/sidebar";
import { stateEmpresa, stateUsuario } from "../states/states";
import Header from "./header";
import Sidebar from "./sidebar";

function Layout() {
   const { t } = useTranslation("root");
   const navigate = useNavigate();
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [empresa, setempresa] = useRecoilState(stateEmpresa);

   useEffect(() => {
      if ("serviceWorker" in navigator) {
         navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
         });
      }
   }, []);

   useEffect(() => {
      //Function to update info data
      (async function load() {
         if (!usuario?.cod_usuario || !empresa?.cod_empresa) {
            try {
               const cookies = parseCookies();

               console.log("[Layout] - Verify refreshToken");

               const refreshResponse = await axios.post(baseURL + `/users/refreshToken`, {
                  refreshToken: cookies.refreshToken,
               });

               if (refreshResponse.data.token) {
                  setCookie(null, "token", refreshResponse.data.token, { maxAge: 60 * 15 });
                  setCookie(null, "refreshToken", refreshResponse.data.refreshToken, { maxAge: 60 * 15 });
                  setCookie(null, "licenseStatus", refreshResponse.data.license.status, { maxAge: 60 * 15 });
                  setCookie(null, "licenseTrialDaysLeft", refreshResponse.data.license.trialDaysLeft, {
                     maxAge: 60 * 15,
                  });
                  setusuario(refreshResponse.data.usuario);
                  setempresa(refreshResponse.data.empresa);
                  console.log("[Layout] - Success Verify refreshToken");
               } else {
                  console.log("[Layout] - Failed Verify refreshToken");
                  navigate("/entrar");
               }
            } catch (error) {
               console.log("[Layout] - Error Verify refreshToken", error);
               destroyCookie("token");
               destroyCookie("refreshToken");
               setusuario({});
               setempresa({});
               navigate("/entrar");
            }
         }
      })();
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
                  <p className="mb-0 fs-4">Version: DEV MODE</p>
               )}
            </div>
         </main>
      </SidebarProvider>
   );
}

export default Layout;
