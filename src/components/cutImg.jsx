import { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

function ImageCropModal({ show, image, onConfirm, onCancel, height, width }) {
    const [cropper, setCropper] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // Estado para gerenciar o processamento
    const cropperRef = useRef(null);

    const handleImageLoad = () => {
        if (cropper) {
            cropper.destroy();
        }

        const cropperInstance = new Cropper(cropperRef.current, {
            aspectRatio: width / height || 1,
            viewMode: 1,
            responsive: true,
            zoomable: true,
            minCropBoxWidth: width || 150,
            minCropBoxHeight: height || 150,
            ready() {
                // Inicializar a área de corte maximizada
                const containerData = cropperInstance.getContainerData();
                cropperInstance.setCropBoxData({
                    left: 0,
                    top: 0,
                    width: containerData.width,
                    height: containerData.height,
                });
            },
        });
        setCropper(cropperInstance);
    };

    const handleConfirm = async () => {
        if (cropper) {
            setIsProcessing(true); // Desativa o botão
            try {
                const croppedImage = cropper.getCroppedCanvas({
                    // width: width || 150,
                    // height: height || 150,
                }).toDataURL();
                await onConfirm(croppedImage); // Espera a ação de confirmação
            } finally {
                setIsProcessing(false); // Reativa o botão em caso de erro ou sucesso
            }
        }
    };

    useEffect(() => {
        return () => {
            if (cropper) cropper.destroy();
        };
    }, [cropper]);

    return (
        <Modal show={show}>
            <Modal.Header closeButton>
                <Modal.Title>Recortar Imagem</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="cropper-container">
                    {image && (
                        <img
                            src={image}
                            ref={cropperRef}
                            alt="Imagem para recorte"
                            onLoad={handleImageLoad}
                            style={{ maxWidth: '100%' }}
                        />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button disabled={isProcessing} className="btn btn-danger" onClick={onCancel}>
                    Cancelar
                </button>
                <button disabled={isProcessing} className="btn btn-success" onClick={handleConfirm}>
                    Confirmar
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ImageCropModal;