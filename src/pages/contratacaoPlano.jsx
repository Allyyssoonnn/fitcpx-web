import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import { getModalidades, getPlanos } from "../api/plano";
import Select from "../components/baseComponents/select";
import { formatarCPF, formatarMoeda } from "../utils";
import JoditEditor from "jodit-react";
import { Modal } from "react-bootstrap";
import Pagamento from "../components/pagamento";

function ContratacaoPlano() {
    const [usuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);
    const location = useLocation();
    const navigate = useNavigate();

    const [aluno, setAluno] = useState();
    const [plano, setPlano] = useState();
    const [pagando, setPagando] = useState(false);
    const [modalPlanos, setModalPlanos] = useState(false);
    const [contratoPreenchido, setContratoPreenchido] = useState();
    const [montandoPlano, setMontandoPlano] = useState(false);
    const [modalModalidade, setModalModalidade] = useState(false);

    const { data: planos, refetch } = useQuery({
        queryKey: ['planos', usuario.cod_empresa],
        queryFn: () => getPlanos(usuario.cod_empresa),
        initialData: [],
    });

    const { data: modalidades } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        const aluno = location.state?.aluno;
        aluno ? setAluno(aluno) : navigate('/dashboard');
    }, []);

    useEffect(() => {
        setPlano();
    }, [montandoPlano]);

    useMemo(() => {
        if (plano?.contrato_plano) {            
            setContratoPreenchido(preencherContrato(plano.contrato_plano, aluno, empresa));
        }
    }, [plano, aluno, empresa]);

    function confirmar(e) {
        e.preventDefault();
        setPagando(true);
    }

    function openModalidade(e) {
        e.preventDefault();
        setModalModalidade(true);
    }

    function addModalidade(modalidade) {
        setPlano(prev => ({
            ...prev,
            modalidades: [...(prev?.modalidades || []), modalidade],
        }));
    }

    function removeModalidade(index) {
        setPlano(prev => ({
            ...prev,
            modalidades: prev?.modalidades.filter((m, i) => index !== i),
        }));
    }

    return (
        <div className="container-fluid">
            <Pagamento show={pagando} close={() => setPagando(false)} />
            <SelectPlano planos={planos} show={modalPlanos} setShow={setModalPlanos} setPlano={setPlano} />
            <ModalModalidades modalidades={modalidades} show={modalModalidade} setShow={setModalModalidade} addModalidade={addModalidade} />
            
            <div className="card">
                <div className="card-header">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body row">
                    <h5 className="card-title">Contratação</h5>

                    <div className="col-md-4">
                        <label className="form-label">Aluno</label>
                        <input className="form-control" value={aluno?.nome_aluno} disabled />
                    </div>

                    <p className="mb-1 mt-2"><strong>CPF:</strong> {formatarCPF(aluno?.cpf_aluno)}</p>
                    <p className="mb-1"><strong>RG:</strong> {aluno?.rg_aluno ?? '-'}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body row">
                            <div className="text-center d-flex flex-column mb-3">
                                <div className="btn-group" role="group">
                                    <button
                                        className={`btn ${!montandoPlano ? "btn-primary" : "btn-outline-primary"}`} 
                                        onClick={() => setMontandoPlano(false)}
                                    >Selecionar plano
                                    </button>

                                    <button
                                        className={`btn ${montandoPlano ? "btn-primary" : "btn-outline-primary"}`} 
                                        onClick={() => setMontandoPlano(true)}
                                    >Montar plano
                                    </button>
                                </div>
                            </div>

                            {!montandoPlano && <CardPlano plano={plano} selectPlano={() => setModalPlanos(true)} />}

                            {montandoPlano && (
                                <div className="d-flex flex-column">
                                    <button className="btn btn-outline-success" onClick={openModalidade}>Adicionar modalidade</button>

                                    <h5 className="card-title fs-3 mt-3">Modalidades</h5>

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {plano?.modalidades?.map((modalidade, index) => (
                                                    <tr key={index}>
                                                        <td>{modalidade.nome_modalidade}</td>
                                                        <td>{formatarMoeda(modalidade?.valor_modalidade || 0)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeModalidade(index)}>
                                                                <i className="bi bi-trash" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body row">
                            <div className="border border-warning bg-warning-subtle fs-3 p-3 rounded mt-3 shadow-md">
                                <p className="text-center mb-0"><strong>Resumo</strong></p>

                                <p>Adesão - <strong>{formatarMoeda(plano?.valor_adesao || 0)}</strong></p>

                                {plano?.modalidades?.map((modalidade, index) => (
                                    <p className="mb-0" key={index}>{modalidade.nome_modalidade} - <strong>{formatarMoeda(modalidade.valor_modalidade)}</strong></p>
                                ))}

                                <p className="mb-0 mt-3 text-end">Total - <strong>{formatarMoeda((plano?.valor_adesao + plano?.valor_plano) || 0)}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Revisão do contrato</h5>

                    <JoditEditor
                        value={contratoPreenchido}
                        onBlur={(newContent) => setContratoPreenchido(newContent)}
                        config={{
                            readonly: false, // ou true, se for só para visualização
                            toolbar: false, // esconde a barra de ferramentas
                            toolbarInline: false,
                            showXPathInStatusbar: false,
                            showCharsCounter: false,
                            showWordsCounter: false,
                            showStatusbar: false,
                            buttons: [], // garante que nenhum botão será carregado
                            removeButtons: "*", // remove todos os botões mesmo se algo vier do default
                        }}
                    />
                </div>

                <div className="card-footer">
                    <button className="btn btn-success" onClick={confirmar}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}

function ModalModalidades({ show, setShow, modalidades, addModalidade }) {
    const [modalidade, setModalidade] = useState();
    
    function confirmar() {
        addModalidade(modalidade);
        setShow(false);
    }

    return (
        <Modal show={show}>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Incluir modalidade</h5>
                </div>

                <div className="card-body">
                    <Select
                        options={modalidades}
                        fieldName='nome_modalidade'
                        fieldValue='cod_modalidade'
                        label='Selecionar modalidade'
                        onChange={(value) => setModalidade(value)}
                    />

                    <div className="mt-3">
                        {modalidade?.variaveis_modalidade && (
                            <Select
                                options={JSON.parse(modalidade?.variaveis_modalidade)}
                                fieldName='nome_variacao'
                                fieldValue='nome_variacao'
                                label='Selecionar variação'
                            />
                        )}
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <label className="badge bg-info w-100 fs-5">{formatarMoeda(modalidade?.valor_modalidade || 0)}</label>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-danger rounded" onClick={() => setShow(false)}>Fechar</button>
                    <button className="btn btn-success rounded" onClick={confirmar} disabled={!modalidade}>Confirmar</button>
                </div>
            </div>
        </Modal>
    )
}

function preencherContrato(contrato, aluno, empresa) {
    // Função para decodificar entidades HTML (como &lt; e &gt;)
    function decodeHtml(html) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    }

    var preenchido = decodeHtml(contrato);

    // Substituições de variáveis do aluno
    preenchido = preenchido.replace(/<nome_aluno>/g, aluno.nome_aluno || '');
    preenchido = preenchido.replace(/<cpf_aluno>/g, aluno.cpf_aluno || '');
    preenchido = preenchido.replace(/<rg_aluno>/g, aluno.rg_aluno || '');
    preenchido = preenchido.replace(/<email_aluno>/g, aluno.email_aluno || '');
    preenchido = preenchido.replace(/<endereco_aluno>/g, aluno.endereco_aluno || '');
    preenchido = preenchido.replace(/<cidade_aluno>/g, aluno.cidade_aluno || '');
    preenchido = preenchido.replace(/<estado_aluno>/g, aluno.estado_aluno || '');
    preenchido = preenchido.replace(/<numero_aluno>/g, aluno.numero_aluno || '');
    
    // Substituições de variáveis da empresa
    preenchido = preenchido.replace(/<nome_empresa>/g, empresa.nome_empresa || '');
    preenchido = preenchido.replace(/<cnpj_empresa>/g, empresa.doc_empresa || '');
    preenchido = preenchido.replace(/<endereco_empresa>/g, empresa.endereco_empresa || '');
    preenchido = preenchido.replace(/<cidade_empresa>/g, empresa.cidade_empresa || '');
    preenchido = preenchido.replace(/<estado_empresa>/g, empresa.estado_empresa || '');
    preenchido = preenchido.replace(/<numero_empresa>/g, empresa.numero_empresa || '');

    return preenchido;
}

function CardPlano({ plano, selectPlano }) {
    function select(e) {
        e.preventDefault();
        selectPlano(plano);
    }

    return (
        <div className="d-flex flex-column align-items-start border border-info bg-info-subtle rounded p-3 shadow-md">
            <div className="d-flex justify-content-between w-100 mb-3">
                <label><strong>Nome: </strong>{plano?.nome_plano ?? '-'}</label>

                <p className="mb-0"><strong>{formatarMoeda((plano?.valor_plano + plano?.valor_adesao) || 0)}</strong></p>
            </div>

            <p className="mb-0"><strong>Valor adesão:</strong> {formatarMoeda(plano?.valor_adesao)}</p>
            <p className="mb-0"><strong>Duração:</strong> {plano?.duracao_plano} {plano?.tipo_duracao_plano}</p>
            
            <button className="btn btn-sm btn-outline-info mt-3" onClick={select}>Selecionar plano</button>
        </div>
    )
}

function SelectPlano({ show, setShow, planos, setPlano }) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const planosPorPagina = 6;

    const totalPaginas = Math.ceil(planos.length / planosPorPagina);
    const inicio = (paginaAtual - 1) * planosPorPagina;
    const fim = inicio + planosPorPagina;
    const planosPaginados = planos.slice(inicio, fim);

    function select(plano) {
        setPlano(plano);
        setShow(false);
    }

    function mudarPagina(novaPagina) {
        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            setPaginaAtual(novaPagina);
        }
    }

    return (
        <Modal show={show} size="xl">
            <div className="modal-header">Selecionar plano</div>

            <div className="modal-body">
                <div className="row g-3">
                    {planosPaginados.map((cardPlano, index) => (
                        <div key={index} className="col-md-4">
                            <CardPlano plano={cardPlano} selectPlano={select} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-info rounded me-2"
                        onClick={() => mudarPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                    >Anterior</button>

                    <div className="text-muted">Página {paginaAtual} de {totalPaginas}</div>

                    <button
                        className="btn btn-outline-info rounded ms-2"
                        onClick={() => mudarPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                    >Próxima</button>
                </div>

                <button className="btn btn-danger rounded" onClick={() => setShow(false)}>Fechar</button>
            </div>
        </Modal>
    )
}

export default ContratacaoPlano;