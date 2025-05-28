import { useEffect, useState } from "react";
import EditableText from "../editableText";
import Swal from "sweetalert2";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ListaExercicios from "./listaExercicios";
import { arrayBorders } from "../../utils";
import GerarTreino from "./gerarTreino";

function TreinoInteligente({ sessoes, setSessoes, setRemovidos, setItensRemovidos, getRepeticao }) {
    const [wait, setWait] = useState();

    const updateNomeSessao = (index, newName) => {
        setSessoes((prevWorkouts) =>
            prevWorkouts.map((workout, i) =>
                index === i ? { ...workout, nome_sessao: newName } : workout
            )
        );
    };

    async function adicionarSessao(e) {
        e.preventDefault();
        if (sessoes.length >= 15) return;
        const newKey = (sessoes.length + 1).toString();
        setSessoes([...sessoes,
            { key: newKey, nome_sessao: `Sessão ${String.fromCharCode(65 + sessoes.length)}`, exercicios: [], sequencia_sessao: sessoes.length +1 },
        ]);
    }

    async function adicionarExercicio(e, indexSessao) {
        e.preventDefault();
        setSessoes(prevsessoes => prevsessoes.map((sessao, index) => index == indexSessao ? {
            ...sessao,
            exercicios: [ ...sessao.exercicios, {
                cod_exercicio: null,
                sequencia_sessao_exercicio: sessoes[indexSessao]?.exercicios?.length + 1,
                sets: [],
                serie_sessao_exercicio:  3,
                repeticao_sessao_exercicio: getRepeticao(),
                intervalo_sessao_exercicio: 60,
                carga_sessao_exercicio: 0,
            } ]
        } : sessao));
    }

    async function adicionarSet(indexSessao, indexExercicio) {
        setSessoes(prevsessoes => prevsessoes.map((sessao, index) => index == indexSessao ? {
            ...sessao,
            exercicios: sessao.exercicios.map((exc, i) => indexExercicio == i ? {
                ...exc,
                sets: [ ...exc.sets, {
                    sequencia_sessao_exercicio: sessoes[indexSessao]?.exercicios?.length + 1,
                    sets: [],
                    serie_sessao_exercicio:  3,
                    repeticao_sessao_exercicio: 12,
                    intervalo_sessao_exercicio: 60,
                    carga_sessao_exercicio: 0,
                } ]
            } : exc)
        } : sessao));
    }

    async function clickDelete(e, nome_sessao, index) {
        e.preventDefault();
        Swal.fire({
            title: 'Tem certeza?',
            text: `Tem certeza que deseja remover a sessão ${nome_sessao}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (result.isConfirmed) {
                    setRemovidos(prev => [...prev, sessoes[index]]);
                    const newWorkouts = sessoes.filter((grupo, idx) => index !== idx);
                    setSessoes(newWorkouts);
                }
            }
        })
    }

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, sai da função
        if (!destination) return;

        // Rearranjar a lista
        const reorderedSessoes = Array.from(sessoes);
        const [removed] = reorderedSessoes.splice(source.index, 1);
        reorderedSessoes.splice(destination.index, 0, removed);

        // Atualizar o campo `sequencia_sessao` de acordo com a nova ordem
        const updatedSessoes = reorderedSessoes.map((item, index) => ({
            ...item,
            sequencia_sessao: index + 1,
        }));

        setSessoes(updatedSessoes);
    };
    
    return (
        <div className="container-fluid">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='SessoesList'>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            // className="d-flex flex-column p-1"
                            // style={{ overflow: 'auto', height: '50vh', overflowX: 'hidden' }}
                        >
                            {sessoes.map((sessao, index) => (
                                <Draggable key={index} draggableId={String(index)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            // {...provided.dragHandleProps}
                                            key={index}
                                            className={`accordion rounded-2 mb-1 border-2 ${arrayBorders[index]}`}
                                            // style={{ border: '0.15rem solid #85D446' }}
                                        >
                                            <div className="accordion-item">
                                                <div className="card-header accordion-header d-flex justify-content-between align-items-center">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="me-2 d-flex flex-column align-items-center"
                                                        style={{ cursor: 'grab' }}
                                                    >
                                                        <i className="bi bi-arrow-bar-up fs-1"></i>
                                                        <i className="bi bi-grip-horizontal"></i>
                                                        <label className="fs-1">{sessao.sequencia_sessao}</label>
                                                    </div>

                                                    {screen.width > 766 && (
                                                        <GerarTreino setSessoes={setSessoes} indexSessao={index} />
                                                    )}

                                                    <button id={`btnSession-${index}`} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${index}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse${index}`}>
                                                        <EditableText
                                                            title={true}
                                                            key={index}
                                                            text={sessao.nome_sessao}
                                                            onUpdate={(newName) => updateNomeSessao(index, newName)}
                                                        />
                                                    </button>

                                                    <div className={`${screen.width < 766 ? 'd-none' : ''}`}>
                                                        <a href="#" className="text-danger" onClick={e => clickDelete(e, sessao.nome_sessao, index)}>
                                                            <i className="bi bi-trash me-2"></i>
                                                        </a>
                                                    </div>

                                                    {screen.width < 766 && (
                                                        <div className="dropdown">
                                                            <button onClick={e => e.stopPropagation()} className="btn btn-outline-primary rounded" data-bs-toggle="dropdown">
                                                                <i className="bi bi-three-dots-vertical"></i>
                                                            </button>

                                                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up rounded p-1 bg-white">
                                                                <GerarTreino setSessoes={setSessoes} indexSessao={index} button={false} />
                                                                <a className="d-flex align-items-center gap-2 btn btn-sm btn-outline-danger rounded mb-1"
                                                                    onClick={e => clickDelete(e, sessao.nome_sessao, index)} href="#"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                    <p className="mb-0">Remover</p>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                    
                                                <div id={`panelsStayOpen-collapse${index}`} className="accordion-collapse collapse">
                                                    <div className="accordion-body">
                                                        <ListaExercicios
                                                            exercicios={sessao?.exercicios ?? []}
                                                            setSessoes={setSessoes}
                                                            indexSessao={index}
                                                            waitExercicio={wait}
                                                            setWaitExercicio={setWait}
                                                            adicionarSet={adicionarSet}
                                                            setItensRemovidos={setItensRemovidos}
                                                        />

                                                        <button id={`addExercise-${index}`} className="btn btn-outline-success rounded w-100 mt-3" onClick={e => adicionarExercicio(e, index)}>
                                                            <i className="bi bi-plus me-2" />
                                                            Adicionar exercício
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button id="addSessions" className="btn btn-outline-primary w-100" onClick={adicionarSessao}>
                <i className="bi bi-plus me-2" />
                Adicionar sessão
            </button>
        </div>
    );
}

export default TreinoInteligente;