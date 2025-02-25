import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { setGrupoAlimento } from "../api/cardapio";

function CadGrupoAlimento() {
    const { handleSubmit, register, setValue, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    useEffect(() => {
        const grupoRecebido = location.state?.grupo;
        if (grupoRecebido) {
            Object.keys(grupoRecebido).forEach((key) => {
                setValue(key, grupoRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setGrupoAlimento({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
        navigate('/grupoalimentos');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/grupoalimentos'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Grupo de alimento</h5>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_grupo_alimento", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
                        <i className="bi bi-check me-2"></i>
                        Confirmar
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CadGrupoAlimento;