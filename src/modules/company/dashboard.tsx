import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import AppMarketingDash from "./dashboard/AppMarketing.dash";
import DuePaymentsDash from "./dashboard/duePayments.dash";
import OlderPhysicalDash from "./dashboard/olderPhysical.dash";
import OverviewDash from "./dashboard/overview.dash";
import TourDash from "./dashboard/tour.dash";

const fields = [
   { key: "overview", label: "Totais" },
   { key: "tours", label: "Tutoriais" },
   { key: "duepayments", label: "Pagamentos" },
   { key: "physical", label: "Avaliações" },
   { key: "apps", label: "Aplicativos" },
];

function Dashboard() {
   // Inicializa o estado com base no localStorage
   const [visibleFields, setVisibleFields] = useState(() => {
      const saved: Record<string, boolean> = {};
      fields.forEach((field) => {
         saved[field.key] = localStorage.getItem(`hidden-${field.key}`) ? false : true;
      });
      return saved;
   });

   // Atualiza localStorage sempre que visibleFields mudar
   useEffect(() => {
      fields.forEach((field) => {
         if (visibleFields[field.key]) {
            localStorage.removeItem(`hidden-${field.key}`);
         } else {
            localStorage.setItem(`hidden-${field.key}`, "true");
         }
      });
   }, [visibleFields]);

   const handleCheckboxChange = (key: string, checked: boolean) => {
      setVisibleFields((prev) => ({ ...prev, [key]: checked }));
   };

   return (
      <div className="container-fluid">
         <div className="d-flex justify-end mb-3">
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Button variant="outline">
                     <Eye />
                     Exibir campos
                  </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Campos</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fields.map((field) => (
                     <DropdownMenuCheckboxItem
                        key={field.key}
                        checked={visibleFields[field.key]}
                        onCheckedChange={(checked) => handleCheckboxChange(field.key, checked as boolean)}
                     >
                        {field.label}
                     </DropdownMenuCheckboxItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         {visibleFields.overview && <OverviewDash />}

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="flex flex-col lg:col-span-2 gap-4">
               {visibleFields.tours && <TourDash />}
               {visibleFields.apps && <AppMarketingDash />}
            </div>

            <div className="flex flex-col lg:col-span-2 gap-4">
               {visibleFields.duepayments && <DuePaymentsDash />}
               {visibleFields.physical && <OlderPhysicalDash />}
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
