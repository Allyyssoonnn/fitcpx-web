import {
   ArrowDown,
   ArrowUp,
   EllipsisVerticalIcon,
   MessageSquareMore,
   MessageSquareText,
   PlusCircle,
   RefreshCcw,
   Trash,
} from "lucide-react";
import FitComboBox from "../../components/baseComponents/FitComboBox";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";
import { arrayBackgrounds, arrayBorders } from "../../utils/utils";
import FitModalViewVideo from "../baseComponents/FitModalVideoView";
import FiltroTreino from "../fitUI/filtroExercicio.ui";
import { NumberInputUI } from "../fitUI/numberInput.ui";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function ListaExercicios({ exercicios, indexSessao, setSessoes, adicionarSet, exerciciosLista }) {
   const changeSequence = (e, index, nextIndex) => {
      e.preventDefault();
      if (nextIndex < 0 || nextIndex >= exercicios.length) return;

      // Clona profundamente os exercícios
      const reorderedExercicios = exercicios.map((ex) => ({
         ...ex,
         sets: ex.sets?.map((s) => ({ ...s })) || [],
      }));

      const [removed] = reorderedExercicios.splice(index, 1);
      reorderedExercicios.splice(nextIndex, 0, removed);

      // Atualiza a sequência
      const updatedExercicios = reorderedExercicios.map((item, idx) => ({
         ...item,
         sequencia_sessao_exercicio: idx + 1,
         sets: item.sets.map((set) => ({
            ...set,
            sequencia_sessao_exercicio: idx + 1,
         })),
      }));

      setSessoes((prevArray) =>
         prevArray.map((grupo, i) => (i === indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo))
      );
   };

   const updateField = (idx, campo, valor, indexSet) => {
      const excs = Array.from(exercicios);
      var updatedExercicios;

      if (indexSet >= 0) {
         //Atualiza set dentro do exercicio
         updatedExercicios = excs.map((item, index) =>
            index == idx
               ? {
                    ...item,
                    sets: item.sets.map((set, id) => (indexSet == id ? { ...set, [campo]: valor } : { ...set })),
                 }
               : { ...item }
         );
      } else {
         //Atualiza exercicio
         updatedExercicios = excs.map((item, id) => (idx == id ? { ...item, [campo]: valor } : { ...item }));
      }

      setSessoes((prevArray) =>
         prevArray.map((grupo, i) => (i == indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo))
      );
   };

   const remove = (index) => {
      // Remove o item pelo índice
      const reorderedExercicios = Array.from(exercicios);
      reorderedExercicios.splice(index, 1);

      // Reordena o campo `sequencia_sessao_exercicio` após a remoção
      const updatedExercicios = reorderedExercicios.map((item, idx) => ({
         ...item,
         sequencia_sessao_exercicio: idx + 1,
      }));

      setSessoes((prevArray) =>
         prevArray.map((grupo, i) => (i == indexSessao ? { ...grupo, exercicios: updatedExercicios } : grupo))
      );
   };

   const removeSet = (indexExercicio, indexSet) => {
      // Remove o item pelo índice
      const reorderedExercicios = Array.from(exercicios);
      const reorderedSets = Array.from(exercicios[indexExercicio].sets);
      reorderedSets.splice(indexSet, 1);

      const updatedSets = reorderedSets.map((item, idx) => ({
         ...item,
         // sequencia_sessao_exercicio: idx + 1,
      }));

      reorderedExercicios[indexExercicio].sets = updatedSets;

      setSessoes((prevArray) =>
         prevArray.map((grupo, i) => (i == indexSessao ? { ...grupo, exercicios: reorderedExercicios } : grupo))
      );
   };

   const confirmaTreinoInteligente = (exerciciosFiltrados, index, indexSet) => {
      // Selecionar um exercício aleatório, se houver exercícios filtrados
      const exercicioAleatorio = exerciciosFiltrados?.length
         ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
         : {};

      if (indexSet == undefined && indexSet == null) {
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == index
                             ? { ...exercicio, ...exercicioAleatorio, exerciciosFiltros: exerciciosFiltrados }
                             : exercicio
                       ),
                    }
                  : sessao
            )
         );
      } else {
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == index
                             ? {
                                  ...exercicio,
                                  sets: exercicio?.sets?.map((set, idx) =>
                                     indexSet == idx
                                        ? { ...set, ...exercicioAleatorio, exerciciosFiltros: exerciciosFiltrados }
                                        : set
                                  ),
                               }
                             : exercicio
                       ),
                    }
                  : sessao
            )
         );
      }
   };

   const selecionaExercicio = (indexSessao, indexExercicio, cod_exercicio, indexSet) => {
      const exercicioAtt = exerciciosLista.find((exc) => exc.cod_exercicio == cod_exercicio);

      if (indexSet == null) {
         // Atualizando exercício base
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == indexExercicio
                             ? {
                                  ...exercicio,
                                  ...exercicioAtt,
                               }
                             : exercicio
                       ),
                    }
                  : sessao
            )
         );
      } else {
         // Atualizando set dentro do exercício base
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == indexExercicio
                             ? {
                                  ...exercicio,
                                  sets: exercicio.sets?.map((set, i) =>
                                     indexSet == i
                                        ? {
                                             ...set,
                                             ...exercicioAtt,
                                             // Sequencia exercicio precisa ser a mesma do exercicio pai para agrupar
                                             sequencia_sessao_exercicio: exercicio.sequencia_sessao_exercicio,
                                          }
                                        : set
                                  ),
                               }
                             : exercicio
                       ),
                    }
                  : sessao
            )
         );
      }
   };

   const atualizaExercicioAleatorio = (e, indexSessao, indexExercicio, exerciciosFiltrados, indexSet) => {
      e.preventDefault();
      const exercicioAleatorio = exerciciosFiltrados.length
         ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
         : { nome_exercicio: "" };

      if (indexSet == undefined && indexSet == null) {
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == indexExercicio ? { ...exercicio, ...exercicioAleatorio } : exercicio
                       ),
                    }
                  : sessao
            )
         );
      } else {
         setSessoes((prevSessoes) =>
            prevSessoes.map((sessao, idSessao) =>
               idSessao == indexSessao
                  ? {
                       ...sessao,
                       exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                          idExercicio == indexExercicio
                             ? {
                                  ...exercicio,
                                  sets: exercicio?.sets.map((set, idx) =>
                                     idx == indexSet ? { ...set, ...exercicioAleatorio } : set
                                  ),
                               }
                             : exercicio
                       ),
                    }
                  : sessao
            )
         );
      }
   };

   function newSet(index) {
      adicionarSet(indexSessao, index);
   }

   return (
      <div className="d-flex flex-column gap-2">
         {exercicios.map((exercicio, index) => (
            <div
               key={`exercise-${index}`}
               className={`d-flex flex-row shadow-sm align-items-center border-s-2 rounded bg-accent p-2 gap-2 ${
                  exercicio.sets?.length > 0 ? arrayBorders[index] : ""
               }`}
            >
               <div className="hidden md:flex flex-column align-items-center sm:none" style={{ cursor: "grab" }}>
                  <Button
                     variant="outline"
                     size="sm"
                     className="p-0 px-1"
                     onClick={(e) => changeSequence(e, index, index - 1)}
                  >
                     <ArrowUp></ArrowUp>
                  </Button>
                  <label className="py-2">{exercicio.sequencia_sessao_exercicio}</label>
                  <Button
                     variant="outline"
                     size="sm"
                     className="p-0 px-1"
                     onClick={(e) => changeSequence(e, index, index + 1)}
                  >
                     <ArrowDown></ArrowDown>
                  </Button>
               </div>

               <Card className="d-flex flex-column w-100">
                  <div>
                     <CardHeader>
                        <div className="d-flex flex-wrap align-items-center gap-2 w-100">
                           {/* Botão filtro */}
                           <FiltroTreino confirma={confirmaTreinoInteligente} exercicio={exercicio} index={index} />

                           {/* Botão atualizar */}
                           {!!exercicio?.exerciciosFiltros?.length && (
                              <Tooltip>
                                 <TooltipTrigger>
                                    <Button
                                       onClick={(e) =>
                                          atualizaExercicioAleatorio(
                                             e,
                                             indexSessao,
                                             index,
                                             exercicio?.exerciciosFiltros ?? []
                                          )
                                       }
                                       size="icon"
                                       variant="ghost"
                                    >
                                       <RefreshCcw />
                                    </Button>
                                 </TooltipTrigger>

                                 <TooltipContent>
                                    Altera o exercício selecionado de acordo com filtro usado
                                 </TooltipContent>
                              </Tooltip>
                           )}

                           {/* Badge */}
                           {exercicio?.sets.length > 0 && (
                              <Badge className={cn("hidden md:flex", arrayBackgrounds[index])}>
                                 1/{exercicio?.sets.length + 1}
                              </Badge>
                           )}

                           {/* Combo responsivo */}
                           <div className="form-floating flex-grow-1 min-w-200px">
                              <FitComboBox
                                 key={`exercise-combobox-${indexSessao}-${index}-set-null`}
                                 name={`exercise-${index}-session-${indexSessao}-set-null`}
                                 options={(exercicio?.exerciciosFiltros ?? exerciciosLista).map((e) => ({
                                    label: e.nome_exercicio,
                                    value: String(e.cod_exercicio),
                                 }))}
                                 placeHolder="Selecione um exercício"
                                 value={exercicio.cod_exercicio}
                                 onChange={(cod_exercicio) => selecionaExercicio(indexSessao, index, cod_exercicio)}
                              />
                           </div>

                           <Dialog>
                              <DropdownMenu>
                                 <DropdownMenuTrigger>
                                    <Button
                                       id={`optionsExercise-${index}-session-${indexSessao}`}
                                       variant="outline"
                                       size="icon"
                                       className="relative inline-flex"
                                    >
                                       {exercicio.observacao_sessao_exercicio && (
                                          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
                                             <MessageSquareText className="!h-3 !w-3" strokeWidth={1.5} />
                                          </Badge>
                                       )}
                                       <EllipsisVerticalIcon />
                                    </Button>
                                 </DropdownMenuTrigger>

                                 <DropdownMenuContent>
                                    <DialogTrigger>
                                       <DropdownMenuItem>
                                          <MessageSquareMore />
                                          Observação
                                       </DropdownMenuItem>
                                    </DialogTrigger>

                                    <DropdownMenuItem
                                       id={`addSetMethod-exercise-${index}-session-${indexSessao}`}
                                       onClick={() => newSet(index)}
                                    >
                                       <PlusCircle />
                                       {exercicio.sets?.length == 0 ? "Bi-set " : ""}
                                       {exercicio.sets?.length == 1 ? "Tri-set " : ""}
                                       {exercicio.sets?.length >= 2 ? "Super-set " : ""}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => remove(index)}>
                                       <Trash />
                                       Remover
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>

                              <DialogContent>
                                 <label className="text-sm font-medium">Observação</label>
                                 <Textarea
                                    placeholder="Digite uma observação..."
                                    value={exercicio.observacao_sessao_exercicio}
                                    onChange={(e) => updateField(index, "observacao_sessao_exercicio", e.target.value)}
                                 />
                                 {exercicio.observacao_sessao_exercicio_aluno && (
                                    <>
                                       <label className="text-sm font-medium">Observação do aluno</label>
                                       <Textarea value={exercicio.observacao_sessao_exercicio_aluno} disabled />
                                    </>
                                 )}
                                 <DialogFooter>
                                    <DialogClose>
                                       <Button type="button">Fechar</Button>
                                    </DialogClose>
                                 </DialogFooter>
                              </DialogContent>
                           </Dialog>

                           {/* Vídeo */}
                           <FitModalViewVideo url={exercicio.url_exercicio} name={exercicio.nome_exercicio} />
                        </div>
                     </CardHeader>

                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           {[
                              { label: "Séries", index: "serie_sessao_exercicio" },
                              { label: "Repetições", index: "repeticao_sessao_exercicio" },
                              { label: "Carga (kg)", index: "carga_sessao_exercicio", prefix: "kg" },
                              { label: "Intervalo (seg)", index: "intervalo_sessao_exercicio", prefix: "seg" },
                           ].map((v, i) => (
                              <div key={i} id={`${v.index}-${index}`}>
                                 <Label className="text-muted text-[12px]">{v.label}</Label>
                                 <NumberInputUI
                                    prefix={v.prefix}
                                    type="number"
                                    defaultValue={3}
                                    value={exercicio[v.index]}
                                    onChange={(value) => updateField(index, v.index, value)}
                                 />
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </div>

                  {exercicio.sets
                     ?.slice()
                     .sort((a, b) => new Date(a.createdAt) + new Date(b.createdAt))
                     .map((set, idx) => (
                        <>
                           <Separator />

                           <div key={`exercise-set-${idx}`}>
                              <CardHeader className="mb-2 w-100">
                                 <div className="d-flex flex-wrap align-items-center gap-2 w-100">
                                    {/* Botão filtro */}
                                    <FiltroTreino
                                       confirma={confirmaTreinoInteligente}
                                       exercicio={exercicio}
                                       index={index}
                                       indexSet={idx}
                                    />

                                    {/* Botão atualizar */}
                                    {!!set?.exerciciosFiltros?.length && (
                                       <Tooltip>
                                          <TooltipTrigger>
                                             <Button
                                                onClick={(e) =>
                                                   atualizaExercicioAleatorio(
                                                      e,
                                                      indexSessao,
                                                      index,
                                                      set?.exerciciosFiltros ?? [],
                                                      idx
                                                   )
                                                }
                                                size="icon"
                                                variant="ghost"
                                             >
                                                <RefreshCcw />
                                             </Button>
                                          </TooltipTrigger>

                                          <TooltipContent>
                                             Altera o exercício selecionado de acordo com filtro usado
                                          </TooltipContent>
                                       </Tooltip>
                                    )}

                                    {/* Badge */}
                                    {exercicio?.sets.length > 0 && (
                                       <Badge className={cn("hidden md:flex", arrayBackgrounds[index])}>
                                          {idx + 2}/{exercicio?.sets.length + 1}
                                       </Badge>
                                    )}

                                    {/* Combo ocupa todo espaço disponível */}
                                    <div className="form-floating flex-grow-1 min-w-200px">
                                       <FitComboBox
                                          key={`exercise-combobox-${indexSessao}-${index}-set-${idx}`}
                                          name={`exercise-${index}-session-${indexSessao}-set-${idx}`}
                                          options={(set?.exerciciosFiltros ?? exerciciosLista).map((e) => ({
                                             label: e.nome_exercicio,
                                             value: String(e.cod_exercicio),
                                          }))}
                                          placeHolder="Selecione um exercício"
                                          value={set.cod_exercicio}
                                          onChange={(cod_exercicio) =>
                                             selecionaExercicio(indexSessao, index, cod_exercicio, idx)
                                          }
                                       />
                                    </div>

                                    <Dialog>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger>
                                             <Button
                                                id={`optionsExercise-${index}-session-${indexSessao}-set-${idx}`}
                                                variant="outline"
                                                size="icon"
                                             >
                                                <EllipsisVerticalIcon />
                                             </Button>
                                          </DropdownMenuTrigger>

                                          <DropdownMenuContent>
                                             <DialogTrigger>
                                                <DropdownMenuItem>
                                                   <MessageSquareMore />
                                                   Observação
                                                </DropdownMenuItem>
                                             </DialogTrigger>
                                             <DropdownMenuItem onClick={() => removeSet(index, idx)}>
                                                <Trash />
                                                Remover
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>

                                       <DialogContent>
                                          <label className="text-sm font-medium">Observação</label>
                                          <Textarea
                                             placeholder="Digite uma observação..."
                                             value={set.observacao_sessao_exercicio}
                                             onChange={(e) =>
                                                updateField(index, "observacao_sessao_exercicio", e.target.value, idx)
                                             }
                                          />
                                          <DialogFooter>
                                             <DialogClose>
                                                <Button type="button">Fechar</Button>
                                             </DialogClose>
                                          </DialogFooter>
                                       </DialogContent>
                                    </Dialog>

                                    {/* Modal vídeo */}
                                    <FitModalViewVideo url={set.url_exercicio} name={set.nome_exercicio} />
                                 </div>
                              </CardHeader>

                              <CardContent className="grid gap-4">
                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[
                                       { label: "Séries", index: "serie_sessao_exercicio" },
                                       { label: "Repetições", index: "repeticao_sessao_exercicio" },
                                       { label: "Carga (kg)", index: "carga_sessao_exercicio", prefix: "kg" },
                                       {
                                          label: "Intervalo (seg)",
                                          index: "intervalo_sessao_exercicio",
                                          prefix: "seg",
                                       },
                                    ].map((v, i) => (
                                       <div key={i}>
                                          <Label className="text-muted text-[12px]">{v.label}</Label>
                                          <NumberInputUI
                                             prefix={v.prefix}
                                             type="number"
                                             defaultValue={3}
                                             value={set[v.index]}
                                             onChange={(value) => updateField(index, v.index, value, idx)}
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </CardContent>
                           </div>
                        </>
                     ))}
               </Card>
            </div>
         ))}
      </div>
   );
}

export default ListaExercicios;
