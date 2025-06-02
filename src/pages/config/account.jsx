import ImageCropModal from "../../components/cutImg";
import { useEffect, useState } from "react";
import { dataURLToBlob, formatarMoeda } from "../../utils";
import { changeEmpresaIMG, changeUsuarioIMG, setEmpresa, setUsuario } from "../../api/usuario";
import { useForm } from "react-hook-form";
import { useNotificacao } from "../../states/states";

function Account({ usuario, setusuario }) {
    const { nSuccess } = useNotificacao();
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
        nSuccess('Alteração confirmada');
    }

    return (
        <div className="row">
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
                        <form onSubmit={handleSubmit(HandleConfirm)}>
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
                                        {/* <button className="btn bg-danger-subtle text-danger">Descartar</button> */}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account;