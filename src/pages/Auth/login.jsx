import { useForm } from "react-hook-form";
import { post } from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { parseCookies, setCookie } from "nookies";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from '../../states/states';
import { loggedGoogle, loginGoogle, getGoogleConnect } from "../../api/usuario";

function Login() {
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    useEffect(() => {
        (async function conect() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const scope = params.get("scope");
        
            if (code) {
                const resp = await loggedGoogle(code, scope, usuario?.cod_empresa);

                if (resp.status) {
                    toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
                    setCookie(null, 'token', resp.token, { maxAge: 60 * 60 * 7 });
                    setCookie(null, 'refreshToken', resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
                    setusuario(resp.usuario);
                    setempresa(resp.empresa);
                    window.location.href = '/';
                } else {
                    toast.error(resp?.msg);
                }
                // const resp2 = await getGoogleConnect(usuario?.cod_empresa);
                // setusuario(prev => ({ ...prev, google: resp2 }));
            }
        })();
    }, []);

    async function conect(e) {
        e.preventDefault();
        const url = await loginGoogle();
        if (url) window.location.href = url;
    }

    async function login(data) {
        const resp = await post('/usuario/login', data);
        if (resp.status) {
            toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
            setCookie(null, 'token', resp.token, { maxAge: 60 * 60 * 7 });
            setCookie(null, 'refreshToken', resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
            setusuario(resp.usuario);
            setempresa(resp.empresa);
            window.location.href = '/';
        } else {
            toast.error(resp?.msg);
        }
    }

    return (
        <div className="page-wrapper p-0" id="main-wrapper" style={{ marginLeft: '0' }}>
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="text-nowrap logo-img d-flex py-2 d-flex justify-content-center align-items-center">
                                        <img src="../assets/images/logos/logo.png" width='60' alt="" />
                                        <h1 className="mb-0 ms-3">Fit Cpx</h1>
                                    </div>
                                    
                                    <p className="text-center">Seja Bem-vindo</p>

                                    <form onSubmit={handleSubmit(login)}>
                                        <div className="mb-3">
                                            <label className="form-label">E-mail</label>
                                            <input id="email" { ...register('email') } type="email" className="form-control" aria-describedby="emailHelp" />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Senha</label>
                                            <input id="password" { ...register('senha') } type="password" className="form-control" />
                                        </div>

                                        <div className="d-flex align-items-center justify-content-center mb-4">
                                            <a className="text-primary fw-bold" href="/recuperar">Esqueceu a senha?</a>
                                        </div>

                                        <button id="sign-in" type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4">Entrar</button>

                                        <button onClick={conect} className="btn text-dark border fw-normal d-flex align-items-center justify-content-center py-8 mb-3 w-100" role="button">
                                            <img src="../assets/images/svgs/google-icon.svg" className="img-fluid me-2" width="18" height="18" />
                                            <span className="flex-shrink-0">Conectar conta Google</span>
                                        </button>

                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Não tem conta?</p>
                                            <a id="register" className="text-primary fw-bold ms-2" href="/registrar">Criar conta</a>
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