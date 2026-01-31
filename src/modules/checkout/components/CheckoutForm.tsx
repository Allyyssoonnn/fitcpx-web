import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateInstallment, formatCurrency, states } from "@/utils/utils";
import { Building2, Coins, CreditCard, RotateCcw, User } from "lucide-react";
import { Control, Controller, useWatch } from "react-hook-form";
import { Plan } from "../types";
import { FormInput } from "./FormInput";

export function CheckoutForm({
   selectedPlan,
   control,
   errors,
}: {
   selectedPlan?: Plan;
   control: Control<any>;
   errors: any;
}) {
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

   return (
      <Accordion type="single" collapsible defaultValue="dados-pessoais" className="w-full space-y-2">
         {/* DADOS PESSOAIS */}
         <AccordionItem value="dados-pessoais" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <User className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Dados Pessoais</Label>
               </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 px-2 pb-6 space-y-4">
               <div className="grid gap-2">
                  <FormInput
                     control={control}
                     name="nome_aluno"
                     label="Nome Completo"
                     placeholder="Ex: João da Silva"
                     error={errors.nome_aluno?.message}
                  />
               </div>

               <div className="grid gap-2">
                  <FormInput
                     control={control}
                     name="email_aluno"
                     label="E-mail"
                     placeholder="Ex: joao@dominio.com"
                     type="email"
                     error={errors.email_aluno?.message}
                     description="E-mail receberá contrato para assinatura"
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                     control={control}
                     name="cpf_aluno"
                     label="CPF"
                     mask="cpf"
                     placeholder="000.000.000-00"
                     maxLength={14}
                     error={errors.cpf_aluno?.message}
                  />

                  <FormInput
                     control={control}
                     name="telefone_aluno"
                     label="Telefone"
                     mask="phone"
                     placeholder="(00) 00000-0000"
                     maxLength={15}
                     error={errors.telefone_aluno?.message}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                     <FormInput
                        control={control}
                        name="data_nascimento_aluno"
                        label="Nascimento"
                        type="date"
                        error={errors.data_nascimento_aluno?.message}
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label>Gênero</Label>
                     {/* Select precisa de Controller */}
                     <Controller
                        control={control}
                        name="genero_aluno"
                        render={({ field }) => (
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="M">Masculino</SelectItem>
                                 <SelectItem value="F">Feminino</SelectItem>
                              </SelectContent>
                           </Select>
                        )}
                     />
                     {errors.genero_aluno && (
                        <span className="text-xs text-red-500">{errors.genero_aluno.message}</span>
                     )}
                  </div>
               </div>
            </AccordionContent>
         </AccordionItem>

         {/* ENDEREÇO */}
         <AccordionItem value="endereco" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <Building2 className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Endereço de Cobrança</Label>
               </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 px-2 pb-6 space-y-4">
               <div className="grid grid-cols-[120px_1fr] gap-4">
                  <FormInput
                     control={control}
                     name="cep_aluno"
                     label="CEP"
                     mask="cep"
                     placeholder="00000-000"
                     maxLength={9}
                     error={errors.cep_aluno?.message}
                  />

                  <FormInput
                     control={control}
                     name="endereco_aluno"
                     label="Logradouro"
                     error={errors.endereco_aluno?.message}
                  />
               </div>

               <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div className="grid gap-2">
                     <FormInput
                        control={control}
                        name="bairro_aluno"
                        label="Bairro"
                        error={errors.bairro_aluno?.message}
                     />
                  </div>

                  <div className="grid gap-2">
                     <FormInput
                        control={control}
                        name="numero_aluno"
                        label="Número"
                        error={errors.numero_aluno?.message}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="grid gap-2">
                     <Label>Estado</Label>
                     <Controller
                        control={control}
                        name="estado_aluno"
                        render={({ field }) => (
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="UF" />
                              </SelectTrigger>
                              <SelectContent>
                                 {states.map((state) => (
                                    <SelectItem key={state} value={state}>
                                       {state}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        )}
                     />
                     {errors.estado_aluno && (
                        <span className="text-xs text-red-500">{errors.estado_aluno.message}</span>
                     )}
                  </div>
                  <div className="grid gap-2">
                     <FormInput
                        control={control}
                        name="cidade_aluno"
                        label="Cidade"
                        placeholder="Ex: São Paulo"
                        error={errors.cidade_aluno?.message}
                     />
                  </div>
               </div>
            </AccordionContent>
         </AccordionItem>

         {/* PAGAMENTO */}
         <AccordionItem value="pagamento" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Pagamento</Label>
               </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 px-2 pb-6 text-sm text-muted-foreground">
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
                                 <FieldContent>
                                    <FieldTitle>
                                       <RotateCcw size={15} className="text-green-600" /> Recorrência
                                    </FieldTitle>
                                    <FieldDescription>Pagamento mensal automático.</FieldDescription>
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
                                                <Select onValueChange={selectField.onChange} value={selectField.value}>
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
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   );
}
