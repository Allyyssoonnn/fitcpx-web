import { getWorkout } from "@/api/workouts";
import FitModalViewVideo from "@/components/baseComponents/FitModalVideoView";
import BackBoxUI from "@/components/fitUI/backBox.ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Activity, Info, MessageSquareMore, Pen, Share } from "lucide-react";
import printJS from "print-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateEmpresa } from "../../states/states";
import { getWorkoutPDF } from "../../utils";
import { arrayBackgrounds } from "../../utils/utils";

export default function WorkoutView() {
   const navigate = useNavigate();
   const { state } = useLocation();
   const [empresa] = useRecoilState(stateEmpresa);

   if (!state.workoutId) navigate(-1);

   const { data: workout } = useQuery({
      queryKey: ["workout", state.workoutId],
      queryFn: () => getWorkout(state.workoutId),
      enabled: !!state.workoutId,
      initialData: {},
   });

   async function sharePDF() {
      const resp = await getWorkoutPDF(workout, empresa.imagem_empresa, empresa.nome_empresa);
      if (!resp) return;

      printJS({
         printable: resp,
         type: "raw-html",
         documentTitle: "Avaliação Física",
      });
   }

   const actionsList = [
      // 1. Relatório: Só se tiver empresa E aluno
      workout?.cod_empresa &&
         workout?.cod_aluno && {
            Icon: Activity,
            label: "Relatório do aluno",
            action: () => navigate("/workoutHistoryView", { state: { workoutId: workout.cod_treino } }),
         },

      // 2. Editar: Só se tiver empresa
      workout?.cod_empresa && {
         Icon: Pen,
         label: "Editar",
         action: () => navigate("/cadtreino", { state: { treino: workout } }),
      },

      // 3. Exportar: Sempre aparece (estava duplicado no seu if/else)
      {
         Icon: Share,
         label: "Exportar",
         action: sharePDF,
      },
   ].filter(Boolean);

   return (
      <div className="container-fluid">
         <BackBoxUI actions={actionsList} />

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
                     <CardTitle>Sessões</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col">
                     {workout?.sessoes?.map((session: any, index: number) => (
                        <Accordion type="multiple">
                           <AccordionItem value={`item-${index}`}>
                              <AccordionTrigger className="border-1 p-3">
                                 <Label>
                                    {session?.sequencia_sessao}
                                    {" - "}
                                    {session?.nome_sessao}
                                 </Label>
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
}: CardExerciseType) {
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
            {/* <Label>
               Observação: <strong>{observation ?? "-"}</strong>
            </Label> */}
         </ItemContent>

         <ItemActions>
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
         </ItemActions>
      </Item>
   );
}
