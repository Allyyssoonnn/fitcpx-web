import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import MediaInput from "../../components/mediaInput";

function Perimetros({ metodoPerimetro, setMetodoPerimetro,
    isEditingEnabled, ocultarCampos, tipoAvaliacao, register, setValue, startSpeechRecognition, getValues, watch
}) {
    
    const onDragEnd = (result) => {
        // const { destination, source } = result;
        // if (!destination) return;

        // if (source.droppableId === "perimetros") {
        //     const updatedPerimetros = Array.from(perimetros);
        //     const [removed] = updatedPerimetros.splice(source.index, 1);
        //     updatedPerimetros.splice(destination.index, 0, removed);
        //     setPerimetros(updatedPerimetros);
        //     localStorage.setItem("perimetros", JSON.stringify(updatedPerimetros));
        // } else if (source.droppableId === "perimetrosDireito") {
        //     const updatedPerimetros = Array.from(perimetrosDireito);
        //     const [removed] = updatedPerimetros.splice(source.index, 1);
        //     updatedPerimetros.splice(destination.index, 0, removed);
        //     setPerimetrosDireito(updatedPerimetros);
        //     localStorage.setItem("perimetrosDireito", JSON.stringify(updatedPerimetros));
        // } else if (source.droppableId === "perimetrosEsquerdo") {
        //     const updatedPerimetros = Array.from(perimetrosEsquerdo);
        //     const [removed] = updatedPerimetros.splice(source.index, 1);
        //     updatedPerimetros.splice(destination.index, 0, removed);
        //     setPerimetrosEsquerdo(updatedPerimetros);
        //     localStorage.setItem("perimetrosEsquerdo", JSON.stringify(updatedPerimetros));
        // }
    };
        
    return (
        <div className="row g-3">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="col-md-3">
                    <label className="form-label">
                        Metódo
                        <OverlayTrigger placement="bottom" overlay={tooltipMetodo}>
                            <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: 'pointer' }}></i>
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
                                    {(provided) => {
                                        if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
                                        return (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                            <div className="d-flex align-items-center mb-2">
                                                <label className={`form-label ${perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? 'fw-bold' : ''}`}>
                                                    {field.label}{perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? '*' : ''}
                                                </label>
                                            </div>
                                            <MediaInput
                                                id={field.name}
                                                campo={field.name}
                                                register={register}
                                                setValue={setValue}
                                                startSpeechRecognition={startSpeechRecognition}
                                                metodo={metodoPerimetro}
                                                required={perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo'}
                                                defaultValue={getValues(field.name)}
                                                watch={watch}
                                            />
                                        </div>)
                                    }}
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
                                    {(provided) => {
                                        if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
                                        return (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                            <div className="d-flex align-items-center mb-2">
                                                <label className={`form-label ${perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? 'fw-bold' : ''}`}>
                                                    {field.label}{perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? '*' : ''}
                                                </label>
                                            </div>
                                            <MediaInput
                                                id={field.name}
                                                campo={field.name}
                                                register={register}
                                                setValue={setValue}
                                                startSpeechRecognition={startSpeechRecognition}
                                                metodo={metodoPerimetro}
                                                required={perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo'}
                                                defaultValue={getValues(field.name)}
                                                watch={watch}
                                            />
                                        </div>)
                                    }}
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
                                    {(provided) => {
                                        if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
                                        return (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="col-md-4" >
                                            <div className="d-flex align-items-center mb-2">
                                                <label className={`form-label ${perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? 'fw-bold' : ''}`}>
                                                    {field.label}{perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo' ? '*' : ''}
                                                </label>
                                            </div>
                                            <MediaInput
                                                id={field.name}
                                                campo={field.name}
                                                register={register}
                                                setValue={setValue}
                                                startSpeechRecognition={startSpeechRecognition}
                                                metodo={metodoPerimetro}
                                                required={perimetrosRequired.includes(field.name) && tipoAvaliacao === 'complexo'}
                                                defaultValue={getValues(field.name)}
                                                watch={watch}
                                            />
                                        </div>)
                                    }}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

const perimetrosRequired = ["braco_relaxado_direito", "coxa_direita", "panturrilha_direita"];

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

const perimetros = [
    { name: 'pescoco', label: 'Pescoço (cm)', icon: 'bi bi-body' },
    { name: 'ombro', label: 'Ombro (cm)', icon: 'bi bi-rulers' },
    { name: 'torax_expirado', label: 'Tórax expirado (cm)', icon: 'bi bi-body' },
    { name: 'torax_inspirado', label: 'Tórax inspirado (cm)', icon: 'bi bi-body' },
    // { name: 'punho', label: 'Punho (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'cintura', label: 'Cintura (cm)', icon: 'bi bi-body' },
    { name: 'abdomen', label: 'Abdômen (cm)', icon: 'bi bi-body' },
    { name: 'quadril', label: 'Quadril (cm)', icon: 'bi bi-body' },
];

const perimetrosDireito = [
    { name: 'braco_relaxado_direito', label: 'Braço relaxado direito (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_direito', label: 'Braço contraído direito (cm)', icon: 'bi bi-body' },
    { name: 'antebraco_direito', label: 'Antebraço direito (cm)', icon: 'bi bi-rulers' },
    { name: 'coxa_direita', label: 'Coxa direita (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_direita', label: 'Panturrilha direita (cm)', icon: 'bi bi-shoe-prints' },
];

const perimetrosEsquerdo = [
    { name: 'braco_relaxado_esquerdo', label: 'Braço relaxado esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'braco_contraido_esquerdo', label: 'Braço contraído esquerdo (cm)', icon: 'bi bi-body' },
    { name: 'antebraco_esquerdo', label: 'Antebraço esquerdo (cm)', icon: 'bi bi-rulers' },
    { name: 'coxa_esquerda', label: 'Coxa esquerda (cm)', icon: 'bi bi-shoe-prints' },
    { name: 'panturrilha_esquerda', label: 'Panturrilha esquerda (cm)', icon: 'bi bi-shoe-prints' },
];

export default Perimetros;