import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { gerarIdCarteira, getStatusAccount, sendDocuments } from "../api/pagamento";
import { setEmpresa } from "../api/usuario";
import { useNavigate } from "react-router-dom";

function FitCpxPay() {
    const navigate = useNavigate();
    const { register, setValue } = useForm();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    const [frontDoc, setFrontDoc] = useState(null);
    const [backDoc, setBackDoc] = useState(null);
    const [type, setType] = useState('company');

    useEffect(() => {
        if (empresa) {
            Object.keys(empresa).forEach((key) => {
                setValue(key, empresa[key]);
            });
        }
    }, [empresa]);

    useEffect(() => {
        if (empresa) {
            getStatusAccount(empresa.cod_empresa);
        }
    }, []);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    async function sendForm() {
        if (!frontDoc || !backDoc) {
            alert('Por favor, envie ambos os documentos.');
            return;
        }

        const frontBase64 = await fileToBase64(frontDoc);
        const backBase64 = await fileToBase64(backDoc);

        if (type === 'company' && empresa?.cod_empresa) {
            // const respEmpresa = await setEmpresa({ cod_empresa: empresa?.cod_empresa, ...data });
            // setempresa(respEmpresa);
        } else if (type === 'individual') {
            //
        }

        await gerarIdCarteira(empresa?.cod_empresa, usuario?.cod_usuario);
        await sendDocuments(frontBase64, backBase64, empresa.cod_empresa, usuario.cod_usuario);

        navigate('/dashboard');
    }

    return (
        <div className="container-fluid">
            <div className="card bg-success-subtle">
                <div className="card-body">
                    <h5 className="card-title">Formulário FitCpx Pay</h5>
                    <h6 className="card-subtitle">Formulário para criar conta FitCpx pay para receber pagamentos no sistema.</h6>
                    <p className="mb-0">(Certifique-se de preencher todos os dados corretamente.)</p>
                </div>
            </div>

            <form>
                <Empresa register={register} />

                <div className="row g-3">
                    <DocumentUpload
                        frontDoc={frontDoc}    
                        backDoc={backDoc}
                        setFrontDoc={setFrontDoc}
                        setBackDoc={setBackDoc}
                    />

                    <DadosBancarios register={register} />
                </div>
            </form>

            <Usuario />

            <div className="card d-flex justify-content-end col-md-6">
                <div className="card-body">
                    <button className="btn btn-success rounded" onClick={sendForm}>Enviar formulário</button>
                </div>
            </div>
        </div>
    )
}

function DadosBancarios({ register }) {

    return (
        <div className="col-md-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Conta bancária</h5>
                    <h6>Conta para receber o valor de saque</h6>

                    <div className="row">
                        <div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Titular da conta</label>
                                <input className='form-control' {...register('titular_banco_conta')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Código do banco</label>
                                <input className='form-control' {...register('codigo_banco_conta')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Agência</label>
                                <input className='form-control' {...register('agencia_banco_conta')} />
                            </div>
                        </div>

                        <div className="col-lg-9">
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Número da conta</label>
                                <input className='form-control' {...register('numero_banco_conta')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Empresa({ register }) {
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Empresa</h5>
                <h6>Dados da empresa para criação da conta</h6>

                <form>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Nome</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('nome_empresa')} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Descrição</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('descricao_empresa')} />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext1" className="form-label">Telefone</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('telefone_empresa')} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">CEP</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('cep_empresa')} />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="exampleInputtext1" className="form-label">Email</label>
                                <input disabled className='form-control' {...register('email_empresa')} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputtext" className="form-label">Razão social</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('razao_social_empresa')} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputtext3" className="form-label">Celular</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('celular_empresa')} />
                            </div>

                            <div className="mb-3 row">
                                <div className="mb-3 col-6">
                                    <label className="form-label">Cidade</label>
                                    <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('cidade_empresa')} />
                                </div>

                                <div className="mb-3 col-6">
                                    <label className="form-label">Estado</label>
                                    <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('estado_empresa')} />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 row">
                            <div className="col-10">
                                <label htmlFor="exampleInputtext4" className="form-label">Endereço</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('endereco_empresa')} />
                            </div>

                            <div className="col-2">
                                <label htmlFor="exampleInputtext4" className="form-label">Número</label>
                                <input disabled={usuario.admin_usuario !== 'S'} className='form-control' {...register('numero_empresa')} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Usuario() {
    const { register, setValue } = useForm();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    useEffect(() => {
        if (usuario) {
            Object.keys(usuario).forEach((key) => {
                setValue(key, usuario[key]);
            });
        }
    }, [usuario]);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Usuário</h5>
                <h6>Dados do responsável pela empresa</h6>

                <form className="row">
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <label htmlFor="exampleInputtext" className="form-label">Nome</label>
                            <input className='form-control' {...register('nome_usuario')} />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="exampleInputtext1" className="form-label">Telefone</label>
                            <input className='form-control' {...register('telefone_usuario')} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputtext" className="form-label">CEP</label>
                            <input className='form-control' {...register('cep_usuario')} />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="mb-3">
                            <label htmlFor="exampleInputtext1" className="form-label">Email</label>
                            <input disabled className='form-control' {...register('email_usuario')} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputtext3" className="form-label">Celular</label>
                            <input className='form-control' {...register('celular_usuario')} />
                        </div>

                        <div className="mb-3 row">
                            <div className="mb-3 col-6">
                                <label className="form-label">Cidade</label>
                                <input className='form-control' {...register('cidade_usuario')} />
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">Estado</label>
                                <input className='form-control' {...register('estado_usuario')} />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 row">
                        <div className="col-10">
                            <label htmlFor="exampleInputtext4" className="form-label">Endereço</label>
                            <input className='form-control' {...register('endereco_usuario')} />
                        </div>

                        <div className="col-2">
                            <label htmlFor="exampleInputtext4" className="form-label">Número</label>
                            <input className='form-control' {...register('numero_usuario')} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

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

export default FitCpxPay;