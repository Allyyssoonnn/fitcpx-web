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
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { stateUsuario, useNotificacao } from "../../states/states";
import { formatarMoeda } from "../../utils";
import { processaPlano } from "../../utils/utilsPlan";

function CadPlano() {
   const location = useLocation();
   const planoRecebido = location.state?.plano;
   const { tSuccess } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({
      defaultValues: planoRecebido ?? { vende_online: "S", vende_recorrencia: "S", max_installments: 1 },
   });
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
                    .replace(/[^\d.-]/g, ""),
              );
      if (isNaN(parsed)) return;

      const novoPlano = selectModalidades.map((m, i) =>
         i === index ? { ...m, valor_modalidade: parsed, valor_modalidade_alterado: parsed } : m,
      );
      const { planoAtualizado, valorTotal } = processaPlano({ modalidades: novoPlano }, duracaoPlano, valorAdesao);
      setSelectModalidades(planoAtualizado.modalidades);
      setValorTotal(valorTotal);
   }

   // Confirma e salva
   async function confirma(data) {
      await createOrUpdatePlan(
         { ...data, valor_plano: valorTotal, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa },
         selectModalidades,
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
                  <FitFormUI
                     errors={errors}
                     fields={[
                        {
                           cols: 4,
                           title: "Configurações de Venda",
                           fields: [
                              {
                                 label: "Permite venda online?",
                                 fieldName: "vende_online",
                                 type: "toggle",
                                 selectOptions: [
                                    { label: "Sim", value: "S" },
                                    { label: "Não", value: "N" },
                                 ],
                              },
                              {
                                 label: "Pagamento recorrência?",
                                 fieldName: "vende_recorrencia",
                                 type: "toggle",
                                 selectOptions: [
                                    { label: "Sim", value: "S" },
                                    { label: "Não", value: "N" },
                                 ],
                              },
                              {
                                 label: "Número máximo de parcelas",
                                 fieldName: "maximo_parcelas",
                                 type: "select",
                                 selectOptions: Array.from({ length: 12 }, (_, i) => ({ label: i + 1, value: i + 1 })),
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

               <Separator className="my-3" />

               <CardFooter className="flex flex-col lg:flex-row justify-between lg:items-end gap-3">
                  <div className="flex gap-3">
                     <Field className="max-w-sm">
                        <FieldLabel>Valor mensal</FieldLabel>
                        <Input disabled value={formatarMoeda(valorTotal / duracaoPlano || 0)} />
                     </Field>

                     <Field className="max-w-sm">
                        <FieldLabel>Valor total</FieldLabel>
                        <Input disabled value={formatarMoeda(valorTotal + valorAdesao)} />
                     </Field>
                  </div>

                  <Button id="submit" type="submit">
                     <Check />
                     Confirmar
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </FormProvider>
   );
}

export default CadPlano;
