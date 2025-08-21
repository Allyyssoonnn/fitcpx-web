import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao, useStateApp } from "../../states/states";
import { getExercicios, setSessao, setTreino } from "../../api/treino";
import { useQuery } from "react-query";
import { arrayBorders, preventForm } from "../../utils";
import { toast } from "react-toastify";
import TreinoInteligente from "../../components/prescricao/treinoInteligente";
import { useFormStore } from "../../hooks/useFormStore";

function CadTreino() {
  const { formData, setTreinoForm } = useFormStore();
  const { nSuccess } = useNotificacao();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario] = useRecoilState(stateUsuario);
  const [sessoes, setSessoes] = useState([]);
  const [removidos, setRemovidos] = useState([]);
  const [itensRemovidos, setItensRemovidos] = useState([]);
  const [nome_aluno, setNome_aluno] = useState("");
  const [codAluno, setCodAluno] = useState(0);
  const [sexo_aluno, setSexo_aluno] = useState(null);

  useEffect(() => {
    const treinoRecebido = location.state?.treino;
    const alunoRecebido = location.state?.aluno;
    if (treinoRecebido) {
      Object.keys(treinoRecebido).forEach((key) => {
        setValue(key, treinoRecebido[key]);
      });
    } else {
      if (formData.treino?.cod_aluno == alunoRecebido?.cod_aluno) {
        Object.keys(formData.treino).forEach((key) => {
          setValue(key, formData.treino[key]);
        });
      }
    }
    if (alunoRecebido) setValue("cod_aluno", alunoRecebido.cod_aluno);
    if (alunoRecebido) setValue("nome_aluno", alunoRecebido.nome_aluno);
    if (alunoRecebido) {
      setNome_aluno(alunoRecebido.nome_aluno);
      setCodAluno(alunoRecebido.cod_aluno);
      setSexo_aluno(alunoRecebido.sexo_aluno);
      setValue("sexo_aluno", alunoRecebido.sexo_aluno);
    } else {
      setSexo_aluno("M");
      setValue("sexo_aluno", "M");
    }
    var sessaoKey = treinoRecebido?.sessoes?.map((sessao, index) => ({
      ...sessao,
      key: index + 1, // Adiciona a propriedade 'key' usando o 'cod_sessao'
    }));
    if (treinoRecebido?.sessoes) setSessoes(sessaoKey);
  }, [location, setValue, usuario]);

  const watched = watch();
  useEffect(() => {
    if (watched?.cod_treino) return;
    setTreinoForm(watched);
  }, [JSON.stringify(watched)]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  function getRepeticao() {
    const { desenvolvimento_treino } = getValues();
    const base = {
      Força: 6,
      Hipertrofia: 12,
      Resistência: 20,
    };
    if (!desenvolvimento_treino) return 12;
    return base[desenvolvimento_treino];
  }

  async function confirma(data) {
    var podeConfirmar = true;
    for (const sessao of sessoes) {
      for (const exercicio of sessao.exercicios) {
        if (!exercicio?.cod_exercicio) {
          podeConfirmar = false;
          toast.error(`Exercício vazio na sessão ${sessao.nome_sessao}`);
        }
      }
    }

    if (!podeConfirmar) return;

    const cod_usuario = usuario.cod_usuario;
    const respTreino = await setTreino({
      ...data,
      sexo_treino: sexo_aluno ?? data?.sexo_treino,
      cod_usuario,
      cod_empresa: usuario.cod_empresa,
    });
    if (respTreino.cod_treino) {
      await setSessao(
        sessoes,
        respTreino.cod_treino,
        usuario.cod_usuario,
        usuario.cod_empresa,
        removidos,
        itensRemovidos
      );
      reset();
      nSuccess();
      navigate(-1);
    } else toast.error("Erro ao salvar treino");
  }

  const { desenvolvimento_treino, volume_treino, nivel_treino } = watch();

  return (
    <form onKeyDown={preventForm} onSubmit={handleSubmit(confirma)} className="container-fluid">
      {/* Header Section */}
      <div className="bg-gradient-primary rounded-4 p-4 mb-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="btn btn-outline-danger rounded-pill px-4"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Voltar
          </button>
        </div>
      </div>

      <div className="card shadow-lg rounded-4">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>

          <div className={`row g-3 mb-3 ${nome_aluno ? "" : "d-none"}`}>
            <div className="col-md-3">
              <label className="form-label fw-bold">Aluno</label>
              <input disabled {...register("nome_aluno")} className="form-control" />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Nome *</label>
              <input
                id="name"
                {...register("nome_treino", { required: "O nome é obrigatório" })}
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Frequência *</label>
              <input
                id="periodicity"
                {...register("frequencia_treino", { required: "Frequência de treino é obrigatório" })}
                type="number"
                step="0.01"
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Sexo *</label>
              <select
                id="gender"
                {...register("sexo_treino", { required: "O sexo é obrigatório" })}
                className="form-control"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Nível *</label>
              <select
                id="difficulty"
                {...register("nivel_treino", { required: "Nível de treino necessário!" })}
                className="form-control"
              >
                <option value="">Selecione o nível do treino</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Observação</label>
              <input id="observation" {...register("observacao_treino")} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Desenvolvimento *</label>
              <select
                id="development"
                {...register("desenvolvimento_treino", { required: "O desenvolvimento é obrigatório" })}
                className="form-control"
              >
                <option value="">Selecione o desenvolvimento</option>
                <option value="Força">Força</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Resistência">Resistência</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Volume de treino *</label>
              <select
                id="volume"
                {...register("volume_treino", { required: "O volume de treino é obrigatório" })}
                className="form-control"
              >
                <option value="">Selecione o volume de treino</option>
                <option value="Baixo">Baixo</option>
                <option value="Médio">Médio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg rounded-4">
        <div className="card-header d-flex justify-content-between flex-wrap">
          <h5 className="card-title fw-semibold m-3">Prescrição</h5>
          <label>{sessoes?.length}/15</label>
        </div>

        <div className="card-body p-1">
          <TreinoInteligente
            cod_aluno={codAluno}
            sessoes={sessoes}
            setSessoes={setSessoes}
            setRemovidos={setRemovidos}
            setItensRemovidos={setItensRemovidos}
            getRepeticao={getRepeticao}
            nivel_treino={nivel_treino}
            volume_treino={volume_treino}
            desenvolvimento_treino={desenvolvimento_treino}
          />
        </div>

        <div className="card-footer">
          <button id="submit" disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
            <i className="bi bi-check me-2"></i>
            Confirmar
          </button>
        </div>
      </div>
    </form>
  );
}

export default CadTreino;
