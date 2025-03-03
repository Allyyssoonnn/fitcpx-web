import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getModalidades, setModalidade, setPlano } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useEffect } from "react";

function CadModalidade() {
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const modalidadeRecebido = location.state?.modalidade;
        if (modalidadeRecebido) {
            Object.keys(modalidadeRecebido).forEach((key) => {
                setValue(key, modalidadeRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setModalidade({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
        navigate('/modalidades');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/modalidades'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Informações</h5>

                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_modalidade", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button type='submit' className="btn btn-success">Confirmar</button>
                </div>
            </div>
        </form>
    )
}

export default CadModalidade;