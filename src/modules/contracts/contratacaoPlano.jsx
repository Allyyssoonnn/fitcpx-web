import JoditEditor from "jodit-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { newContract } from "../../api/contracts";
import { getContractsTemplates } from "../../api/contractsTemplates";
import { getPlans } from "../../api/plans";
import Select from "../../components/baseComponents/select";
import Pagamento from "../../components/payment/pagamento";
import SelectModalidades from "../../components/selectModalidades";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { adicionarMesData, dividirParcelas, formatarCNPJ, formatarCPF, formatarMoeda } from "../../utils";

function ContratacaoPlano() {
   const [usuario] = useRecoilState(stateUsuario);
   const [empresa] = useRecoilState(stateEmpresa);
   const location = useLocation();
   const navigate = useNavigate();

   const [aluno, setAluno] = useState();
   const [plano, setPlano] = useState();
   const [pagando, setPagando] = useState(false);
   const [contratoPreenchido, setContratoPreenchido] = useState();
   const [montandoPlano, setMontandoPlano] = useState(false);
   const [selectContrato, setSelectContrato] = useState();
   const [pagamentoInicial, setPagamentoInicial] = useState();
   // const [inicioContrato, setInicioContrato] = useState();
   const [geraContrato, setGeraContrato] = useState(true);

   const [errors, setErrors] = useState([]);

   const { data: planos, refetch } = useQuery({
      queryKey: ["planos"],
      queryFn: getPlans,
      initialData: [],
   });

   useEffect(() => {
      let tempErrors = [];
      if (!aluno?.cpf_aluno) tempErrors.push("[Cadastro do aluno incompleto] - CPF do aluno não informado.");
      if (!aluno?.email_aluno) tempErrors.push("[Cadastro do aluno incompleto] - E-mail do aluno não informado.");
      if (!aluno?.telefone_aluno) tempErrors.push("[Cadastro do aluno incompleto] - Telefone do aluno não informado.");
      if (!aluno?.endereco_aluno) tempErrors.push("[Cadastro do aluno incompleto] - Endereço do aluno não informado.");
      if (!aluno?.numero_aluno)
         tempErrors.push("[Cadastro do aluno incompleto] - Endereço (número) do aluno não informado.");
      if (!aluno?.estado_aluno) tempErrors.push("[Cadastro do aluno incompleto] - UF do aluno não informado.");
      if (!aluno?.cep_aluno) tempErrors.push("[Cadastro do aluno incompleto] - CEP do aluno não informado.");

      if (!empresa?.doc_empresa) tempErrors.push("[Cadastro da empresa incompleto] - CNPJ da empresa não informado");
      if (!empresa?.email_empresa)
         tempErrors.push("[Cadastro da empresa incompleto] - E-mail da empresa não informado");
      if (!empresa?.telefone_empresa)
         tempErrors.push("[Cadastro da empresa incompleto] - Telefone da empresa não informado");
      if (!empresa?.nome_empresa) tempErrors.push("[Cadastro da empresa incompleto] - Nome da empresa não informado");
      if (!empresa?.endereco_empresa)
         tempErrors.push("[Cadastro da empresa incompleto] - Endereço da empresa não informado");
      if (!empresa?.numero_empresa)
         tempErrors.push("[Cadastro da empresa incompleto] - Endereço (Número) da empresa não informado");
      if (!empresa?.cidade_empresa)
         tempErrors.push("[Cadastro da empresa incompleto] - Cidade da empresa não informado");
      setErrors(tempErrors);
   }, [aluno, empresa]);

   const { data: contratos } = useQuery({
      queryKey: ["contratos", usuario.cod_empresa],
      queryFn: getContractsTemplates,
      initialData: [],
   });

   useEffect(() => {
      const aluno = location.state?.aluno;
      aluno ? setAluno(aluno) : navigate("/dashboard");
   }, []);

   useEffect(() => {
      if (montandoPlano) {
         setPlano({ duracao_plano: 1 });
      } else setPlano();
   }, [montandoPlano]);

   useEffect(() => {
      if (!plano?.duracao_plano) return;
      var planoAtt = atualizarModalidadesComSubvariacoes(plano);
      planoAtt = calculaValoresDoPlano(planoAtt);
      setPlano(planoAtt);
   }, [plano?.duracao_plano]);

   function calculaValoresDoPlano(plano) {
      let total = 0;
      plano?.modalidades?.forEach((mod) => {
         total += mod.valor_modalidade;
      });
      total = plano.duracao_plano * total;

      const parcelas = dividirParcelas(plano.duracao_plano, total);

      return {
         ...plano,
         valor_plano: total,
         parcela_plano: JSON.stringify(parcelas),
      };
   }

   function atualizarModalidadesComSubvariacoes(planoAtual) {
      if (!planoAtual?.modalidades) return planoAtual;

      const modalidadesAtualizadas = planoAtual.modalidades.map((mod) => {
         const novaModalidade = { ...mod };

         const subVariacoes = mod?.valores;
         if (!subVariacoes?.length) return novaModalidade;

         const subVariacao = subVariacoes.filter(
            (v) => planoAtual.duracao_plano >= v.quantidade_modalidade_variacao_valor
         );

         if (!subVariacao.length) {
            novaModalidade.valor_modalidade = mod.valor_modalidade_original;
            novaModalidade.nome_modalidade = mod.nome_modalidade_original;
         } else {
            const ultima = subVariacao[subVariacao.length - 1];
            novaModalidade.cod_modalidade_variacao_valor = ultima.cod_modalidade_variacao_valor;
            novaModalidade.valor_modalidade = ultima.valor_modalidade_variacao_valor;
            novaModalidade.nome_modalidade = `${mod.nome_modalidade_original} - ${String(
               ultima.nome_modalidade_variacao_valor
            )}`;
         }

         return novaModalidade;
      });

      return {
         ...planoAtual,
         modalidades: modalidadesAtualizadas,
      };
   }

   useMemo(() => {
      if (selectContrato?.contrato) {
         setContratoPreenchido(
            preencherContrato(selectContrato.contrato, aluno, empresa, plano?.modalidades, plano, pagamentoInicial)
         );
      }
   }, [selectContrato, aluno, empresa, plano?.modalidades]);

   function confirmar(e) {
      e.preventDefault();

      if (plano?.modalidades.length <= 0) {
         toast.error("Nenhuma modalidade preenchida!");
         return;
      }

      if (!contratoPreenchido && geraContrato) {
         toast.error("Nenhum contrato preenchido!");
         return;
      }

      setPagando(true);
   }

   function addModalidade(modalidade) {
      const planoTemp = { ...plano };
      const modalidades = [...(planoTemp?.modalidades || []), modalidade];

      var planoAtualizado = atualizarModalidadesComSubvariacoes({
         ...planoTemp,
         modalidades,
      });
      planoAtualizado = calculaValoresDoPlano(planoAtualizado);
      setPlano(planoAtualizado);
   }

   function removeModalidade(index) {
      setPlano((prev) => ({
         ...prev,
         modalidades: prev?.modalidades.filter((m, i) => index !== i),
      }));
   }

   function updatePlano(field, value) {
      setPlano((prev) => ({ ...prev, [field]: value }));
   }

   function attValue(v, i) {
      const planoTemp = { ...plano };
      const modalidades = planoTemp?.modalidades.map((m, index) =>
         index == i
            ? {
                 ...m,
                 valor_modalidade: v,
                 valor_modalidade_alterado: v,
              }
            : planoTemp
      );
      var planoAtualizado = calculaValoresDoPlano({
         ...planoTemp,
         modalidades,
      });
      setPlano(planoAtualizado);
   }

   async function onPay(formaPagamento, closeLoading, paymentMethodId, formCard, typePayment) {
      try {
         await newContract({
            ...plano,
            pagamentoInicial,
            formaPagamento,
            contrato: contratoPreenchido,
            cod_aluno: aluno?.cod_aluno,
            cod_usuario: usuario?.cod_usuario,
            cod_empresa: usuario?.cod_empresa,
            typePayment,
            installments: formCard?.installments,
         });
         closeLoading();
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <div className="container-fluid">
         {/* Header Section */}
         <div className="bg-gradient-primary rounded-4 p-4 mb-4 shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
               <button onClick={() => navigate(-1)} className="btn btn-outline-danger rounded-pill px-4">
                  <i className="bi bi-arrow-left me-2"></i>
                  Voltar
               </button>
            </div>
         </div>

         <Pagamento
            show={pagando}
            close={() => setPagando(false)}
            onPay={onPay}
            callback={() =>
               navigate("/aluno", {
                  state: { cod_aluno: aluno.cod_aluno },
               })
            }
         />
         <div className="card shadow-lg rounded-4">
            <div className="card-body row">
               <h5 className="card-title mb-3">Contratação de plano</h5>

               <div className="row">
                  <div className="col-md-6 bg-light rounded p-3">
                     <h5 className="form-label">Aluno</h5>

                     <label className="fs-4 mb-2">{aluno?.nome_aluno}</label>

                     <p className="mb-1">
                        <strong>CEP:</strong> {aluno?.cep_aluno}
                     </p>
                     <p className="mb-1">
                        <strong>Endereço:</strong> {aluno?.endereco_aluno}, {aluno?.numero_aluno}
                     </p>
                     <p className="mb-1">
                        <strong>Cidade:</strong> {aluno?.cidade_aluno} - {aluno?.estado_aluno}
                     </p>
                     <p className="mb-1">
                        <strong>CPF:</strong> {formatarCPF(aluno?.cpf_aluno)}
                     </p>
                     <p className="mb-1">
                        <strong>RG:</strong> {aluno?.rg_aluno ?? "-"}
                     </p>
                  </div>

                  <div className="col-md-6 bg-light rounded p-3">
                     <h5 className="form-label">Empresa</h5>

                     <label className="fs-4 mb-2">{empresa?.nome_empresa}</label>

                     <p className="mb-1">
                        <strong>CEP:</strong> {empresa?.cep_empresa}
                     </p>
                     <p className="mb-1">
                        <strong>Endereço:</strong> {empresa?.endereco_empresa}, {empresa?.numero_empresa}
                     </p>
                     <p className="mb-1">
                        <strong>Cidade:</strong> {empresa?.cidade_empresa} - {empresa?.estado_empresa}
                     </p>
                     <p className="mb-1">
                        <strong>CPF:</strong> {formatarCNPJ(empresa?.doc_empresa)}
                     </p>
                  </div>
               </div>

               {errors.length > 0 && (
                  <div className="d-flex justify-content-center">
                     <div className="bg-danger-subtle rounded p-2 col-md-6 mt-3">
                        <label className="text-center w-100 mb-2">
                           Alertas - (Solucionar pendências para avançar na contratação)
                        </label>
                        {errors.map((error, index) => (
                           <p key={index} className="mb-0">
                              {error}
                           </p>
                        ))}

                        <div className="d-flex justify-content-center mt-3 gap-3">
                           <button className="btn btn-sm btn-outline-info" onClick={() => navigate("/configuracao")}>
                              Ir para configurações
                           </button>

                           <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() =>
                                 navigate("/cadaluno", {
                                    state: { aluno },
                                 })
                              }
                           >
                              Cadastro do aluno
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         <div className="row">
            <div className="col-md-6">
               <div className="card shadow-lg rounded-4">
                  <div className="card-body row">
                     <div className="text-center d-flex flex-column mb-3">
                        <div className="btn-group" role="group">
                           <button
                              className={`btn ${!montandoPlano ? "btn-primary" : "btn-outline-primary"}`}
                              onClick={() => setMontandoPlano(false)}
                           >
                              Selecionar plano
                           </button>

                           <button
                              className={`btn ${montandoPlano ? "btn-primary" : "btn-outline-primary"}`}
                              onClick={() => setMontandoPlano(true)}
                           >
                              Montar plano
                           </button>
                        </div>
                     </div>

                     {!montandoPlano && (
                        <div>
                           <Select
                              label="Selecione o plano"
                              options={planos}
                              fieldName="nome_plano"
                              fieldValue="cod_plano"
                              className="mb-3"
                              // setValue={setPlano}
                              onChange={(v) => setPlano(v)}
                           />
                        </div>
                     )}

                     {montandoPlano && (
                        <div className="d-flex flex-column">
                           <div className="col-md-6">
                              <label className="form-label fw-bold">Duração plano (Meses)</label>
                              <Select
                                 // value={plano?.duracao_plano}
                                 options={[...Array(12).keys()].map((i) => ({ label: i + 1, value: i + 1 }))}
                                 onChange={(v) => updatePlano("duracao_plano", v.value)}
                                 fieldName="label"
                                 fieldValue="value"
                                 label="Duração do plano (Meses)"
                              />
                           </div>
                        </div>
                     )}

                     <div className="row g-3 px-3 mt-0">
                        <div className="col-md-6">
                           <label className="form-label">Primeira cobrança</label>
                           <input
                              className="form-control"
                              type="date"
                              value={pagamentoInicial}
                              onChange={(e) => setPagamentoInicial(e.target.value)}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-md-6">
               <div className="card shadow-lg rounded-4">
                  <div className="card-body row">
                     <SelectModalidades
                        disableControls={!montandoPlano}
                        addModalidade={addModalidade}
                        removeModalidade={removeModalidade}
                        attValue={attValue}
                        modalidadesPlano={plano?.modalidades}
                     />
                     <div className="d-flex justify-between mt-3 mb-0">
                        <p className={`${montandoPlano && "d-none"}`}>
                           Adesão - <strong>{formatarMoeda(plano?.valor_adesao || 0)}</strong>
                        </p>
                        <p>
                           Total - <strong>{formatarMoeda(plano?.valor_plano || 0)}</strong>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="card shadow-lg rounded-4">
            <div className="card-body">
               <h5 className="card-title">Revisão do contrato</h5>

               <div className="form-check form-switch mt-3 mb-3">
                  <input
                     className="form-check-input"
                     type="checkbox"
                     id="flexSwitchCheckDefault"
                     checked={geraContrato}
                     onChange={() => setGeraContrato(!geraContrato)}
                  />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                     [Jurídico] - Gerar e enviar contrato para assinatura?
                  </label>
               </div>

               {geraContrato && (
                  <div className="row g-3">
                     <div className="col-md-6">
                        <Select
                           options={contratos}
                           fieldName="nome_contrato"
                           fieldValue="cod_contrato"
                           value={selectContrato?.cod_contrato}
                           onChange={(value) => setSelectContrato(value)}
                           className="mb-3"
                           label="Selecione o contrato"
                        />
                     </div>
                  </div>
               )}

               {contratoPreenchido && geraContrato && (
                  <JoditEditor
                     value={contratoPreenchido}
                     onBlur={(newContent) => setContratoPreenchido(newContent)}
                     config={{
                        readonly: false, // ou true, se for só para visualização
                        toolbar: false, // esconde a barra de ferramentas
                        toolbarInline: false,
                        showXPathInStatusbar: false,
                        showCharsCounter: false,
                        showWordsCounter: false,
                        showStatusbar: false,
                        buttons: [], // garante que nenhum botão será carregado
                        removeButtons: "*", // remove todos os botões mesmo se algo vier do default
                     }}
                  />
               )}
            </div>

            <div className="card-footer d-flex justify-content-end gap-3">
               <button disabled={errors.length > 0} className="btn btn-success" onClick={confirmar}>
                  Finalizar contratação
               </button>
            </div>
         </div>
      </div>
   );
}

function preencherContrato(contrato, aluno, empresa, modalidades, plano, dataInicio = new Date()) {
   // Função para decodificar entidades HTML (como &lt; e &gt;)
   function decodeHtml(html) {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = html;
      return textarea.value;
   }

   const parcelas = plano?.parcela_plano ? JSON.parse(plano?.parcela_plano) : [];
   // const descMensalidades = parcelas.map((parcela, i) => `<p>${i + 1}. ${formatarMoeda(parcela)} pagável até o dia ${adicionarMesData(dataInicio, i)}</p>`);
   const descMensalidades = `${parcelas
      .map(
         (parcela, i) =>
            `<p style="margin-left: 20px;">${i + 1}. ${formatarMoeda(parcela)} pagável até o dia ${adicionarMesData(
               dataInicio,
               i
            )}</p>`
      )
      .join("")}`;

   const desc = modalidades && modalidades.length > 0 ? modalidades.map((m) => m.nome_modalidade).join(", ") : "";
   var preenchido = decodeHtml(contrato);

   // Substituições de variáveis do aluno
   preenchido = preenchido.replace(/<nome_aluno>/g, aluno.nome_aluno || "");
   preenchido = preenchido.replace(/<cpf_aluno>/g, aluno.cpf_aluno || "");
   preenchido = preenchido.replace(/<rg_aluno>/g, aluno.rg_aluno || "");
   preenchido = preenchido.replace(/<email_aluno>/g, aluno.email_aluno || "");
   preenchido = preenchido.replace(/<endereco_aluno>/g, aluno.endereco_aluno || "");
   preenchido = preenchido.replace(/<cidade_aluno>/g, aluno.cidade_aluno || "");
   preenchido = preenchido.replace(/<estado_aluno>/g, aluno.estado_aluno || "");
   preenchido = preenchido.replace(/<numero_aluno>/g, aluno.numero_aluno || "");

   // Substituições de variáveis da empresa
   preenchido = preenchido.replace(/<nome_empresa>/g, empresa.nome_empresa || "");
   preenchido = preenchido.replace(/<cnpj_empresa>/g, empresa.doc_empresa || "");
   preenchido = preenchido.replace(/<endereco_empresa>/g, empresa.endereco_empresa || "");
   preenchido = preenchido.replace(/<cidade_empresa>/g, empresa.cidade_empresa || "");
   preenchido = preenchido.replace(/<estado_empresa>/g, empresa.estado_empresa || "");
   preenchido = preenchido.replace(/<numero_empresa>/g, empresa.numero_empresa || "");
   preenchido = preenchido.replace(/<bairro_empresa>/g, empresa.bairro_empresa || "");
   preenchido = preenchido.replace(/<cep_empresa>/g, empresa.cep_empresa || "");
   preenchido = preenchido.replace(/<descricao_empresa>/g, desc);

   // Substituições de variáveis de valores
   preenchido = preenchido.replace(/<valor_total>/g, formatarMoeda(plano?.valor_plano ?? 0));
   preenchido = preenchido.replace(/<valor_mensal>/g, descMensalidades);

   return preenchido;
}

export default ContratacaoPlano;
