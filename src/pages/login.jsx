import { useForm } from "react-hook-form";
import { post } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { parseCookies, setCookie } from "nookies";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/states';

function Login() {
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();
    const [usuario, setusuario] = useRecoilState(stateUsuario);

    useEffect(() => {
        const cookies = parseCookies(null);
        if (cookies.token) {
            toast.success('Bem vindo de volta!');
            navigate('/');
        } else {
            setusuario({});
        }
    }, []);

    async function login(data) {
        const resp = await post('/usuario/login', data);
        if (resp.status) {
            toast.success(`Bem vindo ${resp.nome_usuario}!`);
            setCookie(null, 'token', resp.token, { maxAge: 60 * 60 * 7 });
            setCookie(null, 'refreshToken', resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
            console.log(resp);
            setusuario({ ...resp });
            navigate('/');
        } else {
            toast.error(resp?.msg);
        }
    }

    return (
        <div className="page-wrapper" id="main-wrapper">
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <a href="/entrar" className="text-nowrap logo-img d-flex py-2 d-flex justify-content-center">
                                        <img src="../assets/images/logos/logo_horizontal.png" width='220' alt="" />
                                        {/* <h1 style={{ borderLeft: '0.30rem solid #85D446' }}>S-FitApp</h1> */}
                                    </a>
                                    
                                    <p className="text-center">Renove seu profissionalismo</p>

                                    <form onSubmit={handleSubmit(login)}>
                                        <div className="mb-3">
                                            <label className="form-label">E-mail</label>
                                            <input { ...register('email') } type="email" className="form-control" aria-describedby="emailHelp" />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Senha</label>
                                            <input { ...register('senha') } type="password" className="form-control" />
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" checked />
                                                <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                                                    Lembrar de mim
                                                </label>
                                            </div>

                                            <a className="text-primary fw-bold" href="./index.html">Esqueceu a senha?</a>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4">Entrar</button>

                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Não tem conta?</p>
                                            <a className="text-primary fw-bold ms-2" href="/registrar">Criar conta</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;