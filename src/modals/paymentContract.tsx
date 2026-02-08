import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { modalConfirmContract } from "@/modules/checkout/components/confirmContract";
import { calculateInstallment, formatCurrency } from "@/utils/utils";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, CreditCard, RotateCcw, ShoppingBag, Smartphone } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";

const schema = z
   .object({
      metodo_pagamento: z
         .enum(["monthly", "cash", "installments", "none"])
         .refine((val) => val !== undefined, { message: "Selecione uma forma de pagamento" }),
      metodo_recorrencia: z
         .enum(["monthly_app", "monthly_card"])
         .refine((val) => val !== undefined, { message: "Selecione uma forma de pagamento para recorrência" }),

      parcelas: z.string().optional(),
   })
   .superRefine((data, ctx) => {
      // Validação extra: Se escolheu parcelado, TEM que escolher a quantidade
      if (data.metodo_pagamento === "installments" && !data.parcelas) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione a quantidade de parcelas",
            path: ["parcelas"],
         });
      }
   });

type SchemaTypes = z.infer<typeof schema>;

const PaymentContract = NiceModal.create(
   ({
      selectedPlan,
      student,
      onConfirm,
   }: {
      selectedPlan: any;
      student: any;
      onConfirm: (planData: any) => Promise<void>;
   }) => {
      const { visible, remove } = useModal();
      const [useApp, setUseApp] = useState(false);

      const {
         handleSubmit,
         control,
         setValue,
         formState: { errors },
      } = useForm<SchemaTypes>({
         resolver: zodResolver(schema),
         defaultValues: {
            metodo_pagamento: "monthly",
            metodo_recorrencia: "monthly_card",
         },
      });

      const metodoPagamento = useWatch({
         control,
         name: "metodo_pagamento",
      });

      const getParcelaLabel = (num: number) => {
         if (!selectedPlan?.price) return "";

         const { baseValue, hasDifference } = calculateInstallment(selectedPlan.price, num);

         const valorFormatado = formatCurrency(baseValue);

         // Se houver diferença de centavos, você pode (opcionalmente) colocar um asterisco ou apenas mostrar o valor base
         // O padrão de mercado é mostrar apenas o valor base: "3x de R$ 33,33"
         return `${num}x de ${valorFormatado}`;
      };

      async function onSubmit(data: SchemaTypes) {
         const planData = {
            ...selectedPlan,
            metodo_recorrencia: data.metodo_recorrencia,
            metodo_pagamento: useApp === false ? "none" : data.metodo_pagamento,
            parcelas: data.metodo_pagamento === "installments" ? data.parcelas : undefined,
            valor_total: selectedPlan.price,
            nome_plano: selectedPlan.nome_plano,
         };

         modalConfirmContract.show({
            student: student,
            plan: planData,
            onConfirm: async () => onConfirm(planData),
            useApp,
         });
      }

      return (
         <Dialog open={visible} onOpenChange={remove}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="text-black">Pagamento</DialogTitle>
               </DialogHeader>

               <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                     <FieldLabel htmlFor="switch-notifications">
                        <Field orientation="horizontal">
                           <FieldContent>
                              <FieldTitle>Cobrança via Sistema</FieldTitle>
                              <FieldDescription>Utilizar o sistema para processar o pagamento agora.</FieldDescription>
                           </FieldContent>
                           <Switch
                              id="switch-notifications"
                              checked={useApp}
                              onCheckedChange={() => setUseApp(!useApp)}
                           />
                        </Field>
                     </FieldLabel>
                  </FieldGroup>

                  <Separator className="my-3" />

                  {/* PAGAMENTO */}
                  <div className="border rounded-lg p-4 bg-background relative">
                     {!useApp && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-6 transition-all">
                           <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-lg shadow-lg text-center max-w-xs">
                              <p className="font-semibold mb-1">Sem cobrança vinculada</p>
                              <p className="text-sm">
                                 O sistema não gerará cobranças. Ative a opção acima para configurar o pagamento.
                              </p>
                           </div>
                        </div>
                     )}

                     <Label>Forma de Pagamento</Label>

                     {/* RadioGroup com Controller */}
                     <Controller
                        control={control}
                        name="metodo_pagamento"
                        render={({ field }) => (
                           <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              className="mt-4 space-y-2"
                           >
                              {/* Opção Recorrência */}
                              {!!selectedPlan?.duration && selectedPlan?.duration > 1 && selectedPlan?.allowMonthly && (
                                 <FieldLabel htmlFor="plan-monthly" className="cursor-pointer">
                                    <Field orientation="horizontal">
                                       <FieldContent className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pr-2">
                                          <div>
                                             <FieldTitle>
                                                <RotateCcw size={15} className="text-green-600" /> Recorrência
                                             </FieldTitle>
                                             <FieldDescription>Pagamento mensal.</FieldDescription>
                                          </div>

                                          {metodoPagamento === "monthly" && (
                                             <div
                                                className="w-[140px]"
                                                // Impede que o clique no select reative o radio (boa prática)
                                                onClick={(e) => e.stopPropagation()}
                                             >
                                                <Controller
                                                   control={control}
                                                   name="metodo_recorrencia"
                                                   render={({ field: selectField }) => (
                                                      <Select
                                                         defaultValue={selectField.value}
                                                         onValueChange={selectField.onChange}
                                                         value={selectField.value}
                                                      >
                                                         <SelectTrigger className="h-12 w-full bg-background">
                                                            {selectField.value === "monthly_app" && (
                                                               <div className="flex items-center gap-2">
                                                                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                                                                  <span className="font-medium">App Manual</span>
                                                               </div>
                                                            )}

                                                            {selectField.value === "monthly_card" && (
                                                               <div className="flex items-center gap-2">
                                                                  <CreditCard className="h-4 w-4 text-primary" />
                                                                  <span className="font-medium">Auto Cartão</span>
                                                               </div>
                                                            )}

                                                            {/* Fallback caso não tenha valor */}
                                                            {!selectField.value && (
                                                               <span className="text-muted-foreground">
                                                                  Selecione...
                                                               </span>
                                                            )}
                                                         </SelectTrigger>

                                                         <SelectContent>
                                                            {/* Opção 1: App Manual */}
                                                            <SelectItem
                                                               value="monthly_app"
                                                               className="py-3 cursor-pointer"
                                                            >
                                                               <div className="flex items-center gap-3 text-left">
                                                                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                                                                  <div className="flex flex-col">
                                                                     <span className="font-medium text-sm">
                                                                        App Manual
                                                                     </span>
                                                                     <span className="text-xs text-muted-foreground text-wrap max-w-[200px]">
                                                                        Pagamento feito manualmente via App a cada mês.
                                                                     </span>
                                                                  </div>
                                                               </div>
                                                            </SelectItem>

                                                            {/* Opção 2: Auto Cartão */}
                                                            <SelectItem
                                                               value="monthly_card"
                                                               className="py-3 cursor-pointer"
                                                            >
                                                               <div className="flex items-center gap-3 text-left">
                                                                  <CreditCard className="h-5 w-5 text-primary" />
                                                                  <div className="flex flex-col">
                                                                     <span className="font-medium text-sm">
                                                                        Auto Cartão
                                                                     </span>
                                                                     <span className="text-xs text-muted-foreground text-wrap max-w-[200px]">
                                                                        Cobrança recorrente automática no cartão
                                                                        cadastrado.
                                                                     </span>
                                                                  </div>
                                                               </div>
                                                            </SelectItem>
                                                         </SelectContent>
                                                      </Select>
                                                   )}
                                                />
                                             </div>
                                          )}
                                       </FieldContent>
                                       <RadioGroupItem value="monthly" id="plan-monthly" />
                                    </Field>
                                 </FieldLabel>
                              )}

                              {/* Opção À Vista */}
                              <FieldLabel htmlFor="plan-cash" className="cursor-pointer">
                                 <Field orientation="horizontal">
                                    <FieldContent>
                                       <FieldTitle>
                                          <Coins size={15} className="text-green-600" /> À vista
                                       </FieldTitle>
                                       <FieldDescription>Pagamento do valor total.</FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="cash" id="plan-cash" />
                                 </Field>
                              </FieldLabel>

                              {/* Opção Parcelado */}
                              {selectedPlan?.max_installments && selectedPlan?.max_installments > 1 && (
                                 <FieldLabel
                                    htmlFor="plan-installments"
                                    className="cursor-pointer transition-all data-[state=active]:me-3"
                                 >
                                    <Field orientation="horizontal">
                                       <FieldContent className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pr-2">
                                          <div>
                                             <FieldTitle>
                                                <CreditCard size={15} className="text-green-600" /> Parcelado
                                             </FieldTitle>
                                             <FieldDescription>
                                                Em até {selectedPlan?.max_installments}x sem juros
                                             </FieldDescription>
                                          </div>

                                          {/* Lado Direito: Select (Só aparece se selecionado) */}
                                          {metodoPagamento === "installments" && (
                                             <div
                                                className="w-[140px]"
                                                // Impede que o clique no select reative o radio (boa prática)
                                                onClick={(e) => e.stopPropagation()}
                                             >
                                                <Controller
                                                   control={control}
                                                   name="parcelas"
                                                   defaultValue={String(selectedPlan.max_installments)} // Valor padrão: max parcelas
                                                   render={({ field: selectField }) => (
                                                      <Select
                                                         onValueChange={selectField.onChange}
                                                         value={selectField.value}
                                                      >
                                                         <SelectTrigger className="h-8 bg-background">
                                                            <SelectValue placeholder="Parcelas" />
                                                         </SelectTrigger>
                                                         <SelectContent>
                                                            {/* Gera array de 2 até max_installments */}
                                                            {Array.from(
                                                               { length: selectedPlan.max_installments - 1 },
                                                               (_, i) => i + 2,
                                                            ).map((num) => (
                                                               <SelectItem key={num} value={String(num)}>
                                                                  {getParcelaLabel(num)}
                                                               </SelectItem>
                                                            ))}
                                                         </SelectContent>
                                                      </Select>
                                                   )}
                                                />
                                             </div>
                                          )}
                                       </FieldContent>

                                       <RadioGroupItem value="installments" id="plan-installments" />
                                    </Field>
                                 </FieldLabel>
                              )}
                           </RadioGroup>
                        )}
                     />

                     {errors.metodo_pagamento && (
                        <span className="text-xs text-red-500 mt-2 block">{errors.metodo_pagamento.message}</span>
                     )}
                  </div>
               </form>

               <DialogFooter>
                  <Button
                     type="submit"
                     form="checkout-form"
                     size="lg"
                     className="w-full text-md font-semibold gap-2"
                     disabled={!selectedPlan}
                  >
                     <ShoppingBag className="h-5 w-5" />
                     Pagar{" "}
                     {selectedPlan?.price
                        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                             selectedPlan.price,
                          )
                        : "R$ 0,00"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   },
);

export const modalPaymentContract = {
   show: (props?: any) => NiceModal.show(PaymentContract, props),
   hide: () => NiceModal.hide(PaymentContract),
};
