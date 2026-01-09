import {
   ChartBar,
   Clipboard,
   PauseCircle,
   Pen,
   Pencil,
   PlayCircle,
   PlusCircleIcon,
   Rotate3D,
   Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getContracts } from "../../api/contracts";
import { deletePhysicalAssessment, getPhysicalAssessments } from "../../api/physicalAssessments";
import { createOrUpdateStudent, getStudent, updateImageStudent } from "../../api/student";
import { createOrUpdateWorkout, deleteWorkout, getWorkoutHistory, getWorkouts } from "../../api/workouts";
import { FitTable } from "../../components/baseComponents/FitTable";
import ImageCropModal from "../../components/cutImg";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useNotificacao } from "../../states/states";
import { calcularIdade, dataURLToBlob, formatarData } from "../../utils";
import { protocolosPatternRaw } from "../physicalAssessments/cadavaliacao";
import { AddTreino } from "./addWorkout.ui";

function Aluno() {
   const { nConfirm } = useNotificacao();
   const location = useLocation();
   const navigate = useNavigate();
   const cod_aluno = location.state?.cod_aluno;
   const [showModal, setShowModal] = useState(false);
   const [image, setImage] = useState(null);
   const [cropper, setCropper] = useState(null);

   const {
      data: aluno,
      isLoading,
      refetch: refetchAluno,
   } = useQuery({
      queryKey: ["aluno"],
      queryFn: () => getStudent(cod_aluno),
      enabled: !!cod_aluno,
   });

   const { data: treinos, refetch: refetchTreino } = useQuery({
      queryKey: ["treinos"],
      queryFn: () => getWorkouts(false, cod_aluno),
      initialData: [],
      enabled: !!cod_aluno,
   });

   const { data: avaliacoes, refetchAvaliacao } = useQuery({
      queryKey: ["avaliacoes"],
      queryFn: () => getPhysicalAssessments("false", cod_aluno),
      initialData: [],
      enabled: !!cod_aluno,
   });

   const { data: alunoContratos, refetch: refetchContrato } = useQuery({
      queryKey: ["alunoContratos"],
      queryFn: () => getContracts(cod_aluno),
      initialData: [],
      enabled: !!cod_aluno,
   });

   const { data: workoutHistory, refetch } = useQuery({
      queryKey: ["workoutHistory"],
      queryFn: () => getWorkoutHistory(cod_aluno),
      initialData: [],
      enabled: !!cod_aluno,
   });

   useEffect(() => {
      if (!cod_aluno) navigate("/alunos");
   }, []);

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         setImage(event.target.result);
         setShowModal(true);
      };

      reader.readAsDataURL(file);
   };

   const handleModalClose = () => {
      setShowModal(false);
      if (cropper) cropper.destroy();
      setCropper(null);
   };

   const handleModalConfirm = (croppedImage) => {
      if (croppedImage) {
         const croppedBlob = dataURLToBlob(croppedImage);

         const formData = new FormData();
         formData.append("image", croppedBlob, "cropped_image.jpg");

         updateImageStudent(formData, cod_aluno)
            .then((url) => {
               refetchAluno();
               setShowModal(false);
               setCropper(null);
            })
            .catch((error) => {
               console.error("Erro ao salvar imagem recortada:", error);
            });
      }
   };

   async function changeStatusAluno() {
      await createOrUpdateStudent({
         ...aluno,
         status_aluno: aluno.status_aluno == "I" ? "A" : "I",
      });
      refetchAluno();
   }

   if (isLoading)
      return (
         <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Carregando...</span>
            </div>
         </div>
      );

   const getStatusBadge = (status) => {
      const statusConfig = {
         A: { variant: "default", text: "Ativo", icon: "bi-check-circle" },
         B: { variant: "destructive", text: "Bloqueado", icon: "bi-x-circle" },
         I: {
            variant: "destructive",
            text: "Inativo",
            icon: "bi-pause-circle",
         },
      };
      const config = statusConfig[status] || statusConfig["I"];
      return (
         <Badge variant={config.variant}>
            <i className={`bi ${config.icon} me-1`}></i>
            {config.text}
         </Badge>
      );
   };

   async function clickDeleteWorkout(treino) {
      nConfirm(null, "Tem certeza que deseja remover o treino?", async () => {
         await deleteWorkout(treino.cod_treino);
         refetchTreino();
      });
   }

   async function clickDeletePhysicalAssessment(avaliacao) {
      nConfirm(null, "Tem certeza que deseja remover a avaliação?", async () => {
         await deletePhysicalAssessment(avaliacao.cod_avaliacao);
         refetchAvaliacao();
      });
   }

   async function changeStatusTreino(treino) {
      await createOrUpdateWorkout({
         ...treino,
         status_treino: treino.status_treino == "A" ? "I" : "A",
      });
      refetchTreino();
   }

   return (
      <div className="container-fluid">
         <ImageCropModal show={showModal} image={image} onConfirm={handleModalConfirm} onCancel={handleModalClose} />

         <BackBoxUI />

         <Card className="border-0 rounded-4 overflow-hidden">
            <CardContent className="p-0">
               {/* Profile Header */}
               <div className="bg-accent p-5">
                  <div className="row align-items-center">
                     <div className="col-lg-3 col-md-4 text-center mb-4 mb-md-0">
                        <div className="position-relative d-inline-block">
                           <img
                              src={
                                 aluno?.imagem_aluno
                                    ? `${aluno?.imagem_aluno}?&t=${new Date().getTime()}`
                                    : "https://placehold.co/150x150?text=img"
                              }
                              alt="Foto do Aluno"
                              className="img-fluid rounded-circle shadow-lg border border-4 border-white"
                              style={{
                                 width: "200px",
                                 height: "200px",
                                 objectFit: "cover",
                              }}
                           />
                           <label
                              className="btn btn-success btn-sm position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                              htmlFor="img_aluno"
                              style={{
                                 width: "40px",
                                 height: "40px",
                                 padding: "0",
                              }}
                           >
                              <i className="bi bi-camera fs-5"></i>
                           </label>
                           <input id="img_aluno" className="d-none" type="file" onChange={handleFileChange} />
                        </div>
                     </div>

                     <div className="col-lg-9 col-md-8">
                        <div className="d-flex flex-column h-100 justify-content-center">
                           <div className="mb-3">
                              <h1 className="fw-bold text-dark mb-2" id="student-name">
                                 {aluno?.nome_aluno}
                              </h1>
                              <div className="d-flex align-items-center gap-3 flex-wrap">
                                 <span className="text-muted">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {calcularIdade(aluno?.data_nascimento_aluno)} anos
                                 </span>

                                 <span id="student-status">{getStatusBadge(aluno?.status_aluno)}</span>
                              </div>
                           </div>

                           <div className="mb-4">
                              <p className="text-muted mb-1" id="student-email">
                                 <i className="bi bi-envelope me-2"></i>
                                 {aluno?.email_aluno}
                              </p>
                           </div>

                           <div className="d-flex gap-3 flex-wrap">
                              <Button
                                 id="student-edit"
                                 size="sm"
                                 variant="outline"
                                 onClick={() =>
                                    navigate("/cadaluno", {
                                       state: { aluno },
                                    })
                                 }
                              >
                                 <Pen />
                                 Editar Perfil
                              </Button>

                              <Button
                                 id="student-handlestatus"
                                 size="sm"
                                 variant={aluno?.status_aluno == "A" ? "destructive" : "default"}
                                 onClick={changeStatusAluno}
                              >
                                 {aluno?.status_aluno == "A" ? <PauseCircle /> : <PlayCircle />}
                                 {aluno?.status_aluno == "A" ? "Desativar" : "Ativar"}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Tabs Section */}
               <div className="p-4">
                  <Tabs defaultValue="informacoesPessoais">
                     <TabsList className="flex-wrap w-[100%] rounded my-3 h-auto">
                        <TabsTrigger value="informacoesPessoais">Informações Pessoais</TabsTrigger>
                        <TabsTrigger value="avaliacaoFisica">Avaliações Físicas</TabsTrigger>
                        <TabsTrigger value="treino">Treinos</TabsTrigger>
                        <TabsTrigger value="contratos">Contratos</TabsTrigger>
                        <TabsTrigger value="workoutHistory">Treinos realizados</TabsTrigger>
                     </TabsList>

                     <TabsContent value="informacoesPessoais" id="aluno-tab-avaliacaoFisica">
                        <div className="row g-4 mt-2">
                           <div className="col-lg-6">
                              <Card>
                                 <CardHeader>
                                    <CardTitle>
                                       <i className="bi bi-person-lines-fill me-2"></i>
                                       Detalhes Pessoais
                                    </CardTitle>
                                 </CardHeader>

                                 <CardContent>
                                    <div className="space-y-3">
                                       <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                          <span className="text-muted">Telefone:</span>
                                          <span className="fw-semibold" id="student-phone">
                                             {aluno?.telefone_aluno || "Não informado"}
                                          </span>
                                       </div>
                                       <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                          <span className="text-muted">Data de Nascimento:</span>
                                          <span className="fw-semibold" id="student-birthday">
                                             {formatarData(aluno?.data_nascimento_aluno) || "Não informado"}
                                          </span>
                                       </div>
                                       <div className="d-flex justify-content-between align-items-center py-2">
                                          <span className="text-muted">Sexo:</span>
                                          <span className="fw-semibold" id="student-gender">
                                             {aluno?.sexo_aluno === "M" ? "Masculino" : "Feminino"}
                                          </span>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                           </div>

                           <div className="col-lg-6">
                              <Card>
                                 <CardHeader>
                                    <CardTitle>
                                       <i className="bi bi-geo-alt-fill me-2"></i>
                                       Endereço
                                    </CardTitle>
                                 </CardHeader>

                                 <CardContent>
                                    <div className="space-y-3">
                                       <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                          <span className="text-muted">Endereço:</span>
                                          <span className="fw-semibold text-end">
                                             {!aluno?.endereco_aluno && !aluno?.numero_aluno
                                                ? "Não informado"
                                                : `${aluno?.endereco_aluno}, ${aluno?.numero_aluno}, ${aluno?.bairro_aluno}`}
                                          </span>
                                       </div>
                                       <div className="d-flex justify-content-between align-items-center py-2">
                                          <span className="text-muted">Cidade:</span>
                                          <span className="fw-semibold">
                                             {!aluno?.cidade_aluno && !aluno?.estado_aluno
                                                ? "Não informado"
                                                : `${aluno?.cidade_aluno} - ${aluno?.estado_aluno}`}
                                          </span>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="avaliacaoFisica">
                        <div className="mt-4">
                           <Button
                              id="addPhysicalAssessment"
                              className="mb-4"
                              onClick={() =>
                                 navigate("/cadavaliacao", {
                                    state: {
                                       aluno,
                                       ultimaAvaliacao: avaliacoes[0],
                                       avaliacoes: avaliacoes,
                                    },
                                 })
                              }
                           >
                              <PlusCircleIcon />
                              Adicionar Avaliação
                           </Button>

                           <div className="g-4">
                              <FitTable.Root
                                 hideHeader
                                 list={avaliacoes.sort(
                                    (a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)
                                 )}
                                 fieldSearch="data_avaliacao"
                                 onClickItem={(row) =>
                                    navigate("/avaliacao", {
                                       state: {
                                          avaliacao: row,
                                          aluno,
                                       },
                                    })
                                 }
                                 columns={[
                                    {
                                       name: "data_avaliacao",
                                       type: "date",
                                       header: "Data",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "usuario.nome_usuario",
                                       header: "Reponsável",
                                       className: "fw-bold text-black",
                                       getValue: (row) => <div>{row?.usuario?.nome_usuario ?? "-"}</div>,
                                       canSort: true,
                                    },
                                    {
                                       name: "cod_protocolo",
                                       header: "Protocolo",
                                       className: "fw-bold text-black",
                                       getValue: (row) => {
                                          const protocolo = protocolosPatternRaw[row?.cod_protocolo - 1];
                                          if (!protocolo) return "-";
                                          return <div className="text-muted">{protocolo?.nome_protocolo}</div>;
                                       },
                                    },
                                    {
                                       name: "altura",
                                       header: "Altura",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "peso",
                                       header: "Peso",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "gordura",
                                       header: "Gordura",
                                       className: "fw-bold text-black",
                                       getValue: (row) => (
                                          <div className="text-muted">
                                             {row?.result?.compositionWeight?.gordura} kg /{" "}
                                             {row?.result?.compositionPercentage?.gordura}%
                                          </div>
                                       ),
                                    },
                                    {
                                       name: "musculo",
                                       header: "Músculo",
                                       className: "fw-bold text-black",
                                       getValue: (row) => (
                                          <div className="text-muted">
                                             {row?.result?.compositionWeight?.massa_muscular ?? "-"} kg /{" "}
                                             {row?.result?.compositionPercentage?.massa_muscular ?? "-"}%
                                          </div>
                                       ),
                                    },
                                    {
                                       name: "mcm",
                                       header: "MCM",
                                       className: "fw-bold text-black",
                                       getValue: (row) => (
                                          <div className="text-muted">
                                             {row?.result?.compositionWeight?.mcm} kg /{" "}
                                             {row?.result?.compositionPercentage?.mcm}%
                                          </div>
                                       ),
                                    },
                                    {
                                       name: "Resultado",
                                       type: "option",
                                       Icon: ChartBar,
                                       onClick: (row) =>
                                          navigate("/avaliacao", {
                                             state: {
                                                avaliacao: row,
                                                aluno,
                                             },
                                          }),
                                    },
                                    {
                                       name: "Editar",
                                       type: "option",
                                       Icon: Pencil,
                                       onClick: (row) =>
                                          navigate("/cadavaliacao", {
                                             state: {
                                                avaliacao: row,
                                                aluno,
                                             },
                                          }),
                                    },
                                    {
                                       name: "Remover",
                                       type: "option",
                                       Icon: Trash,
                                       onClick: (row) => clickDeletePhysicalAssessment(row),
                                    },
                                 ]}
                              />
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="treino">
                        <div className="mt-4">
                           <AddTreino treinosAluno={treinos} aluno={aluno} />

                           <div className="g-4">
                              <FitTable.Root
                                 list={treinos.sort((a, b) => b.cod_treino - a.cod_treino)}
                                 fieldSearch="nome_treino"
                                 onClickItem={(row) => navigate("/treino", { state: { workoutId: row.cod_treino } })}
                                 columns={[
                                    {
                                       name: "nome_treino",
                                       header: "Nome",
                                       className: "fw-bold text-black",
                                       canSort: true,
                                    },
                                    {
                                       name: "usuario.nome_usuario",
                                       header: "Reponsável",
                                       className: "fw-bold text-black",
                                       canSort: true,
                                    },
                                    {
                                       name: "nivel_treino",
                                       header: "Nível",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "sessoes",
                                       header: "Sessão(s)",
                                       className: "fw-bold text-black",
                                       getValue: (row) => row?.sessoes?.length,
                                       canSort: true,
                                    },
                                    {
                                       name: "status_treino",
                                       header: "Status",
                                       className: "fw-bold text-black",
                                       getValue: (row) =>
                                          row.status_treino == "A" ? (
                                             <div className="badge bg-success">Ativo</div>
                                          ) : (
                                             <div className="badge bg-danger">Inativo</div>
                                          ),
                                    },
                                    {
                                       name: "Editar",
                                       type: "option",
                                       Icon: Pencil,
                                       onClick: (row) =>
                                          navigate("/cadtreino", {
                                             state: {
                                                treino: row,
                                                aluno,
                                             },
                                          }),
                                    },
                                    {
                                       name: "Remover",
                                       type: "option",
                                       Icon: Trash,
                                       onClick: (row) => clickDeleteWorkout(row),
                                    },
                                    {
                                       name: "Mudar status",
                                       type: "option",
                                       Icon: Rotate3D,
                                       onClick: (row) => changeStatusTreino(row),
                                    },
                                 ]}
                              />
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="contratos">
                        <div className="mt-4">
                           <Button
                              className="mb-4"
                              onClick={() =>
                                 navigate("/contratacaoplano", {
                                    state: { aluno },
                                 })
                              }
                           >
                              <PlusCircleIcon />
                              Contratar Plano
                           </Button>

                           <div className="g-4">
                              <FitTable.Root
                                 hideHeader
                                 list={alunoContratos}
                                 fieldSearch="nome_aluno_contrato"
                                 columns={[
                                    {
                                       name: "cod_aluno_contrato",
                                       header: "ID",
                                       className: "fw-bold text-black",
                                       canSort: true,
                                    },
                                    {
                                       name: "nome_aluno_contrato",
                                       header: "Nome",
                                       className: "fw-bold text-black",
                                       canSort: true,
                                    },
                                    {
                                       name: "expiracao_aluno_contrato",
                                       type: "date",
                                       header: "Expiração",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "total_aluno_contrato",
                                       type: "currency",
                                       header: "Vr. total",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "status_aluno_contrato",
                                       header: "Status",
                                       className: "fw-bold text-black",
                                       getValue: (row) => {
                                          if (new Date(row.expiracao_aluno_contrato) < new Date())
                                             return <div className="badge bg-danger">Expirado</div>;
                                          if (row.status_aluno_contrato == "Ativo")
                                             return <div className="badge bg-success">Ativo</div>;
                                          if (row.status_aluno_contrato == "Inative")
                                             return <div className="badge bg-danger">Inativo</div>;
                                          if (row.status_aluno_contrato == "Canceled")
                                             return <div className="badge bg-danger">Cancelado</div>;
                                          return <div className="badge bg-warning text-dark">Pendente</div>;
                                       },
                                    },
                                    {
                                       name: "Ver contrato",
                                       type: "option",
                                       Icon: Clipboard,
                                       onClick: (row) =>
                                          navigate("/contrato", {
                                             state: {
                                                cod_aluno_contrato: row.cod_aluno_contrato,
                                                cod_aluno: aluno.cod_aluno,
                                             },
                                          }),
                                    },
                                 ]}
                              />
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="workoutHistory">
                        {console.log(workoutHistory)}
                        <div className="g-4">
                           <FitTable.Root
                              hideHeader
                              list={workoutHistory}
                              fieldSearch="nome_aluno_contrato"
                              columns={[
                                 {
                                    name: "cod_treino_execucao",
                                    header: "ID",
                                    className: "fw-bold text-black",
                                    canSort: true,
                                 },
                                 {
                                    name: "sessao.nome_sessao",
                                    header: "Sessão",
                                    className: "fw-bold text-black",
                                    canSort: true,
                                 },
                                 {
                                    name: "data_treino_execucao",
                                    header: "Data",
                                    className: "fw-bold text-black",
                                    canSort: true,
                                    type: "date",
                                 },
                                 {
                                    name: "data_treino_execucao",
                                    header: "Hora",
                                    className: "fw-bold text-black",
                                    canSort: true,
                                    type: "time",
                                 },
                                 {
                                    name: "duracao_treino_execucao",
                                    header: "Duração",
                                    className: "fw-bold text-black",
                                    canSort: true,
                                    type: "seconds",
                                 },
                                 {
                                    name: "volume",
                                    header: "Volume",
                                    className: "fw-bold text-black",
                                    getValue: (row) => {
                                       let value = 0;

                                       row.exercicios.map((v) => {
                                          v.sets?.map(
                                             (s) => (value += s.checked ? (s.repetition ?? 0) * (s.weight ?? 0) : 0)
                                          );

                                          v.superSets?.map((v2) => {
                                             v2.sets?.map(
                                                (s) => (value += s.checked ? (s.repetition ?? 0) * (s.weight ?? 0) : 0)
                                             );
                                          });
                                       });

                                       return <div>{value}</div>;
                                    },
                                 },
                                 {
                                    name: "status",
                                    header: "Status",
                                    className: "fw-bold text-black",
                                    getValue: (row) => {
                                       if (
                                          row.exercicios.every(
                                             (v) =>
                                                v?.treino_exercicio_executado == "S" &&
                                                v.superSets?.every((v2) => v2.treino_exercicio_executado == "S")
                                          )
                                       ) {
                                          return <div className="badge bg-success">Completo</div>;
                                       }

                                       return <div className="badge bg-warning text-dark">Incompleto</div>;
                                    },
                                 },
                                 {
                                    name: "Ver execução",
                                    type: "option",
                                    Icon: Clipboard,
                                    // onClick: (row) =>
                                    //    navigate("/contrato", {
                                    //       state: {
                                    //          cod_aluno_contrato: row.cod_aluno_contrato,
                                    //          cod_aluno: aluno.cod_aluno,
                                    //       },
                                    //    }),
                                 },
                              ]}
                           />
                        </div>
                     </TabsContent>
                  </Tabs>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default Aluno;
