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
import { imgProfile, PRODUCAO } from "../../api/api";
import { getContracts } from "../../api/contracts";
import { deletePhysicalAssessment, getPhysicalAssessments } from "../../api/physicalAssessments";
import { createOrUpdateStudent, getStudent, updateImageStudent } from "../../api/student";
import { createOrUpdateWorkout, deleteWorkout, getWorkouts } from "../../api/workouts";
import { FitTable } from "../../components/baseComponents/FitTable";
import ImageCropModal from "../../components/cutImg";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useNotificacao } from "../../states/states";
import { calcularIdade, dataURLToBlob, formatarData } from "../../utils";
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

         updateImageStudent(formData, { cod_aluno })
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
                                    : !PRODUCAO
                                    ? imgProfile
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
                              className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
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
                              <h1 className="fw-bold text-dark mb-2">{aluno?.nome_aluno}</h1>
                              <div className="d-flex align-items-center gap-3 flex-wrap">
                                 <span className="text-muted">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {calcularIdade(aluno?.data_nascimento_aluno)} anos
                                 </span>
                                 {getStatusBadge(aluno?.status_aluno)}
                              </div>
                           </div>

                           <div className="mb-4">
                              <p className="text-muted mb-1">
                                 <i className="bi bi-envelope me-2"></i>
                                 {aluno?.email_aluno}
                              </p>
                           </div>

                           <div className="d-flex gap-3 flex-wrap">
                              <Button
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
                     <TabsList>
                        <TabsTrigger value="informacoesPessoais">Informações Pessoais</TabsTrigger>
                        <TabsTrigger value="avaliacaoFisica">Avaliações Físicas</TabsTrigger>
                        <TabsTrigger value="treino">Treinos</TabsTrigger>
                        <TabsTrigger value="contratos">Contratos</TabsTrigger>
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
                                          <span className="fw-semibold">
                                             {aluno?.telefone_aluno || "Não informado"}
                                          </span>
                                       </div>
                                       <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                          <span className="text-muted">Data de Nascimento:</span>
                                          <span className="fw-semibold">
                                             {formatarData(aluno?.data_nascimento_aluno) || "Não informado"}
                                          </span>
                                       </div>
                                       <div className="d-flex justify-content-between align-items-center py-2">
                                          <span className="text-muted">Sexo:</span>
                                          <span className="fw-semibold">
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
                                       ultimaAvaliacao: avaliacoes[avaliacoes.length - 1],
                                    },
                                 })
                              }
                           >
                              <PlusCircleIcon />
                              Adicionar Avaliação
                           </Button>

                           <div className="row g-4">
                              <FitTable.Root
                                 hideHeader
                                 list={avaliacoes.sort(
                                    (a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)
                                 )}
                                 fieldSearch="data_avaliacao"
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
                                       header: "M. Muscular",
                                       className: "fw-bold text-black",
                                       getValue: (row) => (
                                          <div className="text-muted">
                                             {row?.result?.compositionWeight?.massa_muscular} kg /{" "}
                                             {row?.result?.compositionPercentage?.massa_muscular}%
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

                           <div className="row g-4">
                              <FitTable.Root
                                 hideHeader
                                 list={treinos.sort((a, b) => b.cod_treino - a.cod_treino)}
                                 fieldSearch="nome_treino"
                                 columns={[
                                    {
                                       name: "nome_treino",
                                       header: "Nome",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "usuario.nome_usuario",
                                       header: "Reponsável",
                                       className: "fw-bold text-black",
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

                           <div className="row g-4">
                              <FitTable.Root
                                 hideHeader
                                 list={alunoContratos}
                                 fieldSearch="nome_aluno_contrato"
                                 columns={[
                                    {
                                       name: "cod_aluno_contrato",
                                       header: "ID",
                                       className: "fw-bold text-black",
                                    },
                                    {
                                       name: "nome_aluno_contrato",
                                       header: "Nome",
                                       className: "fw-bold text-black",
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
                  </Tabs>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default Aluno;
