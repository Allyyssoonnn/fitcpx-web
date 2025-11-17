import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { generateWorkout, getMuscleGroups } from "../../api/workouts";
import { stateUsuario, useNotificacao } from "../../states/states";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import MultipleSelector from "../ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function GerarTreino({ setSessoes, indexSessao, nivel_treino, desenvolvimento_treino }) {
   const [open, setOpen] = useState(false);

   function adicionarSessaoGerada(sessao) {
      setSessoes((prevSessoes) => prevSessoes.map((s, i) => (i == indexSessao ? { ...s, exercicios: sessao } : s)));
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger disabled={!desenvolvimento_treino || !nivel_treino}>
            <Button type="button" size="icon" disabled={!desenvolvimento_treino || !nivel_treino}>
               <Lightbulb />
            </Button>
         </DialogTrigger>

         <DialogContent className="!max-w-[800px] sm:!max-w-[30vw] w-full">
            <DialogTitle className="fs-5 text-black">
               <span className="text-muted">[BETA TESTE]</span> - Prescrição inteligente
            </DialogTitle>

            <Filters
               adicionarSessaoGerada={adicionarSessaoGerada}
               closeDialog={() => setOpen(false)}
               nivel_treino={nivel_treino}
               desenvolvimento_treino={desenvolvimento_treino}
            />

            <div className="border" />

            <div className="d-flex align-items-start flex-column justify-around">
               <label>
                  Nível: <strong>{nivel_treino}</strong>
               </label>
               <label>
                  Desenvolvimento: <strong>{desenvolvimento_treino}</strong>
               </label>
            </div>
         </DialogContent>
      </Dialog>
   );
}

function Filters({ adicionarSessaoGerada, closeDialog, nivel_treino, desenvolvimento_treino }) {
   const { nLoading, endLoading } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);

   const [volume_treino, setVolumeTreino] = useState("Baixo");
   const [gruposSelecionados, setGruposSelecionados] = useState([]);

   const { data: grupos } = useQuery({
      queryKey: ["grupos", usuario.cod_empresa],
      queryFn: () => getMuscleGroups("pt"),
      initialData: [],
   });

   async function submitWorkout() {
      if (!gruposSelecionados.length) {
         toast.error("Nenhum grupo selecionado!");
         return;
      }

      nLoading("Carregando...", "Aguarde estamos processando.");

      const sessao = await generateWorkout({
         gruposSelecionados,
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
            className="mb-3"
            value={gruposSelecionados}
            options={grupos?.map((grupo, index) => ({
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

         <Select value={volume_treino} onValueChange={setVolumeTreino}>
            <SelectTrigger className="w-full mb-3">
               <SelectValue placeholder="Volume" />
            </SelectTrigger>

            <SelectContent>
               <SelectItem value="Baixo">Baixo</SelectItem>
               <SelectItem value="Médio">Médio</SelectItem>
               <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
         </Select>

         <DialogFooter>
            <Button onClick={submitWorkout}>Gerar Treino</Button>
         </DialogFooter>
      </div>
   );
}

export default GerarTreino;
