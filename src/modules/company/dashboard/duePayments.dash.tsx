import { getDuePayments } from "@/api/contracts";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DuePaymentsDash() {
   const navigate = useNavigate();

   const { data: duePayments } = useQuery({
      queryKey: ["duePayments"],
      queryFn: getDuePayments,
      initialData: [],
   });

   const totalDuePayments =
      duePayments.reduce((acc, payment) => acc + payment.valor_aluno_contrato_pagamento || 0, 0) || 0;

   if (duePayments.length === 0) {
      return (
         <Alert className="w-full border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50">
            <AlertTriangleIcon />
            <AlertTitle>Nenhum pagamento vencido esse mês</AlertTitle>
            <AlertDescription>
               Nenhum pagamento está vencido no momento. Todos os pagamentos estão em dia.
            </AlertDescription>
         </Alert>
      );
   }

   return (
      <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
         <AlertTriangleIcon />
         <AlertTitle>Atenção: Você tem {duePayments.length} pagamentos vencidos.</AlertTitle>
         <AlertDescription>
            O valor total é de
            <span className="text-red-500 ms-1 font-bold">
               R$ {totalDuePayments.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            .
         </AlertDescription>
         <AlertAction>
            <Button size="sm" variant="ghost" onClick={() => navigate("/financeOverview?filter=overdue")}>
               Ver pagamentos
            </Button>
         </AlertAction>
      </Alert>
   );
}
