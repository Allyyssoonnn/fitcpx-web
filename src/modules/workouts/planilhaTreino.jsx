import { Activity, ArrowLeftCircle, Moon, Pause, Play, RefreshCcw, Sun } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getExercises } from "../../api/exercises";
import { createOrUpdateWorkout, getWorkouts } from "../../api/workouts";
import AutoComplete from "../../components/autoComplete";
import FitModalViewVideo from "../../components/baseComponents/FitModalVideoView";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { stateUsuario, useStateApp } from "../../states/states";
import { arrayBorders } from "../../utils";

function PlanilhaTreino() {
   const [usuario] = useRecoilState(stateUsuario);
   const navigate = useNavigate();
   const { toggleTheme, theme } = useStateApp();

   const [alunos, setAlunos] = useState([]);
   const [indexAluno, setIndexAluno] = useState(0);

   const { data: exercicios } = useQuery({
      queryKey: ["exercicios", usuario.cod_usuario],
      queryFn: getExercises,
      initialData: [],
   });

   useEffect(() => {
      (async () => {
         const alunosCache = JSON.parse(localStorage.getItem("planilhatreino"));
         for (const aluno of alunosCache) {
            const treinos = await getWorkouts(false, aluno.cod_aluno);
            aluno.treinos = treinos?.filter((v) => v.status_treino == "A");
         }
         setAlunos(alunosCache.map((aluno) => ({ ...aluno, indexTreino: 0, indexSessao: 0 })));
      })();
   }, []);

   function alteraTema() {
      toggleTheme();
      const novoTema = theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", novoTema);
      if (novoTema == "dark") {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   }

   async function changeField(value, indexSessao, indexExc, field, indexSet = null) {
      const attAlunos = alunos.map((aluno, i) =>
         indexAluno == i
            ? {
                 ...aluno,
                 treinos: aluno.treinos.map((treino, idx) =>
                    idx == alunos[indexAluno].indexTreino
                       ? {
                            ...treino,
                            sessoes: treino.sessoes.map((sessao, idxSessao) =>
                               indexSessao == idxSessao
                                  ? {
                                       ...sessao,
                                       exercicios: sessao.exercicios.map((exc, idxExc) => {
                                          if (indexExc == idxExc && indexSet !== null)
                                             return {
                                                ...exc,
                                                sets: exc.sets.map((set, i) =>
                                                   indexSet == i ? { ...set, [field]: value } : set
                                                ),
                                             };
                                          if (indexExc == idxExc && indexSet == null) return { ...exc, [field]: value };
                                          return exc;
                                       }),
                                    }
                                  : sessao
                            ),
                         }
                       : treino
                 ),
              }
            : aluno
      );
      setAlunos(attAlunos);
      localStorage.setItem("planilhatreino", JSON.stringify(attAlunos));
      await createOrUpdateWorkout(
         attAlunos[indexAluno].treinos[alunos[indexAluno].indexTreino],
         attAlunos[indexAluno].treinos[alunos[indexAluno].indexTreino].sessoes
      );
   }

   function changeExercicio(exercicio, indexSessao, indexExc) {
      const attAlunos = alunos.map((aluno, i) =>
         indexAluno == i
            ? {
                 ...aluno,
                 treinos: aluno.treinos.map((treino, idx) =>
                    idx == alunos[indexAluno].indexTreino
                       ? {
                            ...treino,
                            sessoes: treino.sessoes.map((sessao, idxSessao) =>
                               indexSessao == idxSessao
                                  ? {
                                       ...sessao,
                                       exercicios: sessao.exercicios.map((exc, idxExc) =>
                                          indexExc == idxExc ? { ...exc, ...exercicio } : exc
                                       ),
                                    }
                                  : sessao
                            ),
                         }
                       : treino
                 ),
              }
            : aluno
      );
      setAlunos(attAlunos);
      localStorage.setItem("planilhatreino", JSON.stringify(attAlunos));
   }

   function changeExercicioSet(exercicio, indexSessao, indexExc, indexSet) {
      const attAlunos = alunos.map((aluno, i) =>
         indexAluno == i
            ? {
                 ...aluno,
                 treinos: aluno.treinos.map((treino, idx) =>
                    idx == alunos[indexAluno].indexTreino
                       ? {
                            ...treino,
                            sessoes: treino.sessoes.map((sessao, idxSessao) =>
                               indexSessao == idxSessao
                                  ? {
                                       ...sessao,
                                       exercicios: sessao.exercicios.map((exc, idxExc) =>
                                          indexExc == idxExc
                                             ? {
                                                  ...exc,
                                                  sets: exc.sets.map((set, idxSet) =>
                                                     idxSet == indexSet ? { ...set, ...exercicio } : set
                                                  ),
                                               }
                                             : exc
                                       ),
                                    }
                                  : sessao
                            ),
                         }
                       : treino
                 ),
              }
            : aluno
      );
      setAlunos(attAlunos);
      localStorage.setItem("planilhatreino", JSON.stringify(attAlunos));
   }

   async function selectTreino(index) {
      setAlunos((prev) => prev.map((_, i) => (i == indexAluno ? { ..._, indexTreino: index } : _)));
   }

   async function selectSessao(index) {
      setAlunos((prev) => prev.map((_, i) => (i == indexAluno ? { ..._, indexSessao: index } : _)));
   }

   return (
      <div className="container-fluid">
         {/* Header Section */}
         <Card className="mb-3">
            <CardContent className="d-flex justify-content-between align-items-center">
               <div className="d-flex gap-2">
                  <Button onClick={() => navigate("/planilha")}>
                     <ArrowLeftCircle />
                     Voltar
                  </Button>

                  <Button variant="outline" onClick={alteraTema} title="Alternar tema">
                     {localStorage.getItem("tema") === "light" ? <Moon /> : <Sun />}
                  </Button>
               </div>

               <div>
                  <h5 className="mb-1 fw-bold">
                     <i className="bi bi-card-checklist me-2"></i>
                     Planilha de Exercícios
                  </h5>
                  <p className="mb-0 opacity-75">Gerencie os treinos dos seus alunos</p>
               </div>
            </CardContent>
         </Card>

         <Card className="overflow-hidden">
            <CardContent className="p-0">
               {/* Student Selection */}
               <div className="p-4 border-bottom">
                  <div className="d-flex flex-column">
                     <h5 className="text-primary mb-3">
                        <i className="bi bi-person-rolodex me-2"></i>
                        Selecionar Aluno
                     </h5>
                     <div className="btn-group gap-3" role="group">
                        {alunos?.map((aluno, index) => (
                           <div key={index}>
                              <input
                                 type="radio"
                                 className="btn-check"
                                 name="btnradio"
                                 id={`btnradio-${index}`}
                                 checked={index == indexAluno}
                                 onChange={() => setIndexAluno(index)}
                              />
                              <label className="btn btn-outline-primary rounded-3 px-4" htmlFor={`btnradio-${index}`}>
                                 {aluno.nome_aluno}
                              </label>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Workout Selection */}
               <div className="p-4">
                  <Accordion type="multiple" className="mx-3">
                     <AccordionItem value="item-1">
                        <AccordionTrigger>
                           <i className="bi bi-card-checklist me-2"></i>
                           <h4>Selecionar Treino/Sessão</h4>
                        </AccordionTrigger>

                        <AccordionContent>
                           <div className="p-4">
                              <div className="row g-4">
                                 <div className="col-md-6">
                                    <h6 className="text-primary mb-3">
                                       <i className="bi bi-list-check me-2"></i>
                                       Treinos Disponíveis
                                    </h6>
                                    <div className="btn-group gap-3 w-100" role="group">
                                       {alunos[indexAluno]?.treinos?.map((treino, index) => {
                                          return treino.status_treino == "A" ? (
                                             <div key={index}>
                                                <input
                                                   type="radio"
                                                   className="btn-check"
                                                   name="btnradioTreino"
                                                   id={`btnradio-treino-${index}`}
                                                   checked={index == alunos[indexAluno].indexTreino}
                                                   onChange={() => selectTreino(index)}
                                                />
                                                <label
                                                   className="btn btn-outline-primary text-start rounded-3 mb-2"
                                                   htmlFor={`btnradio-treino-${index}`}
                                                >
                                                   {treino.nome_treino}
                                                </label>
                                             </div>
                                          ) : null;
                                       })}
                                    </div>
                                 </div>

                                 <div className="col-md-6">
                                    <h6 className="text-info mb-3">
                                       <i className="bi bi-calendar-check me-2"></i>
                                       Sessões do Treino
                                    </h6>
                                    <div className="btn-group gap-3 w-100" role="group">
                                       {alunos[indexAluno]?.treinos[alunos[indexAluno].indexTreino]?.sessoes?.map(
                                          (sessao, index) => (
                                             <div key={index}>
                                                <input
                                                   type="radio"
                                                   className="btn-check"
                                                   name="btnradioSessao"
                                                   id={`btnradio-sessao-${index}`}
                                                   checked={index == alunos[indexAluno].indexSessao}
                                                   onChange={() => selectSessao(index)}
                                                />
                                                <label
                                                   className="btn btn-outline-info text-start rounded-3 mb-2"
                                                   htmlFor={`btnradio-sessao-${index}`}
                                                >
                                                   {sessao.nome_sessao}
                                                </label>
                                             </div>
                                          )
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </AccordionContent>
                     </AccordionItem>

                     {/* Timer Section */}
                     <AccordionItem value="item-2">
                        <AccordionTrigger>
                           <i className="bi bi-stopwatch me-2"></i>
                           <h4>Temporizador</h4>
                        </AccordionTrigger>

                        <AccordionContent>
                           <div className="p-4">
                              <Timer />
                           </div>
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>

                  {/* Exercise Table */}
                  <div className="mt-4">
                     {alunos[indexAluno]?.treinos[alunos[indexAluno].indexTreino]?.sessoes?.map((sessao, idx) => {
                        if (idx == alunos[indexAluno].indexSessao) {
                           return (
                              <Card key={idx}>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                       <Activity />
                                       {sessao.nome_sessao}
                                    </CardTitle>
                                 </CardHeader>

                                 <CardContent className="p-0">
                                    <div className="mb-0 d-flex flex-column gap-2">
                                       {sessao?.exercicios?.map((exc, indexExc) => (
                                          <div key={indexExc} className="d-flex flex-column">
                                             <div
                                                className={`${exc.sets?.length > 0 ? arrayBorders[indexExc] : ""}
                                                   p-2 d-flex flex-col gap-2 rounded-1 border-s-1 border-t-1 border-e-1
                                                `}
                                             >
                                                <div className="col-12 d-flex gap-2 justify-content-between items-center">
                                                   <label className="text-muted">{indexExc + 1}°</label>
                                                   <FitModalViewVideo
                                                      url={exc.url_exercicio}
                                                      name={exc.nome_exercicio}
                                                   />
                                                   <EditExercicio
                                                      value={exc.nome_exercicio}
                                                      onUpdate={(v, object) => {
                                                         changeField(v, idx, indexExc, "cod_exercicio");
                                                         changeExercicio(object, idx, indexExc);
                                                      }}
                                                      exercicios={exercicios}
                                                   />
                                                </div>

                                                <div className="row g-1 m-0 justify-content-center">
                                                   <Edit
                                                      name="Séries"
                                                      className="col-2"
                                                      value={exc.serie_sessao_exercicio}
                                                      onUpdate={(v) =>
                                                         changeField(v, idx, indexExc, "serie_sessao_exercicio")
                                                      }
                                                   />
                                                   <Edit
                                                      name="Repetições"
                                                      className="col-2"
                                                      value={exc.repeticao_sessao_exercicio}
                                                      onUpdate={(v) =>
                                                         changeField(v, idx, indexExc, "repeticao_sessao_exercicio")
                                                      }
                                                   />
                                                   <Edit
                                                      name="Carga"
                                                      className="col-2"
                                                      value={exc.carga_sessao_exercicio}
                                                      onUpdate={(v) =>
                                                         changeField(v, idx, indexExc, "carga_sessao_exercicio")
                                                      }
                                                   />
                                                   <Edit
                                                      name="Observação"
                                                      className="col-5"
                                                      value={exc.observacao_sessao_exercicio}
                                                      onUpdate={(v) =>
                                                         changeField(v, idx, indexExc, "observacao_sessao_exercicio")
                                                      }
                                                   />
                                                </div>
                                             </div>

                                             {exc.sets?.map((set, indexSet) => (
                                                <div
                                                   key={indexSet}
                                                   className={`${exc.sets?.length > 0 ? arrayBorders[indexExc] : ""}
                                                      p-2 d-flex flex-col gap-2 border-s-1 border-b-1 border-e-1
                                                   `}
                                                >
                                                   <div className="col-12 d-flex gap-2 justify-content-between items-center">
                                                      <label className="text-muted">
                                                         {indexExc + 1}.{indexSet + 1}
                                                      </label>
                                                      <FitModalViewVideo
                                                         url={set.url_exercicio}
                                                         name={set.nome_exercicio}
                                                      />
                                                      <EditExercicio
                                                         value={set.nome_exercicio}
                                                         onUpdate={(v, object) => {
                                                            changeField(v, idx, indexExc, "cod_exercicio", indexSet);
                                                            changeExercicioSet(object, idx, indexExc, indexSet);
                                                         }}
                                                         exercicios={exercicios}
                                                      />
                                                   </div>
                                                   <div className="row g-1 m-0 justify-content-center">
                                                      <Edit
                                                         name="Séries"
                                                         className="col-2"
                                                         value={set.serie_sessao_exercicio}
                                                         onUpdate={(v) =>
                                                            changeField(
                                                               v,
                                                               idx,
                                                               indexExc,
                                                               "serie_sessao_exercicio",
                                                               indexSet
                                                            )
                                                         }
                                                      />
                                                      <Edit
                                                         name="Repetições"
                                                         className="col-2"
                                                         value={set.repeticao_sessao_exercicio}
                                                         onUpdate={(v) =>
                                                            changeField(
                                                               v,
                                                               idx,
                                                               indexExc,
                                                               "repeticao_sessao_exercicio",
                                                               indexSet
                                                            )
                                                         }
                                                      />
                                                      <Edit
                                                         name="Carga"
                                                         className="col-2"
                                                         value={set.carga_sessao_exercicio}
                                                         onUpdate={(v) =>
                                                            changeField(
                                                               v,
                                                               idx,
                                                               indexExc,
                                                               "carga_sessao_exercicio",
                                                               indexSet
                                                            )
                                                         }
                                                      />
                                                      <Edit
                                                         name="Observação"
                                                         className="col-5"
                                                         value={set.observacao_sessao_exercicio}
                                                         onUpdate={(v) =>
                                                            changeField(
                                                               v,
                                                               idx,
                                                               indexExc,
                                                               "observacao_sessao_exercicio",
                                                               indexSet
                                                            )
                                                         }
                                                      />
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       ))}
                                    </div>
                                 </CardContent>
                              </Card>
                           );
                        }
                        return null;
                     })}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

function Timer() {
   const [time, setTime] = useState(0);
   const [isRunning, setIsRunning] = useState(false);
   const [inputTime, setInputTime] = useState("");

   useEffect(() => {
      let interval;
      if (isRunning && time > 0) {
         interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
         }, 1000);
      } else if (time === 0 && isRunning) {
         setIsRunning(false);
         playSound();
      }
      return () => clearInterval(interval);
   }, [isRunning, time]);

   const playSound = () => {
      const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
      audio.play();
   };

   const handleSetTime = () => {
      const parsedTime = parseInt(inputTime, 10);
      if (!isNaN(parsedTime) && parsedTime > 0) {
         setTime(parsedTime);
         setInputTime("");
      } else {
         alert("Por favor, insira um número válido maior que 0.");
      }
   };

   const resetTimer = () => {
      setIsRunning(false);
      setTime(0);
   };

   const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
   };

   return (
      <div className="text-center">
         <div className="display-1 fw-bold text-primary mb-4">{formatTime(time)}</div>

         <div className="row g-3 justify-content-center mb-4">
            <div className="col-md-6">
               <div className="input-group">
                  <input
                     type="number"
                     className="form-control form-control-lg rounded-start-pill"
                     placeholder="Definir tempo (segundos)"
                     value={inputTime}
                     onChange={(e) => setInputTime(e.target.value)}
                     disabled={isRunning}
                  />
                  <button
                     className="btn btn-primary btn-lg rounded-end-pill"
                     onClick={handleSetTime}
                     disabled={isRunning}
                  >
                     <i className="bi bi-check-lg me-2"></i>
                     Definir
                  </button>
               </div>
            </div>
         </div>

         <div className="d-flex gap-3 justify-content-center">
            <Button
               variant={isRunning ? "secondary" : "default"}
               onClick={() => setIsRunning(!isRunning)}
               disabled={time === 0}
            >
               {isRunning ? <Pause /> : <Play />}
               {isRunning ? "Pausar" : "Iniciar"}
            </Button>

            <Button variant="destructive" onClick={resetTimer}>
               <RefreshCcw />
               Resetar
            </Button>
         </div>
      </div>
   );
}

function EditExercicio({ value, onUpdate, exercicios }) {
   const [isEditing, setIsEditing] = useState(false);

   useEffect(() => {
      setIsEditing(false);
   }, [value]);

   const handleBlur = () => {
      setIsEditing(false);
   };

   function onChange(value, object) {
      onUpdate(value, object);
      setIsEditing(false);
   }

   return isEditing ? (
      <AutoComplete
         onChange={onChange}
         autoFocus={true}
         onBlur={handleBlur}
         sugestoes={exercicios}
         chavePesquisa="nome_exercicio"
         chave="cod_exercicio"
         className="w-100"
      />
   ) : (
      <div
         className="w-100 p-2 rounded-3 border border-2 border-transparent hover-border-primary cursor-pointer transition-all"
         onDoubleClick={() => setIsEditing(true)}
         style={{ minHeight: "38px", display: "flex", alignItems: "center" }}
      >
         {value || <span className="text-muted">Clique duas vezes para editar</span>}
      </div>
   );
}

function Edit({ value, onUpdate, className = "", name = "" }) {
   const [isEditing, setIsEditing] = useState(false);
   const [inputValue, setInputValue] = useState(value);

   useEffect(() => {
      setInputValue(value);
   }, [value]);

   const handleBlur = () => {
      setIsEditing(false);
      if (inputValue.trim() && inputValue !== value) {
         onUpdate(inputValue.trim());
      }
   };

   return isEditing ? (
      <input
         type="text"
         className={`form-control form-control-sm text-center ${className}`}
         value={inputValue}
         onChange={(e) => setInputValue(e.target.value)}
         onBlur={handleBlur}
         onKeyDown={(e) => (e.key === "Enter" ? handleBlur() : null)}
         autoFocus
      />
   ) : (
      <div className={`${className} transition-all`}>
         <label className="text-muted fs-1">{name}</label>
         <div
            className={`rounded-3 border border-2 cursor-pointer transition-all text-center mx-1`}
            onDoubleClick={() => setIsEditing(true)}
            style={{ minHeight: "38px", display: "flex", alignItems: "center", justifyContent: "center" }}
         >
            {value || <span className="text-muted">-</span>}
         </div>
      </div>
   );
}

// PropTypes validation
EditExercicio.propTypes = {
   value: PropTypes.string,
   onUpdate: PropTypes.func.isRequired,
   exercicios: PropTypes.array.isRequired,
};

Edit.propTypes = {
   value: PropTypes.string,
   onUpdate: PropTypes.func.isRequired,
};

export default PlanilhaTreino;
