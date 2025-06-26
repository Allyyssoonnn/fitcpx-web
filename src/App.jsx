import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from './base/layout';
import Login from './pages/Auth/login';
import Register from './pages/Auth/register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlanilhaTreino from './pages/Infos/planilhaTreino';
import Recovery from './pages/Auth/recovery';
import RecuperacaoSenha from './pages/Auth/recuperacaoSenha';

import ErrorBoundaryWrapper from './base/errorBoundary';
import { parseCookies } from 'nookies';
import routes from './routes/routes';
import PrivateRoute from './routes/PrivateRoute';

function App() {
    const cookies = parseCookies(null);

    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <span className="sr-only">Loading...</span>
                    </div>
                }
            >
                <ToastContainer theme="colored" />
                    <ErrorBoundaryWrapper>
                        <Routes>
                            <Route name='Inicio' path='/'
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
                                                <Route
                                                    key={idx}
                                                    path={route.path}
                                                    exact={route.exact}
                                                    name={route.name}
                                                    element={<route.element />}
                                                />
                                            )
                                        )
                                    })}
                                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                                </>
                            </Route>
                            
                            <Route path='/entrar' element={<Login />} />
                            <Route path='/registrar' element={<Register />} />
                            <Route path='/recuperar' element={<Recovery />} />
                            <Route path='/recoveryPassword' element={<RecuperacaoSenha />} />
                            <Route path='/planilhatreino' element={<PlanilhaTreino />} />
                        </Routes>
                    </ErrorBoundaryWrapper>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;