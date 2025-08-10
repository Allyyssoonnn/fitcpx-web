import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { generateTreino, getArticulacoes, getExerciciosResistencias, getGrupoExercicios, getIndicacoes, getPadraoesMovimentos, getTipoExercicios } from "../../api/treino";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../../states/states";
import { toast } from "react-toastify";
import MultiSelect from "../ui/multiselect";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MultipleSelector from "../ui/multiselect";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

function GerarTreino({ setSessoes, indexSessao }) {

    function adicionarSessaoGerada(sessao) {
        setSessoes(prevSessoes => prevSessoes.map((s, i) => i == indexSessao ? { ...s, exercicios: sessao } : s));
        // setShow(false);
    }

    return (
        <Dialog >
            <DialogTrigger>
                {screen.width > 766 ? (
                    <button type="button" className="btn btn btn-info rounded mx-2">
                        <i className="bi bi-lightbulb" />
                    </button>
                ) : (
                    <a type="button" className="d-flex align-items-center gap-2 btn btn-sm btn-outline-info rounded mb-1">
                        <i className="bi bi-lightbulb" />
                        <p className="mb-0">Treino inteligente</p>
                    </a>
                )}
            </DialogTrigger>
            {/* <ModalGerarTreino show={show} close={() => setShow(false)} adicionarSessaoGerada={adicionarSessaoGerada} /> */}

            <DialogContent className="!max-w-[800px] sm:!max-w-[50vw] w-full">
                <DialogTitle className="fs-5 text-black"><span className="text-muted">[BETA TESTE]</span> - Prescrição inteligente</DialogTitle>

                <Filters adicionarSessaoGerada={adicionarSessaoGerada} />
            </DialogContent>
        </Dialog>
    )
}

function Filters({ adicionarSessaoGerada }) {
    const { nLoading, endLoading } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);

    const [pageShow, setPageShow] = useState('Grupos');
    const [aquecimento, setAquecimento] = useState([{
        label: "Aquecimento",
        cod_padrao_movimento: 2,
        cod_tipo_exercicio: 2,
        cod_exercicio_resistencia: 2,
        cod_indicacao: 2,
        cod_articulacao: 2,
        volume: 2,
        qtd_exercicios: 2
    }]);
    const [gruposSelecionados, setGruposSelecionados] = useState([]);
    const [indicacoesSelecionadas, setIndicacoesSelecionadas] = useState([]);

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

    const { data: articulacoes } = useQuery({
        queryKey: ['articulacoes', usuario.cod_empresa],
        queryFn: () => getArticulacoes(usuario.cod_empresa),
        initialData: [],
    });

    const { data: padraoMovimentos } = useQuery({
        queryKey: ['padraoMovimentos', usuario.cod_empresa],
        queryFn: () => getPadraoesMovimentos(usuario.cod_empresa),
        initialData: [],
    });

    const { data: resistencias } = useQuery({
        queryKey: ['resistencias', usuario.cod_empresa],
        queryFn: () => getExerciciosResistencias(usuario.cod_empresa),
        initialData: [],
    });

    const { data: tipo_exercicios } = useQuery({
        queryKey: ['tipo_exercicios', usuario.cod_empresa],
        queryFn: () => getTipoExercicios(usuario.cod_empresa),
        initialData: [],
    });

    function updateGroup(obj, field, value) {
        setGruposSelecionados(prevState => prevState.map((group) => group.value === obj.value ? { ...group, [field]: value } : group));
    }

    function updateAquecimento(obj, field, value) {
        setAquecimento(prevState => prevState.map((group) => group.value === obj.value ? { ...group, [field]: value } : group));
    }

    async function submitWorkout() {
        if (!gruposSelecionados.length) {
            toast.error('Nenhum grupo selecionado!');
            return;
        }

        nLoading('Carregando...', 'Aguarde estamos processando.');

        const sessao = await generateTreino({
            gruposSelecionados,
            indicacoesSelecionadas,
            aquecimento,
            // equipamentosSelecionados,
            // desenvolvimento,
            // duracao,
        });

        if (sessao) adicionarSessaoGerada(sessao);
        endLoading();
        close();
    }

    return (
        <form onSubmit={submitWorkout}>
            <div className="d-flex justify-content-between align-items-center">
                <label className="form-label">Grupos</label>
                <label>{gruposSelecionados?.length}/5</label>
            </div>

            <MultipleSelector
                value={gruposSelecionados}
                options={grupos.map((grupo, index) => ({ label: grupo.nome_grupo_exercicio, value: grupo.cod_grupo_exercicio }))}
                onChange={(selected) => setGruposSelecionados(selected.map((group) => ({
                    ...group,
                    cod_padrao_movimento: 2,
                    cod_tipo_exercicio: 2,
                    cod_exercicio_resistencia: 2,
                    cod_indicacao: 2,
                    cod_articulacao: 2,
                    volume: group.volume || 2,
                    qtd_exercicios: group.qtd_exercicios || 2
                })))}
                placeholder="Selecione os grupos de exercícios"
                emptyIndicator={<p className="text-center text-sm">Nenhum grupo disponível</p>}
                commandProps={{
                    label: "Selecione grupos de exercícios",
                }}
                maxSelected={5}
                hidePlaceholderWhenSelected
                onMaxSelected={() => toast.error('Máximo de 5 grupos selecionados')}
            />

            <div className="d-flex justify-content-between align-items-center mt-3">
                <label className="form-label">Indicações</label>
                <label>{indicacoesSelecionadas?.length}/3</label>
            </div>

            <MultiSelect
                value={indicacoesSelecionadas}
                options={indicacoes.map((indicacao, index) => ({ label: indicacao.nome_indicacao, value: indicacao.cod_indicacao }))}
                onChange={setIndicacoesSelecionadas}
                placeholder="Selecione as indicações"
                emptyIndicator={<p className="text-center text-sm">Nenhuma indicação disponível</p>}
                maxSelected={5}
                hidePlaceholderWhenSelected
                onMaxSelected={() => toast.error('Máximo de 3 indicações selecionadas')}
            />

            <ToggleGroup type="single" variant="outline" size="lg" value={pageShow} onValueChange={setPageShow} className="mt-3">
                <ToggleGroupItem value="Aquecimento" className="px-3">Aquecimento</ToggleGroupItem>
                <ToggleGroupItem value="Grupos" className="px-3">Grupos</ToggleGroupItem>
            </ToggleGroup>

            {pageShow === "Grupos" && (
                <CardEditor
                    gruposSelecionados={gruposSelecionados}
                    updateGroup={updateGroup}
                    articulacoes={articulacoes}
                    padraoMovimentos={padraoMovimentos}
                    resistencias={resistencias}
                    tipo_exercicios={tipo_exercicios}
                />
            )}
            {pageShow === "Aquecimento" && (
                <CardEditor
                    gruposSelecionados={aquecimento}
                    updateGroup={updateAquecimento}
                    articulacoes={articulacoes}
                    padraoMovimentos={padraoMovimentos}
                    resistencias={resistencias}
                    tipo_exercicios={tipo_exercicios}
                />
            )}

            <DialogFooter className="mt-3 justify-content-between d-flex">
                <DialogClose>
                    <button type="button" className="btn btn-danger">Fechar</button>
                </DialogClose>
                <button type="submit" className="btn btn-success">Gerar Treino</button>
            </DialogFooter>
        </form>
    )
}

function CardEditor({ gruposSelecionados, updateGroup, articulacoes, padraoMovimentos, resistencias, tipo_exercicios }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const current = gruposSelecionados[currentIndex];

    if (!current) return <p className="text-muted text-center mt-3">Nenhum grupo selecionado</p>;

    const handleChange = (field) => (value) => updateGroup(current, field, value);

    return (
        <div className="mt-4 p-4 border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold">{current.label}</h5>
                <span className="text-muted">{currentIndex + 1}/{gruposSelecionados.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <SelectInput label="Volume" value={current.volume} onChange={handleChange("volume")} options={Array.from({ length: 20 }, (_, i) => i + 1)} />
                <SelectInput label="Qtd. Exercícios" value={current.qtd_exercicios} onChange={handleChange("qtd_exercicios")} options={Array.from({ length: 20 }, (_, i) => i + 1)} />
                <SelectInput label="Articulação" value={current.cod_articulacao} onChange={handleChange("cod_articulacao")} options={articulacoes.map(a => ({ label: a.nome_articulacao, value: a.cod_articulacao }))} />
                <SelectInput label="Padrão de movimento" value={current.cod_padrao_movimento} onChange={handleChange("cod_padrao_movimento")} options={padraoMovimentos.map(p => ({ label: p.nome_padrao_movimento, value: p.cod_padrao_movimento }))} />
                <SelectInput label="Resistência" value={current.cod_exercicio_resistencia} onChange={handleChange("cod_exercicio_resistencia")} options={resistencias.map(r => ({ label: r.nome_exercicio_resistencia, value: r.cod_exercicio_resistencia }))} />
                <SelectInput label="Tipo de Exercício" value={current.cod_tipo_exercicio} onChange={handleChange("cod_tipo_exercicio")} options={tipo_exercicios.map(t => ({ label: t.nome_tipo_exercicio, value: t.cod_tipo_exercicio }))} />
            </div>

            {gruposSelecionados?.length > 1 && (
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="outline"
                        onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
                    >
                        ← Anterior
                    </Button>

                    <Button variant="outline"
                        onClick={() => setCurrentIndex((i) => Math.min(gruposSelecionados.length - 1, i + 1))} disabled={currentIndex === gruposSelecionados.length - 1}
                    >
                        Próximo →
                    </Button>
                </div>
            )}
        </div>
    );
}

function SelectInput({ label, value, onChange, options }) {
    return (
        <div>
            <label className="form-label text-sm">{label}</label>
            
            <Select value={String(value)} onValueChange={onChange}>
                <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.value ?? opt} value={String(opt.value ?? opt)}>
                    {opt.label ?? opt}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
    );
}

// function ModalGerarTreino({ show, close, adicionarSessaoGerada }) {
//     const [usuario] = useRecoilState(stateUsuario);
//     const [duracao, setDuracao] = useState('01:00');
//     const [desenvolvimento, setDesenvolvimento] = useState("");
//     const [gruposSelecionados, setGruposSelecionados] = useState([]);
//     const [indicacoesSelecionados, setIndicacoesSelecionados] = useState([]);
//     const [equipamentosSelecionados, setEquipamentosSelecionados] = useState([]);
//     const [stepIndex, setStepIndex] = useState(0);
//     const [showPresets, setShowPresets] = useState(false);

//     useEffect(() => {
//         setGruposSelecionados([]);
//         setIndicacoesSelecionados([]);
//         setEquipamentosSelecionados([]);
//         setDuracao('01:00');
//         setDesenvolvimento('');
//     }, [show]);

//     const { data: grupos } = useQuery({
//         queryKey: ['grupos', usuario.cod_empresa],
//         queryFn: () => getGrupoExercicios(usuario.cod_empresa),
//         initialData: [],
//     });

//     const { data: indicacoes } = useQuery({
//         queryKey: ['indicacoes', usuario.cod_empresa],
//         queryFn: () => getIndicacoes(usuario.cod_empresa),
//         initialData: [],
//     });

//     const { data: equipamentos } = useQuery({
//         queryKey: ['equipamentos', usuario.cod_empresa],
//         queryFn: () => getEquipamentos(usuario.cod_empresa),
//         initialData: [],
//     });

//     async function confirmaTreino() {
//         if (desenvolvimento == '') {
//             toast.error('Desenvolvimento não selecionado!');
//             return;
//         }

//         if (!gruposSelecionados.length) {
//             toast.error('Nenhum grupo selecionado!');
//             return;
//         }

//         Swal.fire({
//             title: "Carregando...",
//             text: "Aguarde",
//             allowOutsideClick: false,
//             didOpen: () => {
//                 Swal.showLoading();
//             },
//         });

//         const sessao = await generateTreino({
//             gruposSelecionados,
//             indicacoesSelecionados,
//             equipamentosSelecionados,
//             desenvolvimento,
//             duracao,
//         });

//         if (sessao) adicionarSessaoGerada(sessao);
//         Swal.close();
//         close();
//         setStepIndex(0);
//     }

//     function carregaPreset(preset) {
//         setShowPresets(false);
//         setGruposSelecionados(preset?.gruposSelecionados ?? []);
//         setIndicacoesSelecionados(preset?.indicacoesSelecionados ?? []);
//         setEquipamentosSelecionados(preset?.equipamentosSelecionados ?? []);
//         setDesenvolvimento(preset?.desenvolvimento ?? '');
//         setDuracao(preset?.duracao ?? '01:00');
//     }

//     const tooltip = (
//         <Tooltip id="tooltip">
//             <div>Com base na sua necessidade, criaremos um treino personalizado, ajustando o volume conforme desejado e garantindo o cumprimento de todas as exigências aplicadas.</div>
//         </Tooltip>
//     );

//     function atualizaSerie(index, series) {
//         setGruposSelecionados(prevState => prevState.map((grupo, i) => index == i ? { ...grupo, series: series } : grupo));
//     }

//     return (
//         <Modal show={show} className="modal-fade">
//             <div className="modal-header d-flex justify-content-between">
//                 <h5 className="modal-title">[Beta teste] - Precrição de Treino inteligente</h5>
                
//                 <OverlayTrigger placement="bottom" overlay={tooltip}>
//                     <i 
//                         className="bi bi-info-circle ms-2 text-primary"
//                         style={{ cursor: 'pointer' }}
//                     ></i>
//                 </OverlayTrigger>
//             </div>

//             <Presets
//                 show={showPresets}
//                 gruposSelecionados={gruposSelecionados}
//                 indicacoesSelecionados={indicacoesSelecionados}
//                 equipamentosSelecionados={equipamentosSelecionados}
//                 carregaPreset={carregaPreset}
//                 setShowPresets={setShowPresets}
//                 desenvolvimento={desenvolvimento}
//                 duracao={duracao}
//             />

//             <MultiSteps indexStep={stepIndex} className={`${showPresets ? 'd-none' : ''}`}>
//                 <Step name='Volume'>
//                     <MultiSelect
//                         options={grupos}
//                         name='Grupos de exercícios'
//                         chavePesquisa='nome_grupo_exercicio'
//                         valueChave='cod_grupo_exercicio'
//                         state={gruposSelecionados}
//                         setState={setGruposSelecionados}
//                     />

//                     <div>
//                         {gruposSelecionados.map((grupo, index) => (
//                             <div className="mt-2" key={index}>
//                                 <label className="form-label">{grupo.nome_grupo_exercicio}</label>
//                                 <input value={grupo?.series} onChange={e => atualizaSerie(index, e.target.value)} className="form-control" placeholder="Séries" />
//                             </div>
//                         ))}
//                     </div>
//                 </Step>

//                 <Step name='Detalhes'>
//                     <div>
//                         <label className="form-label fw-bold">Desenvolvimento</label>
//                         <select value={desenvolvimento} onChange={e => setDesenvolvimento(e.target.value)} className="form-control">
//                             <option value="" disabled hidden>Clique para selecionar</option>
//                             <option value="Força">Força</option>
//                             <option value="Hipertrofia">Hipertrofia</option>
//                             <option value="Resistência">Resistência</option>
//                         </select>
//                     </div>

//                     <MultiSelect
//                         className='mt-2'
//                         options={indicacoes}
//                         name='Indicações'
//                         chavePesquisa='nome_indicacao'
//                         valueChave='cod_indicacao'
//                         state={indicacoesSelecionados}
//                         setState={setIndicacoesSelecionados}
//                     />

//                     <MultiSelect
//                         className='mt-2'
//                         options={equipamentos}
//                         name='Excluir equipamentos'
//                         chavePesquisa='nome_equipamento'
//                         valueChave='cod_equipamento'
//                         state={equipamentosSelecionados}
//                         setState={setEquipamentosSelecionados}
//                     />

//                     <div className="mt-2">
//                         <label className="form-label">Tempo de treino</label>
//                         <input value={duracao} onChange={e => setDuracao(e.target.value)} type="time" className="form-control" placeholder="01:00:00" />
//                     </div>
//                 </Step>
//             </MultiSteps>

//             <div className="modal-footer justify-content-center">
//                 <button onClick={() => setShowPresets(true)} className={`btn btn-outline-warning rounded ${showPresets ? 'd-none' : ''}`}>Presets</button>

//                 {!showPresets && (
//                     <>
//                         {stepIndex > 0 ? (
//                             <button className="btn btn-primary rounded" onClick={() => setStepIndex(stepIndex - 1)}>Voltar</button>
//                         ) : (
//                             <button onClick={close} className="btn btn-danger rounded">Fechar</button>
//                         )}
//                         {stepIndex < 1 ? (
//                             <button className="btn btn-primary rounded" onClick={() => setStepIndex(stepIndex + 1)}>Próximo</button>
//                         ) : (
//                             <button onClick={confirmaTreino} className="btn btn-success rounded">Confirmar</button>
//                         )}
//                     </>
//                 )}
//             </div>
//         </Modal>
//     );
// }

// function Presets({ show, gruposSelecionados, indicacoesSelecionados, equipamentosSelecionados, carregaPreset, setShowPresets, desenvolvimento, duracao }) {
//     const [empresa, setempresa] = useRecoilState(stateEmpresa);
//     const [presets, setPresets] = useState([]);
//     const [nomePreset, setNomePreset] = useState('');

//     useEffect(() => {
//         (async function load() {
//             const resp = await getEmpresa(empresa.cod_empresa);
//             if (resp) setempresa(resp);
//         })
//     }, []);

//     useEffect(() => {
//         if (empresa?.presets_treino_inteligente) setPresets(JSON.parse(empresa.presets_treino_inteligente));
//     }, [empresa, show]);
    
//     async function enviarPresets() {
//         const presetJSON = JSON.stringify(presets);

//         if (empresa.cod_empresa) {
//             const empresaAtualizada = { ...empresa, presets_treino_inteligente: presetJSON };
//             await setEmpresa(empresaAtualizada);
//             setempresa(empresaAtualizada);
//         } else toast.error('Erro ao salvar preset!');
//         setShowPresets(false);
//     }

//     function salvarNovoPreset() {
//         if (!nomePreset.length) {
//             toast.error('Nome não informado!');
//             return;
//         }
//         setPresets(prevPresets => ([ ...prevPresets, { nome_preset: nomePreset, gruposSelecionados, indicacoesSelecionados, equipamentosSelecionados, desenvolvimento, duracao } ]))
//         setNomePreset('');
//     }

//     function removerPreset(index) {
//         Swal.fire({
//             title: 'Tem certeza?',
//             text: `Tem certeza que deseja remover o preset?`,
//             icon: "warning",
//             showCancelButton: true,
//             cancelButtonText: 'Cancelar',
//             confirmButtonText: "Confirmar",
//             reverseButtons: true,
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 const novoPresets = presets.filter((preset, i) => index !== i);
//                 setPresets(novoPresets);
//             }
//         })
//     }

//     function atualizaNomePreset(index, nome) {
//         setPresets(prevPresets => prevPresets.map((preset, i) => i == index ? { ...preset, nome_preset: nome } : preset));
//     }

//     function carregarPreset(index) {
//         if (presets[index]) carregaPreset(presets[index]);
//     }

//     return (<>
//         <div className={`${show ? '' : 'd-none'} p-3`}>
//             <div className="d-flex align-items-center gap-2">
//                 <div className="form-floating w-100">
//                     <input className="form-control" placeholder="Nome do preset" value={nomePreset} onChange={e => setNomePreset(e.target.value)} />
//                     <label className="form-label">Nome do preset</label>
//                 </div>

//                 <button className="btn btn-outline-info rounded" onClick={salvarNovoPreset}>Salvar</button>
//             </div>

//             <ul className="p-3 mt-3">
//                 {!presets.length && (<label className="text-muted text-center w-100">Nenhum preset foi salvo</label>)}
//                 {presets.map((preset, index) => (
//                     <li key={index} className="d-flex justify-content-between border-start border-primary ps-1 mb-2">
//                         <EditableText
//                             key={index}
//                             text={preset.nome_preset}
//                             onUpdate={(newName) => atualizaNomePreset(index, newName)}
//                         />

//                         <div className="d-flex gap-2">
//                             <button className="btn btn-sm btn-outline-success" onClick={() => carregarPreset(index)}>Carregar</button>
//                             <button className="btn btn-sm btn-outline-danger" onClick={() => removerPreset(index)}>Remover</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//         <div className={`modal-footer justify-content-center ${show ? '' : 'd-none'}`}>
//             <button onClick={() => setShowPresets(false)} className='btn btn-outline-danger rounded'>Voltar</button>
//             <button onClick={enviarPresets} className='btn btn-outline-success rounded'>Salvar</button>
//         </div>
//     </>);
// }

export default GerarTreino;