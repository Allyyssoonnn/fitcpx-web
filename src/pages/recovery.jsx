import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { recovery } from "../api/usuario";
import { toast } from "react-toastify";

function Recovery() {
    const { handleSubmit, register } = useForm();
    const navigate = useNavigate();

    async function recoveryPassword(data) {
        const resp = await recovery(data.email);
        
        if (resp.status) {
            navigate('/entrar');
            toast.success('E-mail enviado!');
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

                                    <form onSubmit={handleSubmit(recoveryPassword)}>
                                        <div className="mb-3">
                                            <label className="form-label">E-mail</label>
                                            <input { ...register('email') } type="email" className="form-control" aria-describedby="emailHelp" />
                                        </div>

                                        {/* <div className="mb-4">
                                            <label className="form-label">Senha</label>
                                            <input { ...register('senha') } type="password" className="form-control" />
                                        </div> */}

                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            {/* <div className="form-check">
                                                <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" checked />
                                                <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                                                    Lembrar de mim
                                                </label>
                                            </div> */}

                                            {/* <a className="text-primary fw-bold" href="#">Entrar</a> */}
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4">Recuperar</button>

                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Lembrou?</p>
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
    )
}

export default Recovery;