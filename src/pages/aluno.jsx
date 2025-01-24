import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { calcularIdade, dataURLToBlob, getSexo } from "../utils";
import { useQuery } from "react-query";
import { changeAlunoIMG, getAluno } from '../api/aluno';
import { getTreinos } from '../api/treino';
import ImageCropModal from '../components/cutImg';

function Aluno() {
    const location = useLocation();
    const navigate = useNavigate();
    const cod_aluno = location.state?.cod_aluno;
    const [key, setKey] = useState('informacoesPessoais');
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    // const [treinos] = useState([
    //     { nome_treino: '3x Musc.', nivel_treino: 'Avançado', sexo_treino: 'Masculino', nome_usuario: 'Alyson' },
    // ]);

    const { data: aluno, isLoading } = useQuery({
        queryKey: ['aluno'],
        queryFn: () => getAluno(cod_aluno),
    });

    const { data: treinos } = useQuery({
        queryKey: ['treinos'],
        queryFn: () => getTreinos({ cod_aluno }),
        initialData: []
    });

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

    const handleModalClose = () => {
        setShowModal(false);
        if (cropper) cropper.destroy();
        setCropper(null);
    };

    const handleModalConfirm = (croppedImage) => {
        if (croppedImage) {
            const croppedBlob = dataURLToBlob(croppedImage);

            const formData = new FormData();
            formData.append('image', croppedBlob, 'cropped_image.jpg'); 
            
            // Save the cropped image
            changeAlunoIMG(formData, { cod_aluno }).then(resp => {
                //Preencher o ID
                // =============
                //
                setShowModal(false);
                setCropper(null);
            }).catch((error) => {
                console.error('Erro ao salvar imagem recortada:', error);
            });
        }
    };

    if (isLoading) return <></>;

    return (
        <div className="container-fluid">
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
            />

            <div className='card'>
                <div className='card-header'>
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className='card-body'>
                    <div className='row mb-5'>
                        <div className='col-sm-3 text-center flex-column d-flex align-items-center'>
                            <img
                                src={aluno?.imagem_aluno ? `${aluno?.imagem_aluno}?&t=${new Date().getTime()}` : 'https://placehold.co/150x150?text=img'}
                                alt="Foto do Aluno" 
                                className="img-fluid rounded-circle shadow-md" 
                                style={{ width: '150px', height: '150px' }}
                            />
                            <label className='btn btn-sm btn-info mt-2' htmlFor='img_aluno'>
                                <i className="bi bi-camera me-2"></i>
                                Carregar
                            </label>
                            
                            <input id='img_aluno' className='d-none' type="file" onChange={handleFileChange} />
                        </div>

                        <div className={`col-sm-8 ${window.innerWidth < 900 ? 'text-center' : ''} mt-4`}>
                            <div className='d-flex align-items-center'>
                                <h3>{aluno?.nome_aluno}</h3>
                                <label className={`ms-2 bg-opacity-50 px-2 rounded-3
                                    ${aluno.status_aluno === 'A' ? 'bg-success' : ''}
                                    ${aluno.status_aluno === 'B' ? 'bg-danger' : ''}
                                    ${aluno.status_aluno === 'I' ? 'bg-warning' : ''}
                                `}>
                                    {aluno.status_aluno === 'A' ? 'Ativo' : ''}
                                    {aluno.status_aluno === 'B' ? 'Bloqueado' : ''}
                                    {aluno.status_aluno === 'I' ? 'Inativo' : ''}
                                </label>
                            </div>
                            <p>{calcularIdade(aluno?.data_nascimento_aluno)} Anos</p>
                            <p>Email: {aluno?.email_aluno}</p>
                            <button className='btn btn-warning me-2' onClick={() => navigate('/cadaluno', { state: { aluno } })}>
                                <i className="bi bi-pencil me-2"></i>
                                Editar
                            </button>

                            <button className='btn btn-success me-2' onClick={() => navigate('/cadavaliacao', { state: { aluno } })}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Nova Avaliação
                            </button>
                        </div>
                    </div>

                    <hr className="my-4 border-1 border-black rounded-pill"></hr>

                    <Tabs
                        id="aluno-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className={`mb-3 d-flex ${window.innerWidth < 900 ? 'justify-content-center' : ''}`}
                    >
                        <Tab eventKey="informacoesPessoais" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-person me-2"></i>Informações Pessoais</span>
                                <span className="d-block d-md-none"><i className="bi bi-person me-2"></i>Info</span>
                            </>
                        }>
                            <div>
                                <div className="p-3 bg-light rounded">
                                    <h5>Detalhes Pessoais</h5>
                                    <p><strong>Telefone:</strong> {aluno?.telefone_aluno}</p>
                                    <p><strong>Data de Nascimento:</strong> {aluno?.data_nascimento_aluno}</p>
                                    <p><strong>Sexo:</strong> {aluno?.sexo_aluno === 'M' ? 'Masculino' : 'Feminino'}</p>
                                </div>

                                <div className="p-3 bg-light rounded mt-3">
                                    <h5>Endereço</h5>
                                    <p>
                                        <strong>Endereço: </strong>
                                        {!aluno?.endereco_aluno && !aluno?.numero_aluno
                                            ? (`Não informado`)
                                            : (`${aluno?.endereco_aluno}, ${aluno?.numero_aluno}, ${aluno?.bairro_aluno}`)
                                        }
                                    </p>
                                    <p>
                                        <strong>Cidade: </strong>
                                        {!aluno?.cidade_aluno && !aluno?.estado_aluno
                                            ? (`Não informado`)
                                            : (`${aluno?.cidade_aluno} - ${aluno?.estado_aluno}`)
                                        }
                                    </p>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="avaliacaoFisica" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-clipboard-data me-2"></i>Avaliação Física</span>
                                <span className="d-block d-md-none"><i className="bi bi-clipboard-data me-2"></i>Avaliação</span>
                            </>
                        } >
                            <div className='text-center'>
                                <button className='btn btn-success w-100 rounded-2' onClick={() => navigate('/cadavaliacao', { state: { aluno } })}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Avaliação
                                </button>

                                {aluno?.avaliacao?.map((avaliacao, index) => (
                                    <CardAvaliacao key={index} avaliacao={avaliacao} aluno={aluno} />
                                ))}
                            </div>
                        </Tab>

                        <Tab eventKey="treino" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-card-checklist me-2"></i>Treinos</span>
                                <span className="d-block d-md-none"><i className="bi bi-card-checklist me-2"></i>Treinos</span>
                            </>
                        } >
                            <div className='text-center'>
                                <button className='btn btn-success w-100 rounded-2' onClick={() => navigate('/cadtreino', { state: { aluno } })}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Treino
                                </button>

                                {treinos?.map((treino, index) => (
                                    <CardTreino key={index} treino={treino} aluno={aluno} />
                                ))}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

function CardTreino({ treino, aluno }) {
    const navigate = useNavigate();
    
    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <h5 className="card-title">{treino.nome_treino}</h5>
                <div className='row'>
                    <div className='col-md-3'>
                        <strong>Responsável:</strong> {treino.usuario?.nome_usuario}
                    </div>
                    <div className='col-md-3'>
                        <strong>Nível:</strong> {treino.nivel_treino}
                    </div>
                    <div className='col-md-3'>
                        <strong>Sexo:</strong> {getSexo(treino.sexo_treino)}
                    </div>
                    <div className='col-md-3'>
                        <strong>Sexo:</strong> {treino?.sessoes?.length} {treino?.sessoes?.length > 1 ? 'Sessões' : 'Sessão'}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => navigate('/cadtreino', { state: { treino } })}
                >
                    <i className="bi bi-pencil me-2"></i>Editar
                </button>
                <button
                    className="btn btn-warning d-flex align-items-center"
                    onClick={() => navigate('/avaliacao', { state: { avaliacao, aluno } })}
                    disabled
                >
                    <i className="bi bi-printer me-2"></i>Ver treino
                </button>
            </div>
        </div>
    )
}

function CardAvaliacao({ avaliacao, aluno }) {
    const navigate = useNavigate();

    return (
        <div className="card shadow-sm rounded-3 border-0 bg-white mt-4">
            <div style={{ borderTop: '0.30rem solid #85D446' }} className="card-body rounded-3">
                <h5 className="card-title">Avaliação Física</h5>
                <div className="row">
                    <div className="col-md-4">
                        <strong>Data:</strong> {avaliacao.data_avaliacao}
                    </div>
                    <div className="col-md-4">
                        <strong>Altura:</strong> {avaliacao.altura} m
                    </div>
                    <div className="col-md-4">
                        <strong>Peso:</strong> {avaliacao.peso} kg
                    </div>
                </div>
            </div>

            <div className="card-footer bg-light d-flex justify-content-around py-3">
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => navigate('/cadavaliacao', { state: { avaliacao, aluno } })}
                >
                    <i className="bi bi-pencil me-2"></i> Editar
                </button>
                <button
                    className="btn btn-warning d-flex align-items-center"
                    onClick={() => navigate('/avaliacao', { state: { avaliacao, aluno } })}
                >
                    <i className="bi bi-printer me-2"></i> Ver resultado
                </button>
            </div>
        </div>
    )
}

export default Aluno;