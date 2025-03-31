import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { stateUsuario, useNotificacao } from "../states/states";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { setUsuario } from "../api/usuario";

function CadUsuario() {
    const { nSuccess } = useNotificacao();
    const { handleSubmit, register, setValue, watch, formState: { isSubmitting } } = useForm();
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
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_usuario", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Telefone</label>
                            <input {...register("telefone_usuario")}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Celular</label>
                            <input {...register("celular_usuario")}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Acesso ao sistema</h5>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">E-mail *</label>
                            <input {...register("email_usuario", { required: "O e-mail é obrigatório" })}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Senha *</label>
                            <input {...register("senha_usuario", { required: "O e-mail é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Endereço</h5>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">CEP</label>
                            <input { ...register('cep_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Estado</label>
                            <input { ...register('estado_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Cidade</label>
                            <input { ...register('cidade_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Endereço</label>
                            <input { ...register('endereco_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Número</label>
                            <input { ...register('numero_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Bairro</label>
                            <input { ...register('bairro_usuario') } type="text" className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Complemento</label>
                            <input { ...register('complemento_usuario') } type="text" className="form-control" />
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

export default CadUsuario;