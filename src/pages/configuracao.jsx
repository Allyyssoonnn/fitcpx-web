import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import ImageCropModal from "../components/cutImg";
import { useEffect, useState } from "react";
import { dataURLToBlob, formatarMoeda } from "../utils";
import { changeEmpresaIMG, changeUsuarioIMG, setEmpresa, setUsuario } from "../api/usuario";
import { useForm } from "react-hook-form";
import { gerarIdCarteira } from "../api/pagamento";

function Configuracao() {
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    return (
        <div className="container-fluid">
            <div className="card">
                <ul className="nav nav-pills user-profile-tab" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-account-tab" data-bs-toggle="pill" data-bs-target="#pills-account" type="button" role="tab" aria-controls="pills-account" aria-selected="true">
                            <i className="bi bi-person me-2"></i>
                            <span className="d-none d-md-block">Conta</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-notifications-tab" data-bs-toggle="pill" data-bs-target="#pills-notifications" type="button" role="tab" aria-controls="pills-notifications" aria-selected="false">
                            <i className="bi bi-building me-2"></i>
                            <span className="d-none d-md-block">Empresa</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-bills-tab" data-bs-toggle="pill" data-bs-target="#pills-bills" type="button" role="tab" aria-controls="pills-bills" aria-selected="false">
                            <i className="bi bi-cash me-2"></i>
                            <span className="d-none d-md-block">Financeiro</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-3" id="pills-security-tab" data-bs-toggle="pill" data-bs-target="#pills-security" type="button" role="tab" aria-controls="pills-security" aria-selected="false">
                            <i className="bi bi-unlock me-2"></i>
                            <span className="d-none d-md-block">Licença</span>
                        </button>
                    </li>
                </ul>

                <div className="card-body">
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-account" role="tabpanel" aria-labelledby="pills-account-tab" tabIndex="0">
                            <Conta usuario={usuario} setusuario={setusuario} />
                        </div>

                        <div className="tab-pane fade" id="pills-notifications" role="tabpanel" aria-labelledby="pills-notifications-tab" tabIndex="0">
                            <Empresa empresa={empresa} setempresa={setempresa} usuario={usuario} />
                        </div>
                        
                        <div className="tab-pane fade" id="pills-bills" role="tabpanel" aria-labelledby="pills-bills-tab" tabIndex="0">
                            <Financeiro empresa={empresa} />
                        </div>

                        <div className="tab-pane fade" id="pills-security" role="tabpanel" aria-labelledby="pills-security-tab" tabIndex="0">
                            <Licenca />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Conta({ usuario, setusuario }) {
    const { register, setValue, handleSubmit } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);

    useEffect(() => {
        if (usuario) {
            Object.keys(usuario).forEach((key) => {
                setValue(key, usuario[key]);
            });
        }
    }, [usuario]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
            setShowModal(true); // Open the modal
        };
    
        reader.readAsDataURL(file);
    };

    const handleModalConfirm = (croppedImage) => {
        if (croppedImage) {
            const croppedBlob = dataURLToBlob(croppedImage);

            const formData = new FormData();
            formData.append('image', croppedBlob, 'cropped_image.jpg'); 
            
            // Save the cropped image
            changeUsuarioIMG(formData, { cod_usuario: usuario.cod_usuario }).then(resp => {
                if (resp.id) setusuario({ ...usuario, imagem_usuario: resp.id });
                setShowModal(false);
                setCropper(null);
            }).catch((error) => {
                console.error('Erro ao salvar imagem recortada:', error);
            });
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (cropper) {
            cropper.destroy();
        }
        setCropper(null);
    };

    async function HandleConfirm(data) {
        const usuario = await setUsuario(data);
        setusuario(usuario);
    }

    return (
        <form className="row" onSubmit={handleSubmit(HandleConfirm)}>
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
            />

            <div className="col-lg-6 d-flex align-items-stretch">
                <div className="card w-100 border position-relative overflow-hidden">
                    <div className="card-body p-4">
                        <h4 className="card-title">Foto de perfil</h4>
                        <p className="card-subtitle mb-4">Altere sua foto de perfil aqui!</p>
                        <div className="text-center d-flex flex-column align-items-center">
                            <img
                                src={usuario.imagem_usuario ? `${usuario.imagem_usuario}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                alt="Foto do Usuário"
                                className="img-fluid rounded-circle shadow-md"
                                loading="lazy"
                                width="120" height="120"
                            />

                            <div className="d-flex align-items-center justify-content-center my-4 gap-6">
                                <label className="btn btn-primary" htmlFor='img_aluno'>
                                    <i className="bi bi-camera me-2"></i>
                                    Carregar imagem
                                </label>
                                {/* <button className="btn bg-danger-subtle text-danger">Reset</button> */}
                            </div>

                            <p className="mb-0">JPG, PNG ou JPEG</p>
                            <input id='img_aluno' className='d-none' type="file" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-6 d-flex align-items-stretch">
                <div className="card w-100 border position-relative overflow-hidden">
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                        <h4 className="card-title">Fit Cpx</h4>
                        <img
                            src='/assets/images/logos/logo.png'
                            alt="Foto da Empresa"
                            className="img-fluid"
                            loading="lazy"
                            width="150"
                        />
                        <p className="card-subtitle text-center">Agradecemos por testar nosso app e por apoiar nosso desenvolvimento. Isso significa muito pra gente!</p>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card w-100 border position-relative overflow-hidden mb-0">
                    <div className="card-body p-4">
                        <h4 className="card-title">Informações pessoais</h4>
                        <p className="card-subtitle mb-4">Para alterar informações pessoais edite e salve aqui!</p>
                        <form>
                            <div className="row">
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
                                
                                <div className="col-12">
                                    <div className="d-flex align-items-center justify-content-end mt-4 gap-6">
                                        <button className="btn btn-success" type="submit">Salvar</button>
                                        <button className="btn bg-danger-subtle text-danger">Descartar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </form>
    )
}

function Empresa({ empresa, setempresa, usuario }) {
    const { register, setValue, handleSubmit } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);

    useEffect(() => {
        if (empresa) {
            Object.keys(empresa).forEach((key) => {
                setValue(key, empresa[key]);
            });
        }
    }, [empresa]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
            setShowModal(true); // Open the modal
        };
    
        reader.readAsDataURL(file);
    };

    const handleModalConfirm = (croppedImage) => {
        if (croppedImage) {
            const croppedBlob = dataURLToBlob(croppedImage);

            const formData = new FormData();
            formData.append('image', croppedBlob, 'cropped_image.jpg'); 
            
            // Save the cropped image
            changeEmpresaIMG(formData, { cod_empresa: empresa.cod_empresa }).then(resp => {
                if (resp.id) setempresa({ ...empresa, imagem_empresa: resp.id });
                setShowModal(false);
                setCropper(null);
            }).catch((error) => {
                console.error('Erro ao salvar imagem recortada:', error);
            });
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (cropper) {
            cropper.destroy();
        }
        setCropper(null);
    };

    async function HandleConfirm(data) {
        const empresa = await setEmpresa(data);
        setempresa(empresa);
    }

    return (
        <form className="row" onSubmit={handleSubmit(HandleConfirm)}>
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
            />

            <div className="col-lg-6 d-flex align-items-stretch">
                <div className="card w-100 border position-relative overflow-hidden">
                    <div className="card-body p-4">
                        <h4 className="card-title">Foto da empresa</h4>
                        <p className="card-subtitle mb-4">Altere a foto da empresa aqui!</p>
                        <div className="text-center d-flex flex-column align-items-center">
                            <img
                                src={empresa.imagem_empresa ? `${empresa.imagem_empresa}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                alt="Foto da Empresa"
                                className="img-fluid rounded-circle shadow-md"
                                loading="lazy"
                                width="120" height="120"
                            />

                            <div className="d-flex align-items-center justify-content-center my-4 gap-6">
                                <label className="btn btn-primary" htmlFor='img_empresa'>
                                    <i className="bi bi-camera me-2"></i>
                                    Carregar imagem
                                </label>
                                {/* <button className="btn bg-danger-subtle text-danger">Reset</button> */}
                            </div>

                            <p className="mb-0">JPG, PNG ou JPEG</p>
                            <input id='img_empresa' className='d-none' type="file" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 d-flex align-items-stretch">
                <div className="card w-100 border position-relative overflow-hidden">
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                        <h4 className="card-title">Fit Cpx</h4>
                        <img
                            src='/assets/images/logos/logo.png'
                            alt="Foto da Empresa"
                            className="img-fluid"
                            loading="lazy"
                            width="150"
                        />
                        <p className="card-subtitle text-center">Agradecemos por testar nosso app e por apoiar nosso desenvolvimento. Isso significa muito pra gente!</p>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card w-100 border position-relative overflow-hidden mb-0">
                    <div className="card-body p-4">
                        <h4 className="card-title">Informações pessoais</h4>
                        <p className="card-subtitle mb-4">Para alterar informações pessoais edite e salve aqui!</p>
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
                                
                                <div className="col-12">
                                    <div className="d-flex align-items-center justify-content-end mt-4 gap-6">
                                        <button disabled={usuario.admin_usuario !== 'S'} className="btn btn-success" type="submit">Salvar</button>
                                        <button disabled={usuario.admin_usuario !== 'S'} className="btn bg-danger-subtle text-danger">Descartar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </form>
    )
}

function Financeiro() {
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    async function gerarCarteira() {
        const resp = await gerarIdCarteira(empresa?.cod_empresa);
        if (resp) setempresa(resp);
    }

    return (
        <div className="row">
            <div className="col-lg-6 d-flex align-items-stretch">
                <div className="card w-100 border position-relative overflow-hidden">
                    <div className="card-body p-4">
                        <h4 className="card-title">Dados financeiro</h4>
                        <p className="card-subtitle mb-4">Informações do financeiro!</p>

                        <div className="mb-3">
                            <label className="form-label">ID da Carteira</label>
                            <div className="row">
                                <div className="col-md-10">
                                    <input disabled className="form-control" value={empresa?.walletid_empresa} />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-outline-primary" onClick={() => navigator.clipboard.writeText(empresa?.walletid_empresa)}>
                                        <i className="bi bi-clipboard" />
                                    </button>
                                </div>
                            </div>

                            <label className="form-label mt-3">(Dev) - ID da Carteira</label>
                            <div className="row">
                                <div className="col-md-10">
                                    <input disabled className="form-control" value={empresa?.dev_walletid_empresa} />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-outline-warning" onClick={() => navigator.clipboard.writeText(empresa?.walletid_empresa)}>
                                        <i className="bi bi-clipboard" />
                                    </button>
                                </div>
                            </div>

                            <button className="btn btn-info mt-3" onClick={gerarCarteira}>Gerar ID da carteira</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Licenca() {
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card border shadow-none">
                    <div className="card-body p-4">
                        <h4 className="card-title">Plano atual : <span className="text-success">Gratuito</span></h4>
                        <p className="card-subtitle">Aqui você pode adquirir um novo plano para evoluir sua ferramenta.</p>

                        {[
                            { nome_licenca: 'Gratuito', valor_licenca: 0, adquirido: true, descricao_licenca: 'Plano básico com 3 Alunos e 1 Usuário para uso gratuito.' },
                            { nome_licenca: 'Parcial', valor_licenca: 0, adquirido: false, descricao_licenca: 'Plano com cadastros ilimitados para gestão permitindo a compra de funções individuais.' },
                            { nome_licenca: 'Completo', valor_licenca: 0, adquirido: false, descricao_licenca: 'Plano com cadastros ilimitados para gestão com todas funções.' },
                        ].map((licenca, index) => (<CardLicenca key={index} licenca={licenca} />))}

                        {/* <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-primary">Change Plan</button>
                            <button className="btn bg-danger-subtle text-danger">Reset Plan</button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card border shadow-none">
                    <div className="card-body p-4">
                        <h4 className="card-title">Funções</h4>
                        <p className="card-subtitle">Aqui você pode adquirir funções para facilitar seu operacional de trabalho.</p>

                        {[
                            { nome_licenca: 'Treino inteligente', valor_licenca: 0, adquirido: false, descricao_licenca: 'Prescrever treino de maneira automática.' },
                            { nome_licenca: 'Pagamento', valor_licenca: 0, adquirido: false, descricao_licenca: 'Receber pagamentos utilizando nosso sistema de pagamentos.' },
                            { nome_licenca: 'Fiscal', valor_licenca: 0, adquirido: false, descricao_licenca: 'Emitir notas fiscais de serviço utilizando nosso sistema fiscal.' },
                        ].map((licenca, index) => (<CardLicenca key={index} licenca={licenca} />))}

                        {/* <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-primary">Change Plan</button>
                            <button className="btn bg-danger-subtle text-danger">Reset Plan</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CardLicenca({ licenca }) {

    return (
        (<div className={`d-flex flex-column justify-content-between mt-7 mb-1 shadow p-3 rounded ${licenca.adquirido ? 'bg-success-subtle' : 'border border-info'}`}>
            <div className="d-flex align-items-center gap-3">
                <div className="text-bg-light rounded-1 p-6 d-flex align-items-center justify-content-center">
                    <i className="bi bi-box-seam text-dark d-block fs-7" width="22" height="22"></i>
                </div>
                <div>
                    <h5 className="fs-4 fw-semibold mb-0">{licenca.nome_licenca}</h5>
                    <p className="mb-0 fs-3">{licenca.descricao_licenca}</p>
                    <h5 className="fs-4 fw-semibold mb-0">{formatarMoeda(licenca.valor_licenca)}</h5>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
                {licenca.adquirido && (
                    <button disabled className="btn btn-success rounded">
                        <i className="bi bi-check me-2"></i>
                        Adquirido
                    </button>
                )}

                {!licenca.adquirido && (
                    <button className="btn btn-info rounded">
                        <i className="bi bi-cart me-2"></i>
                        Comprar
                    </button>
                )}
            </div>
        </div>)
    );
}

export default Configuracao;