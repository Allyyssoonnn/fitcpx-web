import { ArrowDown, ArrowUp, PlusCircle, Trash } from "lucide-react";
import Swal from "sweetalert2";
import EditableText from "../editableText";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import GerarTreino from "./gerarTreino";
import ListaExercicios from "./listaExercicios";

function TreinoInteligente({
   sessoes,
   setSessoes,
   getRepeticao,
   getSeries,
   getInterval,
   cod_aluno,
   desenvolvimento_treino,
   volume_treino,
   nivel_treino,
   exercicios,
}) {
   const updateNomeSessao = (index, newName) => {
      setSessoes((prevWorkouts) =>
         prevWorkouts.map((workout, i) => (index === i ? { ...workout, nome_sessao: newName } : workout))
      );
   };

   async function adicionarSessao(e) {
      e.preventDefault();
      if (sessoes.length >= 15) return;
      const newKey = (sessoes.length + 1).toString();
      setSessoes([
         ...sessoes,
         {
            key: newKey,
            nome_sessao: `Sessão ${String.fromCharCode(65 + sessoes.length)}`,
            exercicios: [],
            sequencia_sessao: sessoes.length + 1,
         },
      ]);
   }

   async function adicionarExercicio(e, indexSessao) {
      e.preventDefault();
      setSessoes((prevsessoes) =>
         prevsessoes.map((sessao, index) =>
            index == indexSessao
               ? {
                    ...sessao,
                    exercicios: [
                       ...sessao.exercicios,
                       {
                          cod_exercicio: null,
                          sequencia_sessao_exercicio: sessoes[indexSessao]?.exercicios?.length + 1,
                          sets: [],
                          serie_sessao_exercicio: getSeries(),
                          repeticao_sessao_exercicio: getRepeticao(),
                          intervalo_sessao_exercicio: getInterval(),
                          carga_sessao_exercicio: 0,
                       },
                    ],
                 }
               : sessao
         )
      );
   }

   async function adicionarSet(indexSessao, indexExercicio) {
      setSessoes((prevsessoes) =>
         prevsessoes.map((sessao, index) =>
            index == indexSessao
               ? {
                    ...sessao,
                    exercicios: sessao.exercicios.map((exc, i) =>
                       indexExercicio == i
                          ? {
                               ...exc,
                               sets: [
                                  ...exc.sets,
                                  {
                                     cod_exercicio: null,
                                     sequencia_sessao_exercicio: sessoes[indexSessao]?.exercicios?.length + 1,
                                     sets: [],
                                     serie_sessao_exercicio: getSeries(),
                                     repeticao_sessao_exercicio: getRepeticao(),
                                     intervalo_sessao_exercicio: getInterval(),
                                     carga_sessao_exercicio: 0,
                                  },
                               ],
                            }
                          : exc
                    ),
                 }
               : sessao
         )
      );
   }

   async function clickDelete(e, nome_sessao, index) {
      e.preventDefault();
      Swal.fire({
         title: "Tem certeza?",
         text: `Tem certeza que deseja remover a sessão ${nome_sessao}?`,
         icon: "warning",
         showCancelButton: true,
         cancelButtonText: "Cancelar",
         confirmButtonText: "Confirmar",
         reverseButtons: true,
      }).then(async (result) => {
         if (result.isConfirmed) {
            if (result.isConfirmed) {
               const newWorkouts = sessoes.filter((grupo, idx) => index !== idx);
               setSessoes(newWorkouts);
            }
         }
      });
   }

   const changeSequence = (e, index, nextIndex) => {
      e.preventDefault();
      if (nextIndex < 0 || nextIndex >= sessoes.length) return;

      // Clona profundamente os exercícios
      const reorderedExercicios = sessoes.map((ex) => ({
         ...ex,
         exercicios: ex.exercicios?.map((s) => ({ ...s })) || [],
      }));

      const [removed] = reorderedExercicios.splice(index, 1);
      reorderedExercicios.splice(nextIndex, 0, removed);

      // Atualiza a sequência
      const updatedSessions = reorderedExercicios.map((item, idx) => ({
         ...item,
         sequencia_sessao: idx + 1,
      }));

      setSessoes(updatedSessions);
   };

   return (
      <div className="container-fluid">
         <div>
            {sessoes.map((sessao, index) => (
               <Accordion key={index} type="multiple">
                  <AccordionItem value={`session-${index}`}>
                     <AccordionTrigger className="border-1 items-center p-3">
                        <div className="flex w-full justify-between items-center">
                           <div className="flex gap-3 w-full justify-start">
                              <div className="flex flex-col justify-center items-center">
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="px-1"
                                    onClick={(e) => changeSequence(e, index, index - 1)}
                                 >
                                    <ArrowUp />
                                 </Button>
                                 <label className="fs-1">{sessao.sequencia_sessao}</label>
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="px-1"
                                    onClick={(e) => changeSequence(e, index, index + 1)}
                                 >
                                    <ArrowDown />
                                 </Button>
                              </div>

                              <GerarTreino
                                 setSessoes={setSessoes}
                                 indexSessao={index}
                                 cod_aluno={cod_aluno}
                                 volume_treino={volume_treino}
                                 nivel_treino={nivel_treino}
                                 desenvolvimento_treino={desenvolvimento_treino}
                              />

                              <button
                                 className="w-full flex items-center justify-start"
                                 id={`btnSession-${index}`}
                                 type="button"
                              >
                                 <EditableText
                                    title={true}
                                    key={index}
                                    text={sessao.nome_sessao}
                                    onUpdate={(newName) => updateNomeSessao(index, newName)}
                                 />
                              </button>
                           </div>

                           <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => clickDelete(e, sessao.nome_sessao, index)}
                           >
                              <Trash />
                           </Button>
                        </div>
                     </AccordionTrigger>

                     <AccordionContent>
                        <ListaExercicios
                           exerciciosLista={exercicios}
                           exercicios={sessao?.exercicios ?? []}
                           setSessoes={setSessoes}
                           indexSessao={index}
                           adicionarSet={adicionarSet}
                        />

                        <div className="w-100 d-flex justify-center mt-3">
                           <Button
                              id={`addExercise-${index}`}
                              variant="outline"
                              onClick={(e) => adicionarExercicio(e, index)}
                           >
                              <i className="bi bi-plus me-2" />
                              Adicionar exercício
                           </Button>
                        </div>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            ))}
         </div>

         <Button variant="outline" className="w-[100%] mt-3" id="addSessions" onClick={adicionarSessao}>
            <PlusCircle />
            Adicionar sessão
         </Button>
      </div>
   );
}

export default TreinoInteligente;
