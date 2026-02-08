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

type ListComponentVisiblesProps = {
   options: { label: string; value: string }[];
   prefixLocalStorage: string;
   setColumnFilters?: (prev: any) => any;
   filterId?: string;
};

export default function ListComponentVisibles({
   options,
   prefixLocalStorage,
   setColumnFilters,
   filterId = "status_aluno_contrato_pagamento",
}: ListComponentVisiblesProps) {
   const [visibleFields, setVisibleFields] = useState(() => {
      const saved: Record<string, boolean> = {};
      options.forEach((option) => {
         // Se existir no localStorage, usa o valor (parseando se for string), senão true
         const stored = localStorage.getItem(`${prefixLocalStorage}-${option.value}`);
         saved[option.value] = stored ? false : true;
      });
      return saved;
   });

   useEffect(() => {
      options.forEach((option) => {
         if (visibleFields[option.value]) {
            localStorage.removeItem(`${prefixLocalStorage}-${option.value}`);
         } else {
            localStorage.setItem(`${prefixLocalStorage}-${option.value}`, "true");
         }
      });
   }, [visibleFields]);

   useEffect(() => {
      // Filtra apenas as chaves que estão true E QUE NÃO SÃO "all"
      const activeStatuses = Object.keys(visibleFields).filter((key) => visibleFields[key] === true && key !== "all");
      if (!setColumnFilters) return;

      setColumnFilters((prev: any) => {
         const otherFilters = prev.filter((f: any) => f.id !== filterId);
         return [...otherFilters, { id: filterId, value: activeStatuses }];
      });
   }, [visibleFields, filterId]);

   const handleCheckboxChange = (key: string, checked: boolean) => {
      setVisibleFields((prev) => {
         const newState = { ...prev, [key]: checked };

         if (key === "all") {
            // Caso 1: Clicou em "Todos" -> Marca/Desmarca todo mundo
            options.forEach((f) => (newState[f.value] = checked));
         } else {
            // Caso 2: Clicou em um item individual
            // Vamos verificar se AGORA todos os itens (exceto "all") estão true
            const allIndividualStatus = options.filter((f) => f.value !== "all");

            // Verifica se todos da lista estão true no novo estado
            const allChecked = allIndividualStatus.every((f) => newState[f.value] === true);

            newState["all"] = allChecked;
         }
         return newState;
      });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="max-w-sm">
            <Button variant="outline">
               <Eye />
               Exibição
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status Visíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {options.map((option) => (
               <DropdownMenuCheckboxItem
                  onSelect={(e) => e.preventDefault()}
                  key={option.value}
                  checked={visibleFields[option.value]}
                  onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
               >
                  {option.label}
               </DropdownMenuCheckboxItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
