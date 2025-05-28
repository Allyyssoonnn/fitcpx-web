
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AutoComplete from "../../components/autoComplete";
import { arrayBorders, filtrarExerciciosFunc, segundosParaTempo } from "../../utils";
import { getArticulacoes, getExercicios, getGrupoExercicios, getIndicacoes } from "../../api/treino";
import { stateUsuario, useStateApp } from "../../states/states";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import FiltroTreinoInteligente from "./filtroTreinoInteligente";
import { useState } from "react";

function ListaExercicios({ exercicios, indexSessao, setSessoes, adicionarSet, setItensRemovidos }) {
    const [usuario] = useRecoilState(stateUsuario);
    const [showModalFiltro, setShowModalFiltro] = useState(false);
    // const [indexSessaoFiltro, setIndexSessaoFiltro] = useState();
    const [indexExercicioFiltro, setIndexExercicioFiltro] = useState();

    const { data: exerciciosLista, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario),
        initialData: [],
    });

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

        setSessoes(prevArray => prevArray.map((grupo, i) => i == indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo));
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
        } else {
            //Atualiza exercicio
            updatedExercicios = excs.map((item, id) => idx == id ? { ...item, [campo]: valor } : { ...item });
        }

        setSessoes(prevArray => prevArray.map((grupo, i) => i == indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo));
    }

    const remove = (index) => {
        setItensRemovidos(prev => ([ ...prev, exercicios[index] ]));

        // Remove o item pelo índice
        const reorderedExercicios = Array.from(exercicios);
        reorderedExercicios.splice(index, 1);

        // Reordena o campo `sequencia_sessao_exercicio` após a remoção
        const updatedExercicios = reorderedExercicios.map((item, idx) => ({
            ...item,
            sequencia_sessao_exercicio: idx + 1,
        }));

        setSessoes(prevArray => prevArray.map((grupo, i) => i == indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo));
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

        setSessoes(prevArray => prevArray.map((grupo, i) => i == indexSessao ? { ...grupo, exercicios: reorderedExercicios } : grupo));
    }

    const confirmaTreinoInteligente = (exerciciosFiltrados) => {

        // Selecionar um exercício aleatório, se houver exercícios filtrados
        const exercicioAleatorio = exerciciosFiltrados.length
        ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
        : { nome_exercicio: '' };

        setSessoes(prevSessoes => prevSessoes.map((sessao, idSessao) => idSessao == indexSessao ? {
            ...sessao,
            exercicios: sessao.exercicios.map((exercicio, idExercicio) => idExercicio == indexExercicioFiltro ? { ...exercicio, ...exercicioAleatorio, exerciciosFiltros: exerciciosFiltrados } : exercicio)
        } : sessao))
    }

    const selecionaExercicio = (indexSessao, indexExercicio, cod_exercicio, indexSet) => {
        const exercicioAtt = exerciciosLista.find((exc) => exc.cod_exercicio == cod_exercicio);

        if (indexSet == null) {
            // Atualizando exercício base
            setSessoes(prevSessoes => prevSessoes.map((sessao, idSessao) => idSessao == indexSessao ? {
                ...sessao,
                exercicios: sessao.exercicios.map((exercicio, idExercicio) => idExercicio == indexExercicio ? {
                    ...exercicio,
                    ...exercicioAtt,
                } : exercicio)
            } : sessao))
        } else {
            // Atualizando set dentro do exercício base
            setSessoes(prevSessoes => prevSessoes.map((sessao, idSessao) => idSessao == indexSessao ? {
                ...sessao,
                exercicios: sessao.exercicios.map((exercicio, idExercicio) => idExercicio == indexExercicio ? {
                    ...exercicio,
                    sets: exercicio.sets?.map((set, i) => indexSet == i ? {
                        ...set,
                        ...exercicioAtt,
                        // Sequencia exercicio precisa ser a mesma do exercicio pai para agrupar
                        sequencia_sessao_exercicio: exercicio.sequencia_sessao_exercicio,
                    } : set),
                } : exercicio)
            } : sessao))
        }
    }

    const atualizaExercicioAleatorio = (e, indexSessao, indexExercicio, exerciciosFiltrados) => {
        e.preventDefault();
        const exercicioAleatorio = exerciciosFiltrados.length
        ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
        : { nome_exercicio: '' };

        setSessoes(prevSessoes => prevSessoes.map((sessao, idSessao) => idSessao == indexSessao ? {
            ...sessao,
            exercicios: sessao.exercicios.map((exercicio, idExercicio) => idExercicio == indexExercicio ? { ...exercicio, ...exercicioAleatorio } : exercicio)
        } : sessao))
    }

    const openFiltroTreinoInteligente = (e, indexExercicio) => {
        e.preventDefault();
        setIndexExercicioFiltro(indexExercicio);
        setShowModalFiltro(true);
    }

    function SelectExercicios({ exercicio, index, indexSet = null }) {
        return (
            <div className="d-flex align-items-center gap-2 w-100">
                <button
                    onClick={(e) => openFiltroTreinoInteligente(e, index)}
                    className='btn rounded btn-info'
                >
                    <i className="bi bi-lightbulb" />
                </button>

                <button
                    onClick={(e) => atualizaExercicioAleatorio(e, indexSessao, index, exercicio?.exerciciosFiltros ?? [])}
                    className='btn rounded btn-outline-warning'
                >
                    <i className="bi bi-arrow-clockwise" />
                </button>

                {exercicio.url_exercicio && (
                    <label className="badge bg-success">
                        <i className="bi bi-camera-reels" />
                    </label>
                )}
                
                <div className="form-floating w-100 me-2">
                    <AutoComplete
                        id={`inputExercise-${index}-session-${indexSessao}-set-${indexSet}`}
                        chave='cod_exercicio'
                        valueChave={exercicio.cod_exercicio}
                        sugestoes={exercicio?.exerciciosFiltros ?? exerciciosLista}
                        chavePesquisa='nome_exercicio'
                        onChange={(cod_exercicio, exercicio) => selecionaExercicio(indexSessao, index, cod_exercicio, indexSet)}
                    />
                </div>
            </div>
        )
    }

    function newSet(exercicio, index) {
        adicionarSet(indexSessao, index);
    }

    return (<>
        <FiltroTreinoInteligente show={showModalFiltro} close={() => setShowModalFiltro(false)} confirma={confirmaTreinoInteligente} />
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercicioList">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="d-flex flex-column gap-2">
                        {exercicios.map((exercicio, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    // {...provided.dragHandleProps}
                                    className={`d-flex flex-row shadow-sm align-items-center border border-primary p-2 gap-2 rounded ${exercicio.sets?.length > 0 ? 'border border-2' : ''} ${exercicio.sets?.length > 0 ? arrayBorders[index] : ''}`}
                                    // style={exercicio.sets?.length > 0 ? { borderLeft: '0.30rem solid', borderRight: '0.30rem solid' } : {}}
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

                                    <div className="d-flex flex-column w-100">
                                        <div className="d-flex flex-column p-2 bg-light w-100">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <SelectExercicios exercicio={exercicio} index={index} />

                                                <div className="dropdown">
                                                    <button id={`optionsExercise-${index}-session-${indexSessao}`} onClick={e => e.stopPropagation()} className="btn btn-outline-primary rounded" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up rounded p-1 bg-white">
                                                        <a className="d-flex align-items-center gap-2 btn btn-sm btn-outline-primary rounded mb-1"
                                                            onClick={(e) => { e.preventDefault(); newSet(exercicio, index); }} href="#"
                                                            id={`addSetMethod-exercise-${index}-session-${indexSessao}`}
                                                        >
                                                            <i className="bi bi-collection"></i>
                                                            <p className="mb-0">
                                                                {exercicio.sets?.length == 0 ? 'Bi-set ' : ''}
                                                                {exercicio.sets?.length == 1 ? 'Tri-set ' : ''}
                                                                {exercicio.sets?.length >= 2 ? 'Super-set ' : ''}
                                                            </p>
                                                        </a>
                                                        <a className="d-flex align-items-center gap-2 btn btn-sm btn-outline-danger rounded mb-1"
                                                            onClick={(e) => { e.preventDefault(); remove(index); }} href="#"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Remover</p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex row g-3">
                                                <div className="form-floating col-md-3 col-6">
                                                    <input name={`setsExercise-${index}-session-${indexSessao}`} id="seriesInput" value={exercicio.serie_sessao_exercicio} onChange={e => updateField(index, 'serie_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Séries"/>
                                                    <label htmlFor="seriesInput">Séries</label>
                                                </div>
                                                <div className="form-floating col-md-3 col-6">
                                                    <input name={`repsExercise-${index}-session-${indexSessao}`} id="repInput" value={exercicio.repeticao_sessao_exercicio} onChange={e => updateField(index, 'repeticao_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Repetições"/>
                                                    <label htmlFor="repInput">Repetições</label>
                                                </div>
                                                <div className="form-floating col-md-3 col-6">
                                                    <input id="cargaInput" value={exercicio.carga_sessao_exercicio} onChange={e => updateField(index, 'carga_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Carga (kg)"/>
                                                    <label htmlFor="cargaInput">Carga (kg)</label>
                                                </div>
                                                <div className="form-floating col-md-3 col-6">
                                                    <input name={`intervalExercise-${index}-session-${indexSessao}`} id="interInput" value={exercicio.intervalo_sessao_exercicio} onChange={e => updateField(index, 'intervalo_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Intervalo"/>
                                                    <label htmlFor="interInput">Intervalo</label>
                                                </div>
                                                <div className="form-floating col-md-6">
                                                    <input name={`observationExercise-${index}-session-${indexSessao}`} id="interInput" value={exercicio.observacao_sessao_exercicio} onChange={e => updateField(index, 'observacao_sessao_exercicio', e.target.value)} className="form-control form-control-sm" placeholder="Observação"/>
                                                    <label htmlFor="interInput">Observação</label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-around col-md-6 border border-info rounded">
                                                    <label className="fs-3">Duração: <strong>{segundosParaTempo((exercicio.serie_sessao_exercicio * exercicio.repeticao_sessao_exercicio) * (exercicio.segundos_execucao) + (exercicio.serie_sessao_exercicio * exercicio.intervalo_sessao_exercicio))}</strong></label>
                                                    <label className="fs-3">Nível: <strong>{exercicio.nivel_exercicio || '-'}</strong></label>
                                                </div>
                                            </div>
                                        </div>

                                                                                {exercicio.sets
                                        ?.slice() // Cria uma cópia para não alterar o original
                                        .sort((a, b) => new Date(a.createdAt) + new Date(b.createdAt))
                                        .map((set, idx) => (
                                            <div key={idx} className="d-flex mt-2">
                                                <div className="d-flex flex-column p-2 bg-light w-100">
                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <SelectExercicios exercicio={set} index={index} indexSet={idx} />

                                                        <div className="d-flex gap-1">
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                onClick={(e) => { e.preventDefault(); removeSet(index, idx); }}
                                                            >
                                                                <i className="bi bi-trash me-2"></i>Remover
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div id={`optionsExercise-${index}`} className="d-flex row g-3">
                                                        <div className="form-floating col-md-3 col-6">
                                                            <input name={`setsExercise-${index}-session-${indexSessao}-set-${idx}`} id="seriesInput" value={set.serie_sessao_exercicio} onChange={e => updateField(index, 'serie_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Séries"/>
                                                            <label htmlFor="seriesInput">Séries</label>
                                                        </div>
                                                        <div className="form-floating col-md-3 col-6">
                                                            <input name={`repsExercise-${index}-session-${indexSessao}-set-${idx}`} id="repInput" value={set.repeticao_sessao_exercicio} onChange={e => updateField(index, 'repeticao_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Repetições"/>
                                                            <label htmlFor="repInput">Repetições</label>
                                                        </div>
                                                        <div className="form-floating col-md-3 col-6">
                                                            <input id="cargaInput" value={set.carga_sessao_exercicio} onChange={e => updateField(index, 'carga_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Carga (kg)"/>
                                                            <label htmlFor="cargaInput">Carga (kg)</label>
                                                        </div>
                                                        <div className="form-floating col-md-3 col-6">
                                                            <input name={`intervalExercise-${index}-session-${indexSessao}-set-${idx}`} id="interInput" value={set.intervalo_sessao_exercicio} onChange={e => updateField(index, 'intervalo_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Intervalo"/>
                                                            <label htmlFor="interInput">Intervalo</label>
                                                        </div>
                                                        <div className="form-floating col-md-6">
                                                            <input name={`observationExercise-${index}-session-${indexSessao}-set-${idx}`} id="interInput" value={set.observacao_sessao_exercicio} onChange={e => updateField(index, 'observacao_sessao_exercicio', e.target.value, idx)} className="form-control form-control-sm" placeholder="Observação"/>
                                                            <label htmlFor="interInput">Observação</label>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-around col-md-6 border border-info rounded">
                                                            <label className="fs-3">Duração: <strong>{segundosParaTempo((exercicio.serie_sessao_exercicio * exercicio.repeticao_sessao_exercicio) * (exercicio.segundos_execucao) + (exercicio.serie_sessao_exercicio * exercicio.intervalo_sessao_exercicio))}</strong></label>
                                                            <label className="fs-3">Nível: <strong>{exercicio.nivel_exercicio || '-'}</strong></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
    </>);
}

export default ListaExercicios;