import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { stateUsuario, useNotificacao } from "../states/states";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { setUsuario } from "../api/usuario";
import FitInputForm from "../components/baseComponents/FitInputForm";
import FitStateForm from "../components/baseComponents/FitStateForm";

function CadUsuario() {
    const { nSuccess } = useNotificacao();
    const { handleSubmit, register, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const usuarioRecebido = location.state?.usuario;
        if (usuarioRecebido) {
            Object.keys(usuarioRecebido).forEach((key) => {
                setValue(key, usuarioRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    let cepAtual = '';

    useEffect(() => {
        watch((value) => {
            const { cep_usuario } = value;

            if (cep_usuario?.length === 8) {
                if (cepAtual === cep_usuario) return;
                cepAtual = cep_usuario;
                fetch(`https://viacep.com.br/ws/${cep_usuario}/json/`)
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error('Erro ao buscar informações do CEP.');
                    }
                    return resp.json(); // Extrai o corpo da resposta em formato JSON
                })
                .then((data) => {
                    if (data.logradouro) setValue('endereco_usuario', data.logradouro);
                    if (data.uf) setValue('estado_usuario', data.uf);
                    if (data.localidade) setValue('cidade_usuario', data.localidade);
                    if (data.bairro) setValue('bairro_usuario', data.bairro);
                    if (data.complemento) setValue('complemento_usuario', data.complemento);
                    if (data.cep) setValue('cep_usuario', data.cep);
                })
                .catch((error) => {
                    console.error('Erro:', error.message);
                });
            }
        })
        
    }, [watch]);

    async function confirma(data) {
        await setUsuario({ ...data, cod_empresa: usuario.cod_empresa });
        nSuccess();
        navigate('/usuarios');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/usuarios'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Usuário</h5>

                    <div className="row g-3">
                        <FitInputForm
                            nameField="Nome *"
                            classNameContainer="col-md-3"
                            {...register("nome_usuario", { required: true })}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Telefone"
                            classNameContainer="col-md-3"
                            {...register("telefone_usuario")}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Celular"
                            classNameContainer="col-md-3"
                            {...register("celular_usuario")}
                            errors={errors}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Acesso ao sistema</h5>

                    <div className="row g-3">
                        <FitInputForm
                            nameField="E-mail *"
                            classNameContainer="col-md-3"
                            {...register("email_usuario", { required: true })}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Senha *"
                            classNameContainer="col-md-3"
                            {...register("senha_usuario", { required: true })}
                            errors={errors}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Endereço</h5>

                    <div className="row g-3">
                        <FitInputForm
                            nameField="CEP"
                            classNameContainer="col-md-3"
                            {...register("cep_usuario")}
                            errors={errors}
                        />

                        <FitStateForm
                            nameField="Estado"
                            classNameContainer="col-md-3"
                            {...register("estado_usuario")}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField='Cidade'
                            classNameContainer='col-md-3'
                            errors={errors}
                            { ...register('cidade_usuario') }
                        />
                        
                        <FitInputForm
                            nameField="Endereço"
                            classNameContainer="col-md-3"
                            {...register("endereco_usuario")}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Número"
                            classNameContainer="col-md-3"
                            {...register("numero_usuario")}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Bairro"
                            classNameContainer="col-md-3"
                            {...register("bairro_usuario")}
                            errors={errors}
                        />

                        <FitInputForm
                            nameField="Complemento"
                            classNameContainer="col-md-3"
                            {...register("complemento_usuario")}
                            errors={errors}
                        />
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

export default CadUsuario;