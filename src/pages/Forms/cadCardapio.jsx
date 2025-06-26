import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { formatarData, getAvaliacaoNutricional, preventForm } from "../../utils";
import { useEffect, useMemo, useState } from "react";
import { getAlimentos, setCardapio, setRefeicao } from "../../api/cardapio";
import { stateUsuario, useNotificacao } from "../../states/states";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditableText from "../../components/editableText";
import { toast } from "react-toastify";
import { useNavigationBlocker } from "../../components/useNavigationBlocker";

function CadCardapio() {
    const { nSuccess } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { handleSubmit, register, setValue, watch, reset, formState: { isDirty, isSubmitting } } = useForm();
    const navigate = useNavigationBlocker(isDirty);
    const location = useLocation();

    const [indexAv, setIndexAv] = useState(0);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [objetivo, setObjetivo] = useState('Hipetrofia');
    const [nivelAtividade, setNivelAtividade] = useState('Levemente ativo');
    const aluno = location.state?.aluno;
    const [removidos, setRemovidos] = useState([]);
    const [refeicoes, setRefeicoes] = useState([]);

    useEffect(() => {
        const alunoRecebido = location.state?.aluno;
        if (alunoRecebido) {
            setAvaliacoes(alunoRecebido.avaliacao);
            setIndexAv(alunoRecebido.avaliacao.length - 1);
        }
        const cardapioRecebido = location.state?.cardapio;
        if (cardapioRecebido) {
            Object.keys(cardapioRecebido).forEach((key) => {
                setValue(key, cardapioRecebido[key]);
            });
        }
        var refeicaoKey = cardapioRecebido?.refeicoes?.map((refeicao, index) => ({
            ...refeicao,
            key: index + 1,
        }))
        if (cardapioRecebido?.refeicoes) setRefeicoes(refeicaoKey);
    }, []);

    async function confirma(data) {
        const cardapio = await setCardapio({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa, cod_aluno: aluno.cod_aluno });
        
        if (cardapio) {
            await setRefeicao(refeicoes, cardapio.cod_cardapio, usuario.cod_usuario, usuario.cod_empresa, removidos);
            reset();
            nSuccess();
            navigate('/cardapios');
        } else toast.error('Erro ao salvar treino');
    }

    return (
        <form onKeyDown={preventForm} onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="row g-3 gap-3">
                <div className="card col-md-5">
                    <div className="card-header">
                        <button onClick={e => { e.stopPropagation(); navigate('/cardapios'); }} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-backspace me-2"></i>
                            Voltar
                        </button>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Cardápio</h5>

                        <div className={`col-md-12 ${aluno ? '' : 'd-none'} mb-3`}>
                            <label className="form-label">Aluno</label>
                            <input value={aluno?.nome_aluno} disabled className="form-control" />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_cardapio", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="card col-md-6">
                    <div className="card-body row g-3">
                        <h5 className="card-title fw-semibold mb-4">Referência avaliação</h5>

                        <div className="row g-3 mb-3 col-md-6">
                            <div className="col-md-12">
                                <label className="form-label">Avaliação</label>
                                <select className="form-control" value={indexAv} onChange={e => setIndexAv(e.target.value)}>
                                    <option value={-1}>Selecione uma avaliação</option>
                                    {avaliacoes?.map((av, index) => (
                                        <option key={index} value={index}>{formatarData(av.data_avaliacao)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label">Objetivo</label>
                                <select className="form-control" value={objetivo} onChange={e => setObjetivo(e.target.value)}>
                                    <option value="Emagrecimento">Emagrecimento</option>
                                    <option value="Hipertrofia">Hipertrofia</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Performance">Performance</option>
                                    <option value="Definição Muscular">Definição Muscular</option>
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label">Nível de atividade</label>
                                <select className="form-control" value={nivelAtividade} onChange={e => setNivelAtividade(e.target.value)}>
                                    <option value="Sedentário">Sedentário</option>
                                    <option value="Levemente ativo">Levemente ativo</option>
                                    <option value="Moderadamente ativo">Moderadamente ativo</option>
                                    <option value="Muito ativo">Muito ativo</option>
                                    <option value="Extremamente ativo">Extremamente ativo</option>
                                </select>
                            </div>
                        </div>

                        <div className="row g-3 col-md-6">
                            {(indexAv >= 0 && avaliacoes.length > 0) && (
                                <div className="d-flex flex-column">
                                    <label className="form-label">TMB: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.tmb} Kcal</strong></label>
                                    <label className="form-label">Consumo diário: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.consumo_diario} Kcal</strong></label>
                                    <label className="form-label">Gasto calórico: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.gasto_calorico} Kcal</strong></label>
                                    <label className="form-label">Carboidrato: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.carboidrato} g</strong></label>
                                    <label className="form-label">Proteína: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.proteina} g</strong></label>
                                    <label className="form-label">Gordura: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.gordura} g</strong></label>
                                    <label className="form-label">Água: <strong>{getAvaliacaoNutricional(aluno, avaliacoes[indexAv] || null, objetivo, nivelAtividade)?.agua} Lts</strong></label>
                                </div>
                            )}
                        </div>
                    </div>                    
                </div>

                <div className="card" style={{ height: '90vh' }}>
                    <h5 className="card-title fw-semibold m-3">Alimentação</h5>

                    <div className="card-body p-1">
                        <Refeicoes
                            refeicoes={refeicoes}
                            setRefeicoes={setRefeicoes}
                            setRemovidos={setRemovidos}
                        />
                    </div>

                    <div className="card-footer">
                        <button disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
                            <i className="bi bi-check me-2"></i>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

function Refeicoes({ refeicoes, setRefeicoes, setRemovidos }) {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [waitAlimento, setWaitAlimento] = useState(false);

    const { data: alimentos, refetch } = useQuery({
        queryKey: ['alimentos', usuario.cod_usuario],
        queryFn: () => getAlimentos(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    const addRefeicao = e => {
        e.preventDefault();
        if (refeicoes.length >= 15) return;
        const newKey = (refeicoes.length + 1).toString();
        setRefeicoes([
            ...refeicoes,
            { key: newKey, nome_refeicao: `Refeição ${refeicoes.length + 1}`, alimentos: [], sequencia_refeicao: refeicoes.length +1 },
        ]);
    };

    const removeRefeicao = (index) => {
        const refeicao = refeicoes[index];
        if (window.confirm(`Tem certeza que deseja remover o ${refeicao.nome_refeicao}?`)) {
            setRemovidos(prev => [...prev, refeicao]);
            const newRefeicoes = refeicoes.filter((sessao, idx) => index !== idx);
            setRefeicoes(newRefeicoes);
        }
    };

    const updateNomeSessao = (key, newName) => {
        setRefeicoes((prevrefeicoes) =>
            prevrefeicoes.map((refeicao) =>
                refeicao.key === key ? { ...refeicao, nome_refeicao: newName } : refeicao
            )
        );
    };

    function updateRefeicao(alimentos, index) {
        setRefeicoes(prevArray => prevArray.map((refeicao, i) => i == index ? { ...refeicao, alimentos: alimentos } : refeicao))
    }

    const filteredExercicios = useMemo(() => {
        return alimentos.filter((alimento) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word => alimento.nome_alimento?.toLowerCase().includes(word))
        );
    }, [alimentos, searchTerm]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, sai da função
        if (!destination) return;

        // Rearranjar a lista
        const reorderedRefeicoes = Array.from(refeicoes);
        const [removed] = reorderedRefeicoes.splice(source.index, 1);
        reorderedRefeicoes.splice(destination.index, 0, removed);

        // Atualizar o campo `sequencia_sessao` de acordo com a nova ordem
        const updatedSessoes = reorderedRefeicoes.map((item, index) => ({
            ...item,
            sequencia_refeicao: index + 1,
        }));

        setRefeicoes(updatedSessoes);
    };

    function addAlimento(exercicio) {
        setRefeicoes(prevArray =>
            prevArray.map(item =>
                item.key == waitAlimento.key
                    ? { ...item, alimentos: [...item.alimentos, {
                        ...exercicio,
                        sequencia_refeicao_alimento: refeicoes[waitAlimento?.index]?.alimentos?.length + 1,
                        quantidade_refeicao_alimento:  1,
                        observacao_refeicao_alimento:  '',
                        // repeticao_sessao_exercicio: getRepeticao(),
                        // intervalo_sessao_exercicio: 60,
                        // carga_sessao_exercicio: 0,
                    }] }
                    : item
            )
        );
    }

    return (
        <div className={`d-flex gap-2 ${window.screen.width > 1000 ? '' : 'flex-wrap'}`}>
            <div className={`card ${window.screen.width > 1000 ? 'w-40' : 'w-100'}`}>
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title mb-3">Alimentos</h4>

                    <div className={`border border-info rounded-3 p-2 ${waitAlimento?.index >= 0 ? '' : 'd-none'}`}>
                        <label className="fs-2 me-1">{waitAlimento?.nome_refeicao} (Aguardando seleção)</label>
                        <button onClick={e => { e.preventDefault(); setWaitAlimento({}); }} className="btn btn-sm btn-danger">
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

                <table className="card-body d-flex flex-column p-1" style={{ overflow: 'auto', height: '50vh' }}>
                    {filteredExercicios.map((alimento, index) => (
                        <tr key={index}
                            onClick={e => { e.preventDefault(); addAlimento(alimento); }}
                            className={`d-flex justify-content-between ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
                        >
                            <button className="btn text-start w-100 m-1 btn-hover">{alimento.nome_alimento}</button>
                        </tr>
                    ))}
                </table>
            </div>

            <div className={`card ${window.screen.width > 1000 ? 'w-60' : 'w-100'}`}>
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title mb-3">Refeições</h4>
                    <label>{refeicoes.length}/15</label>
                </div>

                <button className={`btn btn-outline-info rounded-3 mt-3 mb-3 ${refeicoes.length >= 15 ? 'd-none' : ''}`} onClick={addRefeicao}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Refeição
                </button>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sessaoList">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="card-body d-flex flex-column p-1"
                                style={{ overflow: 'auto', height: '50vh', overflowX: 'hidden' }}
                            >
                                {refeicoes.map((refeicao, index) => (
                                    <Draggable key={index} draggableId={String(index)} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                // {...provided.dragHandleProps}
                                                key={index}
                                                className="accordion rounded-2 mb-1 border-2 border-success"
                                                // style={{ border: '0.15rem solid #85D446' }}
                                            >
                                                <div className="accordion-item">
                                                    <div className="accordion-header d-flex">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="me-2 d-flex flex-column align-items-center ps-3"
                                                            style={{ cursor: 'grab' }}
                                                        >
                                                            <i className="bi bi-arrow-bar-up"></i>
                                                            <i className="bi bi-grip-horizontal"></i>
                                                            <label className="fs-1">{refeicao.sequencia_refeicao}</label>
                                                            <i className="bi bi-arrow-bar-down"></i>
                                                        </div>
                                                        
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${index}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse${index}`}>
                                                            {refeicao.nome_refeicao}
                                                        </button>
                                                    </div>

                                                    <div id={`panelsStayOpen-collapse${index}`} className="accordion-collapse collapse">
                                                        <div className="accordion-body row g-3">
                                                            <div className="d-flex align-items-center justify-content-between border-bottom border-dark">
                                                                <EditableText
                                                                    key={refeicao.key}
                                                                    text={refeicao.nome_refeicao}
                                                                    onUpdate={(newName) => updateNomeSessao(refeicao.key, newName)}
                                                                />

                                                                <button className="btn btn-danger btn-sm"
                                                                    onClick={(e) => { e.preventDefault(); removeRefeicao(index); }}
                                                                >
                                                                    <i className="bi bi-trash me-2"></i>
                                                                    Remover
                                                                </button>
                                                            </div>

                                                            <div className="d-flex flex-column">
                                                                <ListaRefeicoes
                                                                    alimentos={refeicao?.alimentos}
                                                                    indexRefeicao={index}
                                                                    updateRefeicao={updateRefeicao}
                                                                    setWaitAlimento={setWaitAlimento}
                                                                    waitAlimento={waitAlimento}
                                                                />

                                                                <button onClick={e => { e.preventDefault(); setWaitAlimento({ ...refeicao, index }); }} className='btn btn-sm btn-outline-info rounded-3 mt-3 mb-3'>
                                                                    <i className="bi bi-plus-circle me-2"></i>
                                                                    Adicionar Alimento
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
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}

function ListaRefeicoes({ alimentos, indexRefeicao, updateRefeicao, setWaitAlimento, waitAlimento }) {

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Se não houver destino válido, sai da função
        if (!destination) return;

        // Rearranjar a lista
        const reorderedExercicios = Array.from(alimentos);
        const [removed] = reorderedExercicios.splice(source.index, 1);
        reorderedExercicios.splice(destination.index, 0, removed);

        // Atualizar o campo `sequencia_sessao_exercicio` de acordo com a nova ordem
        const updatedExercicios = reorderedExercicios.map((item, index) => ({
            ...item,
            sequencia_refeicao_alimento: index + 1
        }));

        updateRefeicao(updatedExercicios, indexRefeicao);
    };

    const updateField = (idx, campo, valor) => {
        const excs = Array.from(alimentos);
        var updatedExercicios;
        updatedExercicios = excs.map((item, id) => idx == id ? { ...item, [campo]: valor } : { ...item });
        updateRefeicao(updatedExercicios, indexRefeicao);
    }

    const remove = (index) => {
        // Remove o item pelo índice
        const reorderedExercicios = Array.from(alimentos);
        reorderedExercicios.splice(index, 1);

        // Reordena o campo `sequencia_sessao_exercicio` após a remoção
        const updatedExercicios = reorderedExercicios.map((item, idx) => ({
            ...item,
            sequencia_refeicao_alimento: idx + 1,
        }));

        updateRefeicao(updatedExercicios, indexRefeicao);
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercicioList">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {alimentos.map((alimento, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    // {...provided.dragHandleProps}
                                    className={`d-flex flex-row align-items-center border-bottom p-2 bg-light gap-2`}
                                    // style={exercicio.sets?.length > 0 ? { borderLeft: '0.30rem solid', borderRight: '0.30rem solid' } : {}}
                                >
                                    <div
                                        {...provided.dragHandleProps}
                                        className="me-2 d-flex flex-column align-items-center"
                                        style={{ cursor: 'grab' }}
                                    >
                                        <i className="bi bi-arrow-bar-up"></i>
                                        <i className="bi bi-grip-horizontal"></i>
                                        <label>{alimento.sequencia_refeicao_alimento}</label>
                                        <i className="bi bi-arrow-bar-down"></i>
                                    </div>

                                    <div>
                                        <div className="d-flex flex-column border-info border-bottom p-2 bg-light">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <label>{alimento.nome_alimento}</label>

                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={(e) => { e.preventDefault(); remove(index); }}
                                                >
                                                    <i className="bi bi-trash me-2"></i>Remover
                                                </button>
                                            </div>

                                            <div className="d-flex gap-1">
                                                <div className="form-floating">
                                                    <input id="quantidadeInput" value={alimento.quantidade_refeicao_alimento} onChange={e => updateField(index, 'quantidade_refeicao_alimento', e.target.value)} className="form-control form-control-sm" placeholder="Quantidade"/>
                                                    <label htmlFor="quantidadeInput">Quantidade</label>
                                                </div>
                                                <div className="form-floating">
                                                    <input type="time" id="horarioInput" value={alimento.horario_refeicao_alimento} onChange={e => updateField(index, 'horario_refeicao_alimento', e.target.value)} className="form-control form-control-sm" placeholder="Séries"/>
                                                    <label htmlFor="horarioInput">Horário</label>
                                                </div>
                                                <div className="form-floating">
                                                    <input id="observacaoInput" value={alimento.observacao_refeicao_alimento} onChange={e => updateField(index, 'observacao_refeicao_alimento', e.target.value)} className="form-control form-control-sm" placeholder="Observação"/>
                                                    <label htmlFor="observacaoInput">Observação</label>
                                                </div>
                                            </div>
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

export default CadCardapio;