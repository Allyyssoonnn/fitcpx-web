import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation, useNavigate } from "react-router-dom";
import { getPhysicalAssessments } from "../../api/physicalAssessments";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { calcularIdade, formatarData, ordenaAvalicaoData } from "../../utils";

function CompareAvaliacao() {
   const navigate = useNavigate();
   const location = useLocation();

   const [physical1, setPhysical1] = useState({});
   const [physical2, setPhysical2] = useState({});
   const [physical3, setPhysical3] = useState({});
   const [aluno, setAluno] = useState({});
   const [dadosIniciados, setDadosIniciados] = useState(false);

   const { data: avaliacoes, refetch } = useQuery({
      queryKey: ["avaliacoes", aluno.cod_aluno],
      queryFn: () => getPhysicalAssessments("false", aluno.cod_aluno),
      initialData: [],
      enabled: !!aluno.cod_aluno,
      // DICA: Evita que refetchs em background resetem sua UI enquanto o usuário mexe
      refetchOnWindowFocus: false,
   });

   // Separe a lógica de inicialização do aluno
   useEffect(() => {
      const alunoRecebido = location.state?.aluno;
      if (alunoRecebido) {
         setAluno(alunoRecebido);
      } else {
         navigate("/alunos");
      }
   }, []); // Roda apenas ao montar o componente

   useEffect(() => {
      // Só entra aqui se tiver dados E se ainda NÃO tiver iniciado
      if (avaliacoes && avaliacoes.length > 0 && !dadosIniciados) {
         // Define os valores iniciais
         setPhysical1(avaliacoes[0]);
         setPhysical2(avaliacoes[avaliacoes.length - 2] || avaliacoes[0]);
         setPhysical3(avaliacoes[avaliacoes.length - 1] || avaliacoes[0]);

         // ATENÇÃO: Trava para que este efeito nunca mais rode,
         // mesmo que 'avaliacoes' mude no futuro.
         setDadosIniciados(true);
      }
   }, [avaliacoes, dadosIniciados]);

   if (!aluno) return <div>Carregando...</div>;

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <Card>
            <CardContent>
               <div className="row g-3 mb-5 justify-content-center align-items-center">
                  <div className="col-md-3">
                     <label className="form-label">Avaliação 1</label>
                     <select
                        className="form-control"
                        value={physical1?.cod_avaliacao}
                        onChange={(e) => setPhysical1(avaliacoes.find((v) => v.cod_avaliacao == e.target.value))}
                     >
                        <option value={null}>Selecione uma avaliação</option>
                        {avaliacoes.map((av, index) => (
                           <option key={av.cod_avaliacao} value={av.cod_avaliacao}>
                              {formatarData(av.data_avaliacao)}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-3">
                     <label className="form-label">Avaliação 2</label>
                     <select
                        className="form-control"
                        value={physical2?.cod_avaliacao}
                        onChange={(e) => setPhysical2(avaliacoes.find((v) => v.cod_avaliacao == e.target.value))}
                     >
                        <option value={null}>Selecione uma avaliação</option>
                        {avaliacoes.map((av, index) => (
                           <option key={av.cod_avaliacao} value={av.cod_avaliacao}>
                              {formatarData(av.data_avaliacao)}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-3">
                     <label className="form-label">Avaliação 3</label>
                     <select
                        className="form-control"
                        value={physical3?.cod_avaliacao}
                        onChange={(e) => setPhysical3(avaliacoes.find((v) => v.cod_avaliacao == e.target.value))}
                     >
                        <option value={null}>Selecione uma avaliação</option>
                        {avaliacoes.map((av, index) => (
                           <option key={av.cod_avaliacao} value={av.cod_avaliacao}>
                              {formatarData(av.data_avaliacao)}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <h4 className="mb-4 text-center">Comparação de Avaliações</h4>

               {/* Exibe informações do aluno */}
               <div className="mb-4">
                  <h5>Aluno: {aluno.nome_aluno || "Nome não disponível"}</h5>
                  <p>
                     <strong>Idade:</strong> {calcularIdade(aluno.data_nascimento_aluno)} anos
                  </p>
               </div>

               <div className="card">
                  <div className="card-header">
                     <h4>Composição corporal</h4>
                  </div>

                  <div className="card-body">
                     {/* Gráfico de Barras Comparativo */}
                     <div className="mb-4">
                        <GraficoNovoNPM aluno={aluno} avaliacoes={avaliacoes} />
                     </div>

                     <row className="row g-3 justify-content-around table-responsive">
                        <table
                           id="basic-datatables"
                           className="table table-sm table-striped table-hover table-responsive"
                        >
                           <thead>
                              <tr>
                                 <th>Parâmetro</th>
                                 <th>
                                    {physical1?.data_avaliacao ? formatarData(physical1.data_avaliacao) : "Selecione"}
                                 </th>
                                 <th></th>
                                 <th>
                                    {physical2?.data_avaliacao ? formatarData(physical2.data_avaliacao) : "Selecione"}
                                 </th>
                                 <th></th>
                                 <th>
                                    {physical3?.data_avaliacao ? formatarData(physical3.data_avaliacao) : "Selecione"}
                                 </th>
                              </tr>
                           </thead>

                           <tbody>
                              {[
                                 { label: "Peso (kg)", value: "peso" },
                                 {
                                    label: "Músculo (%)",
                                    value: "result.compositionPercentage.massa_muscular",
                                    type: "completo",
                                 },
                                 {
                                    label: "Músculo (kg)",
                                    value: "result.compositionWeight.massa_muscular",
                                    type: "completo",
                                 },
                                 { label: "Gordura (%)", value: "result.compositionPercentage.gordura" },
                                 { label: "Gordura (kg)", value: "result.compositionWeight.gordura" },
                                 { label: "Massa Magra (%)", value: "result.compositionPercentage.massa_magra" },
                                 { label: "Massa Magra (kg)", value: "result.compositionWeight.massa_magra" },
                              ].map(({ label, key, value, type }) => {
                                 const getValue = (data) => {
                                    if (!value) return "Não informado";
                                    // if (type == "completo" && data.tipo_avaliacao !== "completo") return 0;
                                    const raw = value.split(".").reduce((acc, key) => acc?.[key], data);
                                    return raw;
                                 };

                                 const val1 = getValue(physical1);
                                 const val2 = getValue(physical2);
                                 const val3 = getValue(physical3);

                                 return (
                                    <tr key={key}>
                                       <td>
                                          <strong>{label}</strong>
                                       </td>
                                       <td>{val1 || "-"}</td>
                                       <th className={`${val2 - val1 > 0 ? "text-success" : "text-danger"}`}>
                                          {val2 ? (val2 - val1).toFixed(2) : "-"}
                                       </th>
                                       <td>{val2 || "-"}</td>
                                       <th className={`${val3 - val2 > 0 ? "text-success" : "text-danger"}`}>
                                          {val3 ? (val3 - val2).toFixed(2) : "-"}
                                       </th>
                                       <td>{val3 || "-"}</td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </row>
                  </div>
               </div>

               <Accordion type="single" collapsible className="mx-3">
                  <Biompedancia avaliacoes={[physical1, physical2, physical3]} />
                  <AreaMagraGorda avaliacoes={[physical1, physical2, physical3]} />
                  <Perimetria avaliacoes={[physical1, physical2, physical3]} />
                  <SimetriaMembro avaliacoes={[physical1, physical2, physical3]} />
                  <Dobras avaliacoes={[physical1, physical2, physical3]} />
                  <Diametro avaliacoes={[physical1, physical2, physical3]} />
                  <Imagens avaliacoes={[physical1, physical2, physical3]} />
               </Accordion>
            </CardContent>
         </Card>
      </div>
   );
}

function Imagens({ avaliacoes }) {
   const [tipoColagem, setTipoColagem] = useState(2);
   const [indexImg, setIndexImg] = useState([0, 0, 0]);

   // Resetar indices apenas quando as avaliações mudarem drasticamente
   useEffect(() => {
      setIndexImg([0, 0, 0]);
   }, [avaliacoes]);

   function changeIndex(value, index) {
      setIndexImg((prev) => prev.map((v, i) => (index === i ? Number(value) : v)));
   }

   return (
      <AccordionItem value="item-5">
         <AccordionTrigger>
            <Label>Comparação visual</Label>
         </AccordionTrigger>

         <AccordionContent>
            <ToggleGroup
               variant="outline"
               type="single"
               value={tipoColagem}
               onValueChange={(value) => setTipoColagem(Number(value))}
               className="mb-3 hidden md:flex"
            >
               <ToggleGroupItem value={2} className="data-[state=on]:text-primary">
                  2 Fotos
               </ToggleGroupItem>
               <ToggleGroupItem value={3} className="data-[state=on]:text-primary">
                  3 Fotos
               </ToggleGroupItem>
            </ToggleGroup>

            {/* Grid de Imagens */}
            <div className={`row g-3 ${tipoColagem === 3 ? "row-cols-3" : "row-cols-2"}`}>
               {avaliacoes?.slice(0, tipoColagem).map((av, index) => {
                  // Variáveis auxiliares para facilitar leitura e evitar erros
                  const imagensDisponiveis = av?.imagem || [];
                  const indiceSelecionado = indexImg[index] || 0;
                  const imagemAtual = imagensDisponiveis[indiceSelecionado];

                  return (
                     <div key={index} className="col">
                        <div className="text-center p-2 border rounded">
                           <div className="mb-2">
                              <label className="form-label fw-bold">
                                 {av?.data_avaliacao ? formatarData(av.data_avaliacao) : "Sem Data"}
                              </label>

                              {/* CORREÇÃO 1: O Select agora tem o atributo VALUE controlado */}
                              <select
                                 className="form-control form-select"
                                 value={indiceSelecionado}
                                 onChange={(e) => changeIndex(e.target.value, index)}
                                 disabled={imagensDisponiveis.length === 0}
                              >
                                 {imagensDisponiveis.length > 0 ? (
                                    imagensDisponiveis.map((img, i) => (
                                       <option key={i} value={i}>
                                          {img.descricao_imagem || `Imagem ${i + 1}`}
                                       </option>
                                    ))
                                 ) : (
                                    <option>Sem imagens</option>
                                 )}
                              </select>
                           </div>

                           <div
                              style={{
                                 minHeight: "200px",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 background: "#f8f9fa",
                              }}
                           >
                              {imagemAtual ? (
                                 <img
                                    src={imagemAtual.url_imagem}
                                    alt={imagemAtual.descricao_imagem}
                                    style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                                 />
                              ) : (
                                 <span className="text-muted">Imagem indisponível</span>
                              )}
                           </div>

                           {/* CORREÇÃO 3: Exibir a descrição da FOTO, não da avaliação inteira */}
                           <h6 className="mt-2 text-muted">{imagemAtual?.descricao_imagem || "-"}</h6>
                        </div>
                     </div>
                  );
               })}
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function Biompedancia({ avaliacoes }) {
   const fields = [
      { label: "% Gordura", value: "bioimpedancia_gordura" },
      { label: "% Muscular", value: "bioimpedancia_muscular" },
      { label: "Idade Corporal", value: "bioimpedancia_idade" },
      { label: "Gordura Visceral", value: "gordura_viceral" },
   ];

   return (
      <AccordionItem value="item-8">
         <AccordionTrigger>
            <Label>Bioimpedância</Label>
         </AccordionTrigger>

         <AccordionContent>
            <row className="row g-3 justify-content-around overflow-auto">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <tbody>
                     <tr>
                        <th></th>
                        <th>
                           {avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th>
                           {avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th>
                           {avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : "Selecione"}
                        </th>
                     </tr>
                     {fields.map(({ label, value }) => {
                        const value1 = avaliacoes[0]?.[value] || 0;
                        const value2 = avaliacoes[1]?.[value] || 0;
                        const value3 = avaliacoes[2]?.[value] || 0;

                        return (
                           <tr key={value}>
                              <th>{label}</th>
                              <td>{value1 || "-"}</td>
                              <th className={`${value2 - value1 > 0 ? "text-success" : "text-danger"}`}>
                                 {(value2 - value1).toFixed(2)}
                              </th>
                              <td>{value2 || "-"}</td>
                              <th className={`${value3 - value2 > 0 ? "text-success" : "text-danger"}`}>
                                 {(value3 - value2).toFixed(2)}
                              </th>
                              <td>{value3 || "-"}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </row>
         </AccordionContent>
      </AccordionItem>
   );
}

function Perimetria({ avaliacoes }) {
   const fields = [
      { label: "Pescoço", value: "pescoco" },
      { label: "Ombro", value: "ombro" },
      { label: "Tórax Inspirado", value: "torax_inspirado" },
      { label: "Tórax Expirado", value: "torax_expirado" },
      { label: "Cintura", value: "cintura" },
      { label: "Abdômen", value: "abdomen" },
      { label: "Quadril", value: "quadril" },
      { label: "Quadril", value: "quadril" },
      { label: "Braço Relaxado Direito:", value: "braco_relaxado_direito" },
      { label: "Braço Contraído Direito:", value: "braco_contraido_direito" },
      { label: "Antebraço Direito:", value: "antebraco_direito" },
      { label: "Coxa Direita", value: "coxa_direita" },
      { label: "Panturrilha Direita", value: "panturrilha_direita" },
      { label: "Braço Relaxado Esquerdo:", value: "braco_relaxado_esquerdo" },
      { label: "Braço Contraído Esquerdo:", value: "braco_contraido_esquerdo" },
      { label: "Antebraço Esquerdo:", value: "antebraco_esquerdo" },
      { label: "Coxa Esquerda", value: "coxa_esquerda" },
      { label: "Panturrilha Esquerda", value: "panturrilha_esquerda" },
   ];

   return (
      <AccordionItem value="item-6">
         <AccordionTrigger>
            <Label>Perimetria (cm)</Label>
         </AccordionTrigger>

         <AccordionContent>
            <row className="row g-3 justify-content-around overflow-auto">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <tbody>
                     <tr>
                        <th></th>
                        <th>
                           {avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th>
                           {avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th>
                           {avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : "Selecione"}
                        </th>
                     </tr>
                     {fields.map(({ label, value }) => {
                        const value1 = avaliacoes[0]?.[value] || 0;
                        const value2 = avaliacoes[1]?.[value] || 0;
                        const value3 = avaliacoes[2]?.[value] || 0;

                        return (
                           <tr key={value}>
                              <th>{label}</th>
                              <td>{value1 || "-"}</td>
                              <th className={`${value2 - value1 > 0 ? "text-success" : "text-danger"}`}>
                                 {(value2 - value1).toFixed(2)}
                              </th>
                              <td>{value2 || "-"}</td>
                              <th className={`${value3 - value2 > 0 ? "text-success" : "text-danger"}`}>
                                 {(value3 - value2).toFixed(2)}
                              </th>
                              <td>{value3 || "-"}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </row>
         </AccordionContent>
      </AccordionItem>
   );
}

function AreaMagraGorda({ avaliacoes }) {
   const [resultados, setResultados] = useState({ braco: [], coxa: [], panturrilha: [] });

   useEffect(() => {
      const arrayResultados = [];

      //Cria um array com os resultados de todas avaliações
      {
         avaliacoes.map((av) => arrayResultados.push(av?.result?.leanAndFatArea));
      }

      // Criar estrutura com arrays vazios para cada segmento
      const groupedResults = {
         braco: [],
         coxa: [],
         panturrilha: [],
      };

      // Iterar sobre os índices dos objetos dentro de cada avaliação
      for (let i = 0; i < 6; i++) {
         // Sempre há 6 itens em cada segmento
         ["braco", "coxa", "panturrilha"].forEach((segmento) => {
            // Criar um novo objeto mantendo nome, campo e prefix, mas com array de valores
            groupedResults[segmento].push({
               nome: arrayResultados[2]?.[segmento][i].nome || "",
               campo: arrayResultados[2]?.[segmento][i].campo || "",
               prefix: arrayResultados[2]?.[segmento][i].prefix || "",

               // Valores
               valor1: arrayResultados[0]?.[segmento]?.[i]?.valor || 0,
               valor2: arrayResultados[1]?.[segmento]?.[i]?.valor || 0,
               valor3: arrayResultados[2]?.[segmento]?.[i]?.valor || 0,

               // Códigos das avaliações
               cod_avaliacao1: avaliacoes[0]?.cod_avaliacao || 0,
               cod_avaliacao2: avaliacoes[1]?.cod_avaliacao || 0,
               cod_avaliacao3: avaliacoes[2]?.cod_avaliacao || 0,
            });
         });
      }

      setResultados(groupedResults);
   }, [avaliacoes]);

   return (
      <AccordionItem value="item-1">
         <AccordionTrigger>
            <Label>Área Magra/Gorda</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="overflow-auto">
               <row className="row g-3 justify-content-around">
                  <table id="basic-datatables" className="table table-sm table-striped table-hover">
                     <tbody>
                        <tr>
                           <th></th>
                           <th>
                              {avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : "Selecione"}
                           </th>
                           <th></th>
                           <th>
                              {avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : "Selecione"}
                           </th>
                           <th></th>
                           <th>
                              {avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : "Selecione"}
                           </th>
                        </tr>
                        <tr>
                           <h6>Braço</h6>
                        </tr>
                        {resultados?.braco?.map((campo, id) => {
                           // if (!campo.cod_avaliacao1) return <tr key={id}><th>Selecione a avaliação 1</th></tr>

                           return (
                              <tr key={id}>
                                 <th>{campo.nome}</th>
                                 {campo.cod_avaliacao1 ? (
                                    <td>
                                       {campo.valor1} {campo.prefix}
                                    </td>
                                 ) : (
                                    <td>-</td>
                                 )}
                                 <th className={`${campo.valor2 - campo.valor1 > 0 ? "text-success" : "text-danger"}`}>
                                    {(campo.valor2 - campo.valor1).toFixed(2)}
                                 </th>
                                 {campo.cod_avaliacao2 ? (
                                    <td>
                                       {campo.valor2} {campo.prefix}
                                    </td>
                                 ) : (
                                    <td>-</td>
                                 )}
                                 <th className={`${campo.valor3 - campo.valor2 > 0 ? "text-success" : "text-danger"}`}>
                                    {(campo.valor3 - campo.valor2).toFixed(2)}
                                 </th>
                                 <td>
                                    {campo.valor3} {campo.prefix}
                                 </td>
                              </tr>
                           );
                        })}
                        <tr>
                           <h6>Coxa</h6>
                        </tr>
                        {resultados?.coxa?.map((campo, id) => (
                           <tr key={id}>
                              <th>{campo.nome}</th>
                              {campo.cod_avaliacao1 ? (
                                 <td>
                                    {campo.valor1} {campo.prefix}
                                 </td>
                              ) : (
                                 <td>-</td>
                              )}
                              <th className={`${campo.valor2 - campo.valor1 > 0 ? "text-success" : "text-danger"}`}>
                                 {(campo.valor2 - campo.valor1).toFixed(2)}
                              </th>
                              {campo.cod_avaliacao2 ? (
                                 <td>
                                    {campo.valor2} {campo.prefix}
                                 </td>
                              ) : (
                                 <td>-</td>
                              )}
                              <th className={`${campo.valor3 - campo.valor2 > 0 ? "text-success" : "text-danger"}`}>
                                 {(campo.valor3 - campo.valor2).toFixed(2)}
                              </th>
                              <td>
                                 {campo.valor3} {campo.prefix}
                              </td>
                           </tr>
                        ))}
                        <tr>
                           <h6>Panturrilha</h6>
                        </tr>
                        {resultados?.panturrilha?.map((campo, id) => (
                           <tr key={id}>
                              <th>{campo.nome}</th>
                              {campo.cod_avaliacao1 ? (
                                 <td>
                                    {campo.valor1} {campo.prefix}
                                 </td>
                              ) : (
                                 <td>-</td>
                              )}
                              <th className={`${campo.valor2 - campo.valor1 > 0 ? "text-success" : "text-danger"}`}>
                                 {(campo.valor2 - campo.valor1).toFixed(2)}
                              </th>
                              {campo.cod_avaliacao2 ? (
                                 <td>
                                    {campo.valor2} {campo.prefix}
                                 </td>
                              ) : (
                                 <td>-</td>
                              )}
                              <th className={`${campo.valor3 - campo.valor2 > 0 ? "text-success" : "text-danger"}`}>
                                 {(campo.valor3 - campo.valor2).toFixed(2)}
                              </th>
                              <td>
                                 {campo.valor3} {campo.prefix}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </row>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function SimetriaMembro({ avaliacoes }) {
   return (
      <AccordionItem value="item-2">
         <AccordionTrigger>
            <div className="d-flex justify-between items-center w-100">
               <Label>Simetria dos membros (cm)</Label>
               <Tooltip>
                  <TooltipTrigger>
                     <Info />
                  </TooltipTrigger>

                  <TooltipContent>
                     O valor será destacado em vermelho quando ultrapassar 1 cm, sinalizando a necessidade de ajuste.
                  </TooltipContent>
               </Tooltip>
            </div>
         </AccordionTrigger>

         <AccordionContent>
            <div className="overflow-auto">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <thead>
                     <tr>
                        <th>Membro</th>
                        <th>
                           {avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th></th>
                        <th>
                           {avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : "Selecione"}
                        </th>
                        <th></th>
                        <th></th>
                        <th>
                           {avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : "Selecione"}
                        </th>
                     </tr>
                     <tr>
                        <th></th>
                        {avaliacoes.map((_, index) => (
                           <>
                              <th key={`dir-${index}`}>Direito</th>
                              <th key={`dif-${index}`}>Diferença</th>
                              <th key={`esq-${index}`}>Esquerdo</th>
                           </>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {["Braço", "Braço contraído", "Antebraço", "Coxa", "Panturrilha"].map((membro, idx) => {
                        const keys = [
                           ["braco_relaxado_direito", "braco_relaxado_esquerdo"],
                           ["braco_contraido_direito", "braco_contraido_esquerdo"],
                           ["antebraco_direito", "antebraco_esquerdo"],
                           ["coxa_direita", "coxa_esquerda"],
                           ["panturrilha_direita", "panturrilha_esquerda"],
                        ];
                        return (
                           <tr key={idx}>
                              <th>{membro}</th>
                              {avaliacoes.map((av, index) => {
                                 const direito = av?.[keys[idx][0]] || "-";
                                 const esquerdo = av?.[keys[idx][1]] || "-";
                                 const diferenca =
                                    direito && esquerdo && !isNaN(direito - esquerdo)
                                       ? (direito - esquerdo).toFixed(2)
                                       : "-";
                                 return (
                                    <>
                                       <td key={`dir-${index}`}>{direito}</td>
                                       <td
                                          key={`dif-${index}`}
                                          className={`${
                                             diferenca >= 1 || diferenca <= -1 ? "text-danger" : "text-success"
                                          }`}
                                       >
                                          {diferenca}
                                       </td>
                                       <td key={`esq-${index}`}>{esquerdo}</td>
                                    </>
                                 );
                              })}
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function Dobras({ avaliacoes }) {
   return (
      <AccordionItem value="item-3">
         <AccordionTrigger>
            <Label>Dobras Cutâneas (cm)</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="card-body">
               <row className="row g-3 justify-content-around">
                  <div className="table-responsive">
                     <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                           <tr>
                              <th>Parâmetro</th>
                              <th>
                                 {avaliacoes[0]?.data_avaliacao
                                    ? formatarData(avaliacoes[0].data_avaliacao)
                                    : "Selecione"}
                              </th>
                              <th></th>
                              <th>
                                 {avaliacoes[1]?.data_avaliacao
                                    ? formatarData(avaliacoes[1].data_avaliacao)
                                    : "Selecione"}
                              </th>
                              <th></th>
                              <th>
                                 {avaliacoes[2]?.data_avaliacao
                                    ? formatarData(avaliacoes[2].data_avaliacao)
                                    : "Selecione"}
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {[
                              { label: "Peitoral", key: "peitoral" },
                              { label: "Bíceps", key: "biciptal" },
                              { label: "Tríceps", key: "triciptal" },
                              { label: "Subescapular", key: "subescapular" },
                              { label: "Axilar Média", key: "axilar_media" },
                              { label: "Abdominal", key: "abdominal" },
                              { label: "Coxa", key: "coxa" },
                              { label: "Supra Ilíaca", key: "supra_iliaca" },
                              { label: "Supra Espinhal", key: "supra_espinhal" },
                              { label: "Panturrilha", key: "panturrilha" },
                           ].map(({ label, key }) => {
                              const val1 = avaliacoes[0]?.[key] || 0;
                              const val2 = avaliacoes[1]?.[key] || 0;
                              const val3 = avaliacoes[2]?.[key] || 0;

                              return (
                                 <tr key={key}>
                                    <td>
                                       <strong>{label}</strong>
                                    </td>
                                    <td>{val1 || "Não informado"}</td>
                                    <th className={`${val2 - val1 > 0 ? "text-success" : "text-danger"}`}>
                                       {val2 ? (val2 - val1).toFixed(2) : "-"}
                                    </th>
                                    <td>{val2 || "Não informado"}</td>
                                    <th className={`${val3 - val2 > 0 ? "text-success" : "text-danger"}`}>
                                       {val3 ? (val3 - val2).toFixed(2) : "-"}
                                    </th>
                                    <td>{val3 || "Não informado"}</td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </row>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function Diametro({ avaliacoes }) {
   return (
      <AccordionItem value="item-4">
         <AccordionTrigger>
            <Label>Diamêtros Osséos</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div>
               <div className="row">
                  <div className="table-responsive">
                     <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                           <tr>
                              <th>Parâmetro</th>
                              <th>
                                 {avaliacoes[0]?.data_avaliacao
                                    ? formatarData(avaliacoes[0].data_avaliacao)
                                    : "Selecione"}
                              </th>
                              <th></th>
                              <th>
                                 {avaliacoes[1]?.data_avaliacao
                                    ? formatarData(avaliacoes[1].data_avaliacao)
                                    : "Selecione"}
                              </th>
                              <th></th>
                              <th>
                                 {avaliacoes[2]?.data_avaliacao
                                    ? formatarData(avaliacoes[2].data_avaliacao)
                                    : "Selecione"}
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {[
                              { label: "Biestilóide punho", key: "biestiloide_punho" },
                              { label: "Biepicôndilo Umeral", key: "biepicondilo_umeral" },
                              { label: "Biepicôndilo femoral", key: "biepicondilo_femoral" },
                           ].map(({ label, key }) => {
                              const val1 = avaliacoes[0]?.[key] || 0;
                              const val2 = avaliacoes[1]?.[key] || 0;
                              const val3 = avaliacoes[2]?.[key] || 0;

                              return (
                                 <tr key={key}>
                                    <td>
                                       <strong>{label}</strong>
                                    </td>
                                    <td>{val1 || "Não informado"}</td>
                                    <th className={`${val2 - val1 > 0 ? "text-success" : "text-danger"}`}>
                                       {val2 ? (val2 - val1).toFixed(2) : "-"}
                                    </th>
                                    <td>{val2 || "Não informado"}</td>
                                    <th className={`${val3 - val2 > 0 ? "text-success" : "text-danger"}`}>
                                       {val3 ? (val3 - val2).toFixed(2) : "-"}
                                    </th>
                                    <td>{val3 || "Não informado"}</td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function GraficoNovoNPM({ aluno, avaliacoes }) {
   const [data, setData] = useState([]);
   const [seriesVisible, setSeriesVisible] = useState([]);

   useEffect(() => {
      var temp = [
         { name: "Massa Muscular", data: [], color: "var(--bs-success)" },
         { name: "Massa magra", data: [], color: "var(--bs-primary)" },
         { name: "Gordura", data: [], color: "var(--bs-danger)" },
         { name: "Osséo", data: [], color: "var(--bs-secondary)" },
         { name: "Residual", data: [], color: "var(--bs-warning)" },
         { name: "Peso", data: [], color: "var(--bs-info)" },
      ];
      for (const av of ordenaAvalicaoData(avaliacoes)) {
         // temp[0].data.push(Number(av.tipo_avaliacao == "completo" ? av.result.compositionWeight.massa_muscular : 0));
         temp[0].data.push(Number(av.result.compositionWeight.massa_muscular));
         temp[1].data.push(Number(av.result.compositionWeight.massa_magra));
         temp[2].data.push(Number(av.result.compositionWeight.gordura));
         temp[3].data.push(Number(av.tipo_avaliacao == "completo" ? av.result.compositionWeight.massa_ossea : 0));
         temp[4].data.push(Number(av.tipo_avaliacao == "completo" ? av.result.compositionWeight.massa_residual : 0));
         temp[5].data.push(Number(av.peso));
      }
      setData(temp);
      setSeriesVisible(temp.reduce((acc, serie) => ({ ...acc, [serie.name]: true }), {}));
   }, [avaliacoes]);

   // Função para calcular o valor máximo dentro dos dados das séries visíveis
   const getMaxValue = () => {
      const visibleData = data.filter((serie) => seriesVisible[serie.name]); // Filtra as séries visíveis
      const allData = visibleData.flatMap((serie) => serie.data); // Extrai todos os dados das séries visíveis
      return Math.max(...allData); // Retorna o maior valor
   };

   // Opções do gráfico
   const options = {
      chart: { fontFamily: "inherit", type: "line", height: 300, toolbar: { show: false }, offsetX: -15 },
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      grid: { borderColor: "var(--bs-border-color)", strokeDashArray: 4, yaxis: { lines: { show: true } } },
      markers: { size: 4 },
      xaxis: {
         categories: ordenaAvalicaoData(avaliacoes).reduce(
            (arr, av, i) => [
               ...arr,
               // new Date(av.data_avaliacao).toLocaleDateString()
               new Date(...av.data_avaliacao.split("-").map((v, i) => (i === 1 ? +v - 1 : +v))).toLocaleDateString(
                  "pt-BR",
               ),
            ],
            [],
         ),
         labels: { style: { fontSize: "12px", colors: "#a1aab2" } },
      },
      yaxis: {
         max: getMaxValue() + 10,
         min: 0,
         tickAmount: 4,
         labels: { style: { fontSize: "12px", colors: "#a1aab2" } },
      },
      tooltip: { theme: "dark", shared: true, intersect: false },
      colors: data.map((serie) => serie.color), // Cores fixas
   };

   // Dados do gráfico filtrados pelas séries visíveis
   const series = data.filter((serie) => seriesVisible[serie.name]);

   // Alterna a visibilidade das séries ao marcar/desmarcar os checkboxes
   const toggleSeries = (event) => {
      const { value, checked } = event.target;
      setSeriesVisible((prev) => ({ ...prev, [value]: checked }));
   };

   return (
      <div>
         <div className="d-md-flex align-items-center justify-content-between mb-4">
            <h5 className="card-title mb-0">Evolução</h5>
         </div>

         {/* Checkboxes em uma única linha */}
         <div className="legend mb-3 flex flex-wrap flex-col lg:flex-row justify-center gap-3">
            {data.map((serie) => (
               <div key={serie.name} className="form-check form-check-inline">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     id={serie.name}
                     value={serie.name}
                     checked={seriesVisible[serie.name]}
                     onChange={toggleSeries}
                     style={{ backgroundColor: serie.color, borderColor: serie.color }} // Cor fixa do checkbox
                  />
                  <label className="form-check-label" htmlFor={serie.name}>
                     {serie.name}
                  </label>
               </div>
            ))}
         </div>

         {/* Gráfico */}
         <div style={{ height: "300px" }}>
            <ReactApexChart options={options} series={series} type="line" height={300} />
         </div>
      </div>
   );
}

export default CompareAvaliacao;
