import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import { formatarCNPJ, formatarCPF, formatarMoeda } from "../utils";
import SelectModalidades from "../components/selectModalidades";
import NumberInput from "../components/numberInput";
import { toast } from "react-toastify";
import { createPaySessao, setAlunoSessaoPacote } from "../api/sessao";
import Pagamento from "../components/payment/pagamento";


function ContratacaoSessao() {
    const [empresa] = useRecoilState(stateEmpresa);
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const location = useLocation();
    const [pacote, setPacote] = useState();
    const [aluno, setAluno] = useState();
    const [sessaoAvulsa, setSessaoAvulsa] = useState(false);
    const [errors, setErrors] = useState([]);
    const [pagando, setPagando] = useState(false);

    useEffect(() => {
        const aluno = location.state?.aluno;
        aluno ? setAluno(aluno) : navigate('/dashboard');
    }, []);

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

    useEffect(() => {
        if (sessaoAvulsa) {
            setPacote({});
        } else setPacote();
    }, [sessaoAvulsa]);

    function updatePlano(field, value) {
        setPacote(prev => ({ ...prev, [field]: value }));
    }

    function addModalidade(modalidade) {
        const planoTemp = {...pacote};
        const modalidades = [...(planoTemp?.modalidades || []), modalidade];

        let total = 0;
        modalidades?.forEach((mod) => total += ((mod.quantidade_modalidade || 1) * mod.valor_modalidade));
        var planoAtualizado = { ...planoTemp, modalidades, valor_plano: total };
        setPacote(planoAtualizado);
    }

    function removeModalidade(index) {
        const modalidades = pacote?.modalidades?.filter((m, i) => index !== i);
        let total = 0;
        modalidades?.forEach((mod) => total += ((mod.quantidade_modalidade || 1) * mod.valor_modalidade));
        var planoAtualizado = { ...pacote, modalidades, valor_plano: total };
        setPacote(planoAtualizado);
    }

    function attValue(v, i) {
        const planoTemp = {...pacote};
        const modalidades = planoTemp?.modalidades.map((m, index) => index == i ? {
            ...m,
            valor_modalidade: v,
            valor_modalidade_alterado: v,
        } : planoTemp);
        let total = 0;
        modalidades?.forEach((mod) => total += mod.valor_modalidade);
        var planoAtualizado = { ...planoTemp, modalidades, valor_plano: total };
        setPacote(planoAtualizado);
    }

    async function confirmar(e) {
        e.preventDefault();

        if (pacote?.modalidades.length <= 0) {
            toast.error('Nenhuma modalidade preenchida!');
            return;
        }

        setPagando(true);
    }

    async function onPay(formaPagamento, closeLoading, paymentMethodId) {
        closeLoading();
        const alunoSessao = await setAlunoSessaoPacote({
            ...pacote,
            formaPagamento,
            cod_aluno: aluno?.cod_aluno,
            cod_usuario: usuario?.cod_usuario,
            cod_empresa: usuario?.cod_empresa,
        });

        await createPaySessao(aluno.cod_aluno, formaPagamento, empresa.cod_empresa, usuario.cod_usuario, alunoSessao.cod_aluno_sessao_pacote, paymentMethodId);
        closeLoading();
    }

    return (
        <div className="container-fluid">
            <Pagamento
                show={pagando}
                close={() => setPagando(false)}
                onPay={onPay}
                callback={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}
                client={aluno}
                atSigth={true}
            />

            <div className="card">
                <div className="card-header">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title mb-3">Contratação de sessão</h5>

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
                                        className={`btn ${!sessaoAvulsa ? "btn-primary" : "btn-outline-primary"}`} 
                                        onClick={() => setSessaoAvulsa(false)}
                                    >Selecionar pacote
                                    </button>

                                    <button
                                        className={`btn ${sessaoAvulsa ? "btn-primary" : "btn-outline-primary"}`} 
                                        onClick={() => setSessaoAvulsa(true)}
                                    >Montar pacote
                                    </button>
                                </div>
                            </div>

                            {/* {!sessaoAvulsa && <CardPlano plano={plano} selectPlano={() => setModalPlanos(true)} />} */}

                            {sessaoAvulsa && (
                                <div className="d-flex flex-column">
                                    <SelectModalidades
                                        addModalidade={addModalidade}
                                        removeModalidade={removeModalidade}
                                        attValue={attValue}
                                        modalidadesPlano={pacote?.modalidades}
                                        allowSubVariacao={false}
                                    />

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Validade das sessões (Meses)</label>
                                        <NumberInput
                                            value={pacote?.duracao_sessao}
                                            onChange={value => updatePlano('duracao_sessao', value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="card-footer">
                            <button disabled={errors.length > 0} className="btn btn-success" onClick={confirmar}>Confirmar</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body row">
                            <div className="border border-warning bg-warning-subtle fs-3 p-3 rounded mt-3 shadow-md">
                                <p className="text-center mb-0"><strong>Resumo</strong></p>

                                {pacote?.modalidades?.map((modalidade, index) => (
                                    <p className="mb-0" key={index}>{modalidade.nome_modalidade} - <strong>{formatarMoeda(modalidade.valor_modalidade)}</strong></p>
                                ))}

                                <p className="mb-0 mt-3 text-end">Total - <strong>{formatarMoeda(pacote?.valor_plano || 0)}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContratacaoSessao;