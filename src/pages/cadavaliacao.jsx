import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Tab, Tabs } from "react-bootstrap";
import { stateUsuario } from "../states/usuario";
import { useRecoilState } from "recoil";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function CadAvaliacao() {
    const { handleSubmit, register, setValue, getFieldState } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);
    const avaliacaoRecebida = location.state?.avaliacao;

    const [isListening, setIsListening] = useState(false);
    const [activeTab, setActiveTab] = useState("perimetro");
    const [perimetros, setPerimetros] = useState(perimetroFields);

    const [isEditable, setIsEditable] = useState(false);
    const [isEditingEnabled, setIsEditingEnabled] = useState(false); 

    useEffect(() => {
        setValue("cod_usuario", usuario?.cod_usuario);

        if (avaliacaoRecebida) {
            Object.keys(avaliacaoRecebida).forEach((key) => {
                setValue(key, avaliacaoRecebida[key]);
            });
        }
    }, [avaliacaoRecebida, setValue, usuario]);

    async function confirma(data) {
        // await setAvaliacaoFisica(data);
        navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
    }

    useEffect(() => {
        // Detecta se o navegador é compatível com SpeechRecognition
        const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        if (!isSupported) {
            alert('Seu navegador não suporta reconhecimento de fala.');
        }
    }, []);

    function processVoiceCommand(command) {
        const regex = /alterar\s(\w+)\spara\s(.*)/i;
        const match = command.match(regex);

        if (match) {
            const field = match[1].toLowerCase(); // O nome do campo (em minúsculo)
            const value = match[2]; // O valor a ser inserido
                        
            if (getFieldState(field)) {
                setValue(field, value);
                console.log(`Alterando ${field} para: ${value}`);
            } else {
                alert('Campo não encontrado!');
            }
        } else {
            alert('Comando inválido. Tente algo como "Alterar peso para 70"');
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

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Comando reconhecido:', transcript);
            processVoiceCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de fala:', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const updatedPerimetros = Array.from(perimetros);
        const [removed] = updatedPerimetros.splice(source.index, 1);
        updatedPerimetros.splice(destination.index, 0, removed);
        setPerimetros(updatedPerimetros);
    };

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

        recognition.onerror = (event) => {
            console.error("Erro no reconhecimento de voz:", event.error);
        };
    };

    return (
        <div className="container-fluid">
            <div className="card">
                <form className="card-body" onSubmit={handleSubmit(confirma)}>
                    <Button
                        href="javascript:history.back()"
                        className="btn btn-danger mb-3 me-3"
                    >
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </Button>

                    <button
                        type="button"
                        className="btn btn-info mb-3 me-3"
                        onClick={startListening}
                    >
                        <i className="bi bi-mic me-2"></i>
                        {isListening ? 'Ouvindo...' : 'Ativar Comando de Voz'}
                    </button>

                    <button
                        type="button"
                        className={`btn ${isEditingEnabled ? 'btn-warning' : 'btn-warning'} mb-3`}
                        onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                    >
                        <i className="bi bi-pen me-2"></i>
                        {isEditingEnabled ? 'Desativar edição' : 'Editar ordem'}
                    </button>

                    <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Data da Avaliação*</label>
                            <input
                                {...register("data_avaliacao", {
                                    required: "A data é obrigatória",
                                })}
                                type="date"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Peso (kg)*</label>
                            <input
                                {...register("peso", {
                                    required: "O peso é obrigatório",
                                })}
                                type="number"
                                step="0.1"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Altura (cm)*</label>
                            <input
                                {...register("altura", {
                                    required: "A altura é obrigatória",
                                })}
                                type="number"
                                step="0.1"
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
                        <Tab eventKey="perimetro" title={<><i className="bi bi-rulers me-2"></i>Perímetro</>}>
                            <div className="row g-3">
                                <DragDropContext onDragEnd={onDragEnd}>
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
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="col-md-4"
                                                            >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className={`${field.icon} me-2`}></i>
                                                                    <label className="form-label">{field.label}</label>
                                                                </div>
                                                                {/* <label className="form-label">{field.label}</label> */}
                                                                <div className="input-group">
                                                                    <input
                                                                        {...register(field.name)}
                                                                        type="number"
                                                                        step="0.1"
                                                                        className="form-control"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-success"
                                                                        onClick={() => startSpeechRecognition(field.name)}
                                                                    >
                                                                        <i className="bi bi-mic"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                        {/* {perimetros.map(({ label, name }) => (
                                            <div key={name} className="col-md-4">
                                                <label className="form-label">{label}</label>
                                                <input
                                                    {...register(name)}
                                                    type="number"
                                                    step="0.1"
                                                    className="form-control"
                                                />
                                            </div>
                                        ))} */}
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

            {/* <div className="col-md-6 table-wraper"> */}
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
            {/* </div> */}
        </div>
    )
}

const perimetroFields = [
    { name: 'pescoco', label: 'Pescoço (cm)', icon: 'bi bi-body' },
    { name: 'ombro', label: 'Ombro (cm)', icon: 'bi bi-rulers' },
    { name: 'torax_inspirado', label: 'Tórax inspirado (cm)', icon: 'bi bi-body' },
    { name: 'torax_expirado', label: 'Tórax expirado (cm)', icon: 'bi bi-body' },
    { name: 'peitoral', label: 'Peitoral (cm)', icon: 'bi bi-body' },
    { name: 'punho', label: 'Punho (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'cintura_escapular', label: 'Cintura escapular (cm)', icon: 'bi bi-rulers' },
    { name: 'cintura', label: 'Cintura (cm)', icon: 'bi bi-body' },
    { name: 'abdomen', label: 'Abdômen (cm)', icon: 'bi bi-body' },
    { name: 'quadril', label: 'Quadril (cm)', icon: 'bi bi-body' },
    { name: 'biestiloide_punho', label: 'Biestilóide punho (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'biepicondilo_femural', label: 'Biepicôndilo femural (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'braco_relaxado_direito', label: 'Braço relaxado direito (cm)', icon: 'bi bi-body' },
    { name: 'braco_relaxado_esquerdo', label: 'Braço relaxado esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_direito', label: 'Braço contraído direito (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_esquerdo', label: 'Braço contraído esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'antebraco_direito', label: 'Antebraço direito (cm)', icon: 'bi bi-rulers' },
    { name: 'antebraco_esquerdo', label: 'Antebraço esquerdo (cm)', icon: 'bi bi-rulers' },
    { name: 'coxa_direita', label: 'Coxa direita (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'coxa_esquerda', label: 'Coxa esquerda (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_direita', label: 'Panturrilha direita (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_esquerda', label: 'Panturrilha esquerda (cm)', icon: 'bi bi-shoe-prints' },
];

export default CadAvaliacao;