import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import EditableText from "../components/editableText";
import { getExercicios, setSessao, setTreino } from "../api/treino";
import { useQuery } from "react-query";
import { Modal } from "react-bootstrap";
import FiltroExercicio from "../components/filtroExercicio";
import AutoComplete from "../components/autoComplete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function CadTreino() {
    const { handleSubmit, register, setValue, getFieldState, getValues, watch, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);
    const [sessoes, setSessoes] = useState([]);
    const [removidos, setRemovidos] = useState([]);

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

    function getRepeticao() {
        const { desenvolvimento_treino } = getValues();
        const base = {
            'Força': 6,
            'Hipertrofia': 12,
            'Resistência': 20,
        }
        if (!desenvolvimento_treino) return 12;
        return base[desenvolvimento_treino];
    }

    async function confirma(data) {
        const cod_usuario = usuario.cod_usuario;
        const respTreino = await setTreino({ ...data, cod_usuario });
        if (respTreino.cod_treino) await setSessao(sessoes, respTreino.cod_treino, usuario.cod_usuario, usuario.cod_empresa, removidos);
        navigate(-1);
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.preventDefault(); navigate(-1); }} className="btn btn-danger mb-3 me-3">
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

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Desenvolvimento *</label>
                            <select {...register('desenvolvimento_treino', { required: 'O desenvolvimento é obrigatório' })} className="form-control">
                                <option value="">Selecione o desenvolvimento</option>
                                <option value="Força">Força</option>
                                <option value="Hipertrofia">Hipertrofia</option>
                                <option value="Resistência">Resistência</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ height: '90vh' }}>
                <h5 className="card-title fw-semibold m-3">Prescrição</h5>

                <div className="card-body p-1">
                    <TabPrescricao
                        sessoes={sessoes}
                        setSessoes={setSessoes}
                        getRepeticao={getRepeticao}
                        setRemovidos={setRemovidos}
                    />
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

function TabPrescricao({ sessoes, setSessoes, getRepeticao, setRemovidos }) {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
    const [waitExercicio, setWaitExercicio] = useState();

    const { data: exercicios, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario),
        initialData: [],
    });
    
    const addSessao = () => {
        if (sessoes.length >= 15) return;
        const newKey = (sessoes.length + 1).toString();
        setSessoes([
            ...sessoes,
            { key: newKey, nome_sessao: `Treino ${String.fromCharCode(65 + sessoes.length)}`, exercicios: [] },
        ]);
    };

    const removeSessao = (index) => {
        const workout = sessoes[index];
        if (window.confirm(`Tem certeza que deseja remover o ${workout.nome_sessao}?`)) {
            setRemovidos(prev => [...prev, workout]);
            const newWorkouts = sessoes.filter((sessao, idx) => index !== idx);
            // const newWorkouts = [ ...sessoes ];
            // newWorkouts[index].deleted = true;
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

    const filteredExercicios = useMemo(() => {
        return exerciciosFiltrados.filter((treino) =>
            treino.nome_exercicio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [exerciciosFiltrados, searchTerm]);

    function updateSessao(exercicios, index) {
        setSessoes(prevArray => prevArray.map((sessao, i) => i == index ? { ...sessao, exercicios: exercicios } : sessao))
    }

    function addExercicio(exercicio) {
        //Adiciona exercicio vinculado a outro exercicio, Bi-set, tri-set, Super-set
        if (!waitExercicio?.key) {
            setSessoes(prevArray =>
                prevArray.map((sessao, index) =>
                    index == waitExercicio?.indexSessao
                        ? { ...sessao, exercicios: sessao.exercicios.map((exc, idx) =>
                            idx == waitExercicio.index
                                ? { ...exc,
                                    sets: [
                                        ...exc.sets,
                                        {
                                            ...exercicio,
                                            sequencia_sessao_exercicio: exc.sequencia_sessao_exercicio,
                                            serie_sessao_exercicio: 3,
                                            repeticao_sessao_exercicio: getRepeticao(),
                                            intervalo_sessao_exercicio: 60,
                                        }
                                    ]
                                }
                                : exc
                        ) }
                        : sessao
                )
            );
            return;
        }
        //Adicionar exercicio a uma sessão
        setSessoes(prevArray =>
            prevArray.map(item =>
                item.key == waitExercicio.key
                    ? { ...item, exercicios: [...item.exercicios, {
                        ...exercicio,
                        sequencia_sessao_exercicio: sessoes[waitExercicio?.index]?.exercicios?.length + 1,
                        sets: [],
                        serie_sessao_exercicio:  3,
                        repeticao_sessao_exercicio: getRepeticao(),
                        intervalo_sessao_exercicio: 60,
                    }] }
                    : item
            )
        );
    }
       
    return (            
        <div className={`d-flex gap-2 ${window.screen.width > 1000 ? '' : 'flex-wrap'}`}>
            <div className={`card ${window.screen.width > 1000 ? 'w-40' : 'w-100'}`}>
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title mb-3">Exercícios</h4>

                    <div className={`border border-info rounded-3 p-2 ${waitExercicio?.index >= 0 ? '' : 'd-none'}`}>
                        <label className="fs-2 me-1">{waitExercicio?.nome_sessao} (Aguardando seleção)</label>
                        <button onClick={e => { e.preventDefault(); setWaitExercicio({}); }} className="btn btn-sm btn-danger">
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquisar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiltroExercicio exercicios={exercicios} setExerciciosFiltrados={setExerciciosFiltrados} />

                <table className="card-body d-flex flex-column p-1" style={{ overflow: 'auto', height: '50vh' }}>
                    {filteredExercicios.map((exc, index) => (
                        <tr key={index}
                            onClick={e => { e.preventDefault(); addExercicio(exc); }}
                            className={`d-flex justify-content-between ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
                        >
                            <button className="btn text-start w-100 m-1 btn-hover">{exc.nome_exercicio}</button>
                        </tr>
                    ))}
                </table>
            </div>

            <div className={`card ${window.screen.width > 1000 ? 'w-60' : 'w-100'}`}>
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title mb-3">Sessões</h4>
                    <label>{sessoes.length}/15</label>
                </div>

                <button className={`btn btn-outline-info rounded-3 mt-3 mb-3 ${sessoes.length >= 15 ? 'd-none' : ''}`} onClick={addSessao}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Sessão
                </button>

                <div className="card-body d-flex flex-column p-1" style={{ overflow: 'auto', height: '50vh', overflowX: 'hidden' }}>
                    {sessoes.map((sessao, index) => (
                        <div key={index} className="accordion rounded-1 mb-1" style={{ border: '0.15rem solid #85D446' }}>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${index}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse${index}`}>
                                        {sessao.nome_sessao}
                                    </button>
                                </h2>

                                <div id={`panelsStayOpen-collapse${index}`} className="accordion-collapse collapse">
                                    <div className="accordion-body row g-3">
                                        <div className="d-flex align-items-center justify-content-between border-1 border-bottom border-dark">
                                            <EditableText
                                                key={sessao.key}
                                                text={sessao.nome_sessao}
                                                onUpdate={(newName) => updateNomeSessao(sessao.key, newName)}
                                            />

                                            <button className="btn btn-danger btn-sm"
                                                onClick={(e) => { e.preventDefault(); removeSessao(index); }}
                                            >
                                                <i className="bi bi-trash me-2"></i>
                                                Remover
                                            </button>
                                        </div>

                                        <div className="d-flex flex-column">
                                            <ListaExercicios
                                                exercicios={sessao?.exercicios}
                                                indexSessao={index}
                                                updateSessao={updateSessao}
                                                setWaitExercicio={setWaitExercicio}
                                                waitExercicio={waitExercicio}
                                            />

                                            <button onClick={e => { e.preventDefault(); setWaitExercicio({ ...sessao, index }); }} className='btn btn-sm btn-outline-info rounded-3 mt-3 mb-3'>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Adicionar Exercício
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ListaExercicios({ exercicios, indexSessao, updateSessao, setWaitExercicio, waitExercicio }) {

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, sai da função
        if (!destination) return;

        // Rearranjar a lista
        const reorderedExercicios = Array.from(exercicios);
        const [removed] = reorderedExercicios.splice(source.index, 1);
        reorderedExercicios.splice(destination.index, 0, removed);

        // Atualizar o campo `sequencia_sessao_exercicio` de acordo com a nova ordem
        const updatedExercicios = reorderedExercicios.map((item, index) => ({
            ...item,
            sequencia_sessao_exercicio: index + 1,
            sets: item.sets.map((set) => ({ ...set, sequencia_sessao_exercicio: index + 1 }))
        }));

        updateSessao(updatedExercicios, indexSessao);
    };

    const updateField = (idx, campo, valor, indexSet) => {
        const excs = Array.from(exercicios);
        var updatedExercicios;

        if (indexSet >= 0) {
            //Atualiza set dentro do exercicio
            updatedExercicios = excs.map((item, index) => 
                index == idx
                    ? { ...item, sets: item.sets.map((set, id) => indexSet == id ? { ...set, [campo]: valor } : { ...set }) }
                    : { ...item }
            );
            console.log(updatedExercicios);            
        } else {
            //Atualiza exercicio
            updatedExercicios = excs.map((item, id) => idx == id ? { ...item, [campo]: valor } : { ...item });
        }

        updateSessao(updatedExercicios, indexSessao);
    }

    const remove = (index) => {
        // Remove o item pelo índice
        const reorderedExercicios = Array.from(exercicios);
        reorderedExercicios.splice(index, 1);

        // Reordena o campo `sequencia_sessao_exercicio` após a remoção
        const updatedExercicios = reorderedExercicios.map((item, idx) => ({
            ...item,
            sequencia_sessao_exercicio: idx + 1,
        }));

        updateSessao(updatedExercicios, indexSessao);
    }

    const removeSet = (indexExercicio, indexSet) => {
        // Remove o item pelo índice
        const reorderedExercicios = Array.from(exercicios);
        const reorderedSets = Array.from(exercicios[indexExercicio].sets);
        reorderedSets.splice(indexSet, 1);

        const updatedSets = reorderedSets.map((item, idx) => ({
            ...item,
            sequencia_sessao_exercicio: idx + 1,
        }));

        reorderedExercicios[indexExercicio].sets = updatedSets;

        updateSessao(reorderedExercicios, indexSessao);
    }

    const addSet = (exercicio) => {
        setWaitExercicio({ ...exercicio, indexSessao });
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercicioList">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {exercicios.map((exercicio, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    // {...provided.dragHandleProps}
                                    className="d-flex flex-row align-items-center border-info border-bottom p-2 bg-light gap-2"
                                    style={exercicio.sets?.length > 0 ? { borderLeft: '0.30rem solid #85D446', borderRight: '0.30rem solid #85D446' } : {}}
                                >
                                    <div
                                        {...provided.dragHandleProps}
                                        className="me-2 d-flex flex-column align-items-center"
                                        style={{ cursor: 'grab' }}
                                    >
                                        <i className="bi bi-arrow-bar-up"></i>
                                        <i className="bi bi-grip-horizontal"></i>
                                        <label>{exercicio.sequencia_sessao_exercicio}</label>
                                        <i className="bi bi-arrow-bar-down"></i>
                                    </div>

                                    <div>
                                        <div className="d-flex flex-column border-info border-bottom p-2 bg-light">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <label>{exercicio.nome_exercicio}</label>

                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-outline-info btn-sm"
                                                        onClick={(e) => { e.preventDefault(); addSet({ ...exercicio, index }); }}
                                                    >
                                                        <i className="bi bi-collection me-2"></i>
                                                        {exercicio.sets?.length == 0 ? 'Bi-set ' : ''}
                                                        {exercicio.sets?.length == 1 ? 'Tri-set ' : ''}
                                                        {exercicio.sets?.length >= 2 ? 'Super-set ' : ''}
                                                    </button>

                                                    <button className="btn btn-outline-danger btn-sm"
                                                        onClick={(e) => { e.preventDefault(); remove(index); }}
                                                    >
                                                        <i className="bi bi-trash me-2"></i>Remover
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-1">
                                                <div className="form-floating">
                                                    <input id="seriesInput" value={exercicio.serie_sessao_exercicio} onChange={e => updateField(index, 'serie_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Séries"/>
                                                    <label htmlFor="seriesInput">Séries</label>
                                                </div>
                                                <div className="form-floating">
                                                    <input id="repInput" value={exercicio.repeticao_sessao_exercicio} onChange={e => updateField(index, 'repeticao_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Repetições"/>
                                                    <label htmlFor="repInput">Repetições</label>
                                                </div>
                                                <div className="form-floating">
                                                    <input id="cargaInput" value={exercicio.carga_sessao_exercicio} onChange={e => updateField(index, 'carga_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Carga (kg)"/>
                                                    <label htmlFor="cargaInput">Carga (kg)</label>
                                                </div>
                                                <div className="form-floating">
                                                    <input id="interInput" value={exercicio.intervalo_sessao_exercicio} onChange={e => updateField(index, 'intervalo_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Intervalo"/>
                                                    <label htmlFor="interInput">Intervalo</label>
                                                </div>
                                            </div>
                                        </div>

                                        {exercicio.sets?.map((set, idx) => (
                                            <div key={idx} className="d-flex flex-column border-info border-bottom p-2 bg-light">
                                                <div className="mb-2 d-flex justify-content-between align-items-center">
                                                    <label>{set.nome_exercicio}</label>

                                                    <div className="d-flex gap-1">
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            onClick={(e) => { e.preventDefault(); removeSet(index, idx); }}
                                                        >
                                                            <i className="bi bi-trash me-2"></i>Remover
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-1">
                                                    <div className="form-floating">
                                                        <input id="seriesInput" value={set.serie_sessao_exercicio} onChange={e => updateField(index, 'serie_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Séries"/>
                                                        <label htmlFor="seriesInput">Séries</label>
                                                    </div>
                                                    <div className="form-floating">
                                                        <input id="repInput" value={set.repeticao_sessao_exercicio} onChange={e => updateField(index, 'repeticao_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Repetições"/>
                                                        <label htmlFor="repInput">Repetições</label>
                                                    </div>
                                                    <div className="form-floating">
                                                        <input id="cargaInput" value={set.carga_sessao_exercicio} onChange={e => updateField(index, 'carga_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Carga (kg)"/>
                                                        <label htmlFor="cargaInput">Carga (kg)</label>
                                                    </div>
                                                    <div className="form-floating">
                                                        <input id="interInput" value={set.intervalo_sessao_exercicio} onChange={e => updateField(index, 'intervalo_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Intervalo"/>
                                                        <label htmlFor="interInput">Intervalo</label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className={`${index === waitExercicio?.index && waitExercicio?.indexSessao === indexSessao ? '' : 'd-none' } border border-info p-2 text-center`}>
                                            <label>
                                                {exercicio.sets?.length == 0 ? 'Bi-set ' : ''}
                                                {exercicio.sets?.length == 1 ? 'Tri-set ' : ''}
                                                {exercicio.sets?.length >= 2 ? 'Super-set ' : ''}
                                                aguardando seleção
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default CadTreino;