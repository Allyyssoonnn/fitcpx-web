import { getDuePayments } from "@/api/contracts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DuePaymentsDash() {
   const navigate = useNavigate();

   const { data: duePayments } = useQuery({
      queryKey: "duePayments",
      queryFn: getDuePayments,
      initialData: [],
   });

   return (
      <Alert
         onClick={() => navigate("/financeOverview")}
         className="cursor-pointer"
         variant={duePayments.length > 0 ? "destructive" : "default"}
      >
         <InfoIcon />
         <AlertTitle>Pagamentos Vencidos</AlertTitle>
         <AlertDescription>{duePayments.length}</AlertDescription>
      </Alert>
   );
}
