import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { getExercises } from "../../api/exercises";
import FitComboBox from "../../components/baseComponents/FitComboBox";
import { Button } from "../../components/ui/button";
import { stateUsuario } from "../../states/states";
import { arrayBorders } from "../../utils";
import FitModalViewVideo from "../baseComponents/FitModalVideoView";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import FiltroTreinoInteligente from "./filtroTreinoInteligente";

function ListaExercicios({ exercicios, indexSessao, setSessoes, adicionarSet }) {
   const [usuario] = useRecoilState(stateUsuario);
   const [showModalFiltro, setShowModalFiltro] = useState(false);
   const [indexExercicioFiltro, setIndexExercicioFiltro] = useState();

   const { data: exerciciosLista } = useQuery({
      queryKey: ["exercicios", usuario.cod_usuario],
      queryFn: getExercises,
      initialData: [],
   });

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
         sequencia_sessao_exercicio: idx + 1,
      }));

      reorderedExercicios[indexExercicio].sets = updatedSets;

      setSessoes((prevArray) =>
         prevArray.map((grupo, i) => (i == indexSessao ? { ...grupo, exercicios: reorderedExercicios } : grupo))
      );
   };

   const confirmaTreinoInteligente = (exerciciosFiltrados) => {
      // Selecionar um exercício aleatório, se houver exercícios filtrados
      const exercicioAleatorio = exerciciosFiltrados.length
         ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
         : { nome_exercicio: "" };

      setSessoes((prevSessoes) =>
         prevSessoes.map((sessao, idSessao) =>
            idSessao == indexSessao
               ? {
                    ...sessao,
                    exercicios: sessao.exercicios.map((exercicio, idExercicio) =>
                       idExercicio == indexExercicioFiltro
                          ? { ...exercicio, ...exercicioAleatorio, exerciciosFiltros: exerciciosFiltrados }
                          : exercicio
                    ),
                 }
               : sessao
         )
      );
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

   const atualizaExercicioAleatorio = (e, indexSessao, indexExercicio, exerciciosFiltrados) => {
      e.preventDefault();
      const exercicioAleatorio = exerciciosFiltrados.length
         ? exerciciosFiltrados[Math.floor(Math.random() * exerciciosFiltrados.length)]
         : { nome_exercicio: "" };

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
   };

   const openFiltroTreinoInteligente = (e, indexExercicio) => {
      e.preventDefault();
      setIndexExercicioFiltro(indexExercicio);
      setShowModalFiltro(true);
   };

   function newSet(index) {
      adicionarSet(indexSessao, index);
   }

   return (
      <>
         <FiltroTreinoInteligente
            exercicio={exercicios[indexExercicioFiltro]}
            show={showModalFiltro}
            close={() => setShowModalFiltro(false)}
            confirma={confirmaTreinoInteligente}
         />

         <div className="d-flex flex-column gap-2">
            {exercicios.map((exercicio, index) => (
               <Card
                  key={exercicio.cod_exercicio}
                  className={`d-flex flex-row shadow-sm align-items-center border-start border-primary p-2 gap-2 rounded ${
                     exercicio.sets?.length > 0 ? arrayBorders[index] : ""
                  }`}
               >
                  <div className="d-flex flex-column align-items-center" style={{ cursor: "grab" }}>
                     <Button
                        size="sm"
                        className="p-0 px-1 bg-info"
                        onClick={(e) => changeSequence(e, index, index - 1)}
                     >
                        <ArrowUp></ArrowUp>
                     </Button>
                     <label className="py-2">{exercicio.sequencia_sessao_exercicio}</label>
                     <Button
                        size="sm"
                        className="p-0 px-1 bg-info"
                        onClick={(e) => changeSequence(e, index, index + 1)}
                     >
                        <ArrowDown></ArrowDown>
                     </Button>
                  </div>

                  <Card className="d-flex flex-column w-100">
                     <div className="py-2 px-3">
                        <CardHeader className="mb-2">
                           <div className="d-flex flex-wrap align-items-center gap-2 w-100">
                              {/* Badge */}
                              <Badge variant="destructive" className="px-3">
                                 {exercicio?.sets.length == 1 && "Bi-set"}
                                 {exercicio?.sets.length == 2 && "Tri-set"}
                                 {exercicio?.sets.length >= 3 && "Super-set"}
                              </Badge>

                              {/* Botão filtro */}
                              <button
                                 onClick={(e) => openFiltroTreinoInteligente(e, index)}
                                 className="btn btn-info rounded"
                              >
                                 <i className="bi bi-funnel" />
                              </button>

                              {/* Combo responsivo */}
                              <div className="form-floating flex-grow-1 min-w-200px">
                                 <FitComboBox
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

                              {/* Botão atualizar */}
                              <button
                                 onClick={(e) =>
                                    atualizaExercicioAleatorio(
                                       e,
                                       indexSessao,
                                       index,
                                       exercicio?.exerciciosFiltros ?? []
                                    )
                                 }
                                 className={`btn btn-outline-warning rounded ${
                                    !exercicio?.exerciciosFiltros && "d-none"
                                 }`}
                              >
                                 <i className="bi bi-arrow-clockwise" />
                              </button>

                              {/* Vídeo */}
                              <FitModalViewVideo url={exercicio.url_exercicio} name={exercicio.nome_exercicio} />

                              {/* Dropdown */}
                              <div className="dropdown">
                                 <button
                                    id={`optionsExercise-${index}-session-${indexSessao}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="btn btn-outline-primary rounded"
                                    data-bs-toggle="dropdown"
                                 >
                                    <i className="bi bi-three-dots-vertical"></i>
                                 </button>

                                 <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up rounded p-1 bg-white">
                                    <a
                                       className="d-flex align-items-center gap-2 btn btn-sm btn-outline-primary rounded mb-1"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          newSet(index);
                                       }}
                                       href="#"
                                       id={`addSetMethod-exercise-${index}-session-${indexSessao}`}
                                    >
                                       <i className="bi bi-collection"></i>
                                       <p className="mb-0">
                                          {exercicio.sets?.length == 0 ? "Bi-set " : ""}
                                          {exercicio.sets?.length == 1 ? "Tri-set " : ""}
                                          {exercicio.sets?.length >= 2 ? "Super-set " : ""}
                                       </p>
                                    </a>
                                    <a
                                       className="d-flex align-items-center gap-2 btn btn-sm btn-outline-danger rounded mb-1"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          remove(index);
                                       }}
                                       href="#"
                                    >
                                       <i className="bi bi-trash"></i>
                                       <p className="mb-0">Remover</p>
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </CardHeader>

                        <CardContent className="grid gap-4">
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                 { label: "Séries", index: "serie_sessao_exercicio" },
                                 { label: "Repetições", index: "repeticao_sessao_exercicio" },
                                 { label: "Carga (kg)", index: "carga_sessao_exercicio" },
                                 { label: "Intervalo (seg)", index: "intervalo_sessao_exercicio" },
                              ].map((v, i) => (
                                 <div key={i}>
                                    <label className="text-sm font-medium">{v.label}</label>
                                    <Input
                                       type="number"
                                       defaultValue={3}
                                       value={exercicio[v.index]}
                                       onChange={(e) => updateField(index, v.index, e.target.value)}
                                    />
                                 </div>
                              ))}
                           </div>

                           <div>
                              <label className="text-sm font-medium">Observação</label>
                              <Textarea
                                 placeholder="Digite uma observação..."
                                 value={exercicio.observacao_sessao_exercicio}
                                 onChange={(e) => updateField(index, "observacao_sessao_exercicio", e.target.value)}
                              />
                           </div>
                        </CardContent>
                     </div>

                     <Separator />

                     {exercicio.sets
                        ?.slice()
                        .sort((a, b) => new Date(a.createdAt) + new Date(b.createdAt))
                        .map((set, idx) => (
                           <div key={set.cod_exercicio} className="mt-2">
                              <div className="py-2 px-3 mb-3">
                                 <CardHeader className="mb-2 w-100">
                                    <div className="d-flex flex-wrap align-items-center gap-2 w-100">
                                       {/* Combo ocupa todo espaço disponível */}
                                       <div className="form-floating flex-grow-1 min-w-200px">
                                          <FitComboBox
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

                                       {/* Modal vídeo */}
                                       <FitModalViewVideo url={set.url_exercicio} name={set.nome_exercicio} />

                                       {/* Botão remover */}
                                       <button
                                          className="btn btn-outline-danger rounded"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             removeSet(index, idx);
                                          }}
                                       >
                                          <i className="bi bi-trash"></i>
                                       </button>
                                    </div>
                                 </CardHeader>

                                 <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                       {[
                                          { label: "Séries", index: "serie_sessao_exercicio" },
                                          { label: "Repetições", index: "repeticao_sessao_exercicio" },
                                          { label: "Carga (kg)", index: "carga_sessao_exercicio" },
                                          {
                                             label: "Intervalo (seg)",
                                             index: "intervalo_sessao_exercicio",
                                          },
                                       ].map((v, i) => (
                                          <div key={i}>
                                             <label className="text-sm font-medium">{v.label}</label>
                                             <Input
                                                type="number"
                                                defaultValue={3}
                                                value={set[v.index]}
                                                onChange={(e) => updateField(index, v.index, e.target.value, idx)}
                                             />
                                          </div>
                                       ))}
                                    </div>

                                    <div>
                                       <label className="text-sm font-medium">Observação</label>
                                       <Textarea
                                          placeholder="Digite uma observação..."
                                          value={set.observacao_sessao_exercicio}
                                          onChange={(e) =>
                                             updateField(index, "observacao_sessao_exercicio", e.target.value, idx)
                                          }
                                       />
                                    </div>
                                 </CardContent>
                              </div>

                              <Separator />
                           </div>
                        ))}
                  </Card>
               </Card>
            ))}
         </div>
      </>
   );
}

export default ListaExercicios;
