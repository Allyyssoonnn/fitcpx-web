import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getModalidades, setModalidade, setPlano } from "../../api/plano";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario, useNotificacao } from "../../states/states";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatarMoeda } from "../../utils";
import CardIconFitCpxPay from "../../components/baseComponents/CardIconFitCpxPay";
import FitInputForm from "../../components/baseComponents/FitInputForm";
import { getUsuarios } from "../../api/usuario";
import { useQuery } from "react-query";
import FitSelectForm from "../../components/baseComponents/FitSelectForm";
import { PRODUCAO } from "../../api/api";
import FitInputCurrency from "../../components/baseComponents/FitInputCurrency";

function CadModalidade() {
  const { nSuccess } = useNotificacao();
  const [empresa] = useRecoilState(stateEmpresa);
  const [usuario] = useRecoilState(stateUsuario);
  const { register, handleSubmit, control, setValue } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalVariacao, setModalVariacao] = useState(false);
  const [modalSubVariacao, setModalSubVariacao] = useState(false);
  const [modalComissao, setModalComissao] = useState(false);
  const [variacoes, setVariacoes] = useState([]);
  const [indexVariacao, setIndexVariacao] = useState(-1);
  const [comissao, setComissao] = useState({});

  useEffect(() => {
    const modalidadeRecebido = location.state?.modalidade;
    if (modalidadeRecebido?.variacoes) setVariacoes(modalidadeRecebido?.variacoes);
    if (modalidadeRecebido?.comissao_modalidade) setComissao(JSON.parse(modalidadeRecebido.comissao_modalidade));
    if (modalidadeRecebido) {
      Object.keys(modalidadeRecebido).forEach((key) => {
        setValue(key, modalidadeRecebido[key]);
      });
    }
  }, [location, setValue, usuario]);

  async function confirma(data) {
    const jsonComisao = comissao?.cod_usuario ? JSON.stringify(comissao) : null;
    await setModalidade({ ...data, comissao_modalidade: jsonComisao, variacoes, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
    nSuccess();
    navigate("/modalidades");
  }

  function addPreco(e) {
    e.preventDefault();
    setModalVariacao(true);
  }

  function addComissao(e) {
    e.preventDefault();
    setModalComissao(true);
  }

  function addSubVariacao(e) {
    e.preventDefault();
    setModalSubVariacao(true);
  }

  const newComissao = (data) => setComissao(data);
  const newVariacao = (data) => setVariacoes((prev) => [...prev, { ...data, valores: [] }]);

  const newDescont = (data) => {
    setVariacoes((prevState) => prevState.map((v, i) => (indexVariacao == i ? { ...v, valores: Array.isArray(v.valores) ? [...v.valores, data] : [data] } : v)));
  };

  function removeVariacao(e, index) {
    e.preventDefault();
    setVariacoes((prev) => prev.filter((v, i) => index !== i));
  }

  function removeComissao(e) {
    e.preventDefault();
    setComissao(null);
  }

  function removeSubVariacao(e, index) {
    e.preventDefault();
    setVariacoes((prevState) =>
      prevState.map((v, i) => (indexVariacao == i ? { ...v, valores: Array.isArray(v.valores) ? v.valores.filter((s, iSub) => iSub !== index) : [] } : v))
    );
  }

  function applyDescont(e, index) {
    e.preventDefault();
    setIndexVariacao(index);
  }

  return (
    <div className="container-fluid">
      <ModalVariacao show={modalVariacao} setShow={setModalVariacao} newVariacao={newVariacao} />
      <ModalSubVariacao show={modalSubVariacao} setShow={setModalSubVariacao} newDescont={newDescont} />
      <ModalComissao show={modalComissao} setShow={setModalComissao} newComissao={newComissao} />

      <form onSubmit={handleSubmit(confirma)}>
        <div className="card">
          <div className="card-header">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/modalidades");
              }}
              className="btn btn-danger mb-3 me-3"
            >
              <i className="bi bi-backspace me-2"></i>
              Voltar
            </button>
          </div>

          <div className="card-body">
            <h5 className="card-title fw-semibold mb-4">Informações</h5>

            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label fw-bold">Nome *</label>
                <input id="name" {...register("nome_modalidade", { required: "O nome é obrigatório" })} className="form-control" />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Valor sessão</label>
                <FitInputCurrency id="value" name="valor_modalidade" control={control} />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label className="form-label fw-bold">Descrição *</label>
                <input id="description" {...register("descricao_modalidade")} className="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div className="card border border-success">
          <div className="card-body">
            <CardIconFitCpxPay>
              <h5 className="card-title fw-semibold">Comissão</h5>
              <h5 className="card-subtitle fw-semibold">Selecione quem recebe por essa modalidade</h5>
              <h5 className="card-subtitle fs-2 mb-4">(Na confirmação do pagamento referente a modalidade é feito o repasse automaticamente)</h5>
            </CardIconFitCpxPay>

            <button className="btn btn-outline-success" onClick={addComissao}>
              Adicionar
            </button>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Porcentagem</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{empresa?.nome_empresa}</td>
                    <td>{100 - (comissao?.porcentagem_usuario || 0)}%</td>
                  </tr>
                  {comissao?.cod_usuario && (
                    <tr>
                      <td>{comissao.nome_usuario}</td>
                      <td>{comissao.porcentagem_usuario}%</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={(e) => removeComissao(e)}>
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-danger fs-2">[Atenção] - Mudanças em quem recebe afetarão contratos vigentes</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Variações da modalidade (Valor mensal)</h5>

                <button id="newVarService" className="btn btn-outline-success mt-3" onClick={addPreco}>
                  Adicionar
                </button>

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
                          <td>{variacao.nome_modalidade_variacao}</td>
                          <td>{formatarMoeda(variacao?.valor_modalidade_variacao || 0)}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-success" onClick={(e) => applyDescont(e, index)}>
                              <span className="me-2">Valores</span>
                              <i className="bi bi-cash" />
                            </button>
                            <button className="btn btn-sm btn-outline-danger ms-2" onClick={(e) => removeVariacao(e, index)}>
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-footer">
                <button id="submit" type="submit" className="btn btn-success">
                  Confirmar
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            {indexVariacao >= 0 && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Valores escalonados</h5>
                  <h5 className="card-subtitle">Valores a partir da duração de plano</h5>
                  <h6>Variação: {variacoes[indexVariacao]?.nome_variacao}</h6>

                  <button className="btn btn-outline-success mt-3" onClick={addSubVariacao}>
                    Adicionar
                  </button>

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
                        {variacoes[indexVariacao]?.valores?.map((valor, index) => (
                          <tr key={index}>
                            <td>{valor.nome_modalidade_variacao_valor}</td>
                            <td>{valor.quantidade_modalidade_variacao_valor}</td>
                            <td>{formatarMoeda(valor?.valor_modalidade_variacao_valor || 0)}</td>
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
  );
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
            <input id="nameVarService" {...register("nome_modalidade_variacao", { required: "Nome obrigatório!" })} className="form-control" />
          </div>

          <div className="mt-3">
            <label className="form-label">Valor</label>
            <FitInputCurrency id="valueVarService" name="valor_modalidade_variacao" control={control} />
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
            Fechar
          </button>

          <button id="submitVarService" type="submit" className="btn btn-success rounded">
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ModalSubVariacao({ show, setShow, newDescont }) {
  const { register, handleSubmit, control, reset } = useForm();

  function confirmar(data) {
    newDescont({
      nome_modalidade_variacao_valor: data.nome_modalidade_variacao_valor ?? `SubVariação ${String(data.quantidade_modalidade_variacao_valor)}`,
      quantidade_modalidade_variacao_valor: Number(data.quantidade_modalidade_variacao_valor ?? 1),
      valor_modalidade_variacao_valor: data.valor_modalidade_variacao_valor,
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
            <input {...register("nome_modalidade_variacao_valor", { required: "Nome obrigatório!" })} className="form-control" />
          </div>

          <div className="mt-3">
            <label className="form-label">Duração do plano</label>
            <input {...register("quantidade_modalidade_variacao_valor", { required: "Duração obrigatório!" })} className="form-control" />
          </div>

          <div className="mt-3">
            <label className="form-label">Valor</label>
            <FitInputCurrency name="valor_modalidade_variacao_valor" control={control} />
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
            Fechar
          </button>

          <button type="submit" className="btn btn-success rounded">
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ModalComissao({ show, setShow, newComissao }) {
  const [usuario] = useRecoilState(stateUsuario);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { data: usuarios, refetch } = useQuery({
    queryKey: ["usuarios", usuario.cod_usuario],
    queryFn: () => getUsuarios(usuario.cod_empresa),
    initialData: [],
    enabled: !!usuario.cod_empresa,
  });

  async function confirmar(data) {
    reset();
    const usuario = usuarios.find((user) => user.cod_usuario == data.cod_usuario);
    newComissao({ ...data, nome_usuario: usuario.nome_usuario });
    setShow(false);
  }

  return (
    <Modal show={show}>
      <form className="card" onSubmit={handleSubmit(confirmar)}>
        <div className="card-header">
          <h5 className="card-title">Adicionar conta de comissão</h5>
        </div>

        <div className="card-body">
          <FitSelectForm nameField="Usuário" textHelp="Apenas usuário com conta no FitCpx Pay está disponível" errors={errors} {...register("cod_usuario", { required: true })}>
            {usuarios.map((user, index) => (
              <option key={index} value={user.cod_usuario}>
                {user.nome_usuario}
              </option>
            ))}
          </FitSelectForm>

          <FitInputForm
            classNameContainer="mt-3"
            type="number"
            nameField="Porcentagem"
            errors={errors}
            {...register("porcentagem_usuario", { required: true, min: 1, max: 100 })}
          />
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
            Cancelar
          </button>
          <button className="btn btn-success rounded" type="submit">
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CadModalidade;
