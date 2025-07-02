import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { recovery } from "../../api/usuario";
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
                                    
                                    <p className="text-center">Recuperação de senha</p>

                                    <form onSubmit={handleSubmit(recoveryPassword)}>
                                        <div className="mb-3">
                                            <label className="form-label">E-mail</label>
                                            <input { ...register('email') } type="email" className="form-control" aria-describedby="emailHelp" />
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4">Enviar link de recuperação</button>

                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Lembrou a senha?</p>
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