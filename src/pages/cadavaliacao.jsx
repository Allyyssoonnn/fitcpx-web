/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { OverlayTrigger, Tab, Tabs, Tooltip } from "react-bootstrap";
import { stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { setAvaliacao } from "../api/aluno";
import { useQuery } from "react-query";
import { getProtocolos } from '../api/usuario';

function CadAvaliacao() {
    const { handleSubmit, register, setValue, getFieldState, getValues, watch, reset } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const { data: protocolos } = useQuery({
        queryKey: ['protocolo', ],
        queryFn: () => getProtocolos(usuario.cod_usuario),
        initialData: [],
    });

    const formValues = watch();
    const [aluno, setAluno] = useState();
    const [isListening, setIsListening] = useState(false);
    const [activeTab, setActiveTab] = useState("perimetro");
    const [perimetros, setPerimetros] = useState(perimetroFields);
    const [perimetrosDireito, setPerimetrosDireito] = useState(perimetroDireitoFields);
    const [perimetrosEsquerdo, setPerimetrosEsquerdo] = useState(perimetroEsquerdoFields);
    const [metodoDobras, setMetodoDobras] = useState('normal');
    const [metodoPerimetro, setMetodoPerimetro] = useState('normal');
    const [isEditingEnabled, setIsEditingEnabled] = useState(false); 
    const [protocolo, setProtocolo] = useState("");

    const [restaurouCache, setRestaurouCache] = useState(false);

    //Trata configurações inicias como o carregamento da avaliação caso for uma edição
    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        const alunoRecebido = location.state?.aluno;
        setValue("cod_usuario", usuario?.cod_usuario);
        setValue("cod_aluno", alunoRecebido?.cod_aluno);
        if (alunoRecebido) setAluno(alunoRecebido);
        if (avaliacaoRecebida) {
            Object.keys(avaliacaoRecebida).forEach((key) => {
                setValue(key, avaliacaoRecebida[key]);
            });
            setProtocolo(avaliacaoRecebida.protocolo_dobras);
        }
    }, [location, setValue, usuario]);
    
    //Carrega o cache salvo caso necessário
    useEffect(() => {
        const avaliacaoCache = localStorage.getItem('avaliacaoCache');
        if (avaliacaoCache) {
            const cacheAvaliacaoObj = JSON.parse(avaliacaoCache);
            Object.keys(cacheAvaliacaoObj).forEach((key) => {
                setValue(key, cacheAvaliacaoObj[key]); // Restaura cada campo
            });
            setRestaurouCache(true);     
        }
    }, [setValue]);

    //Salva os campos em cache
    useEffect(() => {
        if (!formValues || !restaurouCache) return;
        localStorage.setItem('avaliacaoCache', JSON.stringify(formValues));
    }, [formValues, restaurouCache]);

    useEffect(() => {
        const loadFromLocalStorage = (key, setter) => {
            const savedData = localStorage.getItem(key);
            if (savedData) setter(JSON.parse(savedData));
        };

        // Detecta se o navegador é compatível com SpeechRecognition
        const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        if (!isSupported) {
            alert('Seu navegador não suporta reconhecimento de fala.');
        }
        loadFromLocalStorage("perimetros", setPerimetros);
        loadFromLocalStorage("perimetrosDireito", setPerimetrosDireito);
        loadFromLocalStorage("perimetrosEsquerdo", setPerimetrosEsquerdo);
    }, []);

    async function confirma(data) {
        await setAvaliacao(data);
        navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
    }

    function processVoiceCommand(command) {
        function normalizeString(str) {
            return str
            .normalize('NFD') // Normaliza para decompor os caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
            .replace(/\s+/g, '_') // Substitui espaços por underscores
            .toLowerCase(); // Converte para minúsculo
        }

        const regex = /alterar\s([a-zA-Z0-9_áéíóúãõ\s]+)\spara\s(.*)/i;
        const match = command.normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(regex);
        
        if (match) {
            const field = normalizeString(match[1]);
            const value = match[2];
    
            if (field === 'diametro_punho' && getFieldState('biestiloide_punho')) setValue('biestiloide_punho', value);
            if (field === 'diametro_umeral' && getFieldState('biepicondilo_umeral')) setValue('biepicondilo_umeral', value);
            if (field === 'diametro_femoral' && getFieldState('biepicondilo_femoral')) setValue('biepicondilo_femoral', value);
            
            // eslint-disable-next-line no-prototype-builtins
            if (getValues().hasOwnProperty(field)) {
                setValue(field, value);
                console.log(`Alterando ${field} para: ${value}`);
            } else {
                // alert('Campo não encontrado!');
            }
        } else {
            // alert('Comando inválido. Tente algo como "Alterar peso para 70"');
        }
    }

    function startListening() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Seu navegador não suporta a API de reconhecimento de fala.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;

        recognition.start();
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Comando reconhecido:', transcript);
            processVoiceCommand(transcript);
        };
        recognition.onerror = (event) => console.error('Erro no reconhecimento de fala:', event.error);
        recognition.onend = () => setIsListening(false);
    }

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        if (source.droppableId === "perimetros") {
            const updatedPerimetros = Array.from(perimetros);
            const [removed] = updatedPerimetros.splice(source.index, 1);
            updatedPerimetros.splice(destination.index, 0, removed);
            setPerimetros(updatedPerimetros);
            localStorage.setItem("perimetros", JSON.stringify(updatedPerimetros));
        } else if (source.droppableId === "perimetrosDireito") {
            const updatedPerimetros = Array.from(perimetrosDireito);
            const [removed] = updatedPerimetros.splice(source.index, 1);
            updatedPerimetros.splice(destination.index, 0, removed);
            setPerimetrosDireito(updatedPerimetros);
            localStorage.setItem("perimetrosDireito", JSON.stringify(updatedPerimetros));
        } else if (source.droppableId === "perimetrosEsquerdo") {
            const updatedPerimetros = Array.from(perimetrosEsquerdo);
            const [removed] = updatedPerimetros.splice(source.index, 1);
            updatedPerimetros.splice(destination.index, 0, removed);
            setPerimetrosEsquerdo(updatedPerimetros);
            localStorage.setItem("perimetrosEsquerdo", JSON.stringify(updatedPerimetros));
        }
    };

    const resetOrdering = () => {
        localStorage.removeItem('perimetros');
        localStorage.removeItem('perimetrosDireito');
        localStorage.removeItem('perimetrosEsquerdo');
        setPerimetros(perimetroFields);
        setPerimetrosDireito(perimetroDireitoFields);
        setPerimetrosEsquerdo(perimetroEsquerdoFields);
    }

    const startSpeechRecognition = (inputName) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Seu navegador não suporta a API de reconhecimento de fala.');
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";  // Defina o idioma, pode ser 'en-US' para inglês, 'pt-BR' para português
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Comando reconhecido:', transcript);
            setValue(inputName, transcript); // Preenche o campo com o texto reconhecido
        };
        recognition.onerror = (event) => console.error("Erro no reconhecimento de voz:", event.error);
    };

    const tooltip = (
        <Tooltip id="tooltip">
            <div>
                <strong>Simples:</strong> Será apresentado a distribuição corporal em gordura e massa magra, utilizando um menor número de medidas.
            </div>
            <p></p>
            <div>
                <strong>Complexo:</strong> Será detalhada a composição corporal em termos de gordura, músculo, osso e peso residual, utilizando um maior número de medidas.
            </div>
        </Tooltip>
    );

    const tooltipMetodo = (
        <Tooltip id="tooltip">
            <div>
                <strong>Normal:</strong> Apenas um campo para preencher medidas é liberado.
            </div>
            <p></p>
            <div>
                <strong>Média:</strong> É liberado 2 campos para informar 2 medidas, caso a diferença seja mais de 1mm é aberto o terceiro campo para média.
            </div>
        </Tooltip>
    );

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>

                    <button style={{ zIndex: 1050 }} className="btn btn-primary position-fixed bottom-0 end-0 m-3"
                        onClick={e => { e.preventDefault(); startListening(); }}
                    >
                        <i className="bi bi-mic me-2"></i>
                        {isListening ? 'Ouvindo...' : 'Ativar Comando de Voz'}
                    </button>

                    {activeTab === 'perimetro' && (
                        <button
                            type="button"
                            className={`btn ${isEditingEnabled ? 'btn-warning' : 'btn-warning'} mb-3 me-3`}
                            onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                        >
                            <i className="bi bi-pen me-2"></i>
                            {isEditingEnabled ? 'Desativar edição' : 'Editar ordem'}
                        </button>
                    )}

                    {(activeTab === 'perimetro' && isEditingEnabled) && (
                        <button
                            type="button"
                            className={`btn ${isEditingEnabled ? 'btn-danger' : 'btn-warning'} mb-3`}
                            onClick={resetOrdering}
                        >
                            <i className="bi bi-back me-2"></i>
                            Resetar ordenação
                        </button>
                    )}

                    <div className="dropdown">
                        <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-three-dots"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            <li>
                                <button className="dropdown-item" onClick={() => { reset(); localStorage.removeItem('avaliacaoCache'); }}>
                                    <i className="bi bi-trash me-3"></i>
                                    Limpar
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="card-body" onSubmit={handleSubmit(confirma)}>
                    <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>
                    
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Aluno</label>
                            <input value={aluno?.nome_aluno} disabled className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Protocolo *</label>
                            <select {...register('cod_protocolo', { required: 'Protocolo necessário!' })} className="form-control" onChange={e => setProtocolo(Number(e.target.value))}>
                                <option value="">Selecione um protocolo</option>
                                {Object.keys(protocolos).map(categoria => (
                                    <optgroup key={categoria} label={categoria}>
                                        {protocolos[categoria].map(protocolo => (
                                            <option key={protocolo.cod_protocolo} value={protocolo.cod_protocolo}>
                                                {protocolo.nome_protocolo}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo *
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <i 
                                        className="bi bi-info-circle ms-2 text-primary"
                                        style={{ cursor: 'pointer' }}
                                    ></i>
                                </OverlayTrigger>
                            </label>
                            <select {...register('tipo_avaliacao', { required: 'Tipo da avaliação necessário!' })} className="form-control" onChange={e => setProtocolo(Number(e.target.value))}>
                                <option value="simples">Simples</option>
                                <option value="Completo">Complexo</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Data da Avaliação *</label>
                            <input {...register("data_avaliacao", { required: "A data é obrigatória" })}
                                type="date"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Peso (kg) *</label>
                            <input {...register("peso", { required: "O peso é obrigatório" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Altura (cm) *</label>
                            <input {...register("altura", { required: "A altura é obrigatória" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Metabolismo basal</label>
                            <input {...register("metabolismo_basal", { required: "A altura é obrigatória" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Gordura viceral</label>
                            <input {...register("gordura_viceral", { required: "A altura é obrigatória" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <h5 className="card-title fw-semibold mb-4 mt-4">Avaliação</h5>

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="mb-3"
                    >
                        <Tab eventKey="dobras" title={<><i className="bi bi-rulers me-2"></i>Dobras cutâneas</>}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">
                                        Metódo

                                        <OverlayTrigger placement="bottom" overlay={tooltipMetodo}>
                                            <i
                                                className="bi bi-info-circle ms-2 text-primary"
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                        </OverlayTrigger>
                                    </label>
                                    <select value={metodoDobras} onChange={e => setMetodoDobras(e.target.value)} className="form-control">
                                        <option value='normal'>Normal</option>
                                        <option value='media'>Média</option>
                                    </select>
                                </div>

                                <h5 className="text-muted">Dobras</h5>

                                <Dobras protocolo={protocolo} metodoDobras={metodoDobras} register={register} setValue={setValue} startSpeechRecognition={startSpeechRecognition} />
                            </div>
                        </Tab>
                        
                        <Tab eventKey="perimetro" title={<><i className="bi bi-rulers me-2"></i>Perímetro</>}>
                            <div className="row g-3">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div className="col-md-3">
                                        <label className="form-label">
                                            Metódo
                                            <OverlayTrigger placement="bottom" overlay={tooltipMetodo}>
                                                <i
                                                    className="bi bi-info-circle ms-2 text-primary"
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                            </OverlayTrigger>    
                                        </label>
                                        <select value={metodoPerimetro} onChange={e => setMetodoPerimetro(e.target.value)} className="form-control">
                                            <option value='normal'>Normal</option>
                                            <option value='media'>Média</option>
                                        </select>
                                    </div>

                                    <h5 className="text-muted">Geral</h5>

                                    <Droppable droppableId="perimetros" isDropDisabled={!isEditingEnabled}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="row g-3"
                                            >
                                                {perimetros.map((field, index) => (
                                                    <Draggable key={field.name} draggableId={field.name} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className={`${field.icon} me-2`}></i>
                                                                    <label className="form-label">{field.label}</label>
                                                                </div>
                                                                <MediaInput
                                                                    campo1={field.name}
                                                                    register={register}
                                                                    setValue={setValue}
                                                                    startSpeechRecognition={startSpeechRecognition}
                                                                    metodo={metodoPerimetro}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    <h5 className="text-muted">Lado direito</h5>

                                    <Droppable droppableId="perimetrosDireito" isDropDisabled={!isEditingEnabled}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="row g-3"
                                            >
                                                {perimetrosDireito.map((field, index) => (
                                                    <Draggable key={field.name} draggableId={field.name} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className={`${field.icon} me-2`}></i>
                                                                    <label className="form-label">{field.label}</label>
                                                                </div>
                                                                <MediaInput
                                                                    campo1={field.name}
                                                                    register={register}
                                                                    setValue={setValue}
                                                                    startSpeechRecognition={startSpeechRecognition}
                                                                    metodo={metodoPerimetro}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    <h5 className="text-muted">Lado esquerdo</h5>

                                    <Droppable droppableId="perimetrosEsquerdo" isDropDisabled={!isEditingEnabled}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="row g-3"
                                            >
                                                {perimetrosEsquerdo.map((field, index) => (
                                                    <Draggable key={field.name} draggableId={field.name} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className={`${field.icon} me-2`}></i>
                                                                    <label className="form-label">{field.label}</label>
                                                                </div>
                                                                <MediaInput
                                                                    campo1={field.name}
                                                                    register={register}
                                                                    setValue={setValue}
                                                                    startSpeechRecognition={startSpeechRecognition}
                                                                    metodo={metodoPerimetro}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            <h5 className="card-title fw-semibold mt-5">* Referências *</h5>

                            <div className="d-flex flex-column flex-md-row justify-content-between">
                                <div className="flex-fill mb-4 mb-md-0 me-md-2">
                                    <TabReferencia1 />
                                </div>
                                <div className="flex-fill ms-md-2">
                                    <TabReferencia2 />
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="diametro" title={<><i className="bi bi-rulers me-2"></i>Diametro</>}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Biestilóide punho (cm)</label>
                                    <div className="input-group">
                                        <input {...register('biestiloide_punho')} type="number" step="0.1" className="form-control" />
                                        <button type="button" className="btn btn-outline-success" onClick={() => startSpeechRecognition('triciptal')}>
                                            <i className="bi bi-mic"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Biepicôndilo Umeral (cm)</label>
                                    <div className="input-group">
                                        <input {...register('biepicondilo_umeral')} type="number" step="0.1" className="form-control" />
                                        <button type="button" className="btn btn-outline-success" onClick={() => startSpeechRecognition('triciptal')}>
                                            <i className="bi bi-mic"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Biepicôndilo femoral (cm)</label>
                                    <div className="input-group">
                                        <input {...register('biepicondilo_femoral')} type="number" step="0.1" className="form-control" />
                                        <button type="button" className="btn btn-outline-success" onClick={() => startSpeechRecognition('triciptal')}>
                                            <i className="bi bi-mic"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>

                    <button type="submit" className="btn btn-success mt-4">
                        <i className="bi bi-check me-2"></i>
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    );
}

const Dobras = ({ protocolo, register, setValue, startSpeechRecognition, metodoDobras }) => {
    console.log(protocolo);
    
    //Evita uma renderização caso protocolo não esteja definido
    if (!protocolo) return <></>;
    console.log('Renderizou dobras' + metodoDobras + protocolo);    

    const protocolosCampos = {
        1: ["triciptal", "peitoral", "subescapular", "axilar_media", "abdominal", "coxa", "supra_iliaca", "supra_espinhal", "biciptal", "panturrilha"],
        2: ["triciptal", "peitoral", "subescapular", "axilar_media", "abdominal", "coxa", "supra_iliaca"],
        3: ["triciptal", "peitoral", "subescapular", "axilar_media", "abdominal", "coxa", "supra_iliaca"],
        4: ["peitoral", "abdominal", "coxa"],
        5: []
    };

    return (
        <>
            {[1, 2, 3, 4, 5].includes(protocolo) && (
                <>
                    {["triciptal", "peitoral", "subescapular", "axilar_media", "abdominal", "coxa", "supra_iliaca", "supra_espinhal", "biciptal", "panturrilha"]
                        .filter((campo) => protocolosCampos[protocolo]?.includes(campo))
                        .map((campo) => (
                            <div className="col-md-4" key={campo}>
                                <label className="form-label">{campo.replace("_", " ")} (mm)</label>
                                <MediaInput
                                    campo1={campo}
                                    register={register}
                                    setValue={setValue}
                                    startSpeechRecognition={startSpeechRecognition}
                                    metodo={metodoDobras}
                                />
                            </div>
                        ))
                    }
                </>
            )}
        </>
    )
}

const MediaInput = ({ campo1, register, setValue, startSpeechRecognition, metodo }) => {
    const [valor1, setValor1] = useState("");
    const [valor2, setValor2] = useState("");
    const [valor3, setValor3] = useState("");

    const [medirNovamente, setMedirNovamente] = useState(false);

    const [media, setMedia] = useState("");
  
    // Calcula a média quando os valores 1 ou 2 mudam
    useEffect(() => {
        if (metodo === "media" && valor1 && valor2) {
            setMedia(((parseFloat(valor1) + parseFloat(valor2)) / 2).toFixed(1));
            //Calcular aqui
            setValue(campo1, ((parseFloat(valor1) + parseFloat(valor2)) / 2).toFixed(1));

            const diff = Math.abs(parseFloat(valor1) - parseFloat(valor2));
            if (diff > 1 && valor3) {
                setValue(campo1, ((parseFloat(valor1) + parseFloat(valor2) + parseFloat(valor3)) / 3).toFixed(1));
                setMedia(((parseFloat(valor1) + parseFloat(valor2) + parseFloat(valor3)) / 3).toFixed(1));
            }
            setMedirNovamente(diff > 1);
        } else {
            setMedia(""); // Limpa a média se o método for normal
            setValue(campo1, "");
        }
    }, [valor1, valor2, valor3, metodo]);

    return (
        <div className="input-group">
            <div className="input-group">
                {/* Exibe dois campos de entrada se o método for 'media', ou um único campo caso contrário */}
                {metodo === "media" ? (
                    <>
                        <input type="number" step="0.1" className="form-control" value={valor1} onChange={(e) => setValor1(e.target.value)} />
                        <input type="number" step="0.1" className="form-control" value={valor2} onChange={(e) => setValor2(e.target.value)} />
                        {medirNovamente && (
                            <input type="number" step="0.1" className="form-control" value={valor3} onChange={(e) => setValor3(e.target.value)} />
                        )}
                        <input type="text" className="form-control bg-success" value={media} readOnly placeholder="Média" />
                    </>
                ) : (
                    <input {...register(campo1, { required: true })} type="number" step="0.1" className="form-control" value={valor1} onChange={(e) => setValor1(e.target.value)} />
                )}
                <input
                    {...register(campo1, { required: true })}
                    type="number"
                    step="0.1"
                    className='form-control d-none'
                    value={valor1} onChange={(e) => setValor1(e.target.value)}
                />

                {metodo === "normal" && (
                    <button type="button" className="btn btn-outline-success" onClick={() => startSpeechRecognition(campo1)}>
                        <i className="bi bi-mic"></i>
                    </button>
                )}
            </div>

            {medirNovamente && (
                <div id="mediahelp" className="form-text">3º medida necessária</div>
            )}
        </div>
    );
};

function TabReferencia1() {
    return (
        <div className="mt-4">
            <h6 className="fw-semibold">Tabela de Referência - RCQ (Razão Cintura-Quadril)</h6>
            <p>RCQ: Perímetro da cintura (cm) / Perímetro do quadril (cm)</p>

            {/* <div className="col-md-6 table-wraper"> */}
                <table style={{ fontSize: '0.7rem' }} className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Idade</th>
                            <th>Baixo</th>
                            <th>Moderado</th>
                            <th>Alto</th>
                            <th>Muito Alto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>20 a 29</td>
                            <td>&lt; 0.83%</td>
                            <td>0.83% a 0.88%</td>
                            <td>0.89% a 0.94%</td>
                            <td>&gt; 0.94%</td>
                        </tr>
                        <tr>
                            <td>30 a 39</td>
                            <td>&lt; 0.84%</td>
                            <td>0.84% a 0.91%</td>
                            <td>0.92% a 0.96%</td>
                            <td>&gt; 0.96%</td>
                        </tr>
                        <tr>
                            <td>40 a 49</td>
                            <td>&lt; 0.88%</td>
                            <td>0.88% a 0.95%</td>
                            <td>0.96% a 1.00%</td>
                            <td>&gt; 1.00%</td>
                        </tr>
                        <tr>
                            <td>50 a 59</td>
                            <td>&lt; 0.90%</td>
                            <td>0.90% a 0.96%</td>
                            <td>0.97% a 1.02%</td>
                            <td>&gt; 1.02%</td>
                        </tr>
                        <tr>
                            <td>60 a 69</td>
                            <td>&lt; 0.91%</td>
                            <td>0.91% a 0.98%</td>
                            <td>0.99% a 1.03%</td>
                            <td>&gt; 1.03%</td>
                        </tr>
                    </tbody>
                </table>
            {/* </div> */}
        </div>
    )
}

function TabReferencia2() {
    return (
        <div className="mt-4">
            <h6 className="fw-semibold">Tabela de Referência - RCQ (Razão Cintura-Quadril)</h6>
            <p>RCQ: Perímetro da cintura (cm) / Perímetro do quadril (cm)</p>

            <table style={{ fontSize: '0.7rem' }} className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Índice de Risco</th>
                        <th>Homens</th>
                        <th>Mulheres</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Baixo</td>
                        <td>&lt; 94cm</td>
                        <td>&lt; 80cm</td>
                    </tr>
                    <tr>
                        <td>Aumentado</td>
                        <td>94cm a 101cm</td>
                        <td>80cm a 87cm</td>
                    </tr>
                    <tr>
                        <td>Muito aumentado</td>
                        <td>&gt; 101cm</td>
                        <td>&gt; 87cm</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const perimetroFields = [
    { name: 'pescoco', label: 'Pescoço (cm)', icon: 'bi bi-body' },
    { name: 'ombro', label: 'Ombro (cm)', icon: 'bi bi-rulers' },
    { name: 'torax_inspirado', label: 'Tórax inspirado (cm)', icon: 'bi bi-body' },
    { name: 'torax_expirado', label: 'Tórax expirado (cm)', icon: 'bi bi-body' },
    { name: 'punho', label: 'Punho (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'cintura', label: 'Cintura (cm)', icon: 'bi bi-body' },
    { name: 'abdomen', label: 'Abdômen (cm)', icon: 'bi bi-body' },
    { name: 'quadril', label: 'Quadril (cm)', icon: 'bi bi-body' },
];

const perimetroDireitoFields = [
    { name: 'braco_relaxado_direito', label: 'Braço relaxado direito (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_direito', label: 'Braço contraído direito (cm)', icon: 'bi bi-body' },
    { name: 'antebraco_direito', label: 'Antebraço direito (cm)', icon: 'bi bi-rulers' },
    { name: 'coxa_direita', label: 'Coxa direita (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_direita', label: 'Panturrilha direita (cm)', icon: 'bi bi-shoe-prints' },
];

const perimetroEsquerdoFields = [
    { name: 'braco_relaxado_esquerdo', label: 'Braço relaxado esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_esquerdo', label: 'Braço contraído esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'antebraco_esquerdo', label: 'Antebraço esquerdo (cm)', icon: 'bi bi-rulers' },
    { name: 'coxa_esquerda', label: 'Coxa esquerda (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_esquerda', label: 'Panturrilha esquerda (cm)', icon: 'bi bi-shoe-prints' },
];

export default CadAvaliacao;