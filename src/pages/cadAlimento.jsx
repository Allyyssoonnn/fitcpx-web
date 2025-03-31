import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../states/states";
import ImageCropModal from "../components/cutImg";
import { capitalizeFirstLetter, dataURLToBlob } from "../utils";
import { changeAlimentoIMG, getGrupoAlimentos, setAlimento } from "../api/cardapio";
import { useQuery } from "react-query";

function CadAlimento() {
    const { nSuccess } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { handleSubmit, register, setValue, watch, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [img, setImg] = useState('');
    const [imgAlterada, setImgAlterada] = useState(false);

    const { data: grupos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getGrupoAlimentos(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        const alimentoRecebido = location.state?.alimento;
        setImg(alimentoRecebido?.imagem_alimento ? `${alimentoRecebido?.imagem_alimento}?&t=${new Date().getTime()}` : 'https://placehold.co/400x250?text=img');
        if (alimentoRecebido) {
            Object.keys(alimentoRecebido).forEach((key) => {
                setValue(key, alimentoRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    const handleFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
            setShowModal(true); // Open the modal
        };
    
        reader.readAsDataURL(file);
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (cropper) cropper.destroy();
        setCropper(null);
    };

    const handleModalConfirm = (croppedImage) => {
        if (croppedImage) {
            setImg(croppedImage);

            setShowModal(false);
            setCropper(null);
            setImgAlterada(true);
        }
    };

    async function confirma(data) {
        const resp = await setAlimento({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });

        if (img && resp?.cod_alimento && imgAlterada) {
            const croppedBlob = dataURLToBlob(img);

            const formData = new FormData();
            formData.append('image', croppedBlob, 'cropped_image.jpg');
            changeAlimentoIMG(formData, { cod_alimento: resp.cod_alimento }).catch((error) => {
                console.error('Erro ao salvar imagem recortada:', error);
            });
        }
        nSuccess();
        navigate('/cardapios');
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
                height={250}
                width={400}
            />

            <div className="row">
                <div className="card col-md-6">
                    <div className="card-header">
                        <button onClick={e => { e.stopPropagation(); navigate('/alimentos'); }} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-backspace me-2"></i>
                            Voltar
                        </button>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Alimento</h5>

                        <div className="col-md-9">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_alimento", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>                    
                </div>

                <div className="d-flex justify-content-center align-items-center col-md-6">
                    <div className='text-center flex-column d-flex align-items-center'>
                        <img
                            src={img}
                            alt="Foto do Aluno" 
                            className="img-fluid shadow-md" 
                            style={{ width: '400px', height: '250px' }}
                        />
                        <label className='btn btn-sm btn-info mt-2' htmlFor='img_aluno'>
                            <i className="bi bi-camera me-2"></i>
                            Carregar
                        </label>
                        
                        <input id='img_aluno' className='d-none' type="file" onChange={handleFileChange} />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo alimento</label>
                            <select {...register('cod_grupo_alimento', { required: 'Grupo do alimento obrigatório!' })} className="form-control">
                                <option value=''>Selecione o tipo do alimento</option>
                                {grupos.map((te, i) => (
                                    <option value={te.cod_grupo_alimento} key={i}>{te.nome_grupo_alimento}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6"></div>
                        {[
                            { campo: 'umidade', nome: '' },
                            { campo: 'energia_kcal', nome: '' },
                            { campo: 'energia_kj', nome: '' },
                            { campo: 'proteina', nome: '' },
                            { campo: 'lipideos', nome: '' },
                            { campo: 'colesterol', nome: '' },
                            { campo: 'carboidrato', nome: '' },
                            { campo: 'fibra_alimentar', nome: '' },
                            { campo: 'cinzas', nome: '' },
                            { campo: 'calcio', nome: '' },
                            { campo: 'magnesio', nome: '' },
                            { campo: 'manganes', nome: '' },
                            { campo: 'fosforo', nome: '' },
                            { campo: 'ferro', nome: '' },
                            { campo: 'sodio', nome: '' },
                            { campo: 'potassio', nome: '' },
                            { campo: 'cobre', nome: '' },
                            { campo: 'zinco', nome: '' },
                            { campo: 'retinol', nome: '' },
                            { campo: 're', nome: '' },
                            { campo: 'ra', nome: '' },
                            { campo: 'tiamina', nome: '' },
                            { campo: 'riboflavina', nome: '' },
                            { campo: 'piridoxina', nome: '' },
                            { campo: 'niacina', nome: '' },
                            { campo: 'vitamina_c', nome: '' },
                        ].map((campo, index) => (
                            <div className="col-md-2" key={index}>
                                <label className="form-label fw-bold">{capitalizeFirstLetter((campo.campo).replaceAll('_', ' '))}</label>
                                <input type="number" {...register(campo.campo)}
                                    className="form-control"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-footer">
                    <button disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
                        <i className="bi bi-check me-2"></i>
                        Confirmar
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CadAlimento;