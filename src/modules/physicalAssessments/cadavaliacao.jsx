/* eslint-disable react/prop-types */
import { Check, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { CardBody, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { createOrUpdatePhysicalAssessment, updateImagePhysicalAssessment } from "../../api/physicalAssessments";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Button } from "../../components/ui/button";
import { Card, CardFooter } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useFormStore } from "../../hooks/useFormStore";
import { stateUsuario, useNotificacao } from "../../states/states";
import { calcularIdade, dataURLToBlob, limpaForm, preventForm } from "../../utils";
import Bioimpedancia from "./cadAvaliacao/bioimpedancia";
import Diametros from "./cadAvaliacao/diametros";
import Dobras from "./cadAvaliacao/dobras";
import Imagens from "./cadAvaliacao/imagens";
import Perimetros from "./cadAvaliacao/perimetros";

function CadAvaliacao() {
   const { nLoading, endLoading } = useNotificacao();
   const { formData, setAvaliacaoForm } = useFormStore();
   const {
      handleSubmit,
      register,
      setValue,
      getValues,
      watch,
      reset,
      formState: { errors, isSubmitting },
   } = useForm();
   const navigate = useNavigate();
   const location = useLocation();
   const [usuario] = useRecoilState(stateUsuario);
   const [protocolos] = useState({
      Geral: [
         {
            cod_protocolo: 1,
            nome_protocolo: "7 a 17 anos - Dezenberg, Weststrate, Seidell - (1991)",
            categoria_protocolo: "Geral",
         },
      ],
      Feminino: [
         {
            cod_protocolo: 2,
            nome_protocolo: "18 a 55 anos - Jackson, Pollock e Ward - (1980)",
            categoria_protocolo: "Feminino",
         },
         {
            cod_protocolo: 3,
            nome_protocolo: "50 a 75 anos - Rech, Santos e Silva - (2006)",
            categoria_protocolo: "Feminino",
         },
      ],
      Masculino: [
         {
            cod_protocolo: 4,
            nome_protocolo: "18 a 61 anos - Jackson e Pollock - (1978)",
            categoria_protocolo: "Masculino",
         },
         // {
         //    cod_protocolo: 5,
         //    nome_protocolo: "60 a 81 anos - Tran e Weltman - (1988)",
         //    categoria_protocolo: "Masculino",
         // },
      ],
   });

   const [capturedImages, setCapturedImages] = useState({});
   const [imageDescriptions, setImageDescriptions] = useState({});
   const [deletedImages, setDeletedImages] = useState([]);
   const [aluno, setAluno] = useState();
   const [ultimaAvaliacao, setUltimaAvaliacao] = useState();
   const [activeTab, setActiveTab] = useState("bioimpedancia");
   const [metodoDobras, setMetodoDobras] = useState("normal");
   const [metodoPerimetro, setMetodoPerimetro] = useState("normal");
   const [tipoAvaliacao, setTipoAvaliacao] = useState("");
   const [protocolo, setProtocolo] = useState(0);
   const [ocultarCampos, setOcultarCampos] = useState(false);

   const [cod_protocolo, tipo_avaliacao] = watch(["cod_protocolo", "tipo_avaliacao"]);

   useEffect(() => {
      if (cod_protocolo && cod_protocolo !== protocolo) setProtocolo(Number(cod_protocolo));
   }, [cod_protocolo]);

   useEffect(() => {
      if (tipo_avaliacao && tipo_avaliacao !== protocolo) setTipoAvaliacao(tipo_avaliacao);
   }, [tipo_avaliacao]);

   useEffect(() => {
      const ultimaAvaliacaoRecebida = location.state?.ultimaAvaliacao;
      const avaliacaoRecebida = location.state?.avaliacao;
      const alunoRecebido = location.state?.aluno;
      setValue("cod_usuario", usuario?.cod_usuario);
      setValue("cod_aluno", alunoRecebido?.cod_aluno);
      if (ultimaAvaliacaoRecebida) setUltimaAvaliacao(ultimaAvaliacaoRecebida);
      if (alunoRecebido) setAluno(alunoRecebido);
      if (avaliacaoRecebida) {
         Object.keys(avaliacaoRecebida).forEach((key) => {
            setValue(key, avaliacaoRecebida[key]);
         });
         setProtocolo(avaliacaoRecebida.cod_protocolo);
         setTipoAvaliacao(avaliacaoRecebida.tipo_avaliacao);
         avaliacaoRecebida?.imagem?.map((img, index) => {
            setCapturedImages((prevImages) => ({
               ...prevImages,
               [index + 1]: img.url_imagem,
            }));
            setImageDescriptions((prevDescriptions) => ({
               ...prevDescriptions,
               [index + 1]: img.descricao_imagem,
            }));
         });
      } else {
         if (formData.avaliacao?.cod_aluno == alunoRecebido?.cod_aluno) {
            Object.keys(formData.avaliacao).forEach((key) => {
               setValue(key, formData.avaliacao[key]);
            });
         }
      }
   }, [location, setValue, usuario, protocolos]);

   useEffect(() => {
      const avaliacaoRecebida = location.state?.avaliacao;
      if (avaliacaoRecebida) {
         Object.keys(avaliacaoRecebida).forEach((key) => {
            setValue(key, avaliacaoRecebida[key]);
         });
      }
   }, [setValue, location]);

   useEffect(() => {
      const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      if (!isSupported) {
         alert("Seu navegador não suporta reconhecimento de fala.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

   const watched = watch();
   useEffect(() => {
      if (watched?.cod_avaliacao) return;
      setAvaliacaoForm(watched);
   }, [JSON.stringify(watched)]);

   async function confirma(data) {
      try {
         var cancel = false;
         //Verifica se todas as imagens tem descrição
         Object.entries(capturedImages).forEach(([key, imageData]) => {
            if (!imageDescriptions[key]) {
               toast.error(`Adicionar descrição na imagem ${key}`);
               cancel = true;
            }
         });
         if (cancel) return;
         nLoading();
         console.log(limpaForm(data));

         const av = await createOrUpdatePhysicalAssessment(limpaForm(data));
         await enviaImagens(data?.cod_avaliacao ?? av.cod_avaliacao);
         reset();
         navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
         useFormStore.getState().clearForm();
         endLoading();
      } catch (error) {
         console.log(error);
         endLoading();
      }
   }

   const enviaImagens = async (cod_avaliacao) => {
      if (!cod_avaliacao) return;
      const formData = new FormData();

      // Iterar sobre as imagens capturadas e adicioná-las ao FormData
      Object.entries(capturedImages).forEach(([key, imageData]) => {
         if (!imageData.includes("media.fitcpx.com")) {
            const imageBlob = dataURLToBlob(imageData);
            // const imageBlob = imageData;
            const fileSizeMB = (imageBlob.size / (1024 * 1024)).toFixed(2);
            formData.append("image", imageBlob, `[${imageDescriptions[key]}]_${key}(${fileSizeMB}).jpg`);
         }
      });

      try {
         const resp = await updateImagePhysicalAssessment(
            formData,
            {
               cod_avaliacao: String(cod_avaliacao),
               deletedImages: JSON.stringify(deletedImages),
            },
            cod_avaliacao
         );
         resp ? console.log("Imagens enviadas com sucesso!") : console.error("Erro ao enviar as imagens:", resp.msg);
      } catch (error) {
         console.error("Erro na requisição:", error);
      }
   };

   const startSpeechRecognition = (inputName) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
         alert("Seu navegador não suporta a API de reconhecimento de fala.");
         return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR"; // Defina o idioma, pode ser 'en-US' para inglês, 'pt-BR' para português
      recognition.start();

      recognition.onresult = (event) => {
         const transcript = event.results[0][0].transcript;
         console.log("Comando reconhecido:", inputName, transcript);
         setValue(inputName, transcript); // Preenche o campo com o texto reconhecido
      };
      recognition.onerror = (event) => console.error("Erro no reconhecimento de voz:", event.error);
   };

   const tooltipErros = (
      <Tooltip id="tooltip">
         <div>
            {Object.keys(errors).length > 0 && (
               <ul style={{ margin: 0, padding: "0 10px", listStyleType: "disc" }}>
                  {Object.entries(errors).map(([field, error]) => (
                     <li key={field}>
                        {/* {error.message || `Erro no campo ${field}`} */}
                        {field}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </Tooltip>
   );

   function clear() {
      reset();
      useFormStore.getState().clearForm();
      localStorage.removeItem("avaliacaoCache");
   }

   function bringLast(e, field) {
      e.preventDefault();
      const value = ultimaAvaliacao[field];
      setValue(field, value);
   }

   return (
      <div className="container-fluid">
         <BackBoxUI actions={[{ action: clear, label: "Limpar", Icon: Trash }]} />

         <Card className="mt-3">
            <CardBody className="p-4">
               <form onKeyDown={preventForm} onSubmit={handleSubmit(confirma)}>
                  <h5 className="card-title fw-semibold mb-4">Informações iniciais</h5>

                  <div className="row g-3">
                     <div className="col-md-3">
                        <label className="form-label">Aluno</label>
                        <input
                           value={`${calcularIdade(aluno?.data_nascimento_aluno)} - Anos / ${aluno?.nome_aluno}`}
                           disabled
                           className="form-control"
                        />
                     </div>

                     <div className="col-md-3">
                        <label className="form-label fw-bold">Protocolo *</label>
                        <select
                           id="select-protocol"
                           {...register("cod_protocolo", { required: "Protocolo necessário!" })}
                           className="form-control"
                        >
                           <option value="">Selecione um protocolo</option>
                           {Object.keys(protocolos).map((categoria) => (
                              <optgroup key={categoria} label={categoria}>
                                 {Array.isArray(protocolos[categoria]) &&
                                    protocolos[categoria]?.map((protocolo) => (
                                       <option key={protocolo.cod_protocolo} value={protocolo.cod_protocolo}>
                                          {protocolo.nome_protocolo}
                                       </option>
                                    ))}
                              </optgroup>
                           ))}
                        </select>
                     </div>

                     <div className="col-md-3">
                        <label className="form-label fw-bold">
                           Tipo *
                           <OverlayTrigger placement="bottom" overlay={tooltip}>
                              <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: "pointer" }}></i>
                           </OverlayTrigger>
                        </label>
                        <select
                           id="select-type"
                           disabled={!protocolo}
                           {...register("tipo_avaliacao", { required: "Tipo da avaliação necessário!" })}
                           className="form-control"
                        >
                           <option value="">Selecione um tipo</option>
                           <option value="simples">Simples</option>
                           <option value="completo">Completo</option>
                        </select>
                     </div>

                     <div className="col-md-3">
                        <label className="form-label fw-bold">Data da Avaliação *</label>
                        <input
                           id="date"
                           {...register("data_avaliacao", { required: "A data é obrigatória" })}
                           type="date"
                           className="form-control"
                           defaultValue={new Date().toISOString().split("T")[0]}
                        />
                     </div>

                     <div className="col-md-3">
                        <label className="form-label fw-bold">Peso (kg) *</label>
                        <input
                           id="weight"
                           {...register("peso", { required: "O peso é obrigatório" })}
                           type="number"
                           step="0.01"
                           className="form-control"
                        />
                     </div>

                     <div className="col-md-3">
                        <label className="form-label fw-bold">Altura (m) *</label>
                        <div className="input-group">
                           <input
                              id="height"
                              {...register("altura", { required: "A altura é obrigatória" })}
                              type="number"
                              step="0.01"
                              className="form-control"
                           />
                           {!!ultimaAvaliacao && (
                              <button className="btn btn-outline-dark" onClick={(e) => bringLast(e, "altura")}>
                                 <i className="bi bi-arrow-counterclockwise" />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="row g-3 m-1">
                     <div className="form-check">
                        <input
                           value={ocultarCampos}
                           onChange={(e) => setOcultarCampos(e.target.checked)}
                           type="checkbox"
                           className="form-check-input"
                           id="ocultarCampos"
                        />
                        <label className="form-check-label" htmlFor="ocultarCampos">
                           Ocultar campos não obrigatórios
                        </label>
                        <OverlayTrigger placement="bottom" overlay={tooltipCampos}>
                           <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: "pointer" }}></i>
                        </OverlayTrigger>
                     </div>
                  </div>

                  <h5 className="card-title fw-semibold mb-4 mt-4">Avaliação</h5>
                  <h6 className={`text-danger ${protocolo ? "d-none" : ""}`}>Selecione um protocolo</h6>

                  <Tabs
                     value={activeTab}
                     activeKey={activeTab}
                     onValueChange={(tab) => setActiveTab(tab)}
                     className="mb-3"
                  >
                     <TabsList>
                        <TabsTrigger value="bioimpedancia">Bioimpedância</TabsTrigger>
                        <TabsTrigger value="diametros">Diâmetros</TabsTrigger>
                        <TabsTrigger value="dobras">Dobras cutâneas</TabsTrigger>
                        <TabsTrigger value="perimetros">Perímetros</TabsTrigger>
                        <TabsTrigger value="imagens">Imagens</TabsTrigger>
                     </TabsList>

                     <TabsContent value="bioimpedancia" className="mt-3">
                        <Bioimpedancia register={register} startSpeechRecognition={startSpeechRecognition} />
                     </TabsContent>

                     <TabsContent value="diametros" className="mt-3">
                        <Diametros
                           ocultarCampos={ocultarCampos}
                           register={register}
                           startSpeechRecognition={startSpeechRecognition}
                           tipoAvaliacao={tipoAvaliacao}
                           bringLast={bringLast}
                           showBringLast={!!ultimaAvaliacao}
                        />
                     </TabsContent>

                     <TabsContent value="dobras" className="mt-3">
                        <Dobras
                           getValues={getValues}
                           metodoDobras={metodoDobras}
                           ocultarCampos={ocultarCampos}
                           protocolo={protocolo}
                           register={register}
                           setMetodoDobras={setMetodoDobras}
                           setValue={setValue}
                           startSpeechRecognition={startSpeechRecognition}
                           tipoAvaliacao={tipoAvaliacao}
                           watch={watch}
                        />
                     </TabsContent>

                     <TabsContent value="perimetros" className="mt-3">
                        <Perimetros
                           getValues={getValues}
                           metodoPerimetro={metodoPerimetro}
                           ocultarCampos={ocultarCampos}
                           register={register}
                           setMetodoPerimetro={setMetodoPerimetro}
                           setValue={setValue}
                           startSpeechRecognition={startSpeechRecognition}
                           tipoAvaliacao={tipoAvaliacao}
                           watch={watch}
                        />
                     </TabsContent>

                     <TabsContent value="imagens" className="mt-3">
                        <Imagens
                           capturedImages={capturedImages}
                           setCapturedImages={setCapturedImages}
                           imageDescriptions={imageDescriptions}
                           setImageDescriptions={setImageDescriptions}
                           deletedImages={deletedImages}
                           setDeletedImages={setDeletedImages}
                        />
                     </TabsContent>
                  </Tabs>

                  <CardFooter className="d-flex items-end justify-end px-0 mt-4 gap-3">
                     <OverlayTrigger placement="top" overlay={tooltipErros}>
                        <i
                           className={`bi bi-exclamation-octagon ms-2 text-danger ${
                              Object.keys(errors).length > 0 ? "" : "d-none"
                           }`}
                           style={{ cursor: "pointer" }}
                        ></i>
                     </OverlayTrigger>

                     <Button id="submit" disabled={isSubmitting} type="submit">
                        <Check />
                        Confirmar
                     </Button>
                  </CardFooter>
               </form>
            </CardBody>
         </Card>
      </div>
   );
}

const tooltip = (
   <Tooltip id="tooltip">
      <div>
         <strong>Simples:</strong> Será apresentado a distribuição corporal em gordura e massa magra, utilizando um
         menor número de medidas.
      </div>
      <p></p>
      <div>
         <strong>Completo:</strong> Será detalhada a composição corporal em termos de gordura, músculo, osso e peso
         residual, utilizando um maior número de medidas.
      </div>
   </Tooltip>
);

const tooltipCampos = (
   <Tooltip id="tooltip">
      <div>
         <strong></strong> Marcar essa opção vai ocultar todos os campos não obrigatórios para o protocolo selecionado.
      </div>
   </Tooltip>
);

export default CadAvaliacao;
