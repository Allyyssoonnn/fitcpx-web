import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import { getModContratos, getModalidades, getPlanos } from "../api/plano";
import Select from "../components/baseComponents/select";
import { adicionarMesData, dividirParcelas, formatarCNPJ, formatarCPF, formatarMoeda } from "../utils";
import JoditEditor from "jodit-react";
import { Modal } from "react-bootstrap";
import Pagamento from "../components/pagamento";
import NumberInput from "../components/numberInput";
import MultiSelect from "../components/multipleSelect";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { sendAlunoContrato, setAlunoContrato } from "../api/aluno";
import { criarPagamentoAluno } from "../api/pagamento";
import html2pdf from 'html2pdf.js';
import SelectModalidades from "../components/selectModalidades";

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
    const [selectContrato, setSelectContrato] = useState();
    const [descricao, setDescricao] = useState([]);
    const [pagamentoInicial, setPagamentoInicial] = useState();

    const [errors, setErrors] = useState([]);

    const { data: planos, refetch } = useQuery({
        queryKey: ['planos', usuario.cod_empresa],
        queryFn: () => getPlanos(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        let tempErrors = [];
        if (!aluno?.cpf_aluno) tempErrors.push('[Cadastro do aluno incompleto] - CPF do aluno não informado.');
        if (!aluno?.email_aluno) tempErrors.push('[Cadastro do aluno incompleto] - E-mail do aluno não informado.');
        if (!aluno?.telefone_aluno) tempErrors.push('[Cadastro do aluno incompleto] - Telefone do aluno não informado.');
        if (!aluno?.endereco_aluno) tempErrors.push('[Cadastro do aluno incompleto] - Endereço do aluno não informado.');
        if (!aluno?.numero_aluno) tempErrors.push('[Cadastro do aluno incompleto] - Endereço (número) do aluno não informado.');
        if (!aluno?.estado_aluno) tempErrors.push('[Cadastro do aluno incompleto] - UF do aluno não informado.');
        if (!aluno?.cep_aluno) tempErrors.push('[Cadastro do aluno incompleto] - CEP do aluno não informado.');

        if (!empresa?.doc_empresa) tempErrors.push('[Cadastro da empresa incompleto] - CNPJ da empresa não informado');
        if (!empresa?.email_empresa) tempErrors.push('[Cadastro da empresa incompleto] - E-mail da empresa não informado');
        if (!empresa?.telefone_empresa) tempErrors.push('[Cadastro da empresa incompleto] - Telefone da empresa não informado');
        if (!empresa?.nome_empresa) tempErrors.push('[Cadastro da empresa incompleto] - Nome da empresa não informado');
        if (!empresa?.endereco_empresa) tempErrors.push('[Cadastro da empresa incompleto] - Endereço da empresa não informado');
        if (!empresa?.numero_empresa) tempErrors.push('[Cadastro da empresa incompleto] - Endereço (Número) da empresa não informado');
        if (!empresa?.cidade_empresa) tempErrors.push('[Cadastro da empresa incompleto] - Cidade da empresa não informado');
        setErrors(tempErrors);
    }, [aluno, empresa]);

    const { data: contratos } = useQuery({
        queryKey: ['contratos', usuario.cod_empresa],
        queryFn: () => getModContratos(usuario.cod_empresa),
        initialData: [],
    });

    useEffect(() => {
        const aluno = location.state?.aluno;
        aluno ? setAluno(aluno) : navigate('/dashboard');
    }, []);

    useEffect(() => {
        if (montandoPlano) {
            setPlano({ duracao_plano: 1 });
        } else setPlano();
    }, [montandoPlano]);

    useEffect(() => {
        if (!plano?.duracao_plano) return;
        var planoAtt = atualizarModalidadesComSubvariacoes(plano);
        planoAtt = calculaValoresDoPlano(planoAtt);
        setPlano(planoAtt);
    }, [plano?.duracao_plano]);

    function calculaValoresDoPlano(plano) {
        let total = 0;
        plano?.modalidades?.forEach((mod) => {
            total += mod.valor_modalidade;
        });
        total = plano.duracao_plano * total;
    
        const parcelas = dividirParcelas(plano.duracao_plano, total);
        if (plano.valor_adesao) parcelas[0] += plano.valor_adesao;

        return {
            ...plano,
            valor_plano: total,
            parcela_plano: JSON.stringify(parcelas),
        }
    }

    function atualizarModalidadesComSubvariacoes(planoAtual) {
        if (!planoAtual?.modalidades) return planoAtual;
    
        const modalidadesAtualizadas = planoAtual.modalidades.map((mod) => {
            const novaModalidade = { ...mod };

            const subVariacoes = mod?.valores;
            if (!subVariacoes?.length) return novaModalidade;
    
            const subVariacao = subVariacoes.filter(
                (v) => planoAtual.duracao_plano >= v.quantidade_modalidade_variacao_valor
            );
    
            if (!subVariacao.length) {
                novaModalidade.valor_modalidade = mod.valor_modalidade_original;
                novaModalidade.nome_modalidade = mod.nome_modalidade_original;
            } else {
                const ultima = subVariacao[subVariacao.length - 1];
                novaModalidade.cod_modalidade_variacao_valor = ultima.cod_modalidade_variacao_valor;
                novaModalidade.valor_modalidade = ultima.valor_modalidade_variacao_valor;
                novaModalidade.nome_modalidade = `${mod.nome_modalidade_original} - ${String(ultima.nome_modalidade_variacao_valor)}`;
            }
    
            return novaModalidade;
        });

        return {
            ...planoAtual,
            modalidades: modalidadesAtualizadas,
        };
    }

    useMemo(() => {
        if (selectContrato?.contrato) {            
            setContratoPreenchido(preencherContrato(selectContrato.contrato, aluno, empresa, descricao, plano, pagamentoInicial));
        }
    }, [selectContrato, aluno, empresa, descricao]);

    function confirmar(e) {
        e.preventDefault();

        if (plano?.modalidades.length <= 0) {
            toast.error('Nenhuma modalidade preenchida!');
            return;
        }

        if (!contratoPreenchido) {
            toast.error('Nenhum contrato preenchido!');
            return;
        }

        setPagando(true);
    }

    function addModalidade(modalidade) {
        const planoTemp = {...plano};
        const modalidades = [...(planoTemp?.modalidades || []), modalidade];

        var planoAtualizado = atualizarModalidadesComSubvariacoes({ ...planoTemp, modalidades });
        planoAtualizado = calculaValoresDoPlano(planoAtualizado);
        setPlano(planoAtualizado);
    }

    function removeModalidade(index) {
        setPlano(prev => ({
            ...prev,
            modalidades: prev?.modalidades.filter((m, i) => index !== i),
        }));
    }

    function updatePlano(field, value) {
        setPlano(prev => ({ ...prev, [field]: value }));
    }

    function attValue(v, i) {
        const planoTemp = {...plano};
        const modalidades = planoTemp?.modalidades.map((m, index) => index == i ? {
            ...m,
            valor_modalidade: v,
            valor_modalidade_alterado: v,
        } : planoTemp);
        var planoAtualizado = calculaValoresDoPlano({ ...planoTemp, modalidades });
        setPlano(planoAtualizado);
    }

    async function onPay(formaPagamento, closeLoading, paymentMethodId, geraContrato) {
        const alunoContrato = await setAlunoContrato({
            ...plano,
            pagamentoInicial,
            formaPagamento,
            contrato: contratoPreenchido,
            cod_aluno: aluno?.cod_aluno,
            cod_usuario: usuario?.cod_usuario,
            cod_empresa: usuario?.cod_empresa,
        });

        const pdfOptions = {
            margin: 10,
            filename: 'contrato.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().from(contratoPreenchido).set(pdfOptions).outputPdf('blob');

        if (geraContrato) await sendAlunoContrato(alunoContrato.cod_aluno_contrato, pdfBlob);

        await criarPagamentoAluno(aluno.cod_aluno, formaPagamento, empresa.cod_empresa, usuario.cod_usuario, alunoContrato.cod_aluno_contrato, paymentMethodId);
        closeLoading();
    }

    return (
        <div className="container-fluid">
            <Pagamento
                show={pagando}
                close={() => setPagando(false)}
                valor={plano?.valor_plano}
                onPay={onPay}
                duration={plano?.duracao_plano}
                callback={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}
                aluno={aluno}
            />
            <SelectPlano planos={planos} show={modalPlanos} setShow={setModalPlanos} setPlano={setPlano} />

            <div className="card">
                <div className="card-header">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body row">
                    <h5 className="card-title mb-3">Contratação de plano</h5>

                    <div className="row">
                        <div className="col-md-6 bg-light rounded p-3">
                            <h5 className="form-label">Aluno</h5>

                            <label className="fs-4 mb-2">{aluno?.nome_aluno}</label>

                            <p className="mb-1"><strong>CEP:</strong> {aluno?.cep_aluno}</p>
                            <p className="mb-1"><strong>Endereço:</strong> {aluno?.endereco_aluno}, {aluno?.numero_aluno}</p>
                            <p className="mb-1"><strong>Cidade:</strong> {aluno?.cidade_aluno} - {aluno?.estado_aluno}</p>
                            <p className="mb-1"><strong>CPF:</strong> {formatarCPF(aluno?.cpf_aluno)}</p>
                            <p className="mb-1"><strong>RG:</strong> {aluno?.rg_aluno ?? '-'}</p>
                        </div>

                        <div className="col-md-6 bg-light rounded p-3">
                            <h5 className="form-label">Empresa</h5>

                            <label className="fs-4 mb-2">{empresa?.nome_empresa}</label>

                            <p className="mb-1"><strong>CEP:</strong> {empresa?.cep_empresa}</p>
                            <p className="mb-1"><strong>Endereço:</strong> {empresa?.endereco_empresa}, {empresa?.numero_empresa}</p>
                            <p className="mb-1"><strong>Cidade:</strong> {empresa?.cidade_empresa} - {empresa?.estado_empresa}</p>
                            <p className="mb-1"><strong>CPF:</strong> {formatarCNPJ(empresa?.doc_empresa)}</p>
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <div className="d-flex justify-content-center">
                                <div className="bg-danger-subtle rounded p-2 col-md-6 mt-3">
                                    <label className="text-center w-100 mb-2">Alertas - (Solucionar pendências para avançar na contratação)</label>
                                    {errors.map((error, index) => (
                                        <p key={index} className="mb-0">{error}</p>
                                    ))}

                                    <div className="d-flex justify-content-center mt-3 gap-3">
                                        <button className="btn btn-sm btn-outline-info" onClick={() => navigate('/configuracao')}>
                                            Ir para configurações
                                        </button>

                                        <button className="btn btn-sm btn-outline-info" onClick={() => navigate('/cadaluno', { state: { aluno } })}>
                                            Cadastro do aluno
                                        </button>
                                    </div>
                                </div>
                        </div>
                    )}
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
                                    <SelectModalidades
                                        addModalidade={addModalidade}
                                        removeModalidade={removeModalidade}
                                        attValue={attValue}
                                        modalidadesPlano={plano?.modalidades}
                                    />

                                    <h5 className="card-title fs-3 mt-3">Detalhes</h5>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Duração plano (Meses)</label>
                                        <NumberInput
                                            min={1}
                                            value={plano?.duracao_plano}
                                            onChange={value => updatePlano('duracao_plano', value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="col-md-5 mt-3">
                                <label className="form-label">Primeira cobrança</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={pagamentoInicial}
                                    onChange={e => setPagamentoInicial(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body row">
                            <div className="border border-warning bg-warning-subtle fs-3 p-3 rounded mt-3 shadow-md">
                                <p className="text-center mb-0"><strong>Resumo</strong></p>

                                <p className={`${montandoPlano && 'd-none'}`}>Adesão - <strong>{formatarMoeda(plano?.valor_adesao || 0)}</strong></p>

                                {plano?.modalidades?.map((modalidade, index) => (
                                    <p className="mb-0" key={index}>{modalidade.nome_modalidade} - <strong>{formatarMoeda(modalidade.valor_modalidade)}</strong></p>
                                ))}

                                <p className="mb-0 mt-3 text-end">Total - <strong>{formatarMoeda(plano?.valor_plano || 0)}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Revisão do contrato</h5>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <Select
                                options={contratos}
                                fieldName='nome_contrato'
                                fieldValue='cod_contrato'
                                value={selectContrato?.cod_contrato}
                                onChange={(value) => setSelectContrato(value)}
                                className="mb-3"
                                label='Selecione o contrato'
                            />
                        </div>

                        <div className="col-md-6">
                            <MultiSelect
                                options={['Treinamento físico', 'Consultoria nutricional', 'Fisioterapia', 'Acesso a academia']}
                                state={descricao}
                                setState={setDescricao}
                                className="mb-3"
                                label='Selecione a descrição do serviço'
                                hideLabel={true}
                            />
                        </div>
                    </div>

                    {contratoPreenchido && (
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
                    )}
                </div>

                <div className="card-footer">
                    <button disabled={errors.length > 0} className="btn btn-success" onClick={confirmar}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}

function preencherContrato(contrato, aluno, empresa, descricao, plano, dataInicio = new Date()) {
    // Função para decodificar entidades HTML (como &lt; e &gt;)
    function decodeHtml(html) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    }

    const parcelas = JSON.parse(plano.parcela_plano);
    // const descMensalidades = parcelas.map((parcela, i) => `<p>${i + 1}. ${formatarMoeda(parcela)} pagável até o dia ${adicionarMesData(dataInicio, i)}</p>`);
    const descMensalidades = `${parcelas.map((parcela, i) => `<p style="margin-left: 20px;">${i + 1}. ${formatarMoeda(parcela)} pagável até o dia ${adicionarMesData(dataInicio, i)}</p>`).join('')}`;

    const desc = descricao && descricao.length > 0 ? descricao.join(', ') : '';
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
    preenchido = preenchido.replace(/<descricao_empresa>/g, desc);

    // Substituições de variáveis de valores
    preenchido = preenchido.replace(/<valor_total>/g, formatarMoeda(plano.valor_plano));
    preenchido = preenchido.replace(/<valor_mensal>/g, descMensalidades);

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

                <p className="mb-0"><strong>{formatarMoeda(plano?.modalidades?.reduce((valor, mod) => valor + mod.valor_modalidade, 0) + (plano?.valor_adesao ?? 0))}</strong></p>
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