import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./base/layout";
import Login from "./modules/users/login";
import Recovery from "./modules/users/recovery";
import RecuperacaoSenha from "./modules/users/recuperacaoSenha";
import Register from "./modules/users/register";
import PlanilhaTreino from "./modules/workouts/planilhaTreino";
import Checkout from "./modules/checkout/checkout";

import { parseCookies } from "nookies";
import { Toaster } from "sonner";
import ErrorBoundaryWrapper from "./base/errorBoundary";
import PrivateRoute from "./routes/PrivateRoute";
import routes from "./routes/routes";
import { useStateApp } from "./states/states";

function App() {
   const cookies = parseCookies(null);
   const { theme } = useStateApp();

   return (
      <BrowserRouter>
         <Suspense
            fallback={
               <div className="pt-3 text-center">
                  <span className="sr-only">Loading...</span>
               </div>
            }
         >
            <Toaster position="top-center" theme={theme} richColors />
            <ErrorBoundaryWrapper>
               <Routes>
                  <Route
                     name="Inicio"
                     path="/"
                     element={
                        <PrivateRoute isAuthenticated={!!cookies.refreshToken}>
                           <Layout />
                        </PrivateRoute>
                     }
                  >
                     <>
                        {routes.map((route, idx) => {
                           return (
                              route.element && (
                                 <Route key={idx} path={route.path} exact={route.exact} element={<route.element />} />
                              )
                           );
                        })}
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                     </>
                  </Route>

                  <Route path="/entrar" element={<Login />} />
                  <Route path="/registrar" element={<Register />} />
                  <Route path="/recuperar" element={<Recovery />} />
                  <Route path="/recoveryPassword" element={<RecuperacaoSenha />} />
                  <Route path="/planilhatreino" element={<PlanilhaTreino />} />
                  <Route path="/checkout" element={<Checkout />} />
               </Routes>
            </ErrorBoundaryWrapper>
         </Suspense>
      </BrowserRouter>
   );
}

export default App;
