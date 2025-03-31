import { useEffect, useMemo, useState } from "react";
import FiltroExercicio from "../filtroExercicio";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import EditableText from "../editableText";
import { arrayBorders } from "../../utils";
import ListaExercicios from "./listaExercicios";

function Prescricao({ nome, getRepeticao = null, nomeNovoGrupo, nomeArrayGrupo, campoSequencia, array = [], nomeArray, nomeGrupo, filtroComponenteNome, nomeColuna2, grupos = [], setGrupos, setRemovidos, campoSequenciaItem }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [arrayBase, setArrayBase] = useState([]);
    const [wait, setWait] = useState();

    useEffect(() => {
        //Atualiza o array quando não há filtro pois quando atualiza a tela array volta vazio caso não tenha o componente de filtro
        if (filtroComponenteNome !== 'Exercícios') setArrayBase(array);
    }, [array]);

    const arrayFiltered = useMemo(() => {
        return arrayBase.filter((value) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word => value[nomeArray]?.toLowerCase().includes(word))
        );
    }, [arrayBase, searchTerm]);

    async function adicionarGrupo(e) {
        e.preventDefault();
        if (grupos.length >= 15) return;
        const newKey = (grupos.length + 1).toString();
        setGrupos([...grupos,
            { key: newKey, [nomeGrupo]: `${nomeNovoGrupo} ${String.fromCharCode(65 + grupos.length)}`, [nomeArrayGrupo]: [], [campoSequencia]: grupos.length +1 },
        ]);
    }

    async function removerGrupo(index) {
        const workout = grupos[index];

        Swal.fire({
            title: `Remover ${nomeNovoGrupo}`,
            text: `Tem certeza que deseja remover o ${workout[nomeGrupo]}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setRemovidos(prev => [...prev, workout]);
                const newWorkouts = grupos.filter((grupo, idx) => index !== idx);
                setGrupos(newWorkouts);
            }
        })
    }

    return (
        <div className={`d-flex gap-2 ${window.screen.width > 1000 ? '' : 'flex-wrap'}`}>
            <Coluna1
                nome={nome}
                nomeGrupo={nomeGrupo}
                setSearchTerm={setSearchTerm}
                nomeArray={nomeArray}
                searchTerm={searchTerm}
                array={array}
                setArrayBase={setArrayBase}
                arrayFiltered={arrayFiltered}
                wait={wait}
                setWait={setWait}
                filtroComponenteNome={filtroComponenteNome}
                setGrupos={setGrupos}
                grupos={grupos}
                getRepeticao={getRepeticao}
            />

            <Coluna2
                adicionarGrupo={adicionarGrupo}
                grupos={grupos}
                setGrupos={setGrupos}
                nomeColuna2={nomeColuna2}
                nomeGrupo={nomeGrupo}
                campoSequencia={campoSequencia}
                setWait={setWait}
                removerGrupo={removerGrupo}
                nomeArrayGrupo={nomeArrayGrupo}
                campoSequenciaItem={campoSequenciaItem}
                nome={nome}
                wait={wait}
            />
        </div>
    )
}

function Coluna1({ getRepeticao, nome, nomeGrupo, setSearchTerm, nomeArray, grupos, setGrupos, searchTerm, arrayFiltered, wait, setWait, filtroComponenteNome, array, setArrayBase }) {

    function addExercicio(exercicio) {
        //Adiciona exercicio vinculado a outro exercicio, Bi-set, tri-set, Super-set
        if (!wait?.key) {
            setGrupos(prevArray =>
                prevArray.map((sessao, index) =>
                    index == wait?.indexSessao
                        ? { ...sessao, exercicios: sessao.exercicios.map((exc, idx) =>
                            idx == wait.index
                                ? { ...exc,
                                    sets: [
                                        ...exc.sets,
                                        {
                                            ...exercicio,
                                            sequencia_sessao_exercicio: exc.sequencia_sessao_exercicio,
                                            serie_sessao_exercicio: 3,
                                            repeticao_sessao_exercicio: getRepeticao(),
                                            intervalo_sessao_exercicio: 60,
                                            carga_sessao_exercicio: 0,
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
        setGrupos(prevArray =>
            prevArray.map(item =>
                item.key == wait.key
                    ? { ...item, exercicios: [...item.exercicios, {
                        ...exercicio,
                        sequencia_sessao_exercicio: grupos[wait?.index]?.exercicios?.length + 1,
                        sets: [],
                        serie_sessao_exercicio:  3,
                        repeticao_sessao_exercicio: getRepeticao(),
                        intervalo_sessao_exercicio: 60,
                        carga_sessao_exercicio: 0,
                    }] }
                    : item
            )
        );
    }

    function adicionarItem(value) {
        if (nome === 'Exercícios') addExercicio(value);
    }

    return (
        <div className={`card ${window.screen.width > 1000 ? 'w-50' : 'w-100'} vh-100`}>
            <div className="card-header d-flex justify-content-between">
                <h4 className="card-title mb-3">{nome || 'Informar nome'}</h4>

                <div className={`border border-info rounded-3 p-2 ${wait?.index >= 0 ? '' : 'd-none'}`}>
                    <label className="fs-2 me-1">{(wait && wait[nomeGrupo]) ?? ''} (Aguardando seleção)</label>
                    <button onClick={e => { e.preventDefault(); setWait({}); }} className="btn btn-sm btn-danger">
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

            {filtroComponenteNome === 'Exercícios' && (
                <FiltroExercicio exercicios={array} setExerciciosFiltrados={setArrayBase} />
            )}

            <table className="card-body d-flex flex-column p-1 h-100" style={{ overflow: 'auto', height: '100%' }}>
                {arrayFiltered.map((value, index) => (
                    <tr key={index}
                        className={`d-flex btn-hover justify-content-between ${index % 2 === 0 ? 'bg-light' : 'bg-dark-subtle'}`}
                    >
                        <span className="text-start w-90 m-1">{value[nomeArray]}</span>
                        <button onClick={e => { e.preventDefault(); adicionarItem(value); }}
                            disabled={!(wait?.index >= 0)}
                            className="btn btn-outline-success rounded"
                        >
                            <span className="fs-2">Adicionar</span>
                        </button>
                    </tr>
                ))}
            </table>
        </div>
    )
}

function Coluna2({ nome, grupos, setGrupos, adicionarGrupo, nomeColuna2, nomeGrupo, campoSequencia, campoSequenciaItem, setWait, removerGrupo, nomeArrayGrupo, wait }) {

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, sai da função
        if (!destination) return;

        // Rearranjar a lista
        const reorderedSessoes = Array.from(grupos);
        const [removed] = reorderedSessoes.splice(source.index, 1);
        reorderedSessoes.splice(destination.index, 0, removed);

        // Atualizar o campo `sequencia_sessao` de acordo com a nova ordem
        const updatedSessoes = reorderedSessoes.map((item, index) => ({
            ...item,
            [campoSequencia]: index + 1,
        }));

        setGrupos(updatedSessoes);
    };

    const updateNomeSessao = (key, newName) => {
        setGrupos((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout.key === key ? { ...workout, [nomeGrupo]: newName } : workout
            )
        );
    };
    
    return (
        (<div className={`card ${window.screen.width > 1000 ? 'w-60' : 'w-100'} vh-100`}>
            <div className="card-header d-flex justify-content-between">
                <h4 className="card-title mb-3">{nomeColuna2}</h4>
                <label>{grupos.length}/15</label>
            </div>
            <button className={`btn btn-outline-info rounded-3 mt-3 mb-3 ${grupos.length >= 15 ? 'd-none' : ''}`} onClick={adicionarGrupo}>
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar
            </button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`${nomeColuna2}List`}>
                    {(provided) => ((
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="card-body d-flex flex-column p-1"
                            style={{ overflow: 'auto', height: '50vh', overflowX: 'hidden' }}
                        >
                            {grupos.map((grupo, index) => (
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
                                                <div className="accordion-header d-flex justify-content-center">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="me-2 d-flex flex-column align-items-center ps-3"
                                                        style={{ cursor: 'grab' }}
                                                    >
                                                        <i className="bi bi-arrow-bar-up"></i>
                                                        <i className="bi bi-grip-horizontal"></i>
                                                        <label className="fs-1">{grupo[campoSequencia]}</label>
                                                        <i className="bi bi-arrow-bar-down"></i>
                                                    </div>
                                                    
                                                    <button className="accordion-button d-flex align-items-center justify-content-center" type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${index}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse${index}`}>
                                                        <EditableText
                                                            key={grupo.key}
                                                            text={grupo[nomeGrupo]}
                                                            onUpdate={(newName) => updateNomeSessao(grupo.key, newName)}
                                                        />
                                                    </button>

                                                    <div className="d-flex align-items-center pe-2">
                                                        <button className="btn btn-danger rounded px-2 py-1" onClick={(e) => { e.preventDefault(); removerGrupo(index); }}>
                                                            <i className="bi bi-trash"></i>
                                                            {/* Remover */}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div id={`panelsStayOpen-collapse${index}`} className="accordion-collapse collapse">
                                                    <div className="accordion-body row g-3">
                                                        <div className="d-flex flex-column">
                                                            {nome == 'Exercícios' && (
                                                                <ListaExercicios
                                                                    exercicios={grupo?.exercicios}
                                                                    indexSessao={index}
                                                                    setSessoes={setGrupos}
                                                                    setWaitExercicio={setWait}
                                                                    waitExercicio={wait}
                                                                />
                                                            )}

                                                            <button onClick={e => { e.preventDefault(); setWait({ ...grupo, index }); }} className='btn btn-sm btn-outline-info rounded-3 mt-3 mb-3'>
                                                                <i className="bi bi-plus-circle me-2"></i>
                                                                Adicionar Exercício
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                    ))}
                </Droppable>
            </DragDropContext>
        </div>)
    );
}

export default Prescricao;