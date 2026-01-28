import { get } from "@/api/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, Coins, CreditCard, MapPin, Phone, RotateCcw, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";

interface Plan {
   value: string;
   label: string;
   price: number;
   joiningFee: number;
   duration: number;
   max_installments: number;
   allowMonthly: boolean;
}

interface Company {
   name: string;
   address: string;
   phone: string;
   img: string;
}

export default function Checkout() {
   const { handleSubmit, register } = useForm();

   const params = new URLSearchParams(window.location.search);
   const token = params.get("token");
   const companyId = token?.split("-")[1].substring(2);

   const [company, setCompany] = useState<Company | null>(null);
   const [plans, setPlans] = useState<Plan[]>([]);
   const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();

   const { isLoading } = useQuery({
      queryKey: ["company-details", companyId],
      queryFn: async () => {
         const response = await get(`/companies/getCompanyAndPlans?companyId=${companyId}`);
         setCompany(
            response?.company ?? {
               name: "-",
               address: "-",
               phone: "-",
               img: "-",
            },
         );
         setPlans(response?.plans ?? []);
      },
      enabled: !!companyId,
   });

   function handlePlanChange(value: string) {
      const plan = plans.find((p) => p.value === value);
      setSelectedPlan(plan);
   }

   function onSubmit() {
      // Lógica para processar o pagamento
   }

   if (isLoading) {
      return (
         <div className="min-h-svh flex items-center justify-center">
            <span className="text-muted-foreground">Carregando detalhes da empresa e planos...</span>
         </div>
      );
   }

   return (
      <div className="min-h-svh bg-accent p-4 md:p-8 flex items-start justify-center">
         <div className="grid w-full max-w-6xl items-start gap-6 lg:grid-cols-2">
            {/* Lado Esquerdo: Resumo do Pedido */}
            <Resume plans={plans} selectedPlan={selectedPlan} handlePlanChange={handlePlanChange} company={company} />

            {/* Lado Direito: Formulário */}
            <Card className="shadow-sm border-muted-foreground/10 relative overflow-hidden">
               {!selectedPlan && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-6 transition-all">
                     <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-lg shadow-lg text-center max-w-xs">
                        <p className="font-semibold mb-1">Aguardando Seleção</p>
                        <p className="text-sm">
                           Por favor, selecione um plano no resumo do pedido para desbloquear o pagamento.
                        </p>
                     </div>
                  </div>
               )}

               {!!selectedPlan && selectedPlan?.price <= 0 && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-6 transition-all">
                     <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-lg shadow-lg text-center max-w-xs">
                        <p className="font-semibold mb-1">Plano sem valor</p>
                        <p className="text-sm">
                           Por favor, selecione um plano que tenha um valor maior que R$ 0,00 para prosseguir com o
                           pagamento.
                        </p>
                     </div>
                  </div>
               )}

               <CardHeader>
                  <CardTitle className="text-xl">Finalizar Pagamento</CardTitle>
                  <CardDescription>Preencha seus dados com segurança para concluir.</CardDescription>
               </CardHeader>

               <CardContent>
                  <CheckoutForm selectedPlan={selectedPlan} register={register} />
               </CardContent>

               <CardFooter>
                  <Button size="lg" className="w-full text-md font-semibold gap-2" disabled={!selectedPlan}>
                     <ShoppingBag className="h-5 w-5" />
                     Pagar R${" "}
                     {selectedPlan?.price.toFixed(2)
                        ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(selectedPlan.price)
                        : ""}
                  </Button>
               </CardFooter>
            </Card>
         </div>
      </div>
   );
}

function Resume({
   plans,
   selectedPlan,
   handlePlanChange,
   company,
}: {
   plans: Plan[];
   company: Company | null;
   selectedPlan: Plan | undefined;
   handlePlanChange: (value: string) => void;
}) {
   return (
      <Card className="h-fit shadow-sm border-muted-foreground/10 pb-0">
         <CardHeader>
            <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
            <CardDescription>Confira os detalhes da sua assinatura</CardDescription>
         </CardHeader>

         <CardContent className="space-y-6">
            {/* Informações da Empresa */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
               <img
                  src={company?.img}
                  alt="Logo da Empresa"
                  className="rounded-lg object-cover border w-24 h-24 shadow-sm"
                  loading="lazy"
               />

               <div className="space-y-1.5 text-sm">
                  <h3 className="font-semibold text-lg text-foreground">{company?.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <MapPin className="h-4 w-4" />
                     <span>{company?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Phone className="h-4 w-4" />
                     <span>{company?.phone}</span>
                  </div>
               </div>
            </div>

            <Separator />

            {/* Seleção do Plano */}
            <div className="space-y-2">
               <Label>Plano Selecionado</Label>
               <Select onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-full bg-background">
                     <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                     {plans.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                           {plan.label} - R${" "}
                           {new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(plan.price)}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </CardContent>

         <CardFooter className="bg-muted/30 p-6 flex sm:flex-row justify-between items-start gap-4 rounded-b-xl border-t">
            <div className="text-sm text-muted-foreground">
               Duração: <br />
               <span className="font-medium text-foreground">
                  {selectedPlan?.duration ?? "-"}{" "}
                  {!!selectedPlan?.duration && selectedPlan?.duration > 1 ? "meses" : "mês"}
               </span>
            </div>

            <div className="text-right">
               <span className="text-xs text-muted-foreground block">Valor Total</span>
               <span className="text-3xl font-bold text-primary">
                  {selectedPlan?.price.toFixed(2)
                     ? `R$ ${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(selectedPlan.price)}`
                     : "-"}
               </span>
            </div>
         </CardFooter>
      </Card>
   );
}

function CheckoutForm({ selectedPlan, register }: { selectedPlan?: Plan; register: any }) {
   return (
      <Accordion type="single" collapsible defaultValue="dados-pessoais" className="w-full space-y-2">
         {/* Item 1: Dados Pessoais */}
         <AccordionItem value="dados-pessoais" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <User className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Dados Pessoais</Label>
               </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 px-2 pb-6 space-y-4">
               <div className="grid gap-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Ex: João da Silva" {...register("nome_aluno")} />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="email">E-mail</Label>
                     <Input id="email" type="email" placeholder="seu@email.com" {...register("email_aluno")} />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="telefone">Telefone</Label>
                     <Input id="telefone" placeholder="(00) 00000-0000" {...register("telefone_aluno")} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="cpf">CPF</Label>
                     <Input id="cpf" placeholder="000.000.000-00" {...register("cpf_aluno")} />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="rg">RG</Label>
                     <Input id="rg" {...register("rg_aluno")} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                     <Label>Nascimento</Label>
                     <Input type="date" {...register("data_nascimento_aluno")} />
                  </div>
                  <div className="grid gap-2">
                     <Label>Gênero</Label>
                     <Select>
                        <SelectTrigger>
                           <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="masculino">Masculino</SelectItem>
                           <SelectItem value="feminino">Feminino</SelectItem>
                           <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </AccordionContent>
         </AccordionItem>

         {/* Item 2: Endereço */}
         <AccordionItem value="endereco" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <Building2 className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Endereço de Cobrança</Label>
               </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 px-2 pb-6 space-y-4">
               <div className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="cep">CEP</Label>
                     <Input id="cep" placeholder="00000-000" {...register("cep_aluno")} />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="cidade">Cidade</Label>
                     <Input id="cidade" {...register("cidade_aluno")} />
                  </div>
               </div>

               <div className="grid grid-cols-[1fr_100px] gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="rua">Logradouro</Label>
                     <Input id="rua" placeholder="Rua, Avenida..." {...register("rua_aluno")} />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="num">Número</Label>
                     <Input id="num" {...register("numero_aluno")} />
                  </div>
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" placeholder="Estado" {...register("estado_aluno")} />
               </div>
            </AccordionContent>
         </AccordionItem>

         {/* Item 3: Pagamento (Exemplo Adicional) */}
         <AccordionItem value="pagamento" className="border rounded-lg px-4 bg-background">
            <AccordionTrigger className="hover:no-underline py-4">
               <div className="flex items-center gap-2 text-left">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Pagamento</Label>
               </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 px-2 pb-6 text-sm text-muted-foreground">
               <RadioGroup className="mt-4 space-y-2" defaultValue="monthly">
                  {!!selectedPlan?.duration && selectedPlan?.duration > 1 && selectedPlan?.allowMonthly && (
                     <FieldLabel htmlFor="plan-0">
                        <Field orientation="horizontal">
                           <FieldContent>
                              <FieldTitle>
                                 <RotateCcw size={15} color="green" />
                                 Recorrência
                              </FieldTitle>
                              <FieldDescription>
                                 Pagamento da fatura mensal
                                 <p className="m-0 text-[10px]">(Automático para cartão)</p>
                              </FieldDescription>
                           </FieldContent>
                           <RadioGroupItem value="monthly" id="plan-0" />
                        </Field>
                     </FieldLabel>
                  )}

                  <FieldLabel htmlFor="plan-1">
                     <Field orientation="horizontal">
                        <FieldContent>
                           <FieldTitle>
                              <Coins size={15} color="green" />Á vista
                           </FieldTitle>
                           <FieldDescription>Pagamento do valor total á vista</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="cash" id="plan-1" />
                     </Field>
                  </FieldLabel>

                  {selectedPlan?.max_installments && selectedPlan?.max_installments > 1 && (
                     <FieldLabel htmlFor="plan-2">
                        <Field orientation="horizontal">
                           <FieldContent>
                              <FieldTitle>
                                 <CreditCard size={15} color="green" />
                                 Parcelado
                              </FieldTitle>
                              <FieldDescription>
                                 Parcelamento em até {selectedPlan?.max_installments}x sem juros
                              </FieldDescription>
                           </FieldContent>
                           <RadioGroupItem value="installments" id="plan-2" />
                        </Field>
                     </FieldLabel>
                  )}
               </RadioGroup>
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   );
}
