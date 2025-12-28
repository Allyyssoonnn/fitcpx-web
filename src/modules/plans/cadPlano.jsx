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
import { formatarMoeda } from "../../utils";
import { processaPlano } from "../../utils/utilsPlan";

function CadPlano() {
   const location = useLocation();
   const planoRecebido = location.state?.plano;
   const { tSuccess } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({ defaultValues: planoRecebido });
   const {
      handleSubmit,
      watch,
      getValues,
      formState: { errors },
   } = form;
   const navigate = useNavigate();
   const [selectModalidades, setSelectModalidades] = useState([]);
   const [valorTotal, setValorTotal] = useState(0);

   const duracaoPlano = Number(watch("duracao_plano")) || 0;
   const valorAdesao = Number(watch("valor_adesao") || 0);

   // Inicializa plano ao montar
   useEffect(() => {
      if (!planoRecebido) return;

      const { planoAtualizado, valorTotal } = processaPlano(planoRecebido, duracaoPlano, valorAdesao);
      setSelectModalidades(planoAtualizado.modalidades);
      setValorTotal(valorTotal);
   }, [planoRecebido, duracaoPlano, valorAdesao]);

   // Adiciona uma modalidade
   function addModalidade(modalidade) {
      const novoPlano = { modalidades: [...selectModalidades, modalidade] };
      const { planoAtualizado, valorTotal } = processaPlano(novoPlano, duracaoPlano, valorAdesao);
      setSelectModalidades(planoAtualizado.modalidades);
      setValorTotal(valorTotal);
   }

   // Remove modalidade
   function removeModalidade(index) {
      const novoPlano = { modalidades: selectModalidades.filter((_, i) => i !== index) };
      const { planoAtualizado, valorTotal } = processaPlano(novoPlano, duracaoPlano, valorAdesao);
      setSelectModalidades(planoAtualizado.modalidades);
      setValorTotal(valorTotal);
   }

   // Atualiza valor manualmente
   function attValue(valor, index) {
      const parsed =
         typeof valor === "number"
            ? valor
            : parseFloat(
                 String(valor)
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .replace(/[^\d.-]/g, "")
              );
      if (isNaN(parsed)) return;

      const novoPlano = selectModalidades.map((m, i) =>
         i === index ? { ...m, valor_modalidade: parsed, valor_modalidade_alterado: parsed } : m
      );
      const { planoAtualizado, valorTotal } = processaPlano({ modalidades: novoPlano }, duracaoPlano, valorAdesao);
      setSelectModalidades(planoAtualizado.modalidades);
      setValorTotal(valorTotal);
   }

   // Confirma e salva
   async function confirma(data) {
      await createOrUpdatePlan(
         { ...data, valor_plano: valorTotal, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa },
         selectModalidades
      );
      tSuccess();
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
                     <Input disabled value={formatarMoeda(valorTotal + valorAdesao)} />
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
