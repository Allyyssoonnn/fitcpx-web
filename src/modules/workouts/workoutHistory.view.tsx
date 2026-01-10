import { getWorkoutHistoryReport } from "@/api/workouts";
import FitModalViewVideo from "@/components/baseComponents/FitModalVideoView";
import BackBoxUI from "@/components/fitUI/backBox.ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartArea, Info, MessageSquareMore } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { arrayBackgrounds, formatarData } from "../../utils/utils";

export default function WorkoutHistoryView() {
   const navigate = useNavigate();
   const { state } = useLocation();

   if (!state.workoutId) navigate(-1);

   const { data: workout } = useQuery({
      queryKey: ["workoutHistory", state.workoutId],
      queryFn: () => getWorkoutHistoryReport(state.workoutId),
      enabled: !!state.workoutId,
      initialData: {},
   });

   function getVolume(session: any) {
      if (!session) return 0;
      let value = 0;

      session?.exercicios?.map((exec: any) => {
         const sets =
            exec.execucao_treino_execucao_exercicio && JSON.parse(exec.execucao_treino_execucao_exercicio)
               ? JSON.parse(exec.execucao_treino_execucao_exercicio)
               : [];

         sets?.map((s: any) => (value += s.checked ? (s.repetition ?? 0) * (s.weight ?? 0) : 0));
      });

      return value;
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <Card className="mt-3">
            <CardContent>
               <Card>
                  <CardHeader>
                     <CardTitle>Geral</CardTitle>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                     <div className="flex flex-col gap-3">
                        <Label>
                           Nome: <strong>{workout.nome_treino}</strong>
                        </Label>
                        <Label>
                           Desenvolvimento: <strong>{workout.desenvolvimento_treino}</strong>
                        </Label>
                        <Label>
                           Nível: <strong>{workout.nivel_treino}</strong>
                        </Label>
                        <Label>
                           Professor: <strong>{workout.usuario?.nome_usuario}</strong>
                        </Label>
                        <Label>
                           Aluno: <strong>{workout.aluno?.nome_aluno ?? "-"}</strong>
                        </Label>
                     </div>

                     <div className="flex flex-col gap-3">
                        <Label>
                           Sexo: <strong>{workout.sexo_treino == "M" ? "Masculino" : "Feminino"}</strong>
                        </Label>
                        <Label>
                           Frequência: <strong>{workout.frequencia_treino}x</strong>
                        </Label>
                        <Label>
                           Observação: <strong>{workout.observacao_treino}</strong>
                        </Label>
                        <Label>
                           Criação: <strong>{new Date(workout.createdAt).toLocaleString()}</strong>
                        </Label>
                        <Label>
                           Última alteração: <strong>{new Date(workout.updatedAt).toLocaleString()}</strong>
                        </Label>
                     </div>
                  </CardContent>
               </Card>

               <Card className="mt-3">
                  <CardHeader>
                     <CardTitle>Treinos realizados</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col">
                     {workout?.sessoes?.map((session: any, index: number) => (
                        <Accordion type="multiple">
                           <AccordionItem value={`item-${index}`}>
                              <AccordionTrigger className="border-1 p-3 flex items-center">
                                 <Item className="w-50">
                                    <ItemContent>
                                       <ItemTitle>
                                          {session?.sequencia_sessao}
                                          {" - "}
                                          {session?.nome_sessao}
                                       </ItemTitle>

                                       <Separator className="w-50" />

                                       <Label>
                                          Execuções: <strong>{session.execucoes?.length}</strong>
                                       </Label>
                                       <Label>
                                          Volume total:{" "}
                                          <strong>
                                             {session.execucoes?.reduce(
                                                (value: number, exec: any) => (value += getVolume(exec)),
                                                0
                                             )}
                                          </strong>
                                       </Label>
                                    </ItemContent>
                                 </Item>
                              </AccordionTrigger>

                              <AccordionContent className="flex flex-col gap-3">
                                 {session?.exercicios?.map((exercise: any, indexExercise: number) => (
                                    <div className="flex flex-col gap-3">
                                       <CardExercise
                                          key={`exercise-${indexExercise}`}
                                          createdAt={exercise?.createdAt}
                                          updatedAt={exercise?.updatedAt}
                                          sequence={exercise?.sets?.length ? `1/${exercise?.sets?.length + 1}` : ""}
                                          classNameBadge={arrayBackgrounds[indexExercise]}
                                          name={exercise?.exercicio?.nome_exercicio}
                                          series={exercise?.serie_sessao_exercicio}
                                          repetitions={exercise?.repeticao_sessao_exercicio}
                                          weight={exercise?.carga_sessao_exercicio}
                                          interval={exercise?.intervalo_sessao_exercicio}
                                          observation={exercise?.observacao_sessao_exercicio}
                                          studentObservation={exercise?.observacao_sessao_exercicio_aluno}
                                          url={exercise?.exercicio?.url_exercicio}
                                          executions={session.execucoes}
                                          exerciseId={exercise.cod_exercicio}
                                       />

                                       <div className="flex flex-col gap-3 ps-3">
                                          {exercise?.sets?.map((set: any, indexSet: number) => (
                                             <CardExercise
                                                key={`exercise-${indexExercise}`}
                                                createdAt={set?.createdAt}
                                                updatedAt={set?.updatedAt}
                                                sequence={`${indexSet + 2}/${exercise?.sets?.length + 1}`}
                                                classNameBadge={arrayBackgrounds[indexExercise]}
                                                name={set?.exercicio?.nome_exercicio}
                                                series={set?.serie_sessao_exercicio}
                                                repetitions={set?.repeticao_sessao_exercicio}
                                                weight={set?.carga_sessao_exercicio}
                                                interval={set?.intervalo_sessao_exercicio}
                                                observation={set?.observacao_sessao_exercicio}
                                                studentObservation={exercise?.observacao_sessao_exercicio_aluno}
                                                url={set?.exercicio?.url_exercicio}
                                                executions={session.execucoes}
                                                exerciseId={exercise.cod_exercicio}
                                             />
                                          ))}
                                       </div>
                                    </div>
                                 ))}
                              </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                     ))}
                  </CardContent>
               </Card>
            </CardContent>
         </Card>
      </div>
   );
}

interface CardExerciseType {
   key: string;
   createdAt: string;
   updatedAt: string;
   sequence: string;
   name: string;
   url: string;
   series: number;
   repetitions: number;
   interval: number;
   weight: number;
   observation: string;
   studentObservation: string;
   classNameBadge?: string;
   executions: any[];
   exerciseId: number;
}

function CardExercise({
   key,
   createdAt,
   updatedAt,
   sequence,
   name,
   url,
   series,
   repetitions,
   interval,
   observation,
   studentObservation,
   weight,
   classNameBadge,
   executions,
   exerciseId,
}: CardExerciseType) {
   function getExecutions() {
      let count = 0;

      executions?.map((v: any) =>
         v?.exercicios.map((exec: any) => {
            if (exec.cod_exercicio == exerciseId && exec.treino_exercicio_executado == "S") count += 1;
         })
      );

      return count;
   }

   function getBestSet() {
      let set = {};
      executions?.forEach((v: any) => {
         v?.exercicios?.forEach((exec: any) => {
            if (exec.cod_exercicio != exerciseId) return;

            let sets: any[] = [];
            try {
               sets = exec.execucao_treino_execucao_exercicio
                  ? JSON.parse(exec.execucao_treino_execucao_exercicio)
                  : [];
            } catch (e) {
               sets = [];
            }

            const bestSet = sets.reduce((prev, current) => {
               if (current.checked) {
                  return Number(current.weight) > Number(prev.weight) ? current : prev;
               } else return prev;
            }, sets[0]);
            console.log(bestSet);

            set = bestSet;
         });
      });
      return set;
   }

   function getMaxWeight() {
      const response = getBestSet() as any;
      return response?.weight ?? 0;
   }

   function getMaxRepetition() {
      const response = getBestSet() as any;
      return response?.repetition ?? 0;
   }

   return (
      <Item key={key}>
         <ItemMedia variant="icon">
            <Tooltip>
               <TooltipTrigger>
                  <Info />
               </TooltipTrigger>

               <TooltipContent>
                  <div className="flex flex-col text-accent">
                     <label>
                        Criação: <strong>{new Date(createdAt).toLocaleString()}</strong>
                     </label>
                     <label>
                        Última alteração: <strong>{new Date(updatedAt).toLocaleString()}</strong>
                     </label>
                  </div>
               </TooltipContent>
            </Tooltip>
         </ItemMedia>

         <ItemContent>
            <ItemTitle>
               {sequence && <Badge className={classNameBadge}>{sequence}</Badge>}
               {name}
            </ItemTitle>

            <Separator className="w-50" />

            <div className="flex gap-3 flex-wrap">
               <Label>
                  Séries: <strong>{series}</strong>
               </Label>
               <Label>
                  Repetições: <strong>{repetitions}</strong>
               </Label>
               <Label>
                  Carga: <strong>{weight}</strong>
               </Label>
               <Label>
                  Intervalo: <strong>{interval}</strong>
               </Label>
            </div>

            <Label className="mt-3">
               Execuções:{" "}
               <strong>
                  {getExecutions()}/{executions.length ?? "0"}
               </strong>
            </Label>
            <Label>
               Maior de carga: <strong>{getMaxWeight()}kg</strong>
            </Label>
            <Label>
               Maior contagem de repetições: <strong>{getMaxRepetition()}</strong>
            </Label>
         </ItemContent>

         <ItemActions className="flex flex-col">
            <div className="flex gap-3">
               {(observation || studentObservation) && (
                  <Dialog>
                     <DialogTrigger>
                        <Button size="icon">
                           <MessageSquareMore />
                        </Button>
                     </DialogTrigger>

                     <DialogContent>
                        <label className="text-sm font-medium">Observação</label>
                        <Textarea placeholder="Digite uma observação..." value={observation} disabled />
                        {studentObservation && (
                           <>
                              <label className="text-sm font-medium">Observação do aluno</label>
                              <Textarea value={studentObservation} disabled />
                           </>
                        )}
                        <DialogFooter>
                           <DialogClose>
                              <Button type="button">Fechar</Button>
                           </DialogClose>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               )}
               <FitModalViewVideo url={url} name={name} />
            </div>

            <EvolutionChart executions={executions} exerciseId={exerciseId} />
         </ItemActions>
      </Item>
   );
}

const chartConfig = {
   weight: {
      label: "Carga (kg)",
      color: "var(--chart-1)",
   },
   repetition: {
      label: "Repetições",
      color: "var(--chart-2)",
   },
} satisfies ChartConfig;

function EvolutionChart({ executions, exerciseId }: { executions: any[]; exerciseId: number }) {
   const chartData = useMemo(() => {
      // Mapa para garantir apenas 1 registro por dia (o melhor do dia)
      const uniqueDataMap = new Map();

      executions?.forEach((v: any) => {
         // Tratamento de segurança para Data
         if (!v.data_treino_execucao) return;

         // Converte string SQL (YYYY-MM-DD HH:MM:SS) para Date JS
         const dateStr = v.data_treino_execucao.replace(" ", "T");
         const rawDateObj = new Date(dateStr);
         const rawDate = rawDateObj.getTime();

         if (isNaN(rawDate)) return; // Pula se data for inválida

         // Formata a data para usar como Chave única (ex: "25/10")
         const dateLabel = formatarData(v.data_treino_execucao);

         v?.exercicios?.forEach((exec: any) => {
            // Filtra: Só processa se for o exercício atual
            if (exec.cod_exercicio != exerciseId) return;

            let sets: any[] = [];
            try {
               sets = exec.execucao_treino_execucao_exercicio
                  ? JSON.parse(exec.execucao_treino_execucao_exercicio)
                  : [];
            } catch (e) {
               sets = [];
            }

            if (sets.every((v) => !v.checked)) return;

            if (sets.length > 0) {
               // LOGICA INTELIGENTE:
               // Encontra a série com MAIOR Carga do dia (Recorde do dia)
               // Se quiser somar o volume total, a lógica mudaria aqui.
               const bestSet = sets.reduce((prev, current) => {
                  if (current.checked) {
                     return Number(current.weight) > Number(prev.weight) ? current : prev;
                  } else return prev;
               }, sets[0]);

               const newEntry = {
                  rawDate: rawDate, // Para ordenar corretamente
                  date: dateLabel, // Para exibir no eixo X
                  repetition: Number(bestSet.repetition ?? 0),
                  weight: Number(bestSet.weight ?? 0),
               };

               // Se já existe um registro nesse dia, verificamos se o novo é "melhor"
               // ou simplesmente sobrescrevemos para garantir o último treino do dia.
               if (uniqueDataMap.has(dateLabel)) {
                  const existing = uniqueDataMap.get(dateLabel);
                  // Opcional: Se tiver dois treinos no mesmo dia, mantém o de maior carga
                  if (newEntry.weight > existing.weight) {
                     uniqueDataMap.set(dateLabel, newEntry);
                  }
               } else {
                  uniqueDataMap.set(dateLabel, newEntry);
               }
            }
         });
      });

      // Transforma o Map em Array e ordena pela data real (timestamp)
      return Array.from(uniqueDataMap.values()).sort((a: any, b: any) => a.rawDate - b.rawDate);
   }, [executions, exerciseId]);

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
               <ChartArea className="mr-2 h-4 w-4" />
               Evolução
            </Button>
         </DialogTrigger>

         <DialogContent className="w-[90vw] sm:max-w-[700px]">
            <DialogHeader>
               <DialogTitle className="text-black">Evolução de Carga e Repetições</DialogTitle>
               <DialogDescription>Visualizando o progresso de carga máxima atingida em cada treino.</DialogDescription>
            </DialogHeader>

            {/* Verificação: Se não tiver dados, mostra aviso amigável */}
            {chartData.length === 0 ? (
               <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  Nenhum dado de execução encontrado para este exercício.
               </div>
            ) : (
               <div className="w-full h-[350px] mt-4">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                     <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                     >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} width={30} />
                        <YAxis
                           yAxisId="right"
                           orientation="right"
                           tickLine={false}
                           axisLine={false}
                           tickMargin={8}
                           width={30}
                           domain={["auto", "auto"]}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                           yAxisId="left"
                           dataKey="weight"
                           type="monotone"
                           stroke="var(--color-weight)"
                           strokeWidth={2}
                           dot={{ r: 4 }}
                           activeDot={{ r: 6 }}
                        />
                        <Line
                           yAxisId="right"
                           dataKey="repetition"
                           type="monotone"
                           stroke="var(--color-repetition)"
                           strokeWidth={2}
                           strokeDasharray="4 4"
                           dot={{ r: 4 }}
                        />
                     </LineChart>
                  </ChartContainer>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
