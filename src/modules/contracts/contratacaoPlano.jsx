import JoditEditor from "jodit-react";
import { AlertTriangle, Check } from "lucide-react";
import moment from "moment/moment";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { newContract } from "../../api/contracts";
import { getContractsTemplates } from "../../api/contractsTemplates";
import { getPlans } from "../../api/plans";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import Pagamento from "../../components/payment/pagamento";
import SelectModalidades from "../../components/selectModalidades";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { adicionarMesData, dividirParcelas, formatarCEP, formatarCNPJ, formatarCPF, formatarMoeda } from "../../utils";
import { convertNumberToTextWithDecimals } from "../../utils/convertNumberToText";
import { processaPlano } from "../../utils/utilsPlan";

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
   const [geraContrato, setGeraContrato] = useState(true);

   const [errors, setErrors] = useState([]);

   const { data: planos } = useQuery({
      queryKey: ["planos"],
      queryFn: getPlans,
      initialData: [],
   });

   useEffect(() => {
      let tempErrors = [];
      if (!aluno?.cpf_aluno) tempErrors.push("[Cadastro do aluno incompleto] - CPF do aluno não informado.");
      if (!aluno?.rg_aluno) tempErrors.push("[Cadastro do aluno incompleto] - RG do aluno não informado.");
      if (!aluno?.email_aluno) tempErrors.push("[Cadastro do aluno incompleto] - E-mail do aluno não informado.");
      if (!aluno?.telefone_aluno) tempErrors.push("[Cadastro do aluno incompleto] - Telefone do aluno não informado.");
      if (!aluno?.cep_aluno) tempErrors.push("[Cadastro do aluno incompleto] - CEP do aluno não informado.");
      if (!aluno?.endereco_aluno) tempErrors.push("[Cadastro do aluno incompleto] - Endereço do aluno não informado.");
      if (!aluno?.numero_aluno)
         tempErrors.push("[Cadastro do aluno incompleto] - Endereço (número) do aluno não informado.");
      if (!aluno?.cidade_aluno) tempErrors.push("[Cadastro do aluno incompleto] - Cidade do aluno não informado.");
      if (!aluno?.estado_aluno) tempErrors.push("[Cadastro do aluno incompleto] - UF do aluno não informado.");

      if (!empresa?.doc_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - CNPJ/CPF do profissional não informado");
      if (!empresa?.email_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - E-mail do profissional não informado");
      if (!empresa?.telefone_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - Telefone do profissional não informado");
      if (!empresa?.nome_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - Nome do profissional não informado");
      if (!empresa?.cep_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - CEP do profissional não informado");
      if (!empresa?.endereco_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - Endereço do profissional não informado");
      if (!empresa?.numero_empresa)
         tempErrors.push(
            "[Cadastro dos dados profissionais incompleto] - Endereço (Número) do profissional não informado"
         );
      if (!empresa?.cidade_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - Cidade do profissional não informado");
      if (!empresa?.estado_empresa)
         tempErrors.push("[Cadastro dos dados profissionais incompleto] - Estado do profissional não informado");
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
      const { planoAtualizado, valorTotal } = processaPlano(plano, plano?.duracao_plano, plano?.valor_adesao);
      setPlano({ ...planoAtualizado, valor_plano: valorTotal });
   }, [plano?.duracao_plano]);

   // --- Funções otimizadas para modalidades e valores --- //

   function calcularValores(plano) {
      if (!plano?.modalidades?.length) return { ...plano, valor_plano: 0, parcela_plano: "[]" };

      const totalBase = plano.modalidades.reduce((soma, m) => soma + (m.valor_modalidade || 0), 0);
      const valorTotal = totalBase * (plano.duracao_plano || 1);
      const parcelas = dividirParcelas(plano.duracao_plano, valorTotal);

      return { ...plano, valor_plano: valorTotal, parcela_plano: JSON.stringify(parcelas) };
   }

   // substituir aplicarSubvariacoes
   function aplicarSubvariacoes(plano) {
      if (!plano?.modalidades?.length) return plano;
      const duracao = Number(plano.duracao_plano) || 0;

      const modalidades = plano.modalidades.map((m) => {
         // se o usuário já ajustou manualmente, não sobrescrever
         if (m.valor_modalidade_alterado != null) return { ...m };

         const sub = (m.valores || []).filter((v) => duracao >= Number(v.quantidade_modalidade_variacao_valor || 0));

         if (!sub.length) {
            return {
               ...m,
               valor_modalidade: m.valor_modalidade_original ?? (m.valor_modalidade || 0),
               nome_modalidade: m.nome_modalidade_original ?? m.nome_modalidade,
            };
         }

         const ultima = sub[sub.length - 1];
         return {
            ...m,
            cod_modalidade_variacao_valor: ultima.cod_modalidade_variacao_valor,
            valor_modalidade: Number(ultima.valor_modalidade_variacao_valor || 0),
            nome_modalidade: `${m.nome_modalidade_original} - ${ultima.nome_modalidade_variacao_valor}`,
         };
      });

      return { ...plano, modalidades };
   }

   // substituir attValue
   function attValue(valor, index) {
      setPlano((prev) => {
         if (!prev) return prev;

         const idx = Number(index);
         if (Number.isNaN(idx)) return prev;

         const parsed =
            typeof valor === "number"
               ? valor
               : parseFloat(
                    String(valor)
                       .replace(/\./g, "")
                       .replace(",", ".")
                       .replace(/[^\d.-]/g, "")
                 );

         if (isNaN(parsed)) return prev;

         const modalidades = (prev.modalidades || []).map((m, i) =>
            i === idx ? { ...m, valor_modalidade: parsed, valor_modalidade_alterado: parsed } : m
         );

         // usar atualizarPlano (aplicarSubvariacoes agora respeita overrides manuais)
         return atualizarPlano({ ...prev, modalidades });
      });
   }

   function atualizarPlano(plano) {
      return calcularValores(aplicarSubvariacoes(plano));
   }

   function addModalidade(modalidade) {
      setPlano((prev) => atualizarPlano({ ...prev, modalidades: [...(prev?.modalidades || []), modalidade] }));
   }

   function removeModalidade(index) {
      setPlano((prev) =>
         atualizarPlano({
            ...prev,
            modalidades: prev.modalidades?.filter((_, i) => i !== index),
         })
      );
   }

   useMemo(() => {
      if (selectContrato?.contrato) {
         setContratoPreenchido(
            preencherContrato(selectContrato.contrato, aluno, empresa, plano?.modalidades, plano, pagamentoInicial)
         );
      }
   }, [
      selectContrato,
      aluno,
      empresa,
      plano?.modalidades,
      plano?.duracao_plano,
      plano?.multa_moratoria,
      plano?.multa_compensatoria,
      plano?.juros_atraso,
   ]);

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

   function updatePlano(field, value) {
      setPlano((prev) => ({ ...prev, [field]: value }));
   }

   async function onPay(formaPagamento, closeLoading, paymentMethodId, formCard, typePayment) {
      try {
         await newContract({
            ...plano,
            pagamentoInicial,
            formaPagamento,
            contrato: geraContrato ? contratoPreenchido : null,
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

   function selectPlan(v) {
      const planoSelecionado = planos.find((e) => e.cod_plano == v);
      if (!planoSelecionado) return;

      const { planoAtualizado, valorTotal } = processaPlano(
         planoSelecionado,
         planoSelecionado?.duracao_plano,
         planoSelecionado?.valor_adesao
      );

      setPlano((prev) => ({
         ...prev,
         ...planoAtualizado,
         valor_plano: valorTotal,
         modalidades: planoAtualizado.modalidades,
      }));
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

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

         <Card>
            <CardHeader>
               <CardTitle>Contratação de plano</CardTitle>
            </CardHeader>

            <CardContent>
               <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="grid grid-cols-1 gap-2">
                     <CardTitle>Aluno</CardTitle>

                     <Label className="fs-4 mb-2">{aluno?.nome_aluno}</Label>

                     <Label>
                        CEP: <strong>{formatarCEP(aluno?.cep_aluno)}</strong>
                     </Label>

                     <Label>
                        Endereço:{" "}
                        <strong>
                           {aluno?.endereco_aluno}, {aluno?.numero_aluno}
                        </strong>
                     </Label>

                     <Label>
                        Cidade:{" "}
                        <strong>
                           {aluno?.cidade_aluno} - {aluno?.estado_aluno}
                        </strong>
                     </Label>

                     <Label>
                        CPF: <strong>{formatarCPF(aluno?.cpf_aluno)}</strong>
                     </Label>

                     <Label>
                        RG: <strong>{aluno?.rg_aluno ?? "-"}</strong>
                     </Label>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                     <CardTitle>Profissonal</CardTitle>

                     <Label className="fs-4 mb-2">{empresa?.nome_empresa}</Label>

                     <Label className="mb-1">
                        CEP: <strong>{formatarCEP(empresa?.cep_empresa)}</strong>
                     </Label>

                     <Label className="mb-1">
                        Endereço:{" "}
                        <strong>
                           {empresa?.endereco_empresa}, {empresa?.numero_empresa}
                        </strong>
                     </Label>

                     <Label className="mb-1">
                        Cidade:{" "}
                        <strong>
                           {empresa?.cidade_empresa} - {empresa?.estado_empresa}
                        </strong>
                     </Label>

                     <Label className="mb-1">
                        CNPJ/CPF :<strong>{getDoc(empresa?.doc_empresa)}</strong>
                     </Label>
                  </div>
               </div>
            </CardContent>
         </Card>

         {errors.length > 0 && (
            <Card className="mt-3">
               <CardHeader>
                  <AlertTriangle />
                  <CardTitle>Alertas - (Solucionar pendências para avançar na contratação)</CardTitle>
               </CardHeader>

               <CardContent>
                  <div className="d-flex justify-content-center">
                     <div className="rounded p-2 col-md-6 mt-3">
                        {errors.map((error, index) => (
                           <p key={index} className="mb-0">
                              {error}
                           </p>
                        ))}
                     </div>
                  </div>
               </CardContent>

               <CardFooter className="d-flex justify-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => navigate("/configuracao?tab=2")}>
                     Ir para configurações
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() =>
                        navigate("/cadaluno", {
                           state: { aluno },
                        })
                     }
                  >
                     Cadastro do aluno
                  </Button>
               </CardFooter>
            </Card>
         )}
         {!(errors.length > 0) && (
            <div className="grid grid-cols-2 gap-3 mt-3">
               <Card>
                  <CardContent className="grid grid-cols-1">
                     <TooltipProvider delayDuration={100}>
                        <div className="flex justify-center flex-wrap gap-2 mb-3">
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button
                                    variant={!montandoPlano ? "default" : "outline"}
                                    onClick={() => setMontandoPlano(false)}
                                 >
                                    Selecionar plano
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent>Selecionar um plano pré cadastrado</TooltipContent>
                           </Tooltip>

                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button
                                    variant={montandoPlano ? "default" : "outline"}
                                    onClick={() => setMontandoPlano(true)}
                                 >
                                    Montar plano
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent>Montar um plano agora</TooltipContent>
                           </Tooltip>
                        </div>
                     </TooltipProvider>

                     {!montandoPlano && (
                        <Field className="w-[50%]">
                           <FieldLabel>Selecione o plano</FieldLabel>
                           <Select onValueChange={(v) => selectPlan(v)}>
                              <SelectTrigger>
                                 <SelectValue placeholder="Selecione o plano" />
                              </SelectTrigger>

                              <SelectContent>
                                 {planos.map((plano, index) => (
                                    <SelectItem value={String(plano.cod_plano)} key={index}>
                                       {plano.nome_plano}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </Field>
                     )}

                     <Field className="w-[50%]">
                        <FieldLabel>Duração plano</FieldLabel>
                        <Select
                           disabled={!montandoPlano}
                           value={plano?.duracao_plano}
                           onValueChange={(v) => updatePlano("duracao_plano", v)}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione a duração" />
                           </SelectTrigger>

                           <SelectContent>
                              {[...Array(12).keys()].map((i) => (
                                 <SelectItem value={i + 1} key={i}>
                                    {i + 1}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </Field>

                     <Field className="w-[50%] mt-3">
                        <FieldLabel>Primeira cobrança</FieldLabel>
                        <Input
                           type="date"
                           value={pagamentoInicial}
                           onChange={(e) => setPagamentoInicial(e.target.value)}
                        />
                     </Field>

                     <Separator className="my-3" />
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
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

                        <div>
                           <p className={`${montandoPlano && "d-none"} m-0 text-end`}>
                              Mensal - <strong>{formatarMoeda(plano?.valor_plano / plano?.duracao_plano || 0)}</strong>
                           </p>
                           <p className="m-0 text-end">
                              Total -{" "}
                              <strong>{formatarMoeda(plano?.valor_plano + (plano?.valor_adesao || 0) || 0)}</strong>
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {!(errors.length > 0) && (
            <Card className="mt-3">
               <CardHeader>
                  <CardTitle>Revisão do contrato</CardTitle>
               </CardHeader>

               <CardContent>
                  <div className="grid grid-cols-2">
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
                           <Select
                              onValueChange={(v) => {
                                 const contrato = contratos.find((e) => e.cod_contrato == v) || null;
                                 if (!contrato) return;
                                 setSelectContrato(contrato);
                                 if (contrato.multa_compensatoria)
                                    updatePlano("multa_compensatoria", contrato?.multa_compensatoria || "0");
                                 if (contrato.multa_moratoria)
                                    updatePlano("multa_moratoria", contrato?.multa_moratoria || "0");
                                 if (contrato.juros_atraso) updatePlano("juros_atraso", contrato?.juros_atraso || "0");
                              }}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Selecione o contrato" />
                              </SelectTrigger>

                              <SelectContent>
                                 {contratos.map((contrato, index) => (
                                    <SelectItem value={String(contrato.cod_contrato)} key={index}>
                                       {contrato.nome_contrato}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                     )}
                  </div>

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
               </CardContent>

               <div className="d-flex justify-end px-3">
                  <Button id="submit" type="submit" disabled={errors.length > 0} onClick={confirmar}>
                     <Check />
                     Confirmar
                  </Button>
               </div>
            </Card>
         )}
      </div>
   );
}

const getDoc = (doc) => {
   if (!doc) return "";
   if (doc.length == 11) return formatarCPF(doc);
   if (doc.length == 14) return formatarCNPJ(doc);
   return doc;
};

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
            `<p style="margin-left: 20px;">${i + 1}. ${convertNumberToTextWithDecimals(
               parcela
            )} pagável até o dia ${adicionarMesData(dataInicio, i)}</p>`
      )
      .join("")}`;

   const desc = modalidades && modalidades.length > 0 ? modalidades.map((m) => m.nome_modalidade).join(", ") : "";
   var preenchido = decodeHtml(contrato);

   preenchido = preenchido.replaceAll("background: aqua", "");

   preenchido = preenchido.replaceAll(/<data_de_inicio>/g, moment(dataInicio).format("DD/MM/YYYY") || "Não definido");
   preenchido = preenchido.replaceAll(
      /<data_de_termino>/g,
      moment(dataInicio)
         .add(plano?.duracao_plano || 1, "M")
         .format("DD/MM/YYYY") || "Não definido"
   );
   preenchido = preenchido.replaceAll(/<data_vencimento>/g, moment(dataInicio).format("DD") || "Não definido");
   preenchido = preenchido.replaceAll(/<tempo_contrato>/g, plano?.duracao_plano || "Não definido");
   preenchido = preenchido.replaceAll(
      /<valor_total_plano>/g,
      plano?.valor_plano ? convertNumberToTextWithDecimals(plano.valor_plano, "pt") : "Não definido"
   );
   preenchido = preenchido.replaceAll(
      /<valor_mensal_unitario>/g,
      parcelas[0] ? convertNumberToTextWithDecimals(parcelas[0], "pt") : "Não definido"
   );

   preenchido = preenchido.replaceAll(
      /<multa_percentagem>/g,
      plano?.multa_moratoria ? `${plano.multa_moratoria}%` : "0%"
   );
   preenchido = preenchido.replaceAll(/<juros_percentagem>/g, plano?.juros_atraso ? `${plano.juros_atraso}%` : "0%");
   preenchido = preenchido.replaceAll(
      /<percentagem_multa>/g,
      plano?.multa_compensatoria ? `${plano.multa_compensatoria}%` : "0%"
   );
   //multa_percentagem
   //juros_percentagem
   //percentagem_multa

   // Substituições de variáveis do aluno
   preenchido = preenchido.replaceAll(/<nome_aluno>/g, aluno.nome_aluno || "");
   preenchido = preenchido.replaceAll(/<cpf_aluno>/g, aluno?.cpf_aluno ? formatarCPF(aluno.cpf_aluno) : "");
   preenchido = preenchido.replaceAll(/<rg_aluno>/g, aluno.rg_aluno || "");
   preenchido = preenchido.replaceAll(/<email_aluno>/g, aluno.email_aluno || "");
   preenchido = preenchido.replaceAll(/<endereco_aluno>/g, aluno.endereco_aluno || " - ");
   preenchido = preenchido.replaceAll(/<cidade_aluno>/g, aluno.cidade_aluno || " - ");
   preenchido = preenchido.replaceAll(/<estado_aluno>/g, aluno.estado_aluno || " - ");
   preenchido = preenchido.replaceAll(/<numero_aluno>/g, aluno.numero_aluno || " - ");
   preenchido = preenchido.replaceAll(/<cep_aluno>/g, aluno?.cep_aluno ? formatarCEP(aluno?.cep_aluno) : " - ");
   preenchido = preenchido.replaceAll(/<bairro_aluno>/g, aluno.bairro_aluno || " - ");

   // Substituições de variáveis da empresa
   preenchido = preenchido.replaceAll(/<nome_empresa>/g, empresa.nome_empresa || "");
   preenchido = preenchido.replaceAll(/<doc_empresa>/g, empresa?.doc_empresa ? getDoc(empresa.doc_empresa) : "");
   preenchido = preenchido.replaceAll(/<email_empresa>/g, empresa?.email_empresa || "");
   preenchido = preenchido.replaceAll(/<endereco_empresa>/g, empresa.endereco_empresa || " - ");
   preenchido = preenchido.replaceAll(/<cidade_empresa>/g, empresa.cidade_empresa || " - ");
   preenchido = preenchido.replaceAll(/<estado_empresa>/g, empresa.estado_empresa || " - ");
   preenchido = preenchido.replaceAll(/<numero_empresa>/g, empresa.numero_empresa || " - ");
   preenchido = preenchido.replaceAll(/<bairro_empresa>/g, empresa.bairro_empresa || " - ");
   preenchido = preenchido.replaceAll(/<cep_empresa>/g, empresa?.cep_empresa ? formatarCEP(empresa?.cep_empresa) : "");
   preenchido = preenchido.replaceAll(/<modalidade>/g, desc);

   // Substituições de variáveis de valores
   preenchido = preenchido.replaceAll(/<valor_total>/g, convertNumberToTextWithDecimals(plano?.valor_plano ?? 0));
   preenchido = preenchido.replaceAll(/<valor_mensal>/g, descMensalidades);

   return preenchido;
}

export default ContratacaoPlano;
