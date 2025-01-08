import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import EditableText from "../components/editableText";
import { setSessao, setTreino } from "../api/treino";

function CadTreino() {
    const { handleSubmit, register, setValue, getFieldState, getValues, watch, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);
    const [sessoes, setSessoes] = useState([]);

    useEffect(() => {
        const treinoRecebido = location.state?.treino;
        if (treinoRecebido) {
            Object.keys(treinoRecebido).forEach((key) => {
                setValue(key, treinoRecebido[key]);
            });
        }
        var sessaoKey = treinoRecebido?.sessoes?.map((sessao, index) => ({
            ...sessao,
            key: index + 1, // Adiciona a propriedade 'key' usando o 'cod_sessao'
        }))
        if (treinoRecebido?.sessoes) setSessoes(sessaoKey);
    }, [location, setValue, usuario]);

    async function confirma(data) {
        const cod_usuario = usuario.cod_usuario;
        const respTreino = await setTreino({ ...data, cod_usuario });
        if (respTreino.cod_treino) await setSessao(sessoes, respTreino.cod_treino, usuario.cod_usuario, usuario.cod_empresa);
        console.log(respTreino);
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate(-1); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_treino", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Frequência *</label>
                            <input {...register("frequencia_treino", { required: "Frequência de treino é obrigatório" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Nível *</label>
                            <select {...register('nivel_treino', { required: 'Nível de treino necessário!' })} className="form-control">
                                <option value=''>Selecione o nível do treino</option>
                                <option value='Iniciante'>Iniciante</option>
                                <option value='Intermediário'>Intermediário</option>
                                <option value='Avançado'>Avançado</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Sexo *</label>
                            <select {...register('sexo_treino', { required: 'O sexo é obrigatório' })} className="form-control">
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Observação</label>
                            <input {...register("observacao_treino")}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Sessões de treino</h5>

                    <div className="row g-3">
                        <TabSessoes sessoes={sessoes} setSessoes={setSessoes} />
                    </div>
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-success mt-3">
                        <i className="bi bi-check me-2"></i>
                        Confirmar
                    </button>
                </div>
            </div>
        </form>
    );
}

const TabSessoes = ({ sessoes, setSessoes }) => {
    const [activeTab, setActiveTab] = useState(1);

    const addSessao = () => {
        if (sessoes.length >= 7) return;
        const newKey = (sessoes.length + 1).toString();
        setSessoes([
            ...sessoes,
            { key: newKey, nome_sessao: `Treino ${String.fromCharCode(65 + sessoes.length)}`, exercicios: [] },
        ]);
        setActiveTab(newKey);
    };

    const removeSessao = (key) => {
        const index = sessoes.findIndex((w) => w.key === key);
        const workout = sessoes[index];
        if (window.confirm(`Tem certeza que deseja remover o ${workout.nome_sessao}?`)) {
            // const newWorkouts = sessoes.filter((workout) => workout.key !== key);
            const newWorkouts = [ ...sessoes ];
            newWorkouts[index].deleted = true;
            if (newWorkouts.length) {
                setActiveTab(newWorkouts[0].key);
            }
            setSessoes(newWorkouts);
        }
    };

    const updateNomeSessao = (key, newName) => {
        setSessoes((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout.key === key ? { ...workout, nome_sessao: newName } : workout
            )
        );
    };

    return (
        <div className="container mt-4">
            <ul className="nav nav-tabs">
                    {sessoes.map((workout) => {
                        if (workout.deleted) return;
                        return (
                            <li className="nav-item" key={workout.key}>
                            <button
                                className={`nav-link ${activeTab === workout.key ? "active" : ""}`}
                                onClick={() => setActiveTab(workout.key)}
                            >
                                {workout.nome_sessao}
                            </button>
                            </li>
                        );
                    })}

                <li className={`nav-item ${sessoes.length >= 7 ? 'd-none' : ''}`}>
                    <button className="nav-link ms-3" onClick={addSessao}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Adicionar Sessão
                    </button>
                </li>
            </ul>

            <div className="tab-content p-3 mt-3 bg-light rounded-3">
                <div className="d-flex justify-content-between align-items-center">
                    {sessoes.map((workout) =>
                        activeTab === workout.key && !workout.deleted ? (
                            <EditableText
                                key={workout.key}
                                text={workout.nome_sessao}
                                onUpdate={(newName) => updateNomeSessao(workout.key, newName)}
                            />
                        ) : null
                    )}

                    <div className="d-flex gap-1">
                        <button className="btn btn-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSessao(activeTab);
                            }}
                        >
                            <i className="bi bi-trash me-2"></i>
                            Remover
                        </button>
                    </div>
                </div>

                {sessoes.map((workout) =>
                    activeTab === workout.key ? (
                        <div key={workout.key}>
                            <ul>
                                {workout.exercicios?.map((exercise, index) => (
                                    <li key={index}>{exercise}</li>
                                ))}
                                {workout.exercicios?.length > 0 ? (
                                    workout.exercicios.map((exercise, index) => (
                                        <li key={index}>{exercise}</li>
                                    ))
                                ) : (
                                    <div className="text-center m-5">Nenhum exercício informado</div>
                                )}
                            </ul>

                            <button className="btn btn-outline-success w-100 rounded-2">
                                <i className="bi bi-plus-circle me-2"></i>
                                Adicionar exercício
                            </button>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default CadTreino;