import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './base/layout';
import Login from './pages/login';
import Register from './pages/register';
import { ToastContainer } from 'react-toastify';
import PlanilhaTreino from './pages/planilhaTreino';
import LoginAluno from './appAluno/loginApp';
import Recovery from './pages/recovery';

import 'react-toastify/dist/ReactToastify.css';

function App() {
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
                <Routes>
                    <Route name='Inicio' path='*' element={<Layout />} />
                    <Route path='/entrar' element={<Login />} />
                    <Route path='/registrar' element={<Register />} />
                    <Route path='/recuperar' element={<Recovery />} />
                    <Route path='/planilhatreino' element={<PlanilhaTreino />} />
                    
                    {/* APP ALUNO */}
                    <Route path='/app/login' element={<LoginAluno />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;