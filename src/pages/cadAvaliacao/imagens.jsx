import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ImageCropModal from "../../components/cutImg";
import Cropper from "cropperjs";

function Imagens({ capturedImages, setCapturedImages, imageDescriptions, setImageDescriptions, deletedImages, setDeletedImages }) {
    const [showModal, setShowModal] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const fileInputRefs = useRef({});
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [currentOption, setCurrentOption] = useState(null);
    const [options, setOptions] = useState([1, 2, 3]);

    const [editImages, setEditImages] = useState({});
    const [iniciouTela, setIniciouTela] = useState(false);

    useEffect(() => {
        if (iniciouTela) return;
        if (options.length < Object.keys(capturedImages).length) {
            setOptions(Array.from({ length: Object.keys(capturedImages).length }, (_, i) => i + 1));
        }
        setIniciouTela(true);
    }, []);

    const handleEdit = (event, option) => {
        event.preventDefault();

        setCurrentOption(option);
        setImageToCrop(editImages[option]);
        setShowCropModal(true);
    }

    // Função para lidar com arrastar e soltar
    const handleDrop = (event, option) => {
        event.preventDefault();

        //Preenche várias opções para multiplos arquivos
        if (event.dataTransfer.files.length > 1) {
            //Novo array de opções sem as vazias
            var newOptions = [ ...options ];
            for (let i = 0; i < options.length; i++) {
                const opt = options[i];
                if (!capturedImages[opt]) newOptions.splice(i);
            }
            //Array de opções que serão inseridos as imagens carregadas
            const optionFill = Array.from({ length: event.dataTransfer.files.length }, (_, i) => i + newOptions.length + 1);
            //Seta as opções com todas que há imagens
            setOptions([ ...newOptions, ...optionFill ]);

            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                const file = event.dataTransfer.files[i];
                if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imageData = e.target.result;
                        
                        const img = new Image();
                        img.src = imageData;
                        var croppedImage;

                        img.onload = () => {
                            const height = img.height;
                            const width = img.height / 2;
                            //Cortar imagem
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0);
                            croppedImage = canvas.toDataURL('image/jpeg');
                            
                            setEditImages((prevImages) => ({
                                ...prevImages,
                                [optionFill[i]]: imageData,
                            }));
                            setCapturedImages((prevImages) => ({
                                ...prevImages,
                                [optionFill[i]]: croppedImage,
                            }));
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
            return;
        }
        //Segue preenchendo apenas a imagem enviada para a opção
        const file = event.dataTransfer.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                // Enviar imagem para o modal de corte
                setCurrentOption(option);
                setImageToCrop(imageData);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("O arquivo arrastado não é uma imagem válida.");
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Função para lidar com clique no seletor de arquivos
    const handleFileChange = (event, option) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                // Enviar imagem para o modal de corte
                setCurrentOption(option);
                setImageToCrop(imageData);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("O arquivo selecionado não é uma imagem válida.");
        }
    };

    // Função para abrir a câmera e definir a opção para tirar foto
    const handleTakePhoto = async (option) => {
        try {
            setCurrentOption(option);
            setShowModal(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Erro ao acessar a câmera:", error);
        }
    };

    const capturePhoto = () => {
        if (canvasRef.current && videoRef.current && currentOption !== null) {
            const context = canvasRef.current.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = canvasRef.current.toDataURL("image/png");
            console.log(`Foto capturada para a opção ${currentOption}:`, imageData);

            // Enviar imagem para o modal de corte
            setImageToCrop(imageData);
            setShowCropModal(true);

            // Parar a câmera após capturar
            const stream = videoRef.current.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }

            setShowModal(false);
        }
    };

    const changeCam = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            // Encontra a câmera atual e remove da lista
            const currentDeviceId = videoRef.current.srcObject.getTracks()[0].getSettings().deviceId;
            const videoDevicesWithoutCurrent = videoDevices.filter(device => device.deviceId !== currentDeviceId);

            // Seleciona a próxima câmera disponível
            const nextVideoDevice = videoDevicesWithoutCurrent[0];

            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: nextVideoDevice.deviceId } });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Erro ao trocar a câmera:", error);
        }
    }

    const handleModalConfirm = (croppedImage) => {
        if (currentOption !== null) {
            setCapturedImages((prevImages) => ({
                ...prevImages,
                [currentOption]: croppedImage,
            }));
        }
        setShowCropModal(false);
    };

    const handleModalCancel = () => {
        setShowCropModal(false);
    };

    const removePhoto = (option) => {
        if (editImages[option]) {
            setEditImages((prevImages) => {
                const updatedImages = { ...prevImages };
                delete updatedImages[option];
                return updatedImages;
            });
        }
        //Preenche caso já tenha salvo uma imagem para que seja deletada
        if (capturedImages[option].includes('amazonaws.com')) {
            setDeletedImages((prevImages) => ([
                ...prevImages,
                capturedImages[option],
            ]));
        }
        setCapturedImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[option];
            return updatedImages;
        });
    };
    
    // Função para atualizar a descrição de uma imagem
    const updateDescription = (option, description) => {
        setImageDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [option]: description,
        }));
    };

    const renderOption = (option) => (
        <div 
            className="col-md-3 text-center" 
            onDrop={(e) => handleDrop(e, option)} 
            onDragOver={handleDragOver}
        >
            <div className="upload-option border border-dark rounded p-3">
                {option}
                {capturedImages[option] ? (
                    <div className="mb-2">
                        <img
                            src={capturedImages[option]}
                            style={{ width: '100%', border: '1px solid black' }}
                        />
                    </div>
                ) : (
                    // <img src="https://via.assets.so/img.jpg?w=340&h=240&tc=white&t=Imagem" style={{ width: '320px', height: '240px' }} loading="lazy" />
                    <div
                        style={{ 
                            width: 'auto',
                            height: '300px',
                            border: '1px dashed black',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}
                    >
                        Arraste uma imagem aqui
                    </div>
                )}
                <p></p>
                <button onClick={e => { e.preventDefault(); fileInputRefs.current[option]?.click() }} className="btn btn-primary btn-sm me-2">
                    <i className="bi bi-upload me-2"></i>
                    Carregar
                </button>
                {capturedImages[option] ? (
                    <button onClick={e => { e.preventDefault(); removePhoto(option) }} className="btn btn-danger btn-sm">
                        <i className="bi bi-trash me-2"></i>
                        Remover
                    </button>
                ) : (
                    <button onClick={e => { e.preventDefault(); handleTakePhoto(option) }} className="btn btn-success btn-sm">
                        <i className="bi bi-camera me-2"></i>
                        Capturar
                    </button>
                )}
                <p></p>
                <input 
                    className="form-control" 
                    placeholder='Descrição imagem'
                    type="text" 
                    value={imageDescriptions[option] || ''}
                    onChange={(e) => updateDescription(option, e.target.value)}
                />
                <input type="file" ref={(el) => (fileInputRefs.current[option] = el)} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, option)} />
                <button onClick={e => { e.preventDefault(); handleEdit(e, option) }} className={`${editImages[option] ? '' : 'd-none'} btn btn-outline-info btn-sm mt-2 me-2`}>
                    <i className="bi bi-pen me-2"></i>
                    Editar
                </button>
                <button onClick={e => { e.preventDefault(); removeOption(option) }} className='btn btn-outline-danger btn-sm mt-2'>
                    <i className="bi bi-trash me-2"></i>
                    Remover Opção
                </button>
            </div>
        </div>
    );

    const addOption = e => {
        e.preventDefault();
        setOptions((prevOptions) => [...prevOptions, prevOptions.length + 1]);
    };

    const removeOption = (option) => {
        if (editImages[option]) {
            setEditImages((prevImages) => {
                const updatedImages = { ...prevImages };
                delete updatedImages[option];
                return updatedImages;
            });
        }
        setOptions((prevOptions) => prevOptions.filter((o) => o !== option));
        //Preenche caso já tenha salvo uma imagem para que seja deletada
        if (capturedImages[option]?.includes('amazonaws.com')) {
            setDeletedImages((prevImages) => ({
                ...prevImages,
                [currentOption]: capturedImages[option],
            }));
        }
        setCapturedImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[option];
            return updatedImages;
        });
    };

    return (
        <div className="row g-3">
            <Modal show={showModal} className="modal fade" id="eventModal" aria-labelledby="eventModalLabel" aria-hidden="true">
                <div className="modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModalLabel">Evento</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            {/* Video e Canvas para captura de fotos */}
                            {currentOption !== null && (
                                <div className="camera-container text-center mt-4">
                                    <video playsinline ref={videoRef} width="320" height="240" style={{ border: "1px solid black" }}></video>
                                    <br />
                                    <button onClick={changeCam} className="btn btn-info me-2">
                                        <i className="bi bi-arrow-down-up me-2"></i>
                                        Trocar câmera
                                    </button>
                                    <button onClick={capturePhoto} className="btn btn-success">
                                        <i className="bi bi-camera me-2"></i>
                                        Capturar Foto
                                    </button>
                                    <br />
                                    <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none', border: "1px solid black", marginTop: "10px" }}></canvas>
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn bg-danger-subtle text-danger" type="button" onClick={() => setShowModal(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal de Corte */}
            <ImageCropModal
                show={showCropModal}
                image={imageToCrop}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
                height={300}
                width={150}
            />

            <div className="row g-3">
                {options.map((option) => renderOption(option))}

                <div className={`${options.length >= 20 ? 'd-none' : ''} col-md-3 text-center`}>
                    <div className="upload-option border border-dark rounded p-3">
                        <button onClick={addOption} className="btn btn-outline-success">
                            <i className="bi bi-plus-circle me-2"></i>
                            Adicionar opção
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Imagens;