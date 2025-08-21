import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  generateTreino,
  getArticulacoes,
  getExerciciosResistencias,
  getGrupoExercicios,
  getIndicacoes,
  getPadraoesMovimentos,
  getTipoExercicios,
} from "../../api/treino";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../../states/states";
import { toast } from "react-toastify";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import MultipleSelector from "../ui/multiselect";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

function GerarTreino({ setSessoes, indexSessao, cod_aluno, volume_treino, nivel_treino, desenvolvimento_treino }) {
  const [open, setOpen] = useState(false);

  function adicionarSessaoGerada(sessao) {
    setSessoes((prevSessoes) => prevSessoes.map((s, i) => (i == indexSessao ? { ...s, exercicios: sessao } : s)));
    // setShow(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={!volume_treino || !nivel_treino || !desenvolvimento_treino}>
        {screen.width > 766 ? (
          <button
            disabled={!volume_treino || !nivel_treino || !desenvolvimento_treino}
            type="button"
            className="btn btn btn-info rounded mx-2"
          >
            <i className="bi bi-lightbulb" />
          </button>
        ) : (
          <a type="button" className="d-flex align-items-center gap-2 btn btn-sm btn-outline-info rounded mb-1">
            <i className="bi bi-lightbulb" />
            <p className="mb-0">Treino inteligente</p>
          </a>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-[800px] sm:!max-w-[30vw] w-full">
        <DialogTitle className="fs-5 text-black">
          <span className="text-muted">[BETA TESTE]</span> - Prescrição inteligente
        </DialogTitle>

        <Filters
          adicionarSessaoGerada={adicionarSessaoGerada}
          cod_aluno={cod_aluno}
          closeDialog={() => setOpen(false)}
          volume_treino={volume_treino}
          nivel_treino={nivel_treino}
          desenvolvimento_treino={desenvolvimento_treino}
        />

        <div className="border" />

        <div className="d-flex align-items-start flex-column justify-around">
          <label>
            Nível: <strong>{nivel_treino}</strong>
          </label>
          <label>
            Volume: <strong>{volume_treino}</strong>
          </label>
          <label>
            Desenvolvimento: <strong>{desenvolvimento_treino}</strong>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Filters({
  adicionarSessaoGerada,
  cod_aluno,
  closeDialog,
  volume_treino,
  nivel_treino,
  desenvolvimento_treino,
}) {
  const { nLoading, endLoading } = useNotificacao();
  const [usuario] = useRecoilState(stateUsuario);

  const [pageShow, setPageShow] = useState("Grupos");
  const [aquecimento, setAquecimento] = useState([
    {
      label: "Aquecimento",
      cod_padrao_movimento: 2,
      cod_tipo_exercicio: 2,
      cod_exercicio_resistencia: 2,
      cod_indicacao: 2,
      cod_articulacao: 2,
      volume: 2,
      qtd_exercicios: 2,
    },
  ]);
  const [gruposSelecionados, setGruposSelecionados] = useState([]);
  const [indicacoesSelecionadas, setIndicacoesSelecionadas] = useState([]);

  const { data: grupos } = useQuery({
    queryKey: ["grupos", usuario.cod_empresa],
    queryFn: () => getGrupoExercicios(usuario.cod_empresa),
    initialData: [],
  });

  const { data: indicacoes } = useQuery({
    queryKey: ["indicacoes", usuario.cod_empresa],
    queryFn: () => getIndicacoes(usuario.cod_empresa),
    initialData: [],
  });

  const { data: articulacoes } = useQuery({
    queryKey: ["articulacoes", usuario.cod_empresa],
    queryFn: () => getArticulacoes(usuario.cod_empresa),
    initialData: [],
  });

  const { data: padraoMovimentos } = useQuery({
    queryKey: ["padraoMovimentos", usuario.cod_empresa],
    queryFn: () => getPadraoesMovimentos(usuario.cod_empresa),
    initialData: [],
  });

  const { data: resistencias } = useQuery({
    queryKey: ["resistencias", usuario.cod_empresa],
    queryFn: () => getExerciciosResistencias(usuario.cod_empresa),
    initialData: [],
  });

  const { data: tipo_exercicios } = useQuery({
    queryKey: ["tipo_exercicios", usuario.cod_empresa],
    queryFn: () => getTipoExercicios(usuario.cod_empresa),
    initialData: [],
  });

  function updateGroup(obj, field, value) {
    setGruposSelecionados((prevState) =>
      prevState.map((group) => (group.value === obj.value ? { ...group, [field]: value } : group))
    );
  }

  function updateAquecimento(obj, field, value) {
    setAquecimento((prevState) =>
      prevState.map((group) => (group.value === obj.value ? { ...group, [field]: value } : group))
    );
  }

  async function submitWorkout() {
    if (!gruposSelecionados.length) {
      toast.error("Nenhum grupo selecionado!");
      return;
    }

    nLoading("Carregando...", "Aguarde estamos processando.");

    const sessao = await generateTreino({
      gruposSelecionados,
      indicacoesSelecionadas,
      aquecimento,
      cod_aluno,
      volume_treino,
      nivel_treino,
      desenvolvimento_treino,
    });

    if (sessao) adicionarSessaoGerada(sessao);
    endLoading();
    closeDialog();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <label className="form-label">Grupos</label>
        <label>{gruposSelecionados?.length}/3</label>
      </div>

      <MultipleSelector
        value={gruposSelecionados}
        options={grupos.map((grupo, index) => ({
          label: grupo.nome_grupo_exercicio,
          value: grupo.cod_grupo_exercicio,
        }))}
        onChange={(selected) =>
          setGruposSelecionados(
            selected.map((group) => ({
              ...group,
              cod_padrao_movimento: 2,
              cod_tipo_exercicio: 2,
              cod_exercicio_resistencia: 2,
              cod_indicacao: 2,
              cod_articulacao: 2,
              volume: group.volume || 2,
              qtd_exercicios: group.qtd_exercicios || 2,
            }))
          )
        }
        placeholder="Selecione os grupos de exercícios"
        emptyIndicator={<p className="text-center text-sm">Nenhum grupo disponível</p>}
        commandProps={{
          label: "Selecione grupos de exercícios",
        }}
        maxSelected={3}
        hidePlaceholderWhenSelected
        onMaxSelected={() => toast.error("Máximo de 3 grupos selecionados")}
      />

      {/* <div className="d-flex justify-content-between align-items-center mt-3">
        <label className="form-label">Indicações</label>
        <label>{indicacoesSelecionadas?.length}/3</label>
      </div>

      <MultiSelect
        value={indicacoesSelecionadas}
        options={indicacoes.map((indicacao, index) => ({
          label: indicacao.nome_indicacao,
          value: indicacao.cod_indicacao,
        }))}
        onChange={setIndicacoesSelecionadas}
        placeholder="Selecione as indicações"
        emptyIndicator={<p className="text-center text-sm">Nenhuma indicação disponível</p>}
        maxSelected={5}
        hidePlaceholderWhenSelected
        onMaxSelected={() => toast.error("Máximo de 3 indicações selecionadas")}
      /> */}

      <ToggleGroup
        type="single"
        variant="outline"
        size="lg"
        value={pageShow}
        onValueChange={setPageShow}
        className="mt-3 d-none"
      >
        <ToggleGroupItem value="Aquecimento" className="px-3">
          Aquecimento
        </ToggleGroupItem>
        <ToggleGroupItem value="Grupos" className="px-3">
          Grupos
        </ToggleGroupItem>
      </ToggleGroup>

      {pageShow === "Grupos1" && (
        <CardEditor
          gruposSelecionados={gruposSelecionados}
          updateGroup={updateGroup}
          // articulacoes={articulacoes}
          padraoMovimentos={padraoMovimentos}
          resistencias={resistencias}
          tipo_exercicios={tipo_exercicios}
        />
      )}
      {pageShow === "Aquecimento1" && (
        <CardEditor
          gruposSelecionados={aquecimento}
          updateGroup={updateAquecimento}
          articulacoes={articulacoes}
          padraoMovimentos={padraoMovimentos}
          resistencias={resistencias}
          tipo_exercicios={tipo_exercicios}
        />
      )}

      <DialogFooter className="mt-3 justify-content-end d-flex">
        <button onClick={submitWorkout} className="btn btn-success">
          Gerar Treino
        </button>
      </DialogFooter>
    </div>
  );
}

export default GerarTreino;
