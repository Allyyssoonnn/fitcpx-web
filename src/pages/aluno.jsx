import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { calculaKGGordura, calculaKGMCM, calculaKGMusculo, calculaPorcentagemGordura, calculaPorcentagemMCM, calculaPorcentagemMusculo, calcularIdade, dataURLToBlob, formatarData, formatarMoeda, getSexo } from "../utils";
import { useQuery } from "react-query";
import { changeAlunoIMG, deleteAvaliacao, getAluno, getAlunoContratos, getAvaliacao, getAvaliacoes, setAluno } from '../api/aluno';
import { deleteTreino, getTreinos, setTreino } from '../api/treino';
import { deleteCardapio, getCardapios, setCardapio } from '../api/cardapio';
import ImageCropModal from '../components/cutImg';
import PopConfirm from '../components/popConfirm';
import { useRecoilState } from 'recoil';
import { stateUsuario } from '../states/states';
import Swal from 'sweetalert2';

function Aluno() {
    const location = useLocation();
    const navigate = useNavigate();
    const cod_aluno = location.state?.cod_aluno;
    const [key, setKey] = useState('informacoesPessoais');
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [modalAddTreino, setModalAddTreino] = useState(false);
    
    const { data: aluno, isLoading, refetch: refetchAluno } = useQuery({
        queryKey: ['aluno'],
        queryFn: () => getAluno(cod_aluno),
        enabled: !!cod_aluno
    });

    const { data: treinos, refetch: refetchTreino } = useQuery({
        queryKey: ['treinos'],
        queryFn: () => getTreinos({ cod_aluno }),
        initialData: [],
        enabled: !!cod_aluno
    });

    const { data: avaliacoes, refetchAvalicao } = useQuery({
        queryKey: ['avaliacoes'],
        queryFn: () => getAvaliacoes(null, cod_aluno),
        initialData: [],
        enabled: !!cod_aluno
    });

    const { data: alunoContratos, refetch: refetchContrato } = useQuery({
        queryKey: ['alunoContratos'],
        queryFn: () => getAlunoContratos(cod_aluno),
        initialData: [],
        enabled: !!cod_aluno
    });

    const { data: cardapios, refetch: refetchCardapio } = useQuery({
        queryKey: ['cardapios'],
        queryFn: () => getCardapios({ cod_aluno }),
        initialData: []
    });

    useEffect(() => {
        if (!cod_aluno) navigate('/alunos');
    }, []);

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

    async function changeStatusAluno() {
        Swal.fire({
            title: "Carregando...",
            text: "Aguarde",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        await setAluno({ ...aluno, status_aluno: aluno.status_aluno == 'I' ? 'A' : 'I' });
        refetchAluno();
        Swal.close();
    }

    if (isLoading) return <></>;

    return (
        (<div className="container-fluid">
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
            />
            <div className='card'>
                <div className='card-header'>
                    <button onClick={() => navigate('/alunos')} className="btn btn-danger mb-3">
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
                                style={{ width: '150px' }}
                            />
                            <label className='btn btn-sm btn-info mt-2' htmlFor='img_aluno'>
                                <i className="bi bi-camera me-2"></i>
                                Carregar
                            </label>
                            
                            <input id='img_aluno' className='d-none' type="file" onChange={handleFileChange} />
                        </div>

                        <div className={`col-sm-8 ${window.innerWidth < 900 ? 'text-center' : ''} mt-4`}>
                            <h3>{aluno?.nome_aluno}</h3>
                            
                            <p>
                                <label>{calcularIdade(aluno?.data_nascimento_aluno)} Anos</label>

                                <label className={`ms-2 bg-opacity-50 px-2 rounded-3
                                    ${aluno?.status_aluno === 'A' ? 'bg-success' : ''}
                                    ${aluno?.status_aluno === 'B' ? 'bg-danger' : ''}
                                    ${aluno?.status_aluno === 'I' ? 'bg-warning' : ''}
                                    `}>
                                    {aluno?.status_aluno === 'A' ? 'Ativo' : ''}
                                    {aluno?.status_aluno === 'B' ? 'Bloqueado' : ''}
                                    {aluno?.status_aluno === 'I' ? 'Inativo' : ''}
                                </label>
                            </p>

                            <p>Email: {aluno?.email_aluno}</p>

                            <div className='row'>
                                <button className='btn btn-outline-info me-2 col-md-3 mt-2' onClick={() => navigate('/contratacaoplano', { state: { aluno } })}>
                                    <i className="bi bi-card-text me-2"></i>
                                    <span className='d-iline-block d-md-none'>Contratar</span>
                                    <span className='d-none d-md-inline-block'>Contratar plano</span>
                                </button>

                                <button className='btn btn-warning me-2 col-md-3 mt-2' onClick={() => navigate('/cadaluno', { state: { aluno } })}>
                                    <i className="bi bi-pencil me-2"></i>
                                    Editar
                                </button>

                                <button className={`btn btn-${aluno?.status_aluno == 'A' ? 'danger' : 'success'} me-2 col-md-3 mt-2`} onClick={changeStatusAluno}>
                                    <i className={`bi bi-${aluno?.status_aluno == 'A' ? 'x' : 'check'}-circle me-2`}></i>
                                    {aluno?.status_aluno == 'A' ? 'Desativar ' : 'Ativar '}
                                    <span className='d-none d-md-inline-block'>aluno</span>
                                </button>
                            </div>

                            {/* <button className='btn btn-success me-2' onClick={() => navigate('/cadavaliacao', { state: { aluno } })}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Nova Avaliação
                            </button> */}
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
                                <div className="card shadow-sm mb-3 bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title text-primary"><i className="bi bi-person-lines-fill me-2"></i>Detalhes Pessoais</h5>
                                        <p className="mb-1"><strong>Telefone:</strong> {aluno?.telefone_aluno || "Não informado"}</p>
                                        <p className="mb-1"><strong>Data de Nascimento:</strong> {formatarData(aluno?.data_nascimento_aluno) || "Não informado"}</p>
                                        <p className="mb-0"><strong>Sexo:</strong> {aluno?.sexo_aluno === 'M' ? 'Masculino' : 'Feminino'}</p>
                                    </div>
                                </div>
                                
                                <div className="card shadow-sm bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title text-secondary"><i className="bi bi-geo-alt-fill me-2"></i>Endereço</h5>
                                        <p className="mb-1">
                                            <strong>Endereço: </strong> 
                                            {!aluno?.endereco_aluno && !aluno?.numero_aluno
                                                ? "Não informado"
                                                : `${aluno?.endereco_aluno}, ${aluno?.numero_aluno}, ${aluno?.bairro_aluno}`}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Cidade: </strong> 
                                            {!aluno?.cidade_aluno && !aluno?.estado_aluno
                                                ? "Não informado"
                                                : `${aluno?.cidade_aluno} - ${aluno?.estado_aluno}`}
                                        </p>
                                    </div>
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

                                {avaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))
                                .map((avaliacao, index) => (
                                    <CardAvaliacao key={index} avaliacao={avaliacao} aluno={aluno} refetch={refetchAvalicao} />
                                ))}
                            </div>
                        </Tab>

                        <Tab eventKey="treino" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-card-checklist me-2"></i>Treinos</span>
                                <span className="d-block d-md-none"><i className="bi bi-card-checklist me-2"></i>Treinos</span>
                            </>
                        }>
                            <div className='text-center'>
                                <AddTreino show={modalAddTreino} close={() => setModalAddTreino(false)} aluno={aluno} />
                                <button className='btn btn-success w-100 rounded-2' onClick={() => setModalAddTreino(true)}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Treino
                                </button>

                                {treinos.sort((a, b) => b.cod_treino - a.cod_treino)
                                .map((treino, index) => (
                                    <CardTreino key={index} treino={treino} aluno={aluno} refetch={refetchTreino} />
                                ))}
                            </div>
                        </Tab>

                        <Tab eventKey="cardapio" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-book me-2"></i>Cardápio</span>
                                <span className="d-block d-md-none"><i className="bi bi-book me-2"></i>Cardápio</span>
                            </>
                        }>
                            <div className='text-center'>
                                <button className='btn btn-success w-100 rounded-2' onClick={() => navigate('/cadcardapio', { state: { aluno } })}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Cardápio
                                </button>

                                {cardapios?.map((cardapio, index) => (
                                    <CardCardapio key={index} cardapio={cardapio} aluno={aluno} refetch={refetchCardapio} />
                                ))}
                            </div>
                        </Tab>

                        <Tab eventKey="contratos" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-paperclip me-2"></i>Contratos</span>
                                <span className="d-block d-md-none"><i className="bi bi-paperclip me-2"></i>Contratos</span>
                            </>
                        }>
                            <div className='text-center'>
                                {/* <button className='btn btn-success w-100 rounded-2' onClick={() => navigate('/cadcardapio', { state: { aluno } })}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Cardápio
                                </button> */}

                                {alunoContratos?.map((alunoContrato, index) => (
                                    <CardContrato key={index} alunoContrato={alunoContrato} aluno={aluno} refetch={refetchContrato} />
                                ))}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>)
    );
}

function AddTreino({ show, close, aluno }) {
    const [usuario] = useRecoilState(stateUsuario); 
    const navigate = useNavigate();

    const [importando, setImportando] = useState(false);
    const [reajuste, setReajuste] = useState(false);

    const { data: treinos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getTreinos({ cod_empresa: usuario.cod_empresa }),
        initialData: [],
    });

    const tooltip = (
        <Tooltip id="tooltip">
            <div>
                <strong>Novo:</strong> Crie um treino personalizado do zero.
            </div>
            <p></p>
            <p></p>
            <div>
                <strong>Importar:</strong> Escolha um treino de base do sistema.
            </div>
            <p></p>
            <div>
                <strong>Reajuste:</strong> Utilize o último treino ativo para ajustes.
            </div>
        </Tooltip>
    );

    return (
        <Modal show={show} className="modal-fade">
            <div className="modal-dialog-scrollable modal-lg">
                <div className='modal-content'>
                    <div className='modal-header d-flex flex-row justify-content-between align-items-start'>
                        <div>
                            <h4>Adicionar treino</h4>
                            <h6>{aluno?.nome_aluno}</h6>
                        </div>

                        <OverlayTrigger placement="bottom" overlay={tooltip}>
                            <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: 'pointer' }}></i>
                        </OverlayTrigger>
                    </div>

                    <div className="d-flex flex-row justify-content-around p-3">
                        <button className='btn btn-outline-success rounded-1 w-30' onClick={() => navigate('/cadtreino', { state: { aluno } })}>
                            Novo treino
                            <br></br>
                            <i className="bi bi-file-earmark-plus"></i>
                        </button>

                        <button disabled className='btn btn-outline-info rounded-1 w-30' onClick={() => setImportando(true)}>
                            Importar base
                            <br></br>
                            <i className="bi bi-upload"></i>
                        </button>

                        <button disabled className='btn btn-outline-info rounded-1 w-30' onClick={() => setReajuste(true)}>
                            Reajuste
                            <br></br>
                            <i className="bi bi-gear"></i>
                        </button>
                    </div>
                </div>

                <div className='modal-footer'>
                    <button className='btn btn-danger' onClick={close}>
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

function CardCardapio({ cardapio, aluno, refetch }) {
    const navigate = useNavigate();

    async function changeStatusTreino() {
        await setCardapio({ ...cardapio, status_cardapio: cardapio.status_cardapio == 'A' ? 'I' : 'A' });
        refetch();
    }

    async function clickDelete() {
        await deleteCardapio(cardapio.cod_cardapio);
        refetch();
    }
    
    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <div style={{ position: 'absolute' }}>
                    <PopConfirm confirm={clickDelete} />
                </div>

                <h5 className="card-title">{cardapio.nome_cardapio}</h5>

                <div className='row'>
                    <div className='col-md-3'>
                        <strong>Responsável:</strong> {cardapio.usuario?.nome_usuario}
                    </div>
                    {/* <div className='col-md-3'>
                        <strong>Nível:</strong> {cardapio.nivel_treino}
                    </div> */}
                    {/* <div className='col-md-3'>
                        <strong>Sexo:</strong> {getSexo(cardapio.sexo_treino)}
                    </div> */}
                    <div className='col-md-3'>
                        <strong></strong> {cardapio?.refeicoes?.length} {cardapio?.refeicoes?.length > 1 ? 'Refeições' : 'Refeição'}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => navigate('/cadcardapio', { state: { cardapio, aluno } })}
                >
                    <i className="bi bi-pencil me-2"></i>Editar
                </button>

                <button className="btn btn-info d-flex align-items-center" onClick={changeStatusTreino}>
                    <i className="bi bi-ban me-2"></i>{cardapio.status_treino == 'A' ? 'Desativar' : 'Ativar'}
                </button>
            </div>
        </div>
    )
}

function CardTreino({ treino, aluno, refetch }) {
    const navigate = useNavigate();

    async function changeStatusTreino() {
        await setTreino({ ...treino, status_treino: treino.status_treino == 'A' ? 'I' : 'A' });
        refetch();
    }

    async function clickDelete() {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Tem certeza que deseja remover o treino?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteTreino(treino.cod_treino);
                refetch();
            }
        })
    }

    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <div style={{ position: 'absolute' }}>
                    <a href="#" className="text-danger" onClick={clickDelete}>
                        <i className="bi bi-trash me-2"></i>
                    </a>
                </div>

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
                        <strong></strong> {treino?.sessoes?.length} {treino?.sessoes?.length > 1 ? 'Sessões' : 'Sessão'}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => navigate('/cadtreino', { state: { treino, aluno } })}
                >
                    <i className="bi bi-pencil me-2"></i>Editar
                </button>

                <button className="btn btn-info d-flex align-items-center" onClick={changeStatusTreino}>
                    <i className="bi bi-ban me-2"></i>{treino.status_treino == 'A' ? 'Desativar' : 'Ativar'}
                </button>
            </div>
        </div>
    )
}

function CardAvaliacao({ avaliacao, aluno, refetch }) {
    const navigate = useNavigate();
    
    async function clickDelete() {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Tem certeza que deseja remover a avaliação?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteAvaliacao(avaliacao.cod_avaliacao);
                refetch();
            }
        })
        refetch();
    }

    return (
        <div className="card shadow-sm rounded-3 border-0 bg-white mt-4">
            <div style={{ borderTop: '0.30rem solid #85D446' }} className="card-body rounded-3">
                <div style={{ position: 'absolute' }}>
                    <PopConfirm confirm={clickDelete} />
                </div>

                <h5 className="card-title">Avaliação Física</h5>
                <div className="row">
                    <div className="col-md-4">
                        <strong>Data:</strong> {formatarData(avaliacao.data_avaliacao)}
                    </div>
                    <div className="col-md-4">
                        <strong>Altura:</strong> {avaliacao.altura} m
                    </div>
                    <div className="col-md-4">
                        <strong>Peso:</strong> {avaliacao.peso} kg
                    </div>
                    <div className="col-md-4">
                        <strong>Gord.:</strong> {calculaKGGordura(aluno, avaliacao)} KG / {calculaPorcentagemGordura(aluno, avaliacao)} %
                    </div>
                    <div className="col-md-4">
                        <strong>Musc.:</strong> {calculaKGMusculo(aluno, avaliacao)} KG / {calculaPorcentagemMusculo(aluno, avaliacao)} %
                    </div>
                    <div className="col-md-4">
                        <strong>MCM:</strong> {calculaKGMCM(aluno, avaliacao)} KG / {calculaPorcentagemMCM(aluno, avaliacao)} %
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

function CardContrato({ alunoContrato, aluno, refetch }) {
    const navigate = useNavigate();

    async function verContrato() {
        navigate('/contrato', { state: { cod_aluno_contrato: alunoContrato.cod_aluno_contrato, cod_aluno: aluno.cod_aluno } });
    }
    
    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <h5 className="card-title">{alunoContrato.nome_aluno_contrato}</h5>

                <div className='row'>
                    <div className='col-md-3'>
                        <strong>Valor contrato:</strong> {formatarMoeda(alunoContrato.total_aluno_contrato)}
                    </div>
                    <div className='col-md-3'>
                        <strong>Período:</strong> {JSON.parse(alunoContrato.parcela_aluno_contrato).length} Meses
                    </div>
                    <div className='col-md-3'>
                        <strong>Expiração:</strong> {formatarData(alunoContrato.expiracao_aluno_contrato)}
                    </div>
                    <div className='col-md-3'>
                        {alunoContrato.status_aluno_contrato == 'P' && <label className="badge bg-warning">Pendente</label>}
                        {alunoContrato.status_aluno_contrato == 'B' && <label className="badge bg-danger">Bloqueado</label>}
                        {alunoContrato.status_aluno_contrato == 'B' && <label className="badge bg-danger">Cancelado</label>}
                        {alunoContrato.status_aluno_contrato == 'B' && <label className="badge bg-success">Ativo</label>}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                {/* <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => navigate('/cadcardapio', { state: { cardapio, aluno } })}
                >
                    <i className="bi bi-pencil me-2"></i>Editar
                </button> */}

                <button className="btn btn-info d-flex align-items-center" onClick={verContrato}>
                    <i className="bi bi-list me-2"></i> Detalhes
                </button>
            </div>
        </div>
    )
}

export default Aluno;