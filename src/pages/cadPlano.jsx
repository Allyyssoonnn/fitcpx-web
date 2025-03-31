import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CurrencyInput from "../components/currencyInput";
import { getModalidades, setPlano } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../states/states";
import { useEffect } from "react";
import { useQuery } from "react-query";

function CadPlano() {
    const { nSuccess } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: modalidades, refetch } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        const planoRecebido = location.state?.plano;
        if (planoRecebido) {
            Object.keys(planoRecebido).forEach((key) => {
                setValue(key, planoRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setPlano({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
        nSuccess();
        navigate('/planos');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/planos'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Informações</h5>

                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_plano", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col-md-2">
                            <label className="form-label fw-bold">Duração plano</label>
                            <input {...register("duracao_plano")}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo Duração plano</label>
                            <select {...register('tipo_duracao_plano')} className="form-control">
                                <option value='Meses'>Meses</option>
                                <option value='Semanas'>Semanas</option>
                                <option value='Dias'>Dias</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Fincanceiro</h5>

                    <div className="row g-3 mt-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Valor plano</label>
                            <CurrencyInput control={control} name='valor_plano' />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Valor adesão</label>
                            <CurrencyInput control={control} name='valor_adesao' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Modalidades</h5>

                </div>

                <div className="card-footer">
                    <button type='submit' className="btn btn-success">Confirmar</button>
                </div>
            </div>
        </form>
    )
}

export default CadPlano;