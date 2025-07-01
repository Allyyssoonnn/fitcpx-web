import { useEffect, useState } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import MultiSelect from "../multipleSelect";
import { useQuery } from "react-query";
import { generateTreino, getEquipamentos, getGrupoExercicios, getIndicacoes } from "../../api/treino";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { toast } from "react-toastify";
import { MultiSteps, Step } from "../multiStep";
import EditableText from "../editableText";
import Swal from "sweetalert2";
import { getEmpresa, setEmpresa } from "../../api/usuario";

function GerarTreino({ setSessoes, indexSessao, button = true }) {
    const [show, setShow] = useState(false);

    function openModal(e) {
        e.preventDefault();
        setShow(true);
    }

    function adicionarSessaoGerada(sessao) {
        setSessoes(prevSessoes => prevSessoes.map((s, i) => i == indexSessao ? { ...s, exercicios: sessao } : s));
        setShow(false);
    }

    return (
        <>
            <ModalGerarTreino show={show} close={() => setShow(false)} adicionarSessaoGerada={adicionarSessaoGerada} />
            {button ? (
                <button onClick={openModal} className="btn btn btn-info rounded mx-2">
                    <i className="bi bi-lightbulb" />
                </button>
            ) : (
                <a onClick={openModal} className="d-flex align-items-center gap-2 btn btn-sm btn-outline-info rounded mb-1">
                    <i className="bi bi-lightbulb" />
                    <p className="mb-0">Treino inteligente</p>
                </a>
            )}
        </>
    )
}

function ModalGerarTreino({ show, close, adicionarSessaoGerada }) {
    const [usuario] = useRecoilState(stateUsuario);
    const [duracao, setDuracao] = useState('01:00');
    const [desenvolvimento, setDesenvolvimento] = useState("");
    const [gruposSelecionados, setGruposSelecionados] = useState([]);
    const [indicacoesSelecionados, setIndicacoesSelecionados] = useState([]);
    const [equipamentosSelecionados, setEquipamentosSelecionados] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [showPresets, setShowPresets] = useState(false);

    useEffect(() => {
        setGruposSelecionados([]);
        setIndicacoesSelecionados([]);
        setEquipamentosSelecionados([]);
        setDuracao('01:00');
        setDesenvolvimento('');
    }, [show]);

    const { data: grupos } = useQuery({
        queryKey: ['grupos', usuario.cod_empresa],
        queryFn: () => getGrupoExercicios(usuario.cod_empresa),
        initialData: [],
    });

    const { data: indicacoes } = useQuery({
        queryKey: ['indicacoes', usuario.cod_empresa],
        queryFn: () => getIndicacoes(usuario.cod_empresa),
        initialData: [],
    });

    const { data: equipamentos } = useQuery({
        queryKey: ['equipamentos', usuario.cod_empresa],
        queryFn: () => getEquipamentos(usuario.cod_empresa),
        initialData: [],
    });

    async function confirmaTreino() {
        if (desenvolvimento == '') {
            toast.error('Desenvolvimento não selecionado!');
            return;
        }

        if (!gruposSelecionados.length) {
            toast.error('Nenhum grupo selecionado!');
            return;
        }

        Swal.fire({
            title: "Carregando...",
            text: "Aguarde",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const sessao = await generateTreino({
            gruposSelecionados,
            indicacoesSelecionados,
            equipamentosSelecionados,
            desenvolvimento,
            duracao,
        });

        if (sessao) adicionarSessaoGerada(sessao);
        Swal.close();
        close();
        setStepIndex(0);
    }

    function carregaPreset(preset) {
        setShowPresets(false);
        setGruposSelecionados(preset?.gruposSelecionados ?? []);
        setIndicacoesSelecionados(preset?.indicacoesSelecionados ?? []);
        setEquipamentosSelecionados(preset?.equipamentosSelecionados ?? []);
        setDesenvolvimento(preset?.desenvolvimento ?? '');
        setDuracao(preset?.duracao ?? '01:00');
    }

    const tooltip = (
        <Tooltip id="tooltip">
            <div>Com base na sua necessidade, criaremos um treino personalizado, ajustando o volume conforme desejado e garantindo o cumprimento de todas as exigências aplicadas.</div>
        </Tooltip>
    );

    function atualizaSerie(index, series) {
        setGruposSelecionados(prevState => prevState.map((grupo, i) => index == i ? { ...grupo, series: series } : grupo));
    }

    return (
        <Modal show={show} className="modal-fade">
            <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">[Beta teste] - Precrição de Treino inteligente</h5>
                
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <i 
                        className="bi bi-info-circle ms-2 text-primary"
                        style={{ cursor: 'pointer' }}
                    ></i>
                </OverlayTrigger>
            </div>

            <Presets
                show={showPresets}
                gruposSelecionados={gruposSelecionados}
                indicacoesSelecionados={indicacoesSelecionados}
                equipamentosSelecionados={equipamentosSelecionados}
                carregaPreset={carregaPreset}
                setShowPresets={setShowPresets}
                desenvolvimento={desenvolvimento}
                duracao={duracao}
            />

            <MultiSteps indexStep={stepIndex} className={`${showPresets ? 'd-none' : ''}`}>
                <Step name='Volume'>
                    <MultiSelect
                        options={grupos}
                        name='Grupos de exercícios'
                        chavePesquisa='nome_grupo_exercicio'
                        valueChave='cod_grupo_exercicio'
                        state={gruposSelecionados}
                        setState={setGruposSelecionados}
                    />

                    <div>
                        {gruposSelecionados.map((grupo, index) => (
                            <div className="mt-2" key={index}>
                                <label className="form-label">{grupo.nome_grupo_exercicio}</label>
                                <input value={grupo?.series} onChange={e => atualizaSerie(index, e.target.value)} className="form-control" placeholder="Séries" />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step name='Detalhes'>
                    <div>
                        <label className="form-label fw-bold">Desenvolvimento</label>
                        <select value={desenvolvimento} onChange={e => setDesenvolvimento(e.target.value)} className="form-control">
                            <option value="" disabled hidden>Clique para selecionar</option>
                            <option value="Força">Força</option>
                            <option value="Hipertrofia">Hipertrofia</option>
                            <option value="Resistência">Resistência</option>
                        </select>
                    </div>

                    <MultiSelect
                        className='mt-2'
                        options={indicacoes}
                        name='Indicações'
                        chavePesquisa='nome_indicacao'
                        valueChave='cod_indicacao'
                        state={indicacoesSelecionados}
                        setState={setIndicacoesSelecionados}
                    />

                    <MultiSelect
                        className='mt-2'
                        options={equipamentos}
                        name='Excluir equipamentos'
                        chavePesquisa='nome_equipamento'
                        valueChave='cod_equipamento'
                        state={equipamentosSelecionados}
                        setState={setEquipamentosSelecionados}
                    />

                    <div className="mt-2">
                        <label className="form-label">Tempo de treino</label>
                        <input value={duracao} onChange={e => setDuracao(e.target.value)} type="time" className="form-control" placeholder="01:00:00" />
                    </div>
                </Step>
            </MultiSteps>

            <div className="modal-footer justify-content-center">
                <button onClick={() => setShowPresets(true)} className={`btn btn-outline-warning rounded ${showPresets ? 'd-none' : ''}`}>Presets</button>

                {!showPresets && (
                    <>
                        {stepIndex > 0 ? (
                            <button className="btn btn-primary rounded" onClick={() => setStepIndex(stepIndex - 1)}>Voltar</button>
                        ) : (
                            <button onClick={close} className="btn btn-danger rounded">Fechar</button>
                        )}
                        {stepIndex < 1 ? (
                            <button className="btn btn-primary rounded" onClick={() => setStepIndex(stepIndex + 1)}>Próximo</button>
                        ) : (
                            <button onClick={confirmaTreino} className="btn btn-success rounded">Confirmar</button>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
}

function Presets({ show, gruposSelecionados, indicacoesSelecionados, equipamentosSelecionados, carregaPreset, setShowPresets, desenvolvimento, duracao }) {
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const [presets, setPresets] = useState([]);
    const [nomePreset, setNomePreset] = useState('');

    useEffect(() => {
        (async function load() {
            const resp = await getEmpresa(empresa.cod_empresa);
            if (resp) setempresa(resp);
        })
    }, []);

    useEffect(() => {
        if (empresa?.presets_treino_inteligente) setPresets(JSON.parse(empresa.presets_treino_inteligente));
    }, [empresa, show]);
    
    async function enviarPresets() {
        const presetJSON = JSON.stringify(presets);

        if (empresa.cod_empresa) {
            const empresaAtualizada = { ...empresa, presets_treino_inteligente: presetJSON };
            await setEmpresa(empresaAtualizada);
            setempresa(empresaAtualizada);
        } else toast.error('Erro ao salvar preset!');
        setShowPresets(false);
    }

    function salvarNovoPreset() {
        if (!nomePreset.length) {
            toast.error('Nome não informado!');
            return;
        }
        setPresets(prevPresets => ([ ...prevPresets, { nome_preset: nomePreset, gruposSelecionados, indicacoesSelecionados, equipamentosSelecionados, desenvolvimento, duracao } ]))
        setNomePreset('');
    }

    function removerPreset(index) {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Tem certeza que deseja remover o preset?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const novoPresets = presets.filter((preset, i) => index !== i);
                setPresets(novoPresets);
            }
        })
    }

    function atualizaNomePreset(index, nome) {
        setPresets(prevPresets => prevPresets.map((preset, i) => i == index ? { ...preset, nome_preset: nome } : preset));
    }

    function carregarPreset(index) {
        if (presets[index]) carregaPreset(presets[index]);
    }

    return (<>
        <div className={`${show ? '' : 'd-none'} p-3`}>
            <div className="d-flex align-items-center gap-2">
                <div className="form-floating w-100">
                    <input className="form-control" placeholder="Nome do preset" value={nomePreset} onChange={e => setNomePreset(e.target.value)} />
                    <label className="form-label">Nome do preset</label>
                </div>

                <button className="btn btn-outline-info rounded" onClick={salvarNovoPreset}>Salvar</button>
            </div>

            <ul className="p-3 mt-3">
                {!presets.length && (<label className="text-muted text-center w-100">Nenhum preset foi salvo</label>)}
                {presets.map((preset, index) => (
                    <li key={index} className="d-flex justify-content-between border-start border-primary ps-1 mb-2">
                        <EditableText
                            key={index}
                            text={preset.nome_preset}
                            onUpdate={(newName) => atualizaNomePreset(index, newName)}
                        />

                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-success" onClick={() => carregarPreset(index)}>Carregar</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removerPreset(index)}>Remover</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <div className={`modal-footer justify-content-center ${show ? '' : 'd-none'}`}>
            <button onClick={() => setShowPresets(false)} className='btn btn-outline-danger rounded'>Voltar</button>
            <button onClick={enviarPresets} className='btn btn-outline-success rounded'>Salvar</button>
        </div>
    </>);
}

export default GerarTreino;