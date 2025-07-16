import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { calcularIdade, dataURLToBlob, formatarData } from "../../utils";
import { useQuery } from "react-query";
import { changeAlunoIMG, deleteAvaliacao, getAluno, getAlunoContratos, getAvaliacoes, setAluno } from '../../api/aluno';
import { deleteTreino, getTreinos, setTreino } from '../../api/treino';
import ImageCropModal from '../../components/cutImg';
import { useRecoilState } from 'recoil';
import { stateUsuario, useNotificacao } from '../../states/states';
import Swal from 'sweetalert2';
import { getAlunoSessoesPacote } from '../../api/sessao';
import { imgProfile, PRODUCAO } from '../../api/api';
import { FitTable } from "../../components/baseComponents/FitTable";
import { ChartBar, Clipboard, Pencil, Rotate3D, Trash } from 'lucide-react';

function Aluno() {
    const { nConfirm } = useNotificacao();
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

    const { data: alunoSessoes } = useQuery({
        queryKey: ['alunoSessoes'],
        queryFn: () => getAlunoSessoesPacote(cod_aluno),
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
            setShowModal(true);
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
            
            changeAlunoIMG(formData, { cod_aluno }).then(() => {
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

    if (isLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        const statusConfig = {
            'A': { class: 'bg-success', text: 'Ativo', icon: 'bi-check-circle' },
            'B': { class: 'bg-danger', text: 'Bloqueado', icon: 'bi-x-circle' },
            'I': { class: 'bg-warning', text: 'Inativo', icon: 'bi-pause-circle' }
        };
        const config = statusConfig[status] || statusConfig['I'];
        return (
            <span className={`badge ${config.class} px-3 py-2`}>
                <i className={`bi ${config.icon} me-1`}></i>
                {config.text}
            </span>
        );
    };

    async function clickDeleteWorkout(treino) {
        nConfirm(null, "Tem certeza que deseja remover o treino?", async () => {
            await deleteTreino(treino.cod_treino);
            refetchTreino();
        });
    }

    async function clickDeletePhysicalAssessment(avaliacao) {
        nConfirm(null, "Tem certeza que deseja remover a avaliação?", async () => {
            await deleteAvaliacao(avaliacao.cod_avaliacao);
            refetchAvalicao();
        });
    }

    async function changeStatusTreino(treino) {
        await setTreino({ ...treino, status_treino: treino.status_treino == 'A' ? 'I' : 'A' });
        refetchTreino();
    }

    return (
        <div className="container-fluid">
            <ImageCropModal
                show={showModal}
                image={image}
                onConfirm={handleModalConfirm}
                onCancel={handleModalClose}
            />
            
            {/* Header Section */}
            <div className="bg-gradient-primary rounded-4 p-4 mb-4 shadow-lg">
                <div className="d-flex justify-content-between align-items-center">
                    <button 
                        onClick={() => navigate('/alunos')} 
                        className="btn btn-outline-danger rounded-pill px-4"
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Voltar
                    </button>
                </div>
            </div>

            <div className='card border-0 shadow-lg rounded-4 overflow-hidden'>
                <div className='card-body p-0'>
                    {/* Profile Header */}
                    <div className='bg-light p-5'>
                        <div className='row align-items-center'>
                            <div className='col-lg-3 col-md-4 text-center mb-4 mb-md-0'>
                                <div className="position-relative d-inline-block">
                                    <img
                                        src={aluno?.imagem_aluno ? `${aluno?.imagem_aluno}?&t=${new Date().getTime()}` : (!PRODUCAO ? imgProfile : 'https://placehold.co/150x150?text=img')}
                                        alt="Foto do Aluno" 
                                        className="img-fluid rounded-circle shadow-lg border border-4 border-white" 
                                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                    />
                                    <label className='btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center' 
                                        htmlFor='img_aluno'
                                        style={{ width: '40px', height: '40px', padding: '0' }}
                                    >
                                        <i className="bi bi-camera fs-5"></i>
                                    </label>
                                    <input id='img_aluno' className='d-none' type="file" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className='col-lg-9 col-md-8'>
                                <div className="d-flex flex-column h-100 justify-content-center">
                                    <div className="mb-3">
                                        <h1 className="fw-bold text-dark mb-2">{aluno?.nome_aluno}</h1>
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            <span className="text-muted">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {calcularIdade(aluno?.data_nascimento_aluno)} anos
                                            </span>
                                            {getStatusBadge(aluno?.status_aluno)}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-muted mb-1">
                                            <i className="bi bi-envelope me-2"></i>
                                            {aluno?.email_aluno}
                                        </p>
                                    </div>

                                    <div className='d-flex gap-3 flex-wrap'>
                                        <button 
                                            className='btn btn-outline-primary rounded-pill px-4' 
                                            onClick={() => navigate('/cadaluno', { state: { aluno } })}
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Editar Perfil
                                        </button>

                                        <button 
                                            className={`btn ${aluno?.status_aluno == 'A' ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-4`} 
                                            onClick={changeStatusAluno}
                                        >
                                            <i className={`bi bi-${aluno?.status_aluno == 'A' ? 'pause' : 'play'}-circle me-2`}></i>
                                            {aluno?.status_aluno == 'A' ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="p-4">
                        <Tabs
                            id="aluno-tabs"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="nav-tabs-custom"
                        >
                            <Tab eventKey="informacoesPessoais" title={
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-person-lines-fill me-2"></i>
                                    <span className="d-none d-md-inline">Informações Pessoais</span>
                                    <span className="d-inline d-md-none">Info</span>
                                </span>
                            }>
                                <div className="row g-4 mt-2">
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary mb-3">
                                                    <i className="bi bi-person-lines-fill me-2"></i>
                                                    Detalhes Pessoais
                                                </h5>
                                                <div className="space-y-3">
                                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                                        <span className="text-muted">Telefone:</span>
                                                        <span className="fw-semibold">{aluno?.telefone_aluno || "Não informado"}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                                        <span className="text-muted">Data de Nascimento:</span>
                                                        <span className="fw-semibold">{formatarData(aluno?.data_nascimento_aluno) || "Não informado"}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center py-2">
                                                        <span className="text-muted">Sexo:</span>
                                                        <span className="fw-semibold">{aluno?.sexo_aluno === 'M' ? 'Masculino' : 'Feminino'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary mb-3">
                                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                                    Endereço
                                                </h5>
                                                <div className="space-y-3">
                                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                                        <span className="text-muted">Endereço:</span>
                                                        <span className="fw-semibold text-end">
                                                            {!aluno?.endereco_aluno && !aluno?.numero_aluno
                                                                ? "Não informado"
                                                                : `${aluno?.endereco_aluno}, ${aluno?.numero_aluno}, ${aluno?.bairro_aluno}`}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center py-2">
                                                        <span className="text-muted">Cidade:</span>
                                                        <span className="fw-semibold">
                                                            {!aluno?.cidade_aluno && !aluno?.estado_aluno
                                                                ? "Não informado"
                                                                : `${aluno?.cidade_aluno} - ${aluno?.estado_aluno}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="avaliacaoFisica" title={
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-clipboard-data me-2"></i>
                                    <span className="d-none d-md-inline">Avaliação Física</span>
                                    <span className="d-inline d-md-none">Avaliação</span>
                                </span>
                            }>
                                <div className="mt-4">
                                    <button 
                                        id='addPhysicalAssessment' 
                                        className='btn btn-success shadow-sm mb-4'
                                        onClick={() => navigate('/cadavaliacao', { state: { aluno, ultimaAvaliacao: avaliacoes[avaliacoes.length - 1] } })}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Adicionar Avaliação
                                    </button>

                                    <div className="row g-4">
                                        <FitTable.Root
                                            hideHeader
                                            list={avaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))}
                                            fieldSearch='data_avaliacao'
                                            columns={[
                                                { name: "data_avaliacao", type: "date", header: "Data", className: "fw-bold text-black" },
                                                { name: "usuario.nome_usuario", header: "Reponsável", className: "fw-bold text-black" },
                                                { name: "altura", header: "Altura", className: "fw-bold text-black" },
                                                { name: "peso", header: "Peso", className: "fw-bold text-black" },
                                                { name: "gordura", header: "Gordura", className: "fw-bold text-black",
                                                    getValue: (row) => <div className="text-muted">{row?.result?.compositionWeight?.gordura} kg / {row?.result?.compositionPercentage?.gordura}%</div>
                                                },
                                                { name: "musculo", header: "M. Muscular", className: "fw-bold text-black",
                                                    getValue: (row) => <div className="text-muted">{row?.result?.compositionWeight?.massa_muscular} kg / {row?.result?.compositionPercentage?.massa_muscular}%</div>
                                                },
                                                { name: "mcm", header: "MCM", className: "fw-bold text-black",
                                                    getValue: (row) => <div className="text-muted">{row?.result?.compositionWeight?.mcm} kg / {row?.result?.compositionPercentage?.mcm}%</div>
                                                },
                                                { name: "Resultado", type: "option", Icon: ChartBar, onClick: (row) => navigate('/avaliacao', { state: { avaliacao: row, aluno } })},
                                                { name: "Editar", type: "option", Icon: Pencil, onClick: (row) => navigate('/cadavaliacao', { state: { avaliacao: row, aluno } })},
                                                { name: "Remover", type: "option", Icon: Trash, onClick: (row) => clickDeletePhysicalAssessment(row)},
                                            ]}
                                        />
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="treino" title={
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-card-checklist me-2"></i>
                                    <span className="d-none d-md-inline">Treinos</span>
                                    <span className="d-inline d-md-none">Treinos</span>
                                </span>
                            }>
                                <div className="mt-4">
                                    <AddTreino treinosAluno={treinos} show={modalAddTreino} close={() => setModalAddTreino(false)} aluno={aluno} />
                                    <button 
                                        id='addWorkout' 
                                        className='btn btn-success shadow-sm mb-4' 
                                        onClick={() => setModalAddTreino(true)}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Adicionar Treino
                                    </button>

                                    <div className="row g-4">
                                        <FitTable.Root
                                            hideHeader
                                            list={treinos.sort((a, b) => b.cod_treino - a.cod_treino)}
                                            fieldSearch='nome_treino'
                                            columns={[
                                                { name: "nome_treino", header: "Nome", className: "fw-bold text-black" },
                                                { name: "usuario.nome_usuario", header: "Reponsável", className: "fw-bold text-black" },
                                                { name: "nivel_treino", header: "Nível", className: "fw-bold text-black" },
                                                { name: "sessoes", header: "Sessão(s)", className: "fw-bold text-black",
                                                    getValue: (row) => row?.sessoes?.length
                                                },
                                                { name: "status_treino", header: "Status", className: "fw-bold text-black",
                                                    getValue: (row) => row.status_treino == 'A'
                                                    ? <div className='badge bg-success'>Ativo</div>
                                                    : <div className='badge bg-danger'>Inativo</div>
                                                },
                                                { name: "Editar", type: "option", Icon: Pencil, onClick: (row) => navigate('/cadtreino', { state: { treino: row, aluno } })},
                                                { name: "Remover", type: "option", Icon: Trash, onClick: (row) => clickDeleteWorkout(row)},
                                                { name: "Mudar status", type: "option", Icon: Rotate3D, onClick: (row) => changeStatusTreino(row)},
                                            ]}
                                        />
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="contratos" title={
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-paperclip me-2"></i>
                                    <span className="d-none d-md-inline">Contratos</span>
                                    <span className="d-inline d-md-none">Contratos</span>
                                </span>
                            }>
                                <div className="mt-4">
                                    <button 
                                        className='btn btn-success shadow-sm mb-4' 
                                        onClick={() => navigate('/contratacaoplano', { state: { aluno } })}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Contratar Plano
                                    </button>

                                    <div className="row g-4">
                                        <FitTable.Root
                                            hideHeader
                                            list={alunoContratos}
                                            fieldSearch='nome_aluno_contrato'
                                            columns={[
                                                { name: "cod_aluno_contrato", header: "ID", className: "fw-bold text-black" },
                                                { name: "nome_aluno_contrato", header: "Nome", className: "fw-bold text-black" },
                                                { name: "expiracao_aluno_contrato", type: "date", header: "Expiração", className: "fw-bold text-black" },
                                                { name: "total_aluno_contrato", type: "currency", header: "Expiração", className: "fw-bold text-black" },
                                                { name: "status_aluno_contrato", header: "Status", className: "fw-bold text-black",
                                                    getValue: (row) => row.status_aluno_contrato == 'Ativo'
                                                    ? <div className='badge bg-success'>Ativo</div>
                                                    : <div className='badge bg-danger'>Inativo</div>
                                                },
                                                { name: "Ver contrato", type: "option", Icon: Clipboard, onClick: (row) => navigate('/contrato', { state: { cod_aluno_contrato: row.cod_aluno_contrato, cod_aluno: aluno.cod_aluno } })},
                                            ]}
                                        />
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddTreino({ show, close, aluno, treinosAluno }) {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();

    const [importando, setImportando] = useState(false);
    const [reajuste, setReajuste] = useState(false);
    const [treinoSelecionado, setTreinoSelecionado] = useState(null);

    const { data: treinos } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getTreinos({ cod_empresa: usuario.cod_empresa }),
        initialData: [],
    });

    const tooltip = (
        <Tooltip id="tooltip">
            <div><strong>Novo:</strong> Crie um treino personalizado do zero.</div>
            <div className="my-2"><strong>Importar:</strong> Escolha um treino de base do sistema.</div>
            <div><strong>Reajuste:</strong> Utilize o último treino ativo para ajustes.</div>
        </Tooltip>
    );

    function selectTreino(cod_treino) {
        if (!cod_treino) return setTreinoSelecionado(null);

        const lista = reajuste ? treinosAluno : treinos;
        const treino = lista.find(v => String(v.cod_treino) === String(cod_treino));

        if (treino) setTreinoSelecionado(treino);
    }

    function abreTreino() {
        const { cod_treino, ...treinoSemCod } = treinoSelecionado;
        treinoSemCod.sessoes = treinoSemCod.sessoes.map((s) => {
            const { cod_sessao: _cod_sessao, cod_treino: _sessionCodTreino, ...session } = s;
            return session;
        })
        navigate('/cadtreino', { state: { aluno, treino: treinoSemCod } });
    }

    function changeMode(mode) {
        setImportando(mode === 'importar');
        setReajuste(mode === 'reajuste');
        setTreinoSelecionado(null);
    }

    const listTreinos = useMemo(() => (
        reajuste ? treinosAluno : treinos
    ), [treinos, treinosAluno, reajuste]);

    return (
        <Modal show={show} className="modal-fade">
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4">

                    {/* Header */}
                    <div className="modal-header bg-gradient-primary border-0 rounded-top-4 justify-between">
                        <div>
                            <h4 className="mb-1 fw-bold">Adicionar Treino</h4>
                            <h6 className="mb-0 opacity-75">{aluno?.nome_aluno}</h6>
                        </div>

                        <OverlayTrigger placement="bottom" overlay={tooltip}>
                            <i className="bi bi-info-circle fs-4 opacity-75" style={{ cursor: 'pointer' }}></i>
                        </OverlayTrigger>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex flex-wrap gap-3 justify-content-center p-4">
                        <button
                            id='newWorkoutMethod'
                            className="btn btn-outline-success rounded-pill flex-fill shadow-sm"
                            style={{ minWidth: '150px' }}
                            onClick={() => navigate('/cadtreino', { state: { aluno } })}
                        >
                            <i className="bi bi-file-earmark-plus fs-5 me-2"></i>
                            Novo treino
                        </button>

                        <button
                            className={`btn ${importando ? 'btn-info' : 'btn-outline-info'} rounded-pill flex-fill shadow-sm`}
                            style={{ minWidth: '150px' }}
                            onClick={() => changeMode('importar')}
                        >
                            <i className="bi bi-upload fs-5 me-2"></i>
                            Importar base
                        </button>

                        <button
                            className={`btn ${reajuste ? 'btn-info' : 'btn-outline-info'} rounded-pill flex-fill shadow-sm`}
                            style={{ minWidth: '150px' }}
                            onClick={() => changeMode('reajuste')}
                        >
                            <i className="bi bi-gear fs-5 me-2"></i>
                            Reajuste
                        </button>
                    </div>

                    {/* Select treino */}
                    {(importando || reajuste) && (
                        <div className="px-4 pb-3">
                            <label className="form-label fw-semibold">Selecione o treino</label>
                            <select
                                className="form-select rounded-pill border-2"
                                value={treinoSelecionado?.cod_treino || ''}
                                onChange={e => selectTreino(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                {listTreinos.map((treino, i) => (
                                    <option key={i} value={treino.cod_treino}>
                                        {treino.nome_treino} - {new Date(treino.createdAt).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="modal-footer border-0 bg-light rounded-bottom-4">
                        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={close}>
                            Fechar
                        </button>

                        {(importando || reajuste) && (
                            <button
                                className="btn btn-info rounded-pill px-4"
                                disabled={!treinoSelecionado?.cod_treino}
                                onClick={abreTreino}
                            >
                                Selecionar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Aluno;