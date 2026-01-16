import FitModalViewVideo from "@/components/baseComponents/FitModalVideoView";
import BackBoxUI from "@/components/fitUI/backBox.ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatarData, formatarHora, formatarSegundos } from "@/utils";
import { Activity, Dumbbell, Info, MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { arrayBackgrounds } from "../../utils/utils";

export default function SessionWorkoutHistoryView() {
   const navigate = useNavigate();
   const { state } = useLocation();

   const [session, setSession] = useState<any>({});
   const [aluno, setAluno] = useState<any>({});

   useEffect(() => {
      if (!state.session) navigate(-1);
      setSession(state.session);
      setAluno(state.aluno);
   }, []);

   function getVolume(session: any) {
      if (!session) return 0;
      let value = 0;

      session?.exercicios?.map((v: any) => {
         v.sets?.map((s: any) => (value += s.checked ? (s.repetition ?? 0) * (s.weight ?? 0) : 0));

         v.superSets?.map((v2: any) => {
            v2.sets?.map((s: any) => (value += s.checked ? (s.repetition ?? 0) * (s.weight ?? 0) : 0));
         });
      });

      return value;
   }

   return (
      <div className="container-fluid">
         <BackBoxUI
            actions={[
               {
                  Icon: Dumbbell,
                  label: "Ver prescrição",
                  action: () => navigate("/treino", { state: { workoutId: session.cod_treino } }),
               },
               {
                  Icon: Activity,
                  label: "Ver relatório completo",
                  action: () => navigate("/workoutHistoryView", { state: { workoutId: session.cod_treino } }),
               },
            ]}
         />

         <Card className="mt-3">
            <CardContent>
               <Card>
                  <CardHeader>
                     <CardTitle>Geral</CardTitle>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                     <div className="flex flex-col gap-3">
                        <Label>
                           Aluno: <strong>{aluno?.nome_aluno}</strong>
                        </Label>
                        <Label>
                           Sessão: <strong>{session?.sessao?.nome_sessao}</strong>
                        </Label>
                        <Label>
                           Data:{" "}
                           <strong>
                              {formatarData(session?.data_treino_execucao)} -{" "}
                              {formatarHora(session?.data_treino_execucao)}
                           </strong>
                        </Label>
                        <Label>
                           Duração: <strong>{formatarSegundos(session?.duracao_treino_execucao)}</strong>
                        </Label>
                        <Label>
                           Volume: <strong>{getVolume(session)}</strong>
                        </Label>
                     </div>
                  </CardContent>
               </Card>

               <Card className="mt-3">
                  <CardHeader>
                     <CardTitle>Relatório do treino</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col">
                     {session?.exercicios?.map((exercise: any, indexExercise: number) => (
                        <div className="flex flex-col gap-3 mb-3">
                           <CardExercise
                              sets={exercise.sets}
                              key={`exercise-${indexExercise}`}
                              sequence={exercise?.superSets?.length ? `1/${exercise?.superSets?.length + 1}` : ""}
                              classNameBadge={arrayBackgrounds[indexExercise]}
                              name={exercise?.exercicio?.nome_exercicio}
                              observation={exercise?.observacao_sessao_exercicio}
                              studentObservation={exercise?.observacao_sessao_exercicio_aluno}
                              url={exercise?.exercicio?.url_exercicio}
                              repetitions={exercise?.repeticao_treino_execucao_exercicio}
                              interval={exercise?.intervalo_treino_execucao_exercicio}
                           />

                           <div className="flex flex-col gap-3 ps-3">
                              {exercise?.superSets?.map((set: any, indexSet: number) => (
                                 <CardExercise
                                    sets={set.sets}
                                    key={`exercise-${indexExercise}`}
                                    sequence={`${indexSet + 2}/${exercise?.superSets?.length + 1}`}
                                    classNameBadge={arrayBackgrounds[indexExercise]}
                                    name={set?.exercicio?.nome_exercicio}
                                    observation={set?.observacao_sessao_exercicio}
                                    studentObservation={exercise?.observacao_sessao_exercicio_aluno}
                                    url={set?.exercicio?.url_exercicio}
                                    repetitions={set?.repeticao_treino_execucao_exercicio}
                                    interval={set?.intervalo_treino_execucao_exercicio}
                                 />
                              ))}
                           </div>
                        </div>
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
   sequence: string;
   name: string;
   url: string;
   observation?: string;
   studentObservation: string;
   classNameBadge?: string;
   sets: any[];
   repetitions: number;
   interval: number;
}

function CardExercise({
   key,
   sequence,
   name,
   url,
   observation,
   studentObservation,
   classNameBadge,
   sets,
   repetitions,
   interval,
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
                     <label className="mb-1">
                        <strong>Precrição</strong>
                     </label>
                     <label>
                        Repetições: <strong>{repetitions}</strong>
                     </label>
                     <label>
                        Intervalo: <strong>{interval}</strong>
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

            {sets.map((set: any, index: number) => (
               <div className="flex gap-3 flex-wrap">
                  <Label>{index + 1} ª</Label>
                  <Label>
                     Repetições: <strong>{set?.repetition}</strong>
                  </Label>
                  <Label>
                     Carga: <strong>{set?.weight}</strong>
                  </Label>
               </div>
            ))}
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
