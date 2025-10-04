import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateExercise } from "../../api/exercises";
import {
   getEquipaments,
   getExerciseResistences,
   getExerciseTypes,
   getJoints,
   getMuscleGroups,
   getSugestions,
} from "../../api/workouts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { stateUsuario, useNotificacao } from "../../states/states";
import { getYouTubeEmbedUrl } from "../../utils";

function CadExercicio() {
   const { nSuccess } = useNotificacao();
   const {
      handleSubmit,
      register,
      setValue,
      watch,
      formState: { isSubmitting },
   } = useForm();
   const navigate = useNavigate();
   const location = useLocation();
   const [usuario] = useRecoilState(stateUsuario);

   const urlValue = watch("url_exercicio");
   const urlValueEmpresa = watch("url_exercicio_empresa");
   const base_exercicio = watch("base_exercicio");

   const { data: grupos, refetch } = useQuery({
      queryKey: ["exercicios", usuario.cod_empresa],
      queryFn: getMuscleGroups,
      initialData: [],
   });

   const { data: equipamentos } = useQuery({
      queryKey: ["equipamentos", usuario.cod_empresa],
      queryFn: getEquipaments,
      initialData: [],
   });

   const { data: articulacoes } = useQuery({
      queryKey: ["joints"],
      queryFn: getJoints,
      initialData: [],
   });

   const { data: tipo_exercicios } = useQuery({
      queryKey: ["tipo_exercicios", usuario.cod_empresa],
      queryFn: getExerciseTypes,
      initialData: [],
   });

   const { data: exercicios_resistencias } = useQuery({
      queryKey: ["exercicios_resistencias", usuario.cod_empresa],
      queryFn: getExerciseResistences,
      initialData: [],
   });

   const { data: indicacoes } = useQuery({
      queryKey: ["indicacoes", usuario.cod_empresa],
      queryFn: getSugestions,
      initialData: [],
   });

   const { data: padraoes_movimentos } = useQuery({
      queryKey: ["padraoes_movimentos", usuario.cod_empresa],
      queryFn: getExerciseResistences,
      initialData: [],
   });

   useEffect(() => {
      const exercicioRecebido = location.state?.exercicio;
      if (exercicioRecebido) {
         Object.keys(exercicioRecebido).forEach((key) => {
            setValue(key, exercicioRecebido[key]);
         });
      }
   }, [location, setValue, usuario]);

   async function confirma(data) {
      const cleanedData = Object.fromEntries(
         Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
      );
      if (cleanedData.base_exercicio === "S") {
         await createOrUpdateExercise({
            cod_exercicio: cleanedData.cod_exercicio,
            url_exercicio_empresa: cleanedData?.url_exercicio_empresa,
         });
      } else {
         await createOrUpdateExercise({
            ...cleanedData,
            cod_usuario: usuario?.cod_usuario,
            cod_empresa: usuario?.cod_empresa,
            base_exercicio: "N",
         });
      }
      nSuccess();
      navigate("/exercicios");
   }

   return (
      <form onSubmit={handleSubmit(confirma)} className="container-fluid">
         <div className="row ms-1">
            <Card className="card col-md-6 p-4">
               <CardHeader className="d-flex">
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        navigate("/exercicios");
                     }}
                     className="btn btn-danger mb-3 me-3"
                  >
                     <i className="bi bi-backspace me-2"></i>
                     Voltar
                  </button>
               </CardHeader>

               <CardContent>
                  {base_exercicio == "S" && (
                     <p className="text-danger">* Exercício base do sistema [Não é possível edição]</p>
                  )}
                  <h5 className="card-title fw-semibold mb-4">Exercício</h5>

                  <div className="col-md-9">
                     <label className="form-label fw-bold">Nome *</label>
                     <input
                        disabled={base_exercicio === "S"}
                        {...register("nome_exercicio", { required: "O nome é obrigatório" })}
                        className="form-control"
                     />
                  </div>

                  <div className="col-md-12">
                     <label className="form-label fw-bold mt-3">URL</label>
                     <input disabled={base_exercicio === "S"} {...register("url_exercicio")} className="form-control" />
                  </div>

                  {base_exercicio == "S" && (
                     <div className="col-md-12">
                        <label className="form-label fw-bold mt-3">
                           URL Próprio (Incluir seu próprio vídeo ao exercício)
                        </label>
                        <input {...register("url_exercicio_empresa")} className="form-control" />
                     </div>
                  )}
               </CardContent>
            </Card>

            <div className="d-flex justify-content-center align-items-center col-md-6">
               <iframe
                  width="100%"
                  height="300"
                  src={getYouTubeEmbedUrl(urlValueEmpresa ?? urlValue)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
               ></iframe>
            </div>
         </div>

         <Card className="p-4 mb-3">
            <CardContent>
               <div className="row g-3">
                  <div className="col-md-3">
                     <label className="form-label fw-bold">Tipo exercício</label>
                     <select
                        disabled={base_exercicio === "S"}
                        {...register("cod_tipo_exercicio")}
                        className="form-control"
                     >
                        <option value="">Selecione o tipo de exercício</option>
                        {tipo_exercicios.map((te, i) => (
                           <option value={te.cod_tipo_exercicio} key={i}>
                              {te.nome_tipo_exercicio}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-3">
                     <label className="form-label fw-bold">Exercício resistência</label>
                     <select
                        disabled={base_exercicio === "S"}
                        {...register("cod_exercicio_resistencia")}
                        className="form-control"
                     >
                        <option value="">Selecione a resistência do exercício</option>
                        {exercicios_resistencias.map((er, i) => (
                           <option value={er.cod_exercicio_resistencia} key={i}>
                              {er.nome_exercicio_resistencia}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-3">
                     <label className="form-label fw-bold">Indicação</label>
                     <select disabled={base_exercicio === "S"} {...register("cod_indicacao")} className="form-control">
                        <option value="">Selecione a indicação do exercício</option>
                        {indicacoes.map((id, i) => (
                           <option value={id.cod_indicacao} key={i}>
                              {id.nome_indicacao}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-3">
                     <label className="form-label fw-bold">Padrão movimento</label>
                     <select
                        disabled={base_exercicio === "S"}
                        {...register("cod_padrao_movimento")}
                        className="form-control"
                     >
                        <option value="">Selecione o padrão de movimento</option>
                        {padraoes_movimentos.map((pm, i) => (
                           <option value={pm.cod_padrao_movimento} key={i}>
                              {pm.nome_padrao_movimento}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="px-4 mb-3">
            <CardContent>
               <Accordion type="multiple">
                  <AccordionItem value="item-1">
                     <AccordionTrigger>
                        <button
                           disabled={base_exercicio === "S"}
                           type="button"
                           data-bs-toggle="collapse"
                           data-bs-target="#panelsStayOpen-collapseOne"
                           aria-expanded="true"
                           aria-controls="panelsStayOpen-collapseOne"
                        >
                           <h4>Grupos principais</h4>
                        </button>
                     </AccordionTrigger>

                     <AccordionContent>
                        <div className="accordion-body row g-3">
                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 1</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_1")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 2</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_2")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 3</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_3")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 4</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_4")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                     <AccordionTrigger>
                        <button
                           type="button"
                           data-bs-toggle="collapse"
                           data-bs-target="#panelsStayOpen-collapseTwo"
                           aria-expanded="false"
                           aria-controls="panelsStayOpen-collapseTwo"
                        >
                           <h4>Grupos principais</h4>
                        </button>
                     </AccordionTrigger>

                     <AccordionContent>
                        <div className="accordion-body row g-3">
                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 1</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_5")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 2</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_6")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 3</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_7")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Grupo 4</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_grupo_exercicio_8")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o grupo de exercício</option>
                                 {grupos.map((gp, i) => (
                                    <option value={gp.cod_grupo_exercicio} key={i}>
                                       {gp.nome_grupo_exercicio}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                     <AccordionTrigger>
                        <button
                           type="button"
                           data-bs-toggle="collapse"
                           data-bs-target="#panelsStayOpen-collapseThree"
                           aria-expanded="false"
                           aria-controls="panelsStayOpen-collapseThree"
                        >
                           <h4>Equipamentos</h4>
                        </button>
                     </AccordionTrigger>

                     <AccordionContent>
                        <div className="accordion-body row g-3">
                           <div className="col-md-3">
                              <label className="form-label fw-bold">Equipamento 1</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_equipamento_1")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o equipamento</option>
                                 {equipamentos.map((eq, i) => (
                                    <option value={eq.cod_equipamento} key={i}>
                                       {eq.nome_equipamento}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Equipamento 2</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_equipamento_2")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o equipamento</option>
                                 {equipamentos.map((eq, i) => (
                                    <option value={eq.cod_equipamento} key={i}>
                                       {eq.nome_equipamento}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Equipamento 3</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_equipamento_3")}
                                 className="form-control"
                              >
                                 <option value="">Selecione o equipamento</option>
                                 {equipamentos.map((eq, i) => (
                                    <option value={eq.cod_equipamento} key={i}>
                                       {eq.nome_equipamento}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                     <AccordionTrigger>
                        <button
                           type="button"
                           data-bs-toggle="collapse"
                           data-bs-target="#panelsStayOpen-collapseFour"
                           aria-expanded="false"
                           aria-controls="panelsStayOpen-collapseFour"
                        >
                           <h4>Articulações</h4>
                        </button>
                     </AccordionTrigger>

                     <AccordionContent>
                        <div className="accordion-body row g-3">
                           <div className="col-md-3">
                              <label className="form-label fw-bold">Articulação 1</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_articulacao_1")}
                                 className="form-control"
                              >
                                 <option value="">Selecione a articulação</option>
                                 {articulacoes.map((at, i) => (
                                    <option value={at.cod_articulacao} key={i}>
                                       {at.nome_articulacao}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Articulação 2</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_articulacao_2")}
                                 className="form-control"
                              >
                                 <option value="">Selecione a articulação</option>
                                 {articulacoes.map((at, i) => (
                                    <option value={at.cod_articulacao} key={i}>
                                       {at.nome_articulacao}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Articulação 3</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_articulacao_3")}
                                 className="form-control"
                              >
                                 <option value="">Selecione a articulação</option>
                                 {articulacoes.map((at, i) => (
                                    <option value={at.cod_articulacao} key={i}>
                                       {at.nome_articulacao}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div className="col-md-3">
                              <label className="form-label fw-bold">Articulação 4</label>
                              <select
                                 disabled={base_exercicio === "S"}
                                 {...register("cod_articulacao_4")}
                                 className="form-control"
                              >
                                 <option value="">Selecione a articulação</option>
                                 {articulacoes.map((at, i) => (
                                    <option value={at.cod_articulacao} key={i}>
                                       {at.nome_articulacao}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </CardContent>
         </Card>

         <div className="card">
            <div className="card-footer">
               <button disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
                  <i className="bi bi-check me-2"></i>
                  Confirmar
               </button>
            </div>
         </div>
      </form>
   );
}

export default CadExercicio;
