import { setCookie } from 'nookies';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from "../api/api";

function Register() {
    const navigate = useNavigate();
    const { handleSubmit, register } = useForm();

    async function registrar(data) {
        const resp = await post('/usuario/register', data);

        if (resp.status) {
            toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
            setCookie(null, 'token', resp.token, { maxAge: 30000 });
            navigate('/');
        } else {
            toast.error(resp?.msg);
        }
    }

    return (
        <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
            data-sidebar-position="fixed" data-header-position="fixed">
        <div
          className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="row justify-content-center w-100">
              <div className="col-md-8 col-lg-6 col-xxl-3">
                <div className="card mb-0">
                  <div className="card-body">
                    <a href="./index.html" className="text-nowrap logo-img text-center d-block py-3 w-100">
                      {/* <img src="../assets/images/logos/logo-light.svg" alt="" /> */}
                      <h1>EducApp</h1>
                    </a>
                    <p className="text-center">Renove seu profissionalismo</p>
                    <form onSubmit={handleSubmit(registrar)}>
                      <div className="mb-3">
                        <label for="exampleInputtext1" className="form-label">Nome</label>
                        <input { ...register('nome_usuario') } type="text" className="form-control" id="exampleInputtext1" aria-describedby="textHelp" />
                      </div>
                      <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">E-mail</label>
                        <input { ...register('email_usuario') } type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                      </div>
                      <div className="mb-4">
                        <label for="exampleInputPassword1" className="form-label">Senha</label>
                        <input { ...register('senha_usuario') } type="password" className="form-control" id="exampleInputPassword1" />
                      </div>
                      <div className="mb-4">
                        <label for="exampleInputPassword1" className="form-label">Confirmar senha</label>
                        <input { ...register('senha_confirma') } type="password" className="form-control" id="exampleInputPassword1" />
                      </div>
                      <button type='submit' className="btn btn-primary w-100 py-8 fs-4 mb-4">Registrar</button>
                      <div className="d-flex align-items-center justify-content-center">
                        <p className="fs-4 mb-0 fw-bold">Já tem uma conta?</p>
                        <a className="text-primary fw-bold ms-2" href="/entrar">Entrar</a>
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

export default Register;