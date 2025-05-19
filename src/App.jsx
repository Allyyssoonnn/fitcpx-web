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

import ErrorBoundaryWrapper from './base/errorBoundary';
import { useAppVersionChecker } from './hooks/useAppVersionChecker';

function App() {
    useAppVersionChecker();

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
                            <Route name='Inicio' path='*' element={<Layout />} />
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