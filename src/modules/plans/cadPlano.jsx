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
      register,
      handleSubmit,
      control,
      setValue,
      watch,
      getValues,
      formState: { errors },
   } = form;
   const navigate = useNavigate();
   const [selectModalidades, setSelectModalidades] = useState([]);
   const [valorTotal, setValorTotal] = useState(0);

   useEffect(() => {
      if (planoRecebido?.modalidades) setSelectModalidades(planoRecebido?.modalidades);
      if (planoRecebido) {
         Object.keys(planoRecebido).forEach((key) => {
            setValue(key, planoRecebido[key]);
         });
      }
   }, [location, setValue]);

   const duracao_plano = watch("duracao_plano");

   useEffect(() => {
      (async function load() {
         if (!duracao_plano) return;
         const plano = getValues();
         await atualizarModalidadesComSubvariacoes({ plano, modalidades: selectModalidades });
         await calculaValoresDoPlano(plano);
      })();
   }, [duracao_plano, selectModalidades]);

   function calculaValoresDoPlano(plano) {
      let total = 0;

      selectModalidades?.forEach((mod) => {
         total += mod.valor_modalidade;
      });
      total = plano.duracao_plano * total;

      const parcelas = dividirParcelas(plano.duracao_plano, total);
      if (plano.valor_adesao) parcelas[0] += plano.valor_adesao;
      setValorTotal(total);
      return {
         ...plano,
         valor_plano: total,
         parcela_plano: JSON.stringify(parcelas),
      };
   }

   function atualizarModalidadesComSubvariacoes(planoAtual) {
      if (!planoAtual?.modalidades?.length) return planoAtual;

      const modalidadesAtualizadas = planoAtual.modalidades.map((mod) => {
         var novaModalidade = { ...mod };

         if (mod.cod_modalidade_variacao) {
            const variacao = mod.variacoes.find((v) => v.cod_modalidade_variacao == mod.cod_modalidade_variacao);
            novaModalidade.valores = variacao.valores;
         }

         var valores = novaModalidade?.valores;
         if (!valores?.length) return novaModalidade;

         const valorQuantidade = valores.filter((v) => duracao_plano >= v.quantidade_modalidade_variacao_valor);

         if (!valorQuantidade.length) {
            novaModalidade.cod_modalidade_variacao_valor = mod.cod_modalidade_variacao_valor || null;
            novaModalidade.valor_modalidade = mod.valor_modalidade_original || mod.valor_modalidade;
            novaModalidade.nome_modalidade = mod.nome_modalidade_original || mod.nome_modalidade;
         } else {
            const ultima = valorQuantidade[valorQuantidade.length - 1];
            novaModalidade.cod_modalidade_variacao_valor = ultima.cod_modalidade_variacao_valor;
            novaModalidade.valor_modalidade = ultima.valor_modalidade_variacao_valor;
            novaModalidade.nome_modalidade = `${mod.nome_modalidade_original || mod.nome_modalidade} - ${String(
               ultima.nome_modalidade_variacao_valor
            )}`;
         }

         return novaModalidade;
      });

      setSelectModalidades(modalidadesAtualizadas);
   }

   function addModalidade(modalidade) {
      var modalidades = [...(selectModalidades || []), modalidade];
      atualizarModalidadesComSubvariacoes({ modalidades });
   }

   function removeModalidade(index) {
      setSelectModalidades((prev) => prev?.filter((m, i) => index !== i));
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
                  />
               </CardContent>

               <div className="d-flex justify-end items-end gap-3 px-3">
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
