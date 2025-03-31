import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './base/layout';
import Login from './pages/login';
import Register from './pages/register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlanilhaTreino from './pages/planilhaTreino';
import Recovery from './pages/recovery';
import RecuperacaoSenha from './pages/recuperacaoSenha';

import LayoutAluno from './app-aluno/base/layout';
import LayoutAdmin from './app-admin/base/layout';
import LoginAluno from './app-aluno/pages/loginAluno';
import LoginAdmin from './app-admin/pages/loginAdmin';
import ErrorBoundaryWrapper from './base/errorBoundary';

function App() {
    const buildType = import.meta.env.VITE_BUILD_TYPE;
    
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
                        {buildType === "aluno" && (
                            <Routes>
                                <Route name='Inicio' path='*' element={<LayoutAluno />} />
                                <Route path='/entrar' element={<LoginAluno />} />
                            </Routes>
                        )}
                        {buildType === 'usuario' && (
                            (
                                <Routes>
                                    <Route name='Inicio' path='*' element={<Layout />} />
                                    <Route path='/entrar' element={<Login />} />
                                    <Route path='/registrar' element={<Register />} />
                                    <Route path='/recuperar' element={<Recovery />} />
                                    <Route path='/recoveryPassword' element={<RecuperacaoSenha />} />
                                    <Route path='/planilhatreino' element={<PlanilhaTreino />} />
                                </Routes>
                            )
                        )}
                        {buildType === 'admin' && (
                            (
                                <Routes>
                                    <Route name='Inicio' path='*' element={<LayoutAdmin />} />
                                    <Route path='/entrar' element={<LoginAdmin />} />
                                </Routes>
                            )
                        )}
                    </ErrorBoundaryWrapper>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;