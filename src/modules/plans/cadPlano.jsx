import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdatePlan } from "../../api/plans";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import SelectModalidades from "../../components/selectModalidades";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { stateUsuario, useNotificacao } from "../../states/states";
import { dividirParcelas, formatarMoeda } from "../../utils";

function CadPlano() {
   const location = useLocation();
   const planoRecebido = location.state?.plano;
   const { nSuccess } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({ defaultValues: planoRecebido });
   const {
      handleSubmit,
      setValue,
      watch,
      getValues,
      formState: { errors },
   } = form;
   const navigate = useNavigate();
   const [selectModalidades, setSelectModalidades] = useState([]);
   const [valorTotal, setValorTotal] = useState(0);

   useEffect(() => {
      calculaValoresDoPlano();
   }, [selectModalidades]);

   useEffect(() => {
      if (!planoRecebido) return;
      const modalidadesAtualizadas = (planoRecebido.modalidades || []).map((m) => ({
         ...m,
         valor_modalidade: m.valor_modalidade_alterado ?? m.valor_modalidade,
         nome_modalidade: m.nome_plano_modalidade,
      }));
      console.log(planoRecebido.modalidades);

      setSelectModalidades(modalidadesAtualizadas);
      calculaValoresDoPlano(planoRecebido);
   }, [planoRecebido]);

   const duracaoPlano = watch("duracao_plano");

   useEffect(() => {
      if (selectModalidades.length) calculaValoresDoPlano();
   }, [duracaoPlano, selectModalidades]);

   function aplicarSubvariacoes(plano) {
      if (!plano?.modalidades?.length) return plano;
      const duracao = Number(getValues("duracao_plano")) || 0;

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

   function atualizarPlano(plano) {
      const duracao = Number(getValues("duracao_plano")) || 0;
      const valorAdesao = Number(getValues("valor_adesao")) || 0;

      if (!plano?.modalidades?.length) {
         setValorTotal(0);
         setValue("valor_plano", 0);
         setValue("parcela_plano", "[]");
         return plano;
      }

      const totalBase = plano.modalidades.reduce((soma, m) => soma + (m.valor_modalidade || 0), 0);
      const valorTotal = totalBase * duracao;
      const parcelas = dividirParcelas(duracao, valorTotal);
      parcelas[0] += valorAdesao;

      setValorTotal(valorTotal);
      setValue("valor_plano", valorTotal);
      setValue("parcela_plano", JSON.stringify(parcelas));

      return { ...plano, valor_plano: valorTotal, parcela_plano: JSON.stringify(parcelas) };
   }

   function calculaValoresDoPlano() {
      const duracao_plano = Number(getValues("duracao_plano") || 0);
      const valorAdesao = Number(getValues("valor_adesao") || 0);

      const totalModalidades = selectModalidades.reduce((sum, mod) => sum + (mod.valor_modalidade || 0), 0);
      const total = duracao_plano * totalModalidades;
      const parcelas = dividirParcelas(duracao_plano, total);

      parcelas[0] += valorAdesao;

      setValorTotal(total);
      setValue("valor_plano", total);
      setValue("parcela_plano", JSON.stringify(parcelas));
   }

   function addModalidade(modalidade) {
      const planoAtual = { modalidades: [...selectModalidades, modalidade] };
      const planoAtualizado = atualizarPlano(aplicarSubvariacoes(planoAtual));
      setSelectModalidades(planoAtualizado.modalidades);
   }

   function removeModalidade(index) {
      const planoAtual = { modalidades: selectModalidades.filter((_, i) => i !== index) };
      const planoAtualizado = atualizarPlano(aplicarSubvariacoes(planoAtual));
      setSelectModalidades(planoAtualizado.modalidades);
   }

   function attValue(valor, index) {
      setSelectModalidades((prev) => {
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

         const modalidades = (prev || []).map((m, i) =>
            i === idx ? { ...m, valor_modalidade: parsed, valor_modalidade_alterado: parsed } : m
         );

         const planoAtualizado = atualizarPlano(aplicarSubvariacoes({ modalidades }));
         return planoAtualizado.modalidades;
      });
   }

   async function confirma(data) {
      await createOrUpdatePlan(
         {
            ...data,
            valor_plano: valorTotal,
            cod_usuario: usuario.cod_usuario,
            cod_empresa: usuario.cod_empresa,
         },
         selectModalidades
      );
      nSuccess();
      navigate("/planos");
   }

   return (
      <FormProvider {...form}>
         <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <BackBoxUI />

            <Card>
               <CardContent>
                  <FitFormUI
                     errors={errors}
                     fields={[
                        {
                           separator: true,
                           cols: 4,
                           title: "Informações",
                           fields: [
                              {
                                 id: "name",
                                 label: "Nome",
                                 fieldName: "nome_plano",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 id: "name",
                                 label: "Duração do plano (Meses)",
                                 fieldName: "duracao_plano",
                                 inputType: "number",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 label: "Valor Adesão",
                                 fieldName: "valor_adesao",
                                 type: "currency",
                              },
                           ],
                        },
                     ]}
                  />
               </CardContent>
            </Card>

            <Card className="mt-3">
               <CardContent>
                  <SelectModalidades
                     addModalidade={addModalidade}
                     removeModalidade={removeModalidade}
                     modalidadesPlano={selectModalidades}
                     attValue={attValue}
                  />
               </CardContent>

               <div className="d-flex justify-end items-end gap-3 px-3">
                  <Field className="col-2">
                     <FieldLabel>Valor mensal</FieldLabel>
                     <Input disabled value={formatarMoeda(valorTotal / duracaoPlano || 0)} />
                  </Field>

                  <Field className="col-2">
                     <FieldLabel>Valor total</FieldLabel>
                     <Input disabled value={formatarMoeda(valorTotal)} />
                  </Field>

                  <Button id="submit" type="submit">
                     <Check />
                     Confirmar
                  </Button>
               </div>
            </Card>
         </form>
      </FormProvider>
   );
}

export default CadPlano;
