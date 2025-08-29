/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
   calculaKGMCMMeta,
   calculaKGMusculoMeta,
   calculaKGOsseoMeta,
   calculaKGResidualMeta,
   calculaPorcentagemMCMMeta,
   calculaPorcentagemMusculoMeta,
   calculaPorcentagemOsseoMeta,
   calculaPorcentagemResidualMeta,
   calcularIdade,
   formatarData,
   getFitnessAssessmentPDF,
   getIMC,
   getPesoIMCMeta,
   getReferenciaIMC,
   getReferenciaIMCMetas,
   getReferenciaKGGordura,
   getReferenciaPorcentagemGordura,
} from "../../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getAluno } from "../../api/aluno";
import { getResultPhysicalAssesment } from "../../api/avaliacao";
import printJS from "print-js";

function Avaliacao() {
   const navigate = useNavigate();
   const location = useLocation();
   const [empresa] = useRecoilState(stateEmpresa);

   const [avaliacao, setAvaliacao] = useState({});
   const [aluno, setAluno] = useState({});

   const { data: result } = useQuery({
      queryKey: ["protocolo"],
      queryFn: () => getResultPhysicalAssesment(avaliacao),
      initialData: {},
      enabled: !!avaliacao.cod_avaliacao,
   });

   useEffect(() => {
      (async function load() {
         const avaliacaoRecebida = location.state?.avaliacao;
         var alunoRecebido = location.state?.aluno;
         if (!alunoRecebido?.cod_aluno && avaliacaoRecebida?.cod_aluno)
            alunoRecebido = await getAluno(avaliacaoRecebida?.cod_aluno);
         avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) : navigate("/alunos");
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
         <div className="bg-gradient-primary rounded-4 p-4 mb-4 shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
               <button onClick={() => navigate(-1)} className="btn btn-danger me-3">
                  <i className="bi bi-arrow-left-circle me-2"></i> Voltar
               </button>

               <div className="d-flex gap-2 items-center">
                  <button
                     onClick={() => navigate("/compareavaliacao", { state: { avaliacao, aluno } })}
                     className="btn btn-outline-danger rounded-pill px-4"
                  >
                     <i className="bi bi-graph-up-arrow"></i>
                     <span className="d-none d-md-inline-block ms-2">Comparar</span>
                  </button>

                  <button onClick={shareResult} className="btn btn-outline-primary">
                     <i className="bi bi-share"></i>
                     <span className="d-none d-md-inline-block ms-2">Exportar</span>
                  </button>
               </div>
            </div>
         </div>

         <div className="card shadow-lg rounded-4">
            <div className="card-body px-0 px-sm-4" id="printable-area">
               <div className="card">
                  <div className="card-header">
                     <h5>Resultado da Avaliação</h5>
                  </div>

                  <div className="card-body row">
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
                  </div>
               </div>

               <div className="row g-3">
                  <div className="col-md-6">
                     <ComposicaoCorporal avaliacao={avaliacao} result={result} />
                  </div>

                  <div className="col-md-6">
                     <SimetriaMembro avaliacao={avaliacao} />
                  </div>
               </div>

               <Metas aluno={aluno} avaliacao={avaliacao} result={result} />
               <AreaMagraGorda result={result} />
               <Perimetro avaliacao={avaliacao} />
               <Dobras avaliacao={avaliacao} />
               <Diametro avaliacao={avaliacao} />
               <Imagens avaliacao={avaliacao} />
            </div>
         </div>
      </div>
   );
}

function Metas({ aluno, avaliacao, result }) {
   const [meta, setMeta] = useState("Magro");
   const [gordura, setGordura] = useState(15);
   const [imc, setImc] = useState(24);

   return (
      <div className="card accordion">
         <div className="card-header accordion-header">
            <button
               className="accordion-button"
               data-bs-toggle="collapse"
               data-bs-target="#avMetas"
               aria-controls="avMetas"
            >
               <h4>Metas</h4>
            </button>
         </div>

         <div id="avMetas" className="accordion-collapse collapse">
            <div className="card-body accordion-body">
               <div className="col-md-3">
                  <label className="form-label">Meta</label>
                  <select className="form-control" value={meta} onChange={(e) => setMeta(e.target.value)}>
                     <option value="Saúde -1">Saúde -1</option>
                     <option value="Saúde 0">Saúde 0</option>
                     <option value="Saúde +1">Saúde +1</option>
                     <option value="Magro">Magro</option>
                     <option value="Atlético">Atlético</option>
                     <option value="Musculoso">Musculoso</option>
                     <option value="Personalizado">Personalizado</option>
                  </select>
               </div>
               <div className="row g-3">
                  <div className="col-md-4 table-responsive">
                     <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                           <tr>
                              <th>Medidas básicas</th>
                              <th>Atual</th>
                              <th>Meta</th>
                           </tr>
                        </thead>

                        <tbody>
                           <tr>
                              <th>IMC</th>
                              <th>{getIMC(avaliacao)}</th>
                              <th>{getReferenciaIMCMetas(aluno, avaliacao, meta)}</th>
                           </tr>
                           <tr>
                              <th>Peso</th>
                              <th>{avaliacao.peso}</th>
                              <th>{getPesoIMCMeta(aluno, avaliacao, meta, imc)}</th>
                              <th className="text-muted">
                                 -{(avaliacao.peso - getPesoIMCMeta(aluno, avaliacao, meta, imc)).toFixed(1)}
                              </th>
                           </tr>
                        </tbody>
                     </table>

                     <div className={`${meta === "Personalizado" ? "" : "d-none"} mt-3`}>
                        <div>
                           <label className="form-label">% Gordura</label>
                           <input
                              className="form-control"
                              value={gordura}
                              onChange={(e) => setGordura(e.target.value)}
                           />
                        </div>
                        <div>
                           <label className="form-label">IMC</label>
                           <input className="form-control" value={imc} onChange={(e) => setImc(e.target.value)} />
                        </div>
                     </div>
                  </div>

                  <div className="col-md-7 table-responsive">
                     <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                           <tr>
                              <th>Composição - Metas</th>
                              <th>Atual</th>
                              <th></th>
                              <th></th>
                              <th>Meta</th>
                           </tr>
                        </thead>

                        <tbody>
                           <tr>
                              <th>Gordura</th>
                              <th>{result?.compositionWeight?.gordura} KG</th>
                              <th>{result?.compositionPercentage?.gordura} %</th>
                              <th>
                                 <i className="bi bi-arrow-right text-success"></i>
                              </th>
                              <th>{getReferenciaKGGordura(aluno, avaliacao, meta, gordura)} KG</th>
                              <th>{getReferenciaPorcentagemGordura(aluno, avaliacao, meta, gordura)} %</th>
                              <th className="text-muted">
                                 {(
                                    getReferenciaKGGordura(aluno, avaliacao, meta, gordura) -
                                    result?.compositionWeight?.gordura
                                 ).toFixed(1)}
                              </th>
                           </tr>
                           <tr>
                              <th>Musc.</th>
                              <th>{result?.compositionWeight?.massa_muscular} KG</th>
                              <th>{result?.compositionPercentage?.massa_muscular} %</th>
                              <th>
                                 <i className="bi bi-arrow-right text-success"></i>
                              </th>
                              <th>{calculaKGMusculoMeta(aluno, avaliacao, meta, gordura, imc)} KG</th>
                              <th>{calculaPorcentagemMusculoMeta(aluno, avaliacao, meta, gordura, imc)} %</th>
                              <th className="text-muted">
                                 {(
                                    calculaKGMusculoMeta(aluno, avaliacao, meta, gordura, imc) -
                                    result?.compositionWeight?.massa_muscular
                                 ).toFixed(1)}
                              </th>
                           </tr>
                           <tr>
                              <th>Osséa</th>
                              <th>{result?.compositionWeight?.massa_ossea} KG</th>
                              <th>{result?.compositionPercentage?.massa_ossea} %</th>
                              <th>
                                 <i className="bi bi-arrow-right text-success"></i>
                              </th>
                              <th>{calculaKGOsseoMeta(aluno, avaliacao, meta, imc)} KG</th>
                              <th>{calculaPorcentagemOsseoMeta(aluno, avaliacao, meta, imc)} %</th>
                           </tr>
                           <tr>
                              <th>Resi.</th>
                              <th>{result?.compositionWeight?.massa_residual} KG</th>
                              <th>{result?.compositionPercentage?.massa_residual} %</th>
                              <th>
                                 <i className="bi bi-arrow-right text-success"></i>
                              </th>
                              <th>{calculaKGResidualMeta(aluno, avaliacao, meta, gordura, imc)} KG</th>
                              <th>{calculaPorcentagemResidualMeta(aluno, avaliacao, meta, gordura, imc)} %</th>
                           </tr>
                           <tr>
                              <th>MCM</th>
                              <th>{result?.compositionWeight?.mcm} KG</th>
                              <th>{result?.compositionPercentage?.mcm} %</th>
                              <th>
                                 <i className="bi bi-arrow-right text-success"></i>
                              </th>
                              <th>{calculaKGMCMMeta(aluno, avaliacao, meta, gordura, imc)} KG</th>
                              <th>{calculaPorcentagemMCMMeta(aluno, avaliacao, meta, imc)} %</th>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function Imagens({ avaliacao }) {
   return (
      <div className="card">
         <div className="card-header">
            <h4>Imagens</h4>
         </div>

         <div className="card-body">
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
         </div>
      </div>
   );
}

function AreaMagraGorda({ result }) {
   return (
      <div className="card accordion">
         <div className="card-header accordion-header">
            <div
               className="accordion-button"
               data-bs-toggle="collapse"
               data-bs-target="#avLeanAndFatArea"
               aria-controls="avLeanAndFatArea"
            >
               <h4>Área Magra/Gorda</h4>
            </div>
         </div>

         <div id="avLeanAndFatArea" className="accordion-collapse collapse">
            <div className="card-body row justify-content-around accordion-body">
               <div className="col-md-4 table-responsive">
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

               <div className="col-md-4 table-responsive">
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

               <div className="col-md-4 table-responsive">
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
            </div>
         </div>
      </div>
   );
}

function ComposicaoCorporal({ avaliacao, result }) {
   return (
      <div className="card table-responsive">
         <div className="card-header">
            <h4>Composição corporal</h4>
         </div>

         <div className="card-body">
            <div style={{ height: "400px" }}>
               <ResponsivePie
                  enableArcLinkLabels={window.innerWidth < 900 ? false : true}
                  data={
                     avaliacao.tipo_avaliacao === "completo"
                        ? [
                             {
                                id: "Gordura",
                                label: "Gordura",
                                value: result?.compositionPercentage?.gordura,
                                color: "#FF9999",
                             },
                             {
                                id: "Músculo",
                                label: "Músculo",
                                value: result?.compositionPercentage?.massa_muscular,
                                color: "#99FF99",
                             },
                             {
                                id: "Osso",
                                label: "Osso",
                                value: result?.compositionPercentage?.massa_ossea,
                                color: "#CCCCCC",
                             },
                             {
                                id: "Residual",
                                label: "Residual",
                                value: result?.compositionPercentage?.massa_residual,
                                color: "#99CCFF",
                             },
                          ]
                        : [
                             {
                                id: "Gordura",
                                label: "Gordura",
                                value: result?.compositionPercentage?.gordura,
                                color: "#FF9999",
                             },
                             {
                                id: "Massa magra",
                                label: "Massa magra",
                                value: result?.compositionPercentage?.massa_magra,
                                color: "#99FF99",
                             },
                          ]
                  }
                  margin={window.innerWidth > 900 ? { top: 40, right: 80, bottom: 80, left: 80 } : {}}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  // colors={{ scheme: 'nivo' }}
                  colors={(d) => d.data.color}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableRadialLabels={true}
                  radialLabel="id"
                  radialLabelsLinkDiagonalLength={10}
                  radialLabelsTextColor="#333333"
                  // valueFormat={value => `${Number(value)} %`}
                  activeOuterRadiusOffset={8}
                  legends={
                     window.innerWidth < 900
                        ? [
                             {
                                anchor: "top-left",
                                direction: "column",
                                justify: false,
                                translateX: 0,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemsSpacing: 0,
                                symbolSize: 20,
                                itemDirection: "left-to-right",
                             },
                          ]
                        : []
                  }
                  valueFormat={(value) => `${Number(value)}%`}
               />
            </div>

            <table id="basic-datatables" className="table table-sm table-striped table-hover">
               <thead>
                  <tr>
                     <th>Composição</th>
                  </tr>
               </thead>

               <tbody>
                  <tr>
                     <th>Peso</th>
                     <th>-</th>
                     <th>{avaliacao.peso} KG</th>
                  </tr>
                  <tr>
                     <th>Gordura</th>
                     <th>{result?.compositionPercentage?.gordura} %</th>
                     <th>{result?.compositionWeight?.gordura} KG</th>
                  </tr>
                  {avaliacao.tipo_avaliacao === "completo" ? (
                     <>
                        <tr>
                           <th>Musc.</th>
                           <th>{result?.compositionPercentage?.massa_muscular} %</th>
                           <th>{result?.compositionWeight?.massa_muscular} KG</th>
                        </tr>
                        <tr>
                           <th>Óssea.</th>
                           <th>{result?.compositionPercentage?.massa_ossea} %</th>
                           <th>{result?.compositionWeight?.massa_ossea} KG</th>
                        </tr>
                        <tr>
                           <th>Resi.</th>
                           <th>{result?.compositionPercentage?.massa_residual} %</th>
                           <th>{result?.compositionWeight?.massa_residual} KG</th>
                        </tr>
                        <tr>
                           <th>MCM</th>
                           <th>{result?.compositionPercentage?.mcm} %</th>
                           <th>{result?.compositionWeight?.mcm} KG</th>
                        </tr>
                     </>
                  ) : (
                     <tr>
                        <th>Massa Magra</th>
                        <th>{result?.compositionPercentage?.massa_magra} %</th>
                        <th>{result?.compositionWeight?.massa_magra} KG</th>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}

function SimetriaMembro({ avaliacao }) {
   const getDifferenceClass = (diff) => {
      return diff >= 1 || diff <= -1 ? "text-danger" : "text-success";
   };

   const data = [
      {
         membro: "Braço",
         direito: avaliacao.braco_relaxado_direito,
         esquerdo: avaliacao.braco_relaxado_esquerdo,
      },
      {
         membro: "Braço cont.",
         direito: avaliacao.braco_contraido_direito,
         esquerdo: avaliacao.braco_contraido_esquerdo,
      },
      {
         membro: "Antebraço",
         direito: avaliacao.antebraco_direito,
         esquerdo: avaliacao.antebraco_esquerdo,
      },
      {
         membro: "Coxa",
         direito: avaliacao.coxa_direita,
         esquerdo: avaliacao.coxa_esquerda,
      },
   ];

   const tooltipAssimetria = (
      <Tooltip id="tooltip">
         <div>O valor será destacado em vermelho quando ultrapassar 1 cm, sinalizando a necessidade de ajuste.</div>
      </Tooltip>
   );

   return (
      <div className="card table-responsive">
         <div className="card-header d-flex justify-between">
            <h4>Simetria dos membros (cm)</h4>
            <OverlayTrigger placement="bottom" overlay={tooltipAssimetria}>
               <i className="bi bi-question-circle text-danger ms-2"></i>
            </OverlayTrigger>
         </div>

         <div className="card-body">
            <div style={{ height: "400px" }}>
               <ResponsiveBar
                  data={data}
                  axisBottom={null}
                  keys={["direito", "esquerdo"]}
                  indexBy="membro"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.5}
                  groupMode="grouped"
                  layout="horizontal"
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  legends={[
                     {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                           {
                              on: "hover",
                              style: {
                                 itemOpacity: 1,
                              },
                           },
                        ],
                     },
                  ]}
                  role="application"
               />
            </div>

            <table id="basic-datatables" className="table table-sm table-striped table-hover">
               <thead>
                  <tr>
                     <th>Membro</th>
                     <th>Direito</th>
                     <th>Diferença</th>
                     <th>Esquerdo</th>
                  </tr>
               </thead>

               <tbody>
                  <tr>
                     <th>Braço</th>
                     <td>{avaliacao.braco_relaxado_direito || "-"}</td>
                     <th
                        className={getDifferenceClass(
                           avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito
                        )}
                     >
                        {Math.abs(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito).toFixed(2) ||
                           "-"}
                     </th>
                     <td>{avaliacao.braco_relaxado_esquerdo || "-"}</td>
                  </tr>
                  <tr>
                     <th>Braço contraido</th>
                     <td>{avaliacao.braco_contraido_direito || "-"}</td>
                     <th
                        className={getDifferenceClass(
                           avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo
                        )}
                     >
                        {Math.abs(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo).toFixed(2) ||
                           "-"}
                     </th>
                     <td>{avaliacao.braco_contraido_esquerdo || "-"}</td>
                  </tr>
                  <tr>
                     <th>Antebraço</th>
                     <td>{avaliacao.antebraco_direito || "-"}</td>
                     <th className={getDifferenceClass(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo)}>
                        {Math.abs(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo).toFixed(2) || "-"}
                     </th>
                     <td>{avaliacao.antebraco_esquerdo || "-"}</td>
                  </tr>
                  <tr>
                     <th>Coxa</th>
                     <td>{avaliacao.coxa_direita || "-"}</td>
                     <th className={getDifferenceClass(avaliacao.coxa_direita - avaliacao.coxa_esquerda)}>
                        {Math.abs(avaliacao.coxa_direita - avaliacao.coxa_esquerda).toFixed(2) || "-"}
                     </th>
                     <td>{avaliacao.coxa_esquerda || "-"}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
}

function Perimetro({ avaliacao }) {
   return (
      <div className="card no-print accordion">
         <div className="card-header accordion-header">
            <button
               className="accordion-button"
               data-bs-toggle="collapse"
               data-bs-target="#avGirth"
               aria-controls="avGirth"
            >
               <h4>Perimetria (cm)</h4>
            </button>
         </div>

         <div id="avGirth" className="card-body accordion-collapse collapse">
            <div className="card-body accordion-body">
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
         </div>
      </div>
   );
}

function Diametro({ avaliacao }) {
   return (
      <div className="card no-print accordion">
         <div className="card-header accordion-header">
            <button
               className="accordion-button"
               data-bs-target="#avDiameters"
               data-bs-toggle="collapse"
               aria-controls="avDiameters"
            >
               <h4>Diamêtros Osséos</h4>
            </button>
         </div>

         <div id="avDiameters" className="accordion-collapse collapse">
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
         </div>
      </div>
   );
}

function Dobras({ avaliacao }) {
   return (
      <div className="card no-print accordion">
         <div className="card-header accordion-header">
            <div
               className="accordion-button"
               data-bs-target="#avCurves"
               data-bs-toggle="collapse"
               aria-controls="avCurves"
            >
               <h4>Dobras Cutâneas (cm)</h4>
            </div>
         </div>

         <div id="avCurves" className="accordion-collapse collapse">
            <div className="card-body accordion-body">
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
         </div>
      </div>
   );
}

export default Avaliacao;
