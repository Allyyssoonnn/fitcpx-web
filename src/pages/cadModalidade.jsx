import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getModalidades, setModalidade, setPlano } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../states/states";
import { useEffect, useState } from "react";
import CurrencyInput from "../components/currencyInput";
import { Modal } from "react-bootstrap";
import { formatarMoeda } from "../utils";

function CadModalidade() {
    const { nSuccess } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [modalVariacao, setModalVariacao] = useState(false);
    const [modalSubVariacao, setModalSubVariacao] = useState(false);
    const [variacoes, setVariacoes] = useState([]);
    const [indexVariacao, setIndexVariacao] = useState(-1);

    useEffect(() => {
        const modalidadeRecebido = location.state?.modalidade;
        if (modalidadeRecebido?.variaveis_modalidade) setVariacoes(JSON.parse(modalidadeRecebido.variaveis_modalidade))
        if (modalidadeRecebido) {
            Object.keys(modalidadeRecebido).forEach((key) => {
                setValue(key, modalidadeRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setModalidade({ ...data, variaveis_modalidade: JSON.stringify(variacoes), cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
        nSuccess();
        navigate('/modalidades');
    }

    function addPreco(e) {
        e.preventDefault();
        setModalVariacao(true);
    }

    function addSubVariacao(e) {
        e.preventDefault();
        setModalSubVariacao(true);
    }

    const newVariacao = (data) => setVariacoes(prev => ([ ...prev, { ...data, subvariacoes: [] } ]));

    const newDescont = (data) => {
        setVariacoes(prevState => prevState.map((v, i) => indexVariacao == i ? { ...v,
            subvariacoes: Array.isArray(v.subvariacoes) ? [ ...v.subvariacoes, data ] : [data]
        } : v));
    }

    function removeVariacao(e, index) {
        e.preventDefault();
        setVariacoes(prev => prev.filter((v, i) => index !== i));
    }

    function removeSubVariacao(e, index) {
        e.preventDefault();
        setVariacoes(prevState => prevState.map((v, i) => indexVariacao == i ? { ...v,
            subvariacoes: Array.isArray(v.subvariacoes) ? v.subvariacoes.filter((s, iSub) => iSub !== index) : []
        } : v));
    }
    
    function applyDescont(e, index) {
        e.preventDefault();
        setIndexVariacao(index);
    }

    return (
        <div className="container-fluid">
            <ModalVariacao show={modalVariacao} setShow={setModalVariacao} newVariacao={newVariacao} />
            <ModalSubCariacao show={modalSubVariacao} setShow={setModalSubVariacao} newDescont={newDescont} />

            <form onSubmit={handleSubmit(confirma)}>
                <div className="card">
                    <div className="card-header">
                        <button onClick={e => { e.stopPropagation(); navigate('/modalidades'); }} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-backspace me-2"></i>
                            Voltar
                        </button>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title fw-semibold mb-4">Informações</h5>

                        <div className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label fw-bold">Nome *</label>
                                <input {...register("nome_modalidade", { required: "O nome é obrigatório" })}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Valor sessão</label>
                                <CurrencyInput control={control} name='valor_modalidade' />
                            </div>
                        </div>

                        <div className="row g-3 mt-2">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Descrição *</label>
                                <input {...register("descricao_modalidade")} className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Variações de preço</h5>

                                <button className="btn btn-outline-success mt-3" onClick={addPreco}>Adicionar</button>

                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {variacoes.map((variacao, index) => (
                                                <tr key={index}>
                                                    <td>{variacao.nome_variacao}</td>
                                                    <td>{formatarMoeda(variacao?.valor_variacao || 0)}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeVariacao(e, index)}>
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-success ms-2" onClick={(e) => applyDescont(e, index)}>
                                                            <i className="bi bi-cash" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button type='submit' className="btn btn-success">Confirmar</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6">
                        {indexVariacao >= 0 && (
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">SubVariação de por duração de plano</h5>
                                    <h6>Variação: {variacoes[indexVariacao]?.nome_variacao}</h6>

                                    <button className="btn btn-outline-success mt-3" onClick={addSubVariacao}>Adicionar</button>

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>Duração</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {variacoes[indexVariacao]?.subvariacoes?.map((desc, index) => (
                                                    <tr key={index}>
                                                        <td>{desc.nome_subvariacao}</td>
                                                        <td>{desc.duracao_subvariacao}</td>
                                                        <td>{formatarMoeda(desc?.valor_subvariacao || 0)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeSubVariacao(e, index)}>
                                                                <i className="bi bi-trash" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

function ModalVariacao({ show, setShow, newVariacao }) {
    const { register, handleSubmit, control, reset } = useForm();

    function confirmar(data) {
        newVariacao(data);
        setShow(false);
        reset();
    }

    return (
        <Modal show={show}>
            <form className="card" onSubmit={handleSubmit(confirmar)}>
                <div className="card-header">
                    <h5 className="card-title">Adicionar variação</h5>
                </div>

                <div className="card-body">
                    <div>
                        <label className="form-label">Nome</label>
                        <input { ...register('nome_variacao', { required: 'Nome obrigatório!' }) } className="form-control" />
                    </div>

                    <div className="mt-3">
                        <label className="form-label">Valor</label>
                        <CurrencyInput control={control} name='valor_variacao' />
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-danger rounded" onClick={() => setShow(false)}>Fechar</button>

                    <button type="submit" className="btn btn-success rounded">Confirmar</button>
                </div>
            </form>
        </Modal>
    )
}

function ModalSubCariacao({ show, setShow, newDescont }) {
    const { register, handleSubmit, control, reset } = useForm();

    function confirmar(data) {
        newDescont({
            nome_subvariacao: data.nome_subvariacao ?? `SubVariação ${String(data.duracao_subvariacao)}`,
            duracao_subvariacao: Number(data.duracao_subvariacao ?? 1),
            valor_subvariacao: data.valor_subvariacao,
        });
        setShow(false);
        reset();
    }

    return (
        <Modal show={show}>
            <form className="card" onSubmit={handleSubmit(confirmar)}>
                <div className="card-header">
                    <h5 className="card-title">Adicionar variação</h5>
                </div>

                <div className="card-body">
                    <div>
                        <label className="form-label">Nome</label>
                        <input { ...register('nome_subvariacao', { required: 'Nome obrigatório!' }) } className="form-control" />
                    </div>

                    <div className="mt-3">
                        <label className="form-label">Duração do plano</label>
                        <input { ...register('duracao_subvariacao', { required: 'Duração obrigatório!' }) } className="form-control" />
                    </div>

                    <div className="mt-3">
                        <label className="form-label">Valor</label>
                        <CurrencyInput control={control} name='valor_subvariacao' />
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-danger rounded" onClick={() => setShow(false)}>Fechar</button>

                    <button type="submit" className="btn btn-success rounded">Confirmar</button>
                </div>
            </form>
        </Modal>
    )
}

export default CadModalidade;