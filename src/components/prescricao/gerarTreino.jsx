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
import MultiSelect from "../ui/multiselect";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MultipleSelector from "../ui/multiselect";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

function GerarTreino({ setSessoes, indexSessao, cod_aluno }) {
  const [open, setOpen] = useState(false);

  function adicionarSessaoGerada(sessao) {
    setSessoes((prevSessoes) => prevSessoes.map((s, i) => (i == indexSessao ? { ...s, exercicios: sessao } : s)));
    // setShow(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {screen.width > 766 ? (
          <button type="button" className="btn btn btn-info rounded mx-2">
            <i className="bi bi-lightbulb" />
          </button>
        ) : (
          <a type="button" className="d-flex align-items-center gap-2 btn btn-sm btn-outline-info rounded mb-1">
            <i className="bi bi-lightbulb" />
            <p className="mb-0">Treino inteligente</p>
          </a>
        )}
      </DialogTrigger>
      {/* <ModalGerarTreino show={show} close={() => setShow(false)} adicionarSessaoGerada={adicionarSessaoGerada} /> */}

      <DialogContent className="!max-w-[800px] sm:!max-w-[50vw] w-full">
        <DialogTitle className="fs-5 text-black">
          <span className="text-muted">[BETA TESTE]</span> - Prescrição inteligente
        </DialogTitle>

        <Filters
          adicionarSessaoGerada={adicionarSessaoGerada}
          cod_aluno={cod_aluno}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Filters({ adicionarSessaoGerada, cod_aluno, closeDialog }) {
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
    });

    if (sessao) adicionarSessaoGerada(sessao);
    endLoading();
    closeDialog();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <label className="form-label">Grupos</label>
        <label>{gruposSelecionados?.length}/5</label>
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
        maxSelected={5}
        hidePlaceholderWhenSelected
        onMaxSelected={() => toast.error("Máximo de 5 grupos selecionados")}
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
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
      />

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

      <DialogFooter className="mt-3 justify-content-between d-flex">
        <DialogClose>
          <button type="button" className="btn btn-danger">
            Fechar
          </button>
        </DialogClose>
        <button onClick={submitWorkout} className="btn btn-success">
          Gerar Treino
        </button>
      </DialogFooter>
    </div>
  );
}

function CardEditor({
  gruposSelecionados,
  updateGroup,
  articulacoes,
  padraoMovimentos,
  resistencias,
  tipo_exercicios,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = gruposSelecionados[currentIndex];

  if (!current) return <p className="text-muted text-center mt-3">Nenhum grupo selecionado</p>;

  const handleChange = (field) => (value) => updateGroup(current, field, value);

  return (
    <div className="mt-4 p-4 border rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold">{current.label}</h5>
        <span className="text-muted">
          {currentIndex + 1}/{gruposSelecionados.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <SelectInput
          label="Volume"
          value={current.volume}
          onChange={handleChange("volume")}
          options={Array.from({ length: 20 }, (_, i) => i + 1)}
        />
        <SelectInput
          label="Qtd. Exercícios"
          value={current.qtd_exercicios}
          onChange={handleChange("qtd_exercicios")}
          options={Array.from({ length: 20 }, (_, i) => i + 1)}
        />
        {articulacoes && (
          <SelectInput
            label="Articulação"
            value={current.cod_articulacao}
            onChange={handleChange("cod_articulacao")}
            options={articulacoes.map((a) => ({ label: a.nome_articulacao, value: a.cod_articulacao }))}
          />
        )}
        <SelectInput
          label="Padrão de movimento"
          value={current.cod_padrao_movimento}
          onChange={handleChange("cod_padrao_movimento")}
          options={padraoMovimentos.map((p) => ({ label: p.nome_padrao_movimento, value: p.cod_padrao_movimento }))}
        />
        <SelectInput
          label="Resistência"
          value={current.cod_exercicio_resistencia}
          onChange={handleChange("cod_exercicio_resistencia")}
          options={resistencias.map((r) => ({
            label: r.nome_exercicio_resistencia,
            value: r.cod_exercicio_resistencia,
          }))}
        />
        <SelectInput
          label="Tipo de Exercício"
          value={current.cod_tipo_exercicio}
          onChange={handleChange("cod_tipo_exercicio")}
          options={tipo_exercicios.map((t) => ({ label: t.nome_tipo_exercicio, value: t.cod_tipo_exercicio }))}
        />
      </div>

      {gruposSelecionados?.length > 1 && (
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            ← Anterior
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.min(gruposSelecionados.length - 1, i + 1))}
            disabled={currentIndex === gruposSelecionados.length - 1}
          >
            Próximo →
          </Button>
        </div>
      )}
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="form-label text-sm">{label}</label>

      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value ?? opt} value={String(opt.value ?? opt)}>
              {opt.label ?? opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default GerarTreino;
