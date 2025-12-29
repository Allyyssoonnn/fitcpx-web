/* eslint-disable react/prop-types */
import { Check, EyeClosed, Info, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { createOrUpdatePhysicalAssessment, updateImagePhysicalAssessment } from "../../api/physicalAssessments";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "../../components/ui/field";
import { Label } from "../../components/ui/label";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useFormStore } from "../../hooks/useFormStore";
import { stateUsuario, useNotificacao } from "../../states/states";
import { calcularIdade, dataURLToBlob, limpaForm, preventForm } from "../../utils";
import Bioimpedancia from "./cadAvaliacao/bioimpedancia";
import Diametros from "./cadAvaliacao/diametros";
import Dobras from "./cadAvaliacao/dobras";
import Imagens from "./cadAvaliacao/imagens";
import Perimetros from "./cadAvaliacao/perimetros";

function CadAvaliacao() {
   const location = useLocation();
   const { nLoading, endLoading } = useNotificacao();
   const { formData, setAvaliacaoForm } = useFormStore();
   const avaliacaoRecebida = location.state?.avaliacao;
   const avaliacaoCached = formData.avaliacao;

   const form = useForm({
      defaultValues: avaliacaoRecebida ?? avaliacaoCached ?? { data_avaliacao: new Date().toISOString().split("T")[0] },
   });
   const {
      handleSubmit,
      register,
      setValue,
      getValues,
      watch,
      reset,
      formState: { errors, isSubmitting },
   } = form;

   const navigate = useNavigate();
   const [usuario] = useRecoilState(stateUsuario);
   const [lastPhysicalAssessments, setLastPhysicalAssessments] = useState([]);
   const [protocolos] = useState(protocolosPattern);
   const [protocolo, setProtocolo] = useState(1);

   const [capturedImages, setCapturedImages] = useState({});
   const [imageDescriptions, setImageDescriptions] = useState({});
   const [deletedImages, setDeletedImages] = useState([]);
   const [aluno, setAluno] = useState();
   const [activeTab, setActiveTab] = useState("bioimpedancia");
   const [metodoDobras, setMetodoDobras] = useState("normal");
   const [metodoPerimetro, setMetodoPerimetro] = useState("normal");
   const [tipoAvaliacao, setTipoAvaliacao] = useState(localStorage.getItem("memoPhysicalAssessmentType") ?? "completo");
   const [ocultarCampos, setOcultarCampos] = useState(false);

   const [cod_protocolo, tipo_avaliacao] = watch(["cod_protocolo", "tipo_avaliacao"]);

   useEffect(() => {
      if (cod_protocolo && cod_protocolo !== protocolo) setProtocolo(Number(cod_protocolo));
   }, [cod_protocolo]);

   useEffect(() => {
      if (tipo_avaliacao && tipo_avaliacao !== protocolo) {
         setTipoAvaliacao(tipo_avaliacao);
      }
   }, [tipo_avaliacao]);

   useEffect(() => {
      if (tipoAvaliacao) {
         localStorage.setItem("memoPhysicalAssessmentType", tipoAvaliacao);
      }
   }, [tipoAvaliacao]);

   useEffect(() => {
      setLastPhysicalAssessments(location.state?.avaliacoes ?? []);
      const avaliacaoRecebida = location.state?.avaliacao;
      const alunoRecebido = location.state?.aluno;
      setValue("cod_usuario", usuario?.cod_usuario);
      setValue("cod_aluno", alunoRecebido?.cod_aluno);
      if (alunoRecebido) setAluno(alunoRecebido);
      if (avaliacaoRecebida) {
         setProtocolo(avaliacaoRecebida.cod_protocolo);
         setTipoAvaliacao(avaliacaoRecebida.tipo_avaliacao);

         //Carrega as imagens da avaliação
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
         setValue("data_avaliacao", new Date().toISOString().split("T")[0]);
         setValue("cod_protocolo", 1);
         setValue("tipo_avaliacao", localStorage.getItem("memoPhysicalAssessmentType") ?? "completo");

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
      recognition.lang = "pt-BR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let timeoutId = null;

      recognition.onstart = () => {
         toast.info("Aguardando comando", { duration: 5000 });
         console.log("🎤 Reconhecimento iniciado");
         // Para automaticamente após 5 segundos
         timeoutId = setTimeout(() => {
            toast.warning("Tempo limite atingido");
            console.log("⏱️ Tempo limite atingido (5s). Parando...");
            recognition.stop();
         }, 5000);
      };

      recognition.onresult = (event) => {
         const result = event.results[0];
         if (result.isFinal) {
            let transcript = result[0].transcript;
            toast.success(`Reconhecido ${transcript}`);

            if (numberString[transcript]) transcript = String(numberString[transcript]);

            console.log("Comando reconhecido:", inputName, transcript);
            setValue(inputName, transcript.replace(",", "."));
         }
      };

      recognition.onerror = (event) => {
         // toast.error(`Erro - ${event.error}`);
         console.error("Erro no reconhecimento de voz:", event.error);
      };

      recognition.onend = () => {
         console.log("🎤 Reconhecimento finalizado");
         clearTimeout(timeoutId);
      };

      recognition.start();
   };

   function clear() {
      reset();
      useFormStore.getState().clearForm();
      localStorage.removeItem("avaliacaoCache");
      setProtocolo();
      setValue(
         "data_avaliacao",
         new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
      );
      setValue("cod_protocolo", 1);
      setValue("tipo_avaliacao", localStorage.getItem("memoPhysicalAssessmentType") ?? "completo");
   }

   function bringLast(e, field) {
      var lastField = null;
      e.preventDefault();
      for (const physicalAssessment of lastPhysicalAssessments) {
         if (!lastField && physicalAssessment[field]) lastField = physicalAssessment[field];
      }
      setValue(field, lastField);
   }

   return (
      <div className="container-fluid">
         <BackBoxUI actions={[{ action: clear, label: "Limpar", Icon: Trash }]} />

         <div className="mt-3">
            <FormProvider {...form}>
               <form onKeyDown={preventForm} onSubmit={handleSubmit(confirma)}>
                  <Card>
                     <CardContent>
                        <label className="mb-3">
                           Aluno:{" "}
                           <strong>{`${aluno?.nome_aluno} | ${calcularIdade(
                              aluno?.data_nascimento_aluno
                           )} - Anos`}</strong>
                        </label>

                        <FitFormUI
                           errors={errors}
                           fields={[
                              {
                                 title: "Informações iniciais",
                                 cols: 4,
                                 fields: [
                                    {
                                       id: "select-type",
                                       label: "Tipo de avaliação",
                                       fieldName: "tipo_avaliacao",
                                       type: "select",
                                       selectOptions: [
                                          { label: "Simples", value: "simples" },
                                          { label: "Completo", value: "completo" },
                                       ],
                                       options: {
                                          required: true,
                                       },
                                       tooltipText: (
                                          <>
                                             <div>
                                                <strong>Simples:</strong> Será apresentado a distribuição corporal em
                                                gordura e massa magra, utilizando um menor número de medidas.
                                             </div>
                                             <p></p>
                                             <div>
                                                <strong>Completo:</strong> Será detalhada a composição corporal em
                                                termos de gordura, músculo, osso e peso residual, utilizando um maior
                                                número de medidas.
                                             </div>
                                          </>
                                       ),
                                    },
                                    {
                                       id: "date",
                                       label: "Data da Avaliação",
                                       fieldName: "data_avaliacao",
                                       inputType: "date",
                                       options: {
                                          required: true,
                                       },
                                    },
                                    {
                                       id: "weight",
                                       label: "Peso (kg)",
                                       fieldName: "peso",
                                       type: "number",
                                       options: {
                                          required: true,
                                       },
                                    },
                                    {
                                       id: "height",
                                       label: "Altura (m)",
                                       fieldName: "altura",
                                       type: "number",
                                       options: {
                                          required: true,
                                       },
                                    },
                                 ],
                              },
                           ]}
                        />

                        <div className="row g-3 mt-2">
                           <Field className="col-md-6">
                              <FieldLabel>Protocolo *</FieldLabel>

                              <FieldContent className="w-full">
                                 <Select
                                    id="select-protocol"
                                    value={protocolo}
                                    onValueChange={(v) => setValue("cod_protocolo", v)}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Selecione um protocolo" />
                                    </SelectTrigger>

                                    <SelectContent>
                                       {Object.keys(protocolos).map((categoria) => (
                                          <SelectGroup key={categoria}>
                                             <SelectLabel>{categoria}</SelectLabel>
                                             {Array.isArray(protocolos[categoria]) &&
                                                protocolos[categoria]?.map((protocolo) => (
                                                   <SelectItem
                                                      key={protocolo.cod_protocolo}
                                                      value={protocolo.cod_protocolo}
                                                   >
                                                      {protocolo.nome_protocolo}
                                                   </SelectItem>
                                                ))}
                                          </SelectGroup>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </FieldContent>
                           </Field>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="mt-3">
                     <CardContent>
                        <div className="m-1 flex justify-between">
                           <h5 className="card-title fw-semibold mb-4 mt-4">Dados da avaliação</h5>

                           <div className="flex items-center gap-2 border-1 px-2 rounded shadow-sm">
                              <Checkbox
                                 id="ocultarCampos"
                                 checked={ocultarCampos}
                                 onCheckedChange={(checked) => setOcultarCampos(checked)}
                              />

                              <div className="flex flex-row items-center gap-1 cursor-pointer">
                                 <EyeClosed className="w-4 h-4" />
                                 <Label htmlFor="ocultarCampos">Ocultar campos não obrigatórios</Label>
                              </div>

                              <TooltipProvider>
                                 <Tooltip>
                                    <TooltipTrigger asChild>
                                       <Info className="w-4 h-4 text-primary cursor-pointer" />
                                    </TooltipTrigger>

                                    <TooltipContent side="bottom">
                                       Marcar essa opção vai ocultar todos os campos não obrigatórios para o protocolo
                                       selecionado.
                                    </TooltipContent>
                                 </Tooltip>
                              </TooltipProvider>
                           </div>
                        </div>

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

                           <TabsContent value="bioimpedancia" className="mt-3 pt-3 border-t-1">
                              <Bioimpedancia
                                 register={register}
                                 startSpeechRecognition={startSpeechRecognition}
                                 errors={errors}
                                 watch={watch}
                                 setValue={setValue}
                                 getValues={getValues}
                              />
                           </TabsContent>

                           <TabsContent value="diametros" className="mt-3 pt-3 border-t-1">
                              <Diametros
                                 ocultarCampos={ocultarCampos}
                                 register={register}
                                 startSpeechRecognition={startSpeechRecognition}
                                 tipoAvaliacao={tipoAvaliacao}
                                 bringLast={bringLast}
                                 showBringLast={!!lastPhysicalAssessments.length}
                                 errors={errors}
                                 watch={watch}
                                 setValue={setValue}
                                 getValues={getValues}
                              />
                           </TabsContent>

                           <TabsContent value="dobras" className="mt-3 pt-3 border-t-1">
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
                                 errors={errors}
                              />
                           </TabsContent>

                           <TabsContent value="perimetros" className="mt-3 pt-3 border-t-1">
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
                                 errors={errors}
                              />
                           </TabsContent>

                           <TabsContent value="imagens" className="mt-3 pt-3 border-t-1">
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
                     </CardContent>

                     <CardFooter className="d-flex items-end justify-end mt-4 gap-3">
                        <Button id="submit" disabled={isSubmitting} type="submit">
                           <Check />
                           Confirmar
                        </Button>
                     </CardFooter>
                  </Card>
               </form>
            </FormProvider>
         </div>
      </div>
   );
}

const numberString = {
   Um: 1,
   Dois: 2,
   Três: 3,
   Quatro: 4,
   Cinco: 5,
   Seis: 6,
   Sete: 7,
   Oito: 8,
   Nove: 9,
   Dez: 10,
};

export const protocolosPattern = {
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
};

export const protocolosPatternRaw = [
   {
      cod_protocolo: 1,
      nome_protocolo: "7 a 17 anos - Dezenberg, Weststrate, Seidell - (1991)",
      categoria_protocolo: "Geral",
   },
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
];

export default CadAvaliacao;
