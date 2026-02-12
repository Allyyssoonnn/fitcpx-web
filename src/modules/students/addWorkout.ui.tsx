import { getWorkouts } from "@/api/workouts";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AddTreinoProps = {
   aluno: any;
   treinosAluno: any[];
};

export function AddTreino({ aluno, treinosAluno }: AddTreinoProps) {
   const [usuario] = useRecoilState(stateUsuario);
   const navigate = useNavigate();

   const [modo, setModo] = useState<"novo" | "importar" | "reajuste" | null>(null);
   const [treinoSelecionado, setTreinoSelecionado] = useState<any>(null);

   const { data: treinos = [] } = useQuery({
      queryKey: ["treinos", usuario.cod_empresa],
      queryFn: getWorkouts,
   });

   const listaTreinos = useMemo(() => (modo === "reajuste" ? treinosAluno : treinos), [treinos, treinosAluno, modo]);

   const handleSelectTreino = (cod_treino: string) => {
      const treino = listaTreinos.find((t) => String(t.cod_treino) === cod_treino);
      setTreinoSelecionado(treino || null);
   };

   const handleConfirm = () => {
      if (!treinoSelecionado) return;

      const { cod_treino, ...treinoLimpo } = treinoSelecionado;
      treinoLimpo.sessoes = treinoLimpo.sessoes.map(({ cod_sessao, cod_treino, exercicios = [], ...sessao }) => ({
         ...sessao,
         exercicios: exercicios.map(({ cod_sessao_exercicio, ...exercicio }) => ({
            ...exercicio,
            sets: exercicio?.sets?.map(({ cod_sessao_exercicio, ...set }) => set) ?? [],
         })),
      }));

      treinoLimpo.status_treino = "A";

      navigate("/cadtreino", { state: { aluno, treino: treinoLimpo } });
   };

   const handleNovo = () => navigate("/cadtreino", { state: { aluno } });

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button id="addWorkout" className="mb-4">
               <PlusCircleIcon className="mr-2 h-4 w-4" />
               Adicionar Treino
            </Button>
         </DialogTrigger>

         <DialogContent className="max-w-md">
            <DialogHeader>
               <DialogTitle>Novo treino</DialogTitle>
               <DialogDescription>Aluno: {aluno?.nome_aluno}</DialogDescription>
            </DialogHeader>

            <TooltipProvider delayDuration={100}>
               <div className="flex flex-col gap-3 mt-2">
                  <div className="flex flex-wrap gap-2">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant={modo === "novo" ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                 setModo("novo");
                                 handleNovo();
                              }}
                           >
                              Novo
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crie um treino do zero</TooltipContent>
                     </Tooltip>

                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant={modo === "importar" ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                 setModo("importar");
                                 setTreinoSelecionado(null);
                              }}
                           >
                              Importar
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Importe um treino salvo no sistema</TooltipContent>
                     </Tooltip>

                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant={modo === "reajuste" ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                 setModo("reajuste");
                                 setTreinoSelecionado(null);
                              }}
                           >
                              Reajuste
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baseie-se no último treino ativo</TooltipContent>
                     </Tooltip>
                  </div>

                  {(modo === "importar" || modo === "reajuste") && (
                     <>
                        <Separator />
                        <Select onValueChange={handleSelectTreino} value={String(treinoSelecionado?.cod_treino || "")}>
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione o treino" />
                           </SelectTrigger>

                           <SelectContent>
                              {listaTreinos.length > 0 ? (
                                 listaTreinos.map((t) => (
                                    <SelectItem key={t.cod_treino} value={String(t.cod_treino)}>
                                       {t.nome_treino} — {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                                    </SelectItem>
                                 ))
                              ) : (
                                 <div className="p-2 text-sm text-muted-foreground">Nenhum treino disponível</div>
                              )}
                           </SelectContent>
                        </Select>
                     </>
                  )}
               </div>
            </TooltipProvider>

            <DialogFooter className="mt-4">
               <Button
                  onClick={handleConfirm}
                  disabled={!treinoSelecionado}
                  className={cn(!treinoSelecionado && "opacity-70 cursor-not-allowed")}
               >
                  Confirmar
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
