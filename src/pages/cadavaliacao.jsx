/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { OverlayTrigger, Tab, Tabs, Tooltip } from "react-bootstrap";
import { stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { sendAvaliacaoIMG, setAvaliacao } from "../api/aluno";
import { useQuery } from "react-query";
import { getProtocolos } from '../api/usuario';
import { calcularIdade, dataURLToBlob, preventForm } from "../utils";
import Imagens from "./cadAvaliacao/imagens";
import { toast } from "react-toastify";
import Dobras from "./cadAvaliacao/dobras";
import Perimetros from "./cadAvaliacao/perimetros";
import Diametros from "./cadAvaliacao/diametros";
import Bioimpedancia from "./cadAvaliacao/bioimpedancia";
import { useFormStore } from "../hooks/useFormStore";

function CadAvaliacao() {
    const { formData, setAvaliacaoForm } = useFormStore();
    const { handleSubmit, register, setValue, getValues, watch, reset, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const { data: protocolos, isLoading } = useQuery({
        queryKey: ['protocolo'],
        queryFn: () => getProtocolos(usuario.cod_usuario),
        initialData: [],
    });

    const [capturedImages, setCapturedImages] = useState({});
    const [imageDescriptions, setImageDescriptions] = useState({});
    const [deletedImages, setDeletedImages] = useState([]);
    const [aluno, setAluno] = useState();
    const [activeTab, setActiveTab] = useState("perimetros");
    const [metodoDobras, setMetodoDobras] = useState('normal');
    const [metodoPerimetro, setMetodoPerimetro] = useState('normal');
    const [tipoAvaliacao, setTipoAvaliacao] = useState('');
    const [isEditingEnabled, setIsEditingEnabled] = useState(false); 
    const [protocolo, setProtocolo] = useState(0);
    const [ocultarCampos, setOcultarCampos] = useState(false);

    const [cod_protocolo, tipo_avaliacao] = watch(['cod_protocolo', 'tipo_avaliacao']);

    useEffect(() => {
        if (cod_protocolo && cod_protocolo !== protocolo) setProtocolo(Number(cod_protocolo));
    }, [cod_protocolo]);

    useEffect(() => {
        if (tipo_avaliacao && tipo_avaliacao !== protocolo) setTipoAvaliacao(tipo_avaliacao);
    }, [tipo_avaliacao]);

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
            setProtocolo(avaliacaoRecebida.cod_protocolo);
            setTipoAvaliacao(avaliacaoRecebida.tipo_avaliacao);
            avaliacaoRecebida?.imagem?.map((img, index) => {
                setCapturedImages((prevImages) => ({
                    ...prevImages,
                    [index + 1]: img.url_imagem,
                }));
                setImageDescriptions((prevDescriptions) => ({
                    ...prevDescriptions,
                    [index + 1]: img.descricao_imagem,
                }));
            })
        } else {
            if (formData.avaliacao?.cod_aluno == alunoRecebido?.cod_aluno) {
                Object.keys(formData.avaliacao).forEach((key) => {
                    setValue(key, formData.avaliacao[key]);
                });
            }
        }
    }, [location, setValue, usuario]);
    
    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        if (avaliacaoRecebida) {
            Object.keys(avaliacaoRecebida).forEach((key) => {
                setValue(key, avaliacaoRecebida[key]);
            });   
        }
    }, [setValue, location]);

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
        // loadFromLocalStorage("perimetros", setPerimetros);
        // loadFromLocalStorage("perimetrosDireito", setPerimetrosDireito);
        // loadFromLocalStorage("perimetrosEsquerdo", setPerimetrosEsquerdo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const watched = watch();
    useEffect(() => {
        setAvaliacaoForm(watched);
    }, [JSON.stringify(watched)]);
    
    if (isLoading) return <></>;

    async function confirma(data) {
        var cancel = false;
        //Verifica se todas as imagens tem descrição
        Object.entries(capturedImages).forEach(([key, imageData]) => {
            if (!imageDescriptions[key]) {
                toast.error(`Adicionar descrição na imagem ${key}`);
                cancel = true;
            }
        });
        if (cancel) return;

        const av = await setAvaliacao(data);
        enviaImagens(data?.cod_avaliacao ?? av.cod_avaliacao);
        reset();
        navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
        useFormStore.getState().clearForm();
    }

    const enviaImagens = async (cod_avaliacao) => {
        if (!cod_avaliacao) return;
        const formData = new FormData();

        // Iterar sobre as imagens capturadas e adicioná-las ao FormData
        Object.entries(capturedImages).forEach(([key, imageData]) => {
            if (!imageData.includes('amazonaws.com')) {
                const imageBlob = dataURLToBlob(imageData);
                // const imageBlob = imageData;
                const fileSizeMB = (imageBlob.size / (1024 * 1024)).toFixed(2);
                formData.append('image', imageBlob, `[${imageDescriptions[key]}]_${key}(${fileSizeMB}).jpg`);
            }
        });

        try {
            const resp = await sendAvaliacaoIMG(formData, { cod_avaliacao, deletedImages: JSON.stringify(deletedImages) });
            resp.status ? console.log('Imagens enviadas com sucesso!') : console.error('Erro ao enviar as imagens:', resp.msg);
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const resetOrdering = () => {
        localStorage.removeItem('perimetros');
        localStorage.removeItem('perimetrosDireito');
        localStorage.removeItem('perimetrosEsquerdo');
        // setPerimetros(perimetroFields);
        // setPerimetrosDireito(perimetroDireitoFields);
        // setPerimetrosEsquerdo(perimetroEsquerdoFields);
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
            console.log('Comando reconhecido:', inputName, transcript);
            setValue(inputName, transcript); // Preenche o campo com o texto reconhecido
        };
        recognition.onerror = (event) => console.error("Erro no reconhecimento de voz:", event.error);
    };

    const tooltipErros = (
        <Tooltip id="tooltip">
            <div>
                {Object.keys(errors).length > 0 && (
                    <ul style={{ margin: 0, padding: '0 10px', listStyleType: 'disc' }}>
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>
                                {/* {error.message || `Erro no campo ${field}`} */}
                                {field}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Tooltip>
    );

    function clear() {
        reset();
        useFormStore.getState().clearForm();
        localStorage.removeItem('avaliacaoCache');
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>

                    {/* {activeTab === 'perimetros' && (
                        <button
                            type="button"
                            className={`btn ${isEditingEnabled ? 'btn-warning' : 'btn-warning'} mb-3 me-3`}
                            onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                        >
                            <i className="bi bi-pen me-2"></i>
                            {isEditingEnabled ? 'Desativar edição' : 'Editar ordem'}
                        </button>
                    )}

                    {(activeTab === 'perimetros' && isEditingEnabled) && (
                        <button
                            type="button"
                            className={`btn ${isEditingEnabled ? 'btn-danger' : 'btn-warning'} mb-3`}
                            onClick={resetOrdering}
                        >
                            <i className="bi bi-back me-2"></i>
                            Resetar ordenação
                        </button>
                    )} */}

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
                                <button className="dropdown-item" onClick={clear}>
                                    <i className="bi bi-trash me-3"></i>
                                    Limpar
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <form onKeyDown={preventForm} className="card-body" onSubmit={handleSubmit(confirma)}>
                    <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>
                    
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Aluno</label>
                            <input value={`${calcularIdade(aluno?.data_nascimento_aluno)} - Anos / ${aluno?.nome_aluno}`} disabled className="form-control" />
                        </div>

                        {isLoading ? (
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Protocolo *</label>
                                <label className="form-control">Carregando...</label>
                            </div>
                        ) : (
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Protocolo *</label>
                                <select id="select-protocol" {...register('cod_protocolo', { required: 'Protocolo necessário!' })} className="form-control">
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
                        )}

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo *
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: 'pointer' }}></i>
                                </OverlayTrigger>
                            </label>
                            <select id="select-type" disabled={!protocolo} {...register('tipo_avaliacao', { required: 'Tipo da avaliação necessário!' })} className="form-control">
                                <option value=''>Selecione um tipo</option>
                                <option value='simples'>Simples</option>
                                <option value='complexo'>Complexo</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Data da Avaliação *</label>
                            <input id="date" {...register("data_avaliacao", { required: "A data é obrigatória" })}
                                type="date"
                                className="form-control"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Peso (kg) *</label>
                            <input id="weight" {...register("peso", { required: "O peso é obrigatório" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Altura (m) *</label>
                            <input id="height" {...register("altura", { required: "A altura é obrigatória" })}
                                type="number"
                                step="0.01"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 m-1">
                        <div className="form-check">
                            <input value={ocultarCampos} onChange={e => setOcultarCampos(e.target.checked)} type="checkbox" className="form-check-input" id="ocultarCampos"/>
                            <label className="form-check-label" htmlFor="ocultarCampos">
                                Ocultar campos não obrigatórios
                            </label>
                            <OverlayTrigger placement="bottom" overlay={tooltipCampos}>
                                <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: 'pointer' }}></i>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <h5 className="card-title fw-semibold mb-4 mt-4">Avaliação</h5>
                    <h6 className={`text-danger ${protocolo ? 'd-none' : ''}`}>Selecione um protocolo</h6>

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="mb-3"
                    >
                        <Tab key='diametros' eventKey="diametros" title={<><i className="bi bi-arrows-angle-contract me-2"></i>Diametros</>}>
                            <Diametros
                                ocultarCampos={ocultarCampos}
                                register={register}
                                startSpeechRecognition={startSpeechRecognition}
                                tipoAvaliacao={tipoAvaliacao}
                            />
                        </Tab>

                        <Tab eventKey="bioimpedancia" title={<><i className="bi bi-activity me-2"></i>Bioimpedância</>}>
                            <Bioimpedancia
                                ocultarCampos={ocultarCampos}
                                register={register}
                                startSpeechRecognition={startSpeechRecognition}
                                tipoAvaliacao={tipoAvaliacao}
                            />
                        </Tab>

                        <Tab eventKey="dobras" title={<><i className="bi bi-arrows-collapse me-2"></i>Dobras cutâneas</>}>
                            <Dobras
                                getValues={getValues}
                                metodoDobras={metodoDobras}
                                ocultarCampos={ocultarCampos}
                                protocolo={protocolo}
                                register={register}
                                setMetodoDobras={setMetodoDobras}
                                setValue={setValue}
                                startSpeechRecognition={startSpeechRecognition}
                                tipoAvaliacao={tipoAvaliacao}
                                watch={watch}
                            />
                        </Tab>
                        
                        <Tab eventKey="perimetros" title={<><i className="bi bi-rulers me-2"></i>Perímetros</>}>
                            <Perimetros
                                getValues={getValues}
                                isEditingEnabled={isEditingEnabled}
                                metodoPerimetro={metodoPerimetro}
                                ocultarCampos={ocultarCampos}
                                // perimetros={perimetros}
                                // perimetrosDireito={perimetrosDireito}
                                // perimetrosEsquerdo={perimetrosEsquerdo}
                                register={register}
                                setMetodoPerimetro={setMetodoPerimetro}
                                setValue={setValue}
                                startSpeechRecognition={startSpeechRecognition}
                                tipoAvaliacao={tipoAvaliacao}
                                // setPerimetros={setPerimetros}
                                // setPerimetrosEsquerdo={setPerimetrosEsquerdo}
                                // setPerimetrosDireito={setPerimetrosDireito}
                                watch={watch}
                            />
                        </Tab>
                        
                        <Tab eventKey='imagens' title={<><i className="bi bi-camera me-2"></i>Imagens</>}>
                            <Imagens
                                capturedImages={capturedImages}
                                setCapturedImages={setCapturedImages}
                                imageDescriptions={imageDescriptions}
                                setImageDescriptions={setImageDescriptions}
                                deletedImages={deletedImages}
                                setDeletedImages={setDeletedImages}
                            />
                        </Tab>
                    </Tabs>

                    <div className="d-flex align-items-center mt-4 gap-3">
                        <OverlayTrigger placement="top" overlay={tooltipErros}>
                            <i className={`bi bi-exclamation-octagon ms-2 text-danger ${Object.keys(errors).length > 0 ? '' : 'd-none'}`} style={{ cursor: 'pointer' }}></i>
                        </OverlayTrigger>
                        
                        <button id="submit" disabled={isSubmitting} type="submit" className="btn btn-success">
                            <i className="bi bi-check me-2"></i>
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

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

const tooltipCampos = (
    <Tooltip id="tooltip">
        <div>
            <strong></strong> Marcar essa opção vai ocultar todos os campos não obrigatórios para o protocolo selecionado.
        </div>
    </Tooltip>
);

export default CadAvaliacao;