import { useEffect, useRef } from "react";

const DocumentUpload = ({ frontDoc, backDoc, setFrontDoc, setBackDoc }) => {
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);
    
    const handleFileChange = (e, setFile) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo é muito grande. O tamanho máximo é 5MB.');
                e.target.value = '';
                return;
            }
            setFile(file);
        }
    };
    
    const removeFile = (setFile, inputRef) => {
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
        
    // Configurar o drag and drop
    useEffect(() => {
        const setupDragDrop = (boxRef, inputRef, setFile) => {
            if (!boxRef.current) return;
            
            const box = boxRef.current;
            
            const handleDragOver = (e) => {
                e.preventDefault();
                box.classList.add('drag-over');
            };
            
            const handleDragLeave = () => {
                box.classList.remove('drag-over');
            };
            
            const handleDrop = (e) => {
                e.preventDefault();
                box.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length) {
                    const file = e.dataTransfer.files[0];
                    
                    if (file.size > 5 * 1024 * 1024) {
                        alert('O arquivo é muito grande. O tamanho máximo é 5MB.');
                        return;
                    }
                    
                    if (inputRef.current) {
                        // Não é possível definir files diretamente, então simulamos um evento de change
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        inputRef.current.files = dataTransfer.files;
                        setFile(file);
                    }
                }
            };
            
            box.addEventListener('dragover', handleDragOver);
            box.addEventListener('dragleave', handleDragLeave);
            box.addEventListener('drop', handleDrop);
            
            return () => {
                box.removeEventListener('dragover', handleDragOver);
                box.removeEventListener('dragleave', handleDragLeave);
                box.removeEventListener('drop', handleDrop);
            };
        };
        
        const frontBoxRef = { current: document.getElementById('frontDocBox') };
        const backBoxRef = { current: document.getElementById('backDocBox') };
        
        const cleanupFront = setupDragDrop(frontBoxRef, frontInputRef, setFrontDoc);
        const cleanupBack = setupDragDrop(backBoxRef, backInputRef, setBackDoc);
        
        return () => {
            cleanupFront && cleanupFront();
            cleanupBack && cleanupBack();
        };
    }, []);
    
    return (
        <div className="col-lg-6">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-1">Documentos</h5>
                    <p className="text-muted mb-4">Documentos para validação do responsável legal da empresa</p>
                    
                    <div className="upload-container">
                        {/* Documento Frente */}
                        <div className="upload-item mb-4">
                            <label 
                                className={`upload-box d-flex flex-column align-items-center justify-content-center p-4 rounded ${frontDoc ? 'file-selected' : 'border-dashed'} cursor-pointer`}
                                id="frontDocBox"
                            >
                                <i className="bi bi-file-earmark-text fs-1 mb-2"></i>
                                <span className="fw-medium">RG/CNH (Frente)</span>
                                {!frontDoc && (
                                    <>
                                        <p className="text-muted small mt-1 mb-2">Arraste o arquivo ou clique para fazer upload</p>
                                        <span className="badge bg-light text-info small">PDF, JPG ou PNG (máx. 5MB)</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="d-none" 
                                    accept=".pdf,.jpg,.jpeg,.png" 
                                    ref={frontInputRef}
                                    onChange={(e) => handleFileChange(e, setFrontDoc)}
                                />
                            </label>
                            {frontDoc && (
                                <div className="upload-status mt-2 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span className="file-name text-truncate">{frontDoc.name}</span>
                                    </div>
                                    <button 
                                        className="btn btn-sm text-danger"
                                        onClick={() => removeFile(setFrontDoc, frontInputRef)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Documento Verso */}
                        <div className="upload-item mb-4">
                            <label 
                                className={`upload-box d-flex flex-column align-items-center justify-content-center p-4 rounded ${backDoc ? 'file-selected' : 'border-dashed'} cursor-pointer`}
                                id="backDocBox"
                            >
                                <i className="bi bi-file-earmark-text fs-1 mb-2"></i>
                                <span className="fw-medium">RG/CNH (Verso)</span>
                                {!backDoc && (
                                    <>
                                        <p className="text-muted small mt-1 mb-2">Arraste o arquivo ou clique para fazer upload</p>
                                        <span className="badge bg-light text-info small">PDF, JPG ou PNG (máx. 5MB)</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="d-none" 
                                    accept=".pdf,.jpg,.jpeg,.png" 
                                    ref={backInputRef}
                                    onChange={(e) => handleFileChange(e, setBackDoc)}
                                />
                            </label>
                            {backDoc && (
                                <div className="upload-status mt-2 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span className="file-name text-truncate">{backDoc.name}</span>
                                    </div>
                                    <button 
                                        className="btn btn-sm text-danger"
                                        onClick={() => removeFile(setBackDoc, backInputRef)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <div className="alert alert-info small d-flex align-items-center py-2" role="alert">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            <div>Os documentos enviados são criptografados e utilizados apenas para verificação de identidade.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;