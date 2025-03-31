import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateAdmin, stateUsuario, useNotificacao } from "../states/states";
import { getArticulacoes, getEquipamentos, getExerciciosResistencias, getGrupoExercicios, getIndicacoes, getPadraoesMovimentos, getTipoExercicios, setExercicio, setGrupoExercicio } from "../api/treino";
import { useQuery } from "react-query";
import { getYouTubeEmbedUrl } from "../utils";

function CadExercicio() {
    const { nSuccess } = useNotificacao();
    const { handleSubmit, register, setValue, watch, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);
    const [admin] = useRecoilState(stateAdmin);

    const urlValue = watch("url_exercicio");

    const { data: grupos, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_empresa],
        queryFn: () => getGrupoExercicios(usuario.cod_empresa),
        initialData: [],
    });

    const { data: equipamentos } = useQuery({
        queryKey: ['equipamentos', usuario.cod_empresa],
        queryFn: () => getEquipamentos(usuario.cod_empresa),
        initialData: [],
    });

    const { data: articulacoes } = useQuery({
        queryKey: ['articulacoes', usuario.cod_empresa],
        queryFn: () => getArticulacoes(usuario.cod_empresa),
        initialData: [],
    });

    const { data: tipo_exercicios } = useQuery({
        queryKey: ['tipo_exercicios', usuario.cod_empresa],
        queryFn: () => getTipoExercicios(usuario.cod_empresa),
        initialData: [],
    });
    
    const { data: exercicios_resistencias } = useQuery({
        queryKey: ['exercicios_resistencias', usuario.cod_empresa],
        queryFn: () => getExerciciosResistencias(usuario.cod_empresa),
        initialData: [],
    });

    const { data: indicacoes } = useQuery({
        queryKey: ['indicacoes', usuario.cod_empresa],
        queryFn: () => getIndicacoes(usuario.cod_empresa),
        initialData: [],
    });

    const { data: padraoes_movimentos } = useQuery({
        queryKey: ['padraoes_movimentos', usuario.cod_empresa],
        queryFn: () => getPadraoesMovimentos(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        const exercicioRecebido = location.state?.exercicio;
        if (exercicioRecebido) {
            Object.keys(exercicioRecebido).forEach((key) => {
                setValue(key, exercicioRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        const cleanedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
        );
        await setExercicio({ ...cleanedData, cod_usuario: usuario?.cod_usuario, cod_empresa: usuario?.cod_empresa, base_exercicio: admin?.cod_admin ? 'S' : 'N' });
        nSuccess();
        navigate('/exercicios');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="row g-3">
                <div className="card col-md-6">
                    <div className="card-header">
                        <button onClick={e => { e.stopPropagation(); navigate('/exercicios'); }} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-backspace me-2"></i>
                            Voltar
                        </button>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Exercício</h5>

                        <div className="col-md-9">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_exercicio", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold mt-3">URL</label>
                            <input {...register("url_exercicio")}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center col-md-6">
                    <iframe
                        width="100%"
                        height="300"
                        src={getYouTubeEmbedUrl(urlValue)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo exercício</label>
                            <select {...register('cod_tipo_exercicio')} className="form-control">
                                <option value=''>Selecione o tipo de exercício</option>
                                {tipo_exercicios.map((te, i) => (
                                    <option value={te.cod_tipo_exercicio} key={i}>{te.nome_tipo_exercicio}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Exercício resistência</label>
                            <select {...register('cod_exercicio_resistencia')} className="form-control">
                                <option value=''>Selecione a resistência do exercício</option>
                                {exercicios_resistencias.map((er, i) => (
                                    <option value={er.cod_exercicio_resistencia} key={i}>{er.nome_exercicio_resistencia}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Indicação</label>
                            <select {...register('cod_indicacao')} className="form-control">
                                <option value=''>Selecione a indicação do exercício</option>
                                {indicacoes.map((id, i) => (
                                    <option value={id.cod_indicacao} key={i}>{id.nome_indicacao}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Padrão movimento</label>
                            <select {...register('cod_indicacao')} className="form-control">
                                <option value=''>Selecione o padrão de movimento</option>
                                {padraoes_movimentos.map((pm, i) => (
                                    <option value={pm.cod_padrao_movimento} key={i}>{pm.nome_padrao_movimento}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="accordion">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                            Grupos principais
                        </button>
                    </h2>

                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                        <div className="accordion-body row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 1</label>
                                <select {...register('cod_grupo_exercicio_1')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 2</label>
                                <select {...register('cod_grupo_exercicio_2')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 3</label>
                                <select {...register('cod_grupo_exercicio_3')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 4</label>
                                <select {...register('cod_grupo_exercicio_4')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            Grupos secundários
                        </button>
                    </h2>

                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 1</label>
                                <select {...register('cod_grupo_exercicio_5')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 2</label>
                                <select {...register('cod_grupo_exercicio_6')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 3</label>
                                <select {...register('cod_grupo_exercicio_7')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Grupo 4</label>
                                <select {...register('cod_grupo_exercicio_8')} className="form-control">
                                    <option value=''>Selecione o grupo de exercício</option>
                                    {grupos.map((gp, i) => (
                                        <option value={gp.cod_grupo_exercicio} key={i}>{gp.nome_grupo_exercicio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                            Equipamentos
                        </button>
                    </h2>

                    <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                        <div className="accordion-body row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Equipamento 1</label>
                                <select {...register('cod_equipamento_1')} className="form-control">
                                    <option value=''>Selecione o equipamento</option>
                                    {equipamentos.map((eq, i) => (
                                        <option value={eq.cod_equipamento} key={i}>{eq.nome_equipamento}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Equipamento 2</label>
                                <select {...register('cod_equipamento_2')} className="form-control">
                                    <option value=''>Selecione o equipamento</option>
                                    {equipamentos.map((eq, i) => (
                                        <option value={eq.cod_equipamento} key={i}>{eq.nome_equipamento}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Equipamento 3</label>
                                <select {...register('cod_equipamento_3')} className="form-control">
                                    <option value=''>Selecione o equipamento</option>
                                    {equipamentos.map((eq, i) => (
                                        <option value={eq.cod_equipamento} key={i}>{eq.nome_equipamento}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                            Articulações
                        </button>
                    </h2>

                    <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse">
                        <div className="accordion-body row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Articulação 1</label>
                                <select {...register('cod_articulacao_1')} className="form-control">
                                    <option value=''>Selecione a articulação</option>
                                    {articulacoes.map((at, i) => (
                                        <option value={at.cod_articulacao} key={i}>{at.nome_articulacao}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Articulação 2</label>
                                <select {...register('cod_articulacao_2')} className="form-control">
                                    <option value=''>Selecione a articulação</option>
                                    {articulacoes.map((at, i) => (
                                        <option value={at.cod_articulacao} key={i}>{at.nome_articulacao}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Articulação 3</label>
                                <select {...register('cod_articulacao_3')} className="form-control">
                                    <option value=''>Selecione a articulação</option>
                                    {articulacoes.map((at, i) => (
                                        <option value={at.cod_articulacao} key={i}>{at.nome_articulacao}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Articulação 4</label>
                                <select {...register('cod_articulacao_4')} className="form-control">
                                    <option value=''>Selecione a articulação</option>
                                    {articulacoes.map((at, i) => (
                                        <option value={at.cod_articulacao} key={i}>{at.nome_articulacao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
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

export default CadExercicio;