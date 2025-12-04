/* eslint-disable react/prop-types */
import printJS from "print-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getStudent } from "../../api/student";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { stateEmpresa } from "../../states/states";

import { ChartArea, Info, Pen, Share } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { calcularIdade, formatarData, getFitnessAssessmentPDF, getIMC, getReferenciaIMC } from "../../utils";
import { ChartBarLabelCustom } from "./chart";
import { ChartPieLabel } from "./pieChart";

function Avaliacao() {
   const navigate = useNavigate();
   const location = useLocation();
   const [empresa] = useRecoilState(stateEmpresa);

   const [avaliacao, setAvaliacao] = useState({});
   const [aluno, setAluno] = useState({});
   const [result, setResult] = useState({});

   useEffect(() => {
      (async function load() {
         const avaliacaoRecebida = location.state?.avaliacao;
         var alunoRecebido = location.state?.aluno;
         if (!alunoRecebido?.cod_aluno && avaliacaoRecebida?.cod_aluno)
            alunoRecebido = await getStudent(avaliacaoRecebida?.cod_aluno);
         if (avaliacaoRecebida) {
            setAvaliacao(avaliacaoRecebida);
            setResult(avaliacaoRecebida?.result);
         } else navigate("/alunos");
         alunoRecebido ? setAluno(alunoRecebido) : navigate("/alunos");
      })();
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

   if (!avaliacao) {
      return <div>Carregando...</div>;
   }

   const shareResult = async () => {
      const resp = await getFitnessAssessmentPDF(result, empresa.imagem_empresa);
      if (!resp) return;

      printJS({
         printable: resp,
         type: "raw-html",
         documentTitle: "Avaliação Física",
      });
   };

   const getTotalDobras = () => {
      const dobras = [
         avaliacao.triciptal,
         avaliacao.peitoral,
         avaliacao.subescapular,
         avaliacao.axilar_media,
         avaliacao.abdominal,
         avaliacao.coxa,
         avaliacao.supra_iliaca,
         avaliacao.supra_espinhal,
         avaliacao.biciptal,
         avaliacao.panturrilha,
      ];
      const result = dobras.reduce((total, valor) => total + (parseFloat(valor) || 0), 0);
      return result.toFixed(2);
   };

   return (
      <div className="container-fluid">
         <BackBoxUI
            actions={[
               {
                  Icon: Pen,
                  label: "Editar",
                  action: () => {
                     navigate("/cadavaliacao", {
                        state: {
                           avaliacao,
                           aluno,
                        },
                     });
                  },
               },
               {
                  Icon: ChartArea,
                  label: "Comparar",
                  action: () => navigate("/compareavaliacao", { state: { avaliacao, aluno } }),
               },
               {
                  Icon: Share,
                  label: "Exportar",
                  action: shareResult,
               },
            ]}
         />

         <Card className="mt-3">
            <CardContent id="printable-area">
               <Card>
                  <CardHeader>
                     <h5>Resultado da Avaliação</h5>
                  </CardHeader>

                  <CardContent className="row px-3">
                     {/* <p><strong>Protocolo:</strong> {avaliacao.cod_protocolo}</p> */}
                     <div className="col-6">
                        <p>
                           <strong>Aluno:</strong> {aluno?.nome_aluno}
                        </p>
                        <p>
                           <strong>Idade:</strong> {calcularIdade(aluno?.data_nascimento_aluno)} Anos
                        </p>
                        <p>
                           <strong>Sexo:</strong> {aluno.sexo_aluno === "M" ? "Masculino" : "Feminino"}
                        </p>
                        <p>
                           <strong>Peso:</strong> {avaliacao.peso} kg
                        </p>
                        <p>
                           <strong>Total dobras:</strong> {getTotalDobras()} cm
                        </p>
                        <p>
                           <strong>IMC:</strong> {getIMC(avaliacao)}
                        </p>
                     </div>

                     <div className="col-6">
                        <p>
                           <strong>Data da Avaliação:</strong> {formatarData(avaliacao.data_avaliacao)}
                        </p>
                        <p>
                           <strong>Tipo da Avaliação:</strong> {avaliacao.tipo_avaliacao?.toUpperCase()}
                        </p>
                        <p>
                           <strong>Altura:</strong> {avaliacao.altura} cm
                        </p>
                        <p>
                           <strong>Metabolismo basal:</strong> {result?.basal}
                        </p>
                        <p>
                           <strong>Indíce de IMC: </strong> {getReferenciaIMC(aluno, avaliacao)}
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                  <ComposicaoCorporal avaliacao={avaliacao} result={result} />

                  <SimetriaMembro avaliacao={avaliacao} />
               </div>

               <Accordion type="single" collapsible className="mx-3 mt-3">
                  {avaliacao.tipo_avaliacao === "completo" && <AreaMagraGorda result={result} />}
                  <Perimetro avaliacao={avaliacao} />
                  <Dobras avaliacao={avaliacao} />
                  <Diametro avaliacao={avaliacao} />
                  <Imagens avaliacao={avaliacao} />
               </Accordion>
            </CardContent>
         </Card>
      </div>
   );
}

function Imagens({ avaliacao }) {
   return (
      <AccordionItem value="item-6">
         <AccordionTrigger>
            <Label>Imagens</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="row g-3">
               {avaliacao?.imagem?.map((img, index) => (
                  <div key={index} className="col-md-3">
                     <div className="text-center">
                        <img src={img?.url_imagem} style={{ width: "100%", border: "1px solid black" }} />
                        <h4 className="mt-2">{img?.descricao_imagem}</h4>
                     </div>
                  </div>
               ))}
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function AreaMagraGorda({ result }) {
   return (
      <AccordionItem value="item-2">
         <AccordionTrigger>
            <Label>Área Magra/Gorda</Label>
         </AccordionTrigger>

         <AccordionContent className="grid grid-cols-1 lg:grid-cols-3">
            <div className="table-responsive">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <thead>
                     <tr>
                        <th>Braço</th>
                     </tr>
                  </thead>

                  <tbody>
                     {result?.leanAndFatArea?.braco?.map((campo, id) => (
                        <tr key={id}>
                           <th>{campo.nome}</th>
                           <th>
                              {campo.valor} {campo.prefix}
                           </th>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="table-responsive">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <thead>
                     <tr>
                        <th>Coxa</th>
                     </tr>
                  </thead>

                  <tbody>
                     {result?.leanAndFatArea?.coxa?.map((campo, id) => (
                        <tr key={id}>
                           <th>{campo.nome}</th>
                           <th>
                              {campo.valor} {campo.prefix}
                           </th>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="table-responsive">
               <table id="basic-datatables" className="table table-sm table-striped table-hover">
                  <thead>
                     <tr>
                        <th>Panturrilha</th>
                     </tr>
                  </thead>

                  <tbody>
                     {result?.leanAndFatArea?.panturrilha?.map((campo, id) => (
                        <tr key={id}>
                           <th>{campo.nome}</th>
                           <th>
                              {campo.valor} {campo.prefix}
                           </th>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function ComposicaoCorporal({ avaliacao, result }) {
   return (
      <Card className="bg-accent">
         <CardHeader>
            <CardTitle>Composição corporal</CardTitle>
         </CardHeader>

         <CardContent className="px-3">
            <ChartPieLabel
               data={
                  avaliacao.tipo_avaliacao === "completo"
                     ? [
                          {
                             id: "gordura",
                             label: "Gordura",
                             value: result?.compositionPercentage?.gordura,
                             fill: "var(--color-chrome)",
                          },
                          {
                             id: "Músculo",
                             label: "Músculo",
                             value: result?.compositionPercentage?.massa_muscular,
                             fill: "var(--color-safari)",
                          },
                          {
                             id: "Osso",
                             label: "Osso",
                             value: result?.compositionPercentage?.massa_ossea,
                             fill: "var(--color-firefox)",
                          },
                          {
                             id: "Residual",
                             label: "Residual",
                             value: result?.compositionPercentage?.massa_residual,
                             fill: "var(--color-edge)",
                          },
                       ]
                     : [
                          {
                             id: "Gordura",
                             label: "Gordura",
                             value: result?.compositionPercentage?.gordura,
                             fill: "var(--color-chrome)",
                          },
                          {
                             id: "Massa magra",
                             label: "Massa magra",
                             value: result?.compositionPercentage?.massa_magra,
                             fill: "var(--color-safari)",
                          },
                       ]
               }
            />

            <Table className="mt-3">
               <TableHeader>
                  <TableRow>
                     <TableCell>Composição</TableCell>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  <TableRow>
                     <TableCell>Peso</TableCell>
                     <TableCell>-</TableCell>
                     <TableCell>{avaliacao.peso} KG</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Gordura</TableCell>
                     <TableCell>{result?.compositionPercentage?.gordura} %</TableCell>
                     <TableCell>{result?.compositionWeight?.gordura} KG</TableCell>
                  </TableRow>
                  {avaliacao.tipo_avaliacao === "completo" ? (
                     <>
                        <TableRow>
                           <TableCell>Musc.</TableCell>
                           <TableCell>{result?.compositionPercentage?.massa_muscular} %</TableCell>
                           <TableCell>{result?.compositionWeight?.massa_muscular} KG</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Óssea.</TableCell>
                           <TableCell>{result?.compositionPercentage?.massa_ossea} %</TableCell>
                           <TableCell>{result?.compositionWeight?.massa_ossea} KG</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Resi.</TableCell>
                           <TableCell>{result?.compositionPercentage?.massa_residual} %</TableCell>
                           <TableCell>{result?.compositionWeight?.massa_residual} KG</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>MCM</TableCell>
                           <TableCell>{result?.compositionPercentage?.mcm} %</TableCell>
                           <TableCell>{result?.compositionWeight?.mcm} KG</TableCell>
                        </TableRow>
                     </>
                  ) : (
                     <TableRow>
                        <TableCell>Massa Magra</TableCell>
                        <TableCell>{result?.compositionPercentage?.massa_magra} %</TableCell>
                        <TableCell>{result?.compositionWeight?.massa_magra} KG</TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}

function SimetriaMembro({ avaliacao }) {
   const getDifferenceClass = (diff) => {
      return diff >= 1 || diff <= -1 ? "text-danger" : "text-success";
   };

   const data = [
      {
         membro: "Panturrilha",
         direito: parseFloat(avaliacao.panturrilha_direita) || 0,
         esquerdo: parseFloat(avaliacao.panturrilha_esquerda) || 0,
      },
      {
         membro: "Braço",
         direito: parseFloat(avaliacao.braco_relaxado_direito) || 0,
         esquerdo: parseFloat(avaliacao.braco_relaxado_esquerdo) || 0,
      },
      {
         membro: "Braço cont.",
         direito: parseFloat(avaliacao.braco_contraido_direito) || 0,
         esquerdo: parseFloat(avaliacao.braco_contraido_esquerdo) || 0,
      },
      {
         membro: "Antebraço",
         direito: parseFloat(avaliacao.antebraco_direito) || 0,
         esquerdo: parseFloat(avaliacao.antebraco_esquerdo) || 0,
      },
      {
         membro: "Coxa",
         direito: parseFloat(avaliacao.coxa_direita) || 0,
         esquerdo: parseFloat(avaliacao.coxa_esquerda) || 0,
      },
   ];

   return (
      <Card className="bg-accent">
         <CardHeader className="flex">
            <Tooltip>
               <TooltipTrigger>
                  <Info size={15} />
               </TooltipTrigger>

               <TooltipContent>
                  O valor será destacado em vermelho quando ultrapassar 1 cm, sinalizando a necessidade de ajuste.
               </TooltipContent>
            </Tooltip>
            <CardTitle>Simetria dos membros (cm)</CardTitle>
         </CardHeader>

         <CardContent className="px-3">
            <ChartBarLabelCustom data={data} />

            <Table className="mt-3">
               <TableHeader>
                  <TableRow>
                     <TableCell>Membro</TableCell>
                     <TableCell>Direito</TableCell>
                     <TableCell>Diferença</TableCell>
                     <TableCell>Esquerdo</TableCell>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  <TableRow>
                     <TableCell>Braço</TableCell>
                     <TableCell>{avaliacao.braco_relaxado_direito || "-"}</TableCell>
                     <TableCell
                        className={getDifferenceClass(
                           avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito
                        )}
                     >
                        {Math.abs(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito).toFixed(2) ||
                           "-"}
                     </TableCell>
                     <TableCell>{avaliacao.braco_relaxado_esquerdo || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Braço contraido</TableCell>
                     <TableCell>{avaliacao.braco_contraido_direito || "-"}</TableCell>
                     <TableCell
                        className={getDifferenceClass(
                           avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo
                        )}
                     >
                        {Math.abs(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo).toFixed(2) ||
                           "-"}
                     </TableCell>
                     <TableCell>{avaliacao.braco_contraido_esquerdo || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Antebraço</TableCell>
                     <TableCell>{avaliacao.antebraco_direito || "-"}</TableCell>
                     <TableCell
                        className={getDifferenceClass(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo)}
                     >
                        {Math.abs(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo).toFixed(2) || "-"}
                     </TableCell>
                     <TableCell>{avaliacao.antebraco_esquerdo || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Coxa</TableCell>
                     <TableCell>{avaliacao.coxa_direita || "-"}</TableCell>
                     <TableCell className={getDifferenceClass(avaliacao.coxa_direita - avaliacao.coxa_esquerda)}>
                        {Math.abs(avaliacao.coxa_direita - avaliacao.coxa_esquerda).toFixed(2) || "-"}
                     </TableCell>
                     <TableCell>{avaliacao.coxa_esquerda || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Panturrilha</TableCell>
                     <TableCell>{avaliacao.panturrilha_direita || "-"}</TableCell>
                     <TableCell
                        className={getDifferenceClass(avaliacao.panturrilha_esquerda - avaliacao.panturrilha_direita)}
                     >
                        {Math.abs(avaliacao.panturrilha_esquerda - avaliacao.panturrilha_direita).toFixed(2) || "-"}
                     </TableCell>
                     <TableCell>{avaliacao.panturrilha_esquerda || "-"}</TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}

function Perimetro({ avaliacao }) {
   return (
      <AccordionItem value="item-3">
         <AccordionTrigger>
            <Label>Perimetria (cm)</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="card-body">
               <div className="row g-3 mt-3">
                  <div className="card col-md-4">
                     <h6>Geral</h6>
                     <ul>
                        <li>
                           <strong>Pescoço:</strong> {avaliacao.pescoco || "-"}
                        </li>
                        <li>
                           <strong>Ombro:</strong> {avaliacao.ombro || "-"}
                        </li>
                        <li>
                           <strong>Tórax Inspirado:</strong> {avaliacao.torax_inspirado || "-"}
                        </li>
                        <li>
                           <strong>Tórax Expirado:</strong> {avaliacao.torax_expirado || "-"}
                        </li>
                        {/* <li><strong>Punho:</strong> {avaliacao.punho || '-'}</li> */}
                        <li>
                           <strong>Cintura:</strong> {avaliacao.cintura || "-"}
                        </li>
                        <li>
                           <strong>Abdômen:</strong> {avaliacao.abdomen || "-"}
                        </li>
                        <li>
                           <strong>Quadril:</strong> {avaliacao.quadril || "-"}
                        </li>
                     </ul>
                  </div>

                  <div className="card col-md-4">
                     <h6>Lado direito</h6>
                     <ul>
                        <li>
                           <strong>Braço Relaxado Direito:</strong> {avaliacao.braco_relaxado_direito || "-"}
                        </li>
                        <li>
                           <strong>Braço Contraído Direito:</strong> {avaliacao.braco_contraido_direito || "-"}
                        </li>
                        <li>
                           <strong>Antebraço Direito:</strong> {avaliacao.antebraco_direito || "-"}
                        </li>
                        <li>
                           <strong>Coxa Direita:</strong> {avaliacao.coxa_direita || "-"}
                        </li>
                        <li>
                           <strong>Panturrilha Direita:</strong> {avaliacao.panturrilha_direita || "-"}
                        </li>
                     </ul>
                  </div>

                  <div className="card col-md-4">
                     <h6>Lado esquerdo</h6>
                     <ul>
                        <li>
                           <strong>Braço Relaxado Esquerdo:</strong> {avaliacao.braco_relaxado_esquerdo || "-"}
                        </li>
                        <li>
                           <strong>Braço Contraído Esquerdo:</strong> {avaliacao.braco_contraido_esquerdo || "-"}
                        </li>
                        <li>
                           <strong>Antebraço Esquerdo:</strong> {avaliacao.antebraco_esquerdo || "-"}
                        </li>
                        <li>
                           <strong>Coxa Esquerda:</strong> {avaliacao.coxa_esquerda || "-"}
                        </li>
                        <li>
                           <strong>Panturrilha Esquerda:</strong> {avaliacao.panturrilha_esquerda || "-"}
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function Diametro({ avaliacao }) {
   return (
      <AccordionItem value="item-5">
         <AccordionTrigger>
            <Label>Diamêtros Osséos</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="card-body">
               <ul className="mt-3">
                  <li>
                     <strong>Biestilóide punho:</strong> {avaliacao.biestiloide_punho || "-"} cm
                  </li>
                  <li>
                     <strong>Biepicôndilo Umeral:</strong> {avaliacao.biepicondilo_umeral || "-"} cm
                  </li>
                  <li>
                     <strong>Biepicôndilo femoral:</strong> {avaliacao.biepicondilo_femoral || "-"} cm
                  </li>
               </ul>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

function Dobras({ avaliacao }) {
   return (
      <AccordionItem value="item-4">
         <AccordionTrigger>
            <Label>Dobras Cutâneas (cm)</Label>
         </AccordionTrigger>

         <AccordionContent>
            <div className="card-body">
               <row className="row g-3">
                  <ul className="mt-3 col-md-3">
                     <li>
                        <strong>Peitoral:</strong> {avaliacao.peitoral || "-"}
                     </li>
                     <li>
                        <strong>Bíceps:</strong> {avaliacao.biciptal || "-"}
                     </li>
                     <li>
                        <strong>Tríceps:</strong> {avaliacao.triciptal || "-"}
                     </li>
                     <li>
                        <strong>Subescapular:</strong> {avaliacao.subescapular || "-"}
                     </li>
                     <li>
                        <strong>Axilar Media:</strong> {avaliacao.axilar_media || "-"}
                     </li>
                     <li>
                        <strong>Abdominal:</strong> {avaliacao.abdominal || "-"}
                     </li>
                     <li>
                        <strong>Coxa:</strong> {avaliacao.coxa || "-"}
                     </li>
                     <li>
                        <strong>Supra Ilíaca:</strong> {avaliacao.supra_iliaca || "-"}
                     </li>
                     <li>
                        <strong>Supra espinhal:</strong> {avaliacao.supra_espinhal || "-"}
                     </li>
                     <li>
                        <strong>Panturrilha:</strong> {avaliacao.panturrilha || "-"}
                     </li>
                  </ul>

                  <div className="mt-3 col-md-3">
                     {/* <img className="img-fluid" src="/assets/images/app/dobras.png" /> */}
                  </div>
               </row>
            </div>
         </AccordionContent>
      </AccordionItem>
   );
}

export default Avaliacao;
