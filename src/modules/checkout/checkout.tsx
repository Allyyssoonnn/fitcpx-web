import { get } from "@/api/api";
import { getCheckoutInfo } from "@/api/companies";
import { onlineContract } from "@/api/contracts";
import { verifyExists } from "@/api/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeCep, normalizeCpf, normalizePhone, searchCEP } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod"; // Importante
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Importante: Controller
import { CheckoutForm } from "./components/CheckoutForm";
import { modalConfirmContract } from "./components/confirmContract";
import { Resume } from "./components/resume";
import { CheckoutFormValues, checkoutSchema } from "./schema";
import { Company, Plan } from "./types";

export default function Checkout() {
   const params = new URLSearchParams(window.location.search);
   const sToken = params.get("s");

   const [company, setCompany] = useState<Company | null>(null);
   const [plans, setPlans] = useState<Plan[]>([]);
   const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
   const [companyNotFound, setCompanyNotFound] = useState(false);
   const [companyId, setCompanyId] = useState();
   const [planId, setplanId] = useState();
   const [studentId, setStudentId] = useState();
   const [allowSelectPlan, setAllowSelectPlan] = useState(true);

   useQuery({
      queryKey: ["checkout-info", sToken],
      queryFn: async () => {
         if (!sToken) return;
         const response = (await getCheckoutInfo(sToken)) as any;

         if (response.companyId) setCompanyId(response.companyId);
         if (response.planId) {
            setplanId(response.planId);
            setAllowSelectPlan(false);
         }
         if (response.setStudentId) setStudentId(response.setStudentId);

         if (response?.student) {
            const student = response?.student;

            setValue("telefone_aluno", normalizePhone(student.telefone_aluno));
            setValue("cpf_aluno", normalizeCpf(student.cpf_aluno));
            setValue("cep_aluno", normalizeCep(student.cep_aluno));

            setValue("nome_aluno", student.nome_aluno);
            setValue("email_aluno", student.email_aluno);
            setValue("data_nascimento_aluno", student.data_nascimento_aluno);
            setValue("sexo_aluno", student.sexo_aluno);
            setValue("cidade_aluno", student.cidade_aluno);
            setValue("endereco_aluno", student.endereco_aluno);
            setValue("bairro_aluno", student.bairro_aluno);
            setValue("numero_aluno", student.numero_aluno);
            setValue("estado_aluno", student.estado_aluno);
         }
      },
      enabled: !!sToken,
   });

   // --- 2. Configuração do Hook Form com Zod ---
   const {
      handleSubmit,
      control,
      setValue,
      formState: { errors },
      watch,
      setFocus,
      clearErrors,
   } = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
         // É CRUCIAL inicializar tudo com string vazia para evitar erro de "undefined"
         nome_aluno: "",
         email_aluno: "",
         telefone_aluno: "",
         cpf_aluno: "",
         data_nascimento_aluno: "",
         sexo_aluno: "",
         cep_aluno: "",
         cidade_aluno: "",
         endereco_aluno: "",
         bairro_aluno: "",
         numero_aluno: "",
         estado_aluno: "",
         metodo_pagamento: "monthly", // Este já tem um valor válido por padrão
         metodo_recorrencia: "monthly_card",
      },
   });

   const { isLoading } = useQuery({
      queryKey: ["company-details", companyId],
      queryFn: async () => {
         const response = await get(`/companies/getCompanyAndPlans?companyId=${companyId}`);
         if (!response?.company?.companyId) setCompanyNotFound(true);
         setCompany(response?.company ?? { name: "-", address: "-", phone: "-", img: "-" });
         setPlans(response?.plans ?? []);
         if (planId) {
            const planPreSelected = (response?.plans ?? []).find((plan: any) => plan.value == planId);
            if (planPreSelected) setSelectedPlan(planPreSelected);
            if (planPreSelected.allowMonthly) setValue("metodo_pagamento", "monthly");
            else setValue("metodo_pagamento", "cash");
         }
      },
      enabled: !!companyId,
   });

   const cepValue = watch("cep_aluno");

   useEffect(() => {
      const handleSearch = async () => {
         const cepLimpo = cepValue?.replace(/\D/g, "") ?? "";

         if (cepLimpo.length === 8) {
            try {
               const data = (await searchCEP(cepLimpo)) as any;

               if (!data || data.erro) return;

               if (data.city) setValue("cidade_aluno", data.city, { shouldValidate: true });
               if (data.neighbord) setValue("bairro_aluno", data.neighbord, { shouldValidate: true });
               if (data.state) setValue("estado_aluno", data.state, { shouldValidate: true });
               if (data.address) setValue("endereco_aluno", data.address, { shouldValidate: true });

               // Garante que o erro do campo CEP suma imediatamente
               clearErrors("cep_aluno");

               setTimeout(() => setFocus("numero_aluno"), 100);
            } catch (error) {
               console.error("Failed to fetch CEP:", error);
            }
         }
      };

      handleSearch(); // Execute it
   }, [cepValue, setValue, setFocus]); // Added setFocus to dependencies for safety

   function handlePlanChange(value: string) {
      const plan = plans.find((p) => p.value === value);
      setSelectedPlan(plan);

      // Resetar metodo de pagamento se o plano mudar para evitar opções inválidas
      if (plan) {
         if (plan.allowMonthly) setValue("metodo_pagamento", "monthly");
         else setValue("metodo_pagamento", "cash");
      }
   }

   // ... imports e setup do hook form

   // --- 3. Função de Submit ---
   async function onSubmit(data: CheckoutFormValues) {
      if (!selectedPlan) return;

      // 1. Prepara os dados brutos (Payload para criar aluno se necessário)
      const rawPayload = {
         ...data,
         cpf_aluno: data.cpf_aluno.replace(/\D/g, ""),
         telefone_aluno: data.telefone_aluno.replace(/\D/g, ""),
         cep_aluno: data.cep_aluno.replace(/\D/g, ""),
         cod_contrato: selectedPlan.contractId, // Supondo que venha daqui
         cod_empresa: companyId,
      };

      // 2. Prepara os dados do plano para exibição e envio
      const planData = {
         cod_plano: selectedPlan.value,
         nome_plano: selectedPlan.label,
         valor_total: selectedPlan.price,
         cod_contrato: selectedPlan.contractId,
         cod_empresa: companyId,
         metodo_recorrencia: data.metodo_recorrencia,
         metodo_pagamento: data.metodo_pagamento,
         parcelas: data.metodo_pagamento === "installments" ? data.parcelas : undefined,
      };

      // 3. Verifica se o aluno já existe (Verificação assíncrona)
      let existingStudent = null;
      try {
         // Adicionei um loading visual aqui se precisar, ou deixe transparente
         existingStudent = await verifyExists({
            email: data.email_aluno,
            cpf: rawPayload.cpf_aluno,
            companyId,
         });
      } catch (error) {
         console.error("Erro ao verificar aluno", error);
         // Decida se para o fluxo ou continua como novo aluno
      }

      // O objeto final do aluno será o existente OU o payload do formulário
      var finalStudentData = existingStudent?.cod_aluno ? { ...existingStudent, ...rawPayload } : rawPayload;
      if (studentId && !finalStudentData.cod_aluno) finalStudentData.cod_aluno = studentId;

      // 4. ABRE O MODAL
      // Passamos a lógica da API dentro da prop 'onConfirm'
      modalConfirmContract.show({
         student: finalStudentData,
         plan: planData,
         onConfirm: async () => {
            // Esta função só roda quando o usuário clica em "Confirmar" dentro do modal
            if (!companyId) return;

            // Chama sua API final
            const response = await onlineContract(companyId, finalStudentData, planData);

            // Debug para garantir que está vindo
            console.log("Resposta da API:", response);

            // 2. Monta os parâmetros
            const paramsObj: any = {
               nome: finalStudentData.nome_aluno,
               email: finalStudentData.email_aluno,
            };

            // Se a API retornou o link da fatura (Boleto/Pix), adiciona aos params
            // Ajuste 'response.invoiceUrl' para o campo correto que sua API retorna
            if (response?.url) {
               paramsObj.faturaUrl = response.url;
            }

            if (response?.contractURL) {
               paramsObj.contractURL = response.contractURL;
            }

            // 3. Serializa e redireciona
            const searchParams = new URLSearchParams(paramsObj).toString();
            // http://localhost:5173/successPage?nome=Fit+Student&email=fitcomplex%40fitcpx.com&faturaUrl=https%3A%2F%2Fsandbox.asaas.com%2Fi%2Fz10x3ez4jsu21r4m&faturaAdicionalUrl=undefined
            window.location.href = `/successPage?${searchParams}`;
         },
      });
   }

   if (isLoading) {
      return (
         <div className="min-h-svh flex items-center justify-center">
            <span className="text-muted-foreground">Carregando...</span>
         </div>
      );
   }
   // localhost:5173/checkout?token=1109-001-2001
   if (companyNotFound) {
      return (
         <div className="min-h-svh bg-accent p-4 md:p-8 flex items-center justify-center">
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-lg shadow-lg text-center min-w-xs">
               <p className="font-semibold mb-1">Empresa não encontrada</p>
               <p className="text-sm">solicite um link correto para contratar um plano.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-svh bg-accent p-4 md:p-8 flex items-start justify-center">
         <div className="grid w-full max-w-6xl items-start gap-6 lg:grid-cols-2">
            <Resume
               plans={plans}
               selectedPlan={selectedPlan}
               handlePlanChange={handlePlanChange}
               company={company}
               allowSelectPlan={allowSelectPlan}
            />

            <Card className="shadow-sm border-muted-foreground/10 relative overflow-hidden">
               {/* Overlays de bloqueio (mantidos do original) */}
               {!selectedPlan && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-6 transition-all">
                     <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-lg shadow-lg text-center max-w-xs">
                        <p className="font-semibold mb-1">Aguardando Seleção</p>
                        <p className="text-sm">Selecione um plano no resumo para desbloquear.</p>
                     </div>
                  </div>
               )}

               <CardHeader>
                  <CardTitle className="text-xl">Finalizar Pagamento</CardTitle>
                  <CardDescription>Preencha seus dados com segurança.</CardDescription>
               </CardHeader>

               <CardContent>
                  {/* Envolvemos o formulário aqui */}
                  <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                     <CheckoutForm selectedPlan={selectedPlan} control={control} errors={errors} />
                  </form>
               </CardContent>

               <CardFooter>
                  {/* O botão deve ter type="submit" e estar ligado ao form */}
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
               </CardFooter>
            </Card>
         </div>
      </div>
   );
}
