import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type Options = {
   value: string;
   label: string;
};

type FitComboBoxProps = {
   name: string;
   options: Options[];
   placeHolder?: string;
   value?: string | null; // Aceita null explicitamente
   onChange?: (value: string) => void;
};

export default function FitComboBox({ name, options = [], placeHolder, value, onChange }: FitComboBoxProps) {
   const [open, setOpen] = React.useState(false);

   // Garante que se vier null/undefined, vira string vazia.
   // Se vier número, vira string.
   const valueComp = useMemo(() => (value ? String(value) : ""), [value]);

   const optionsMemo = useMemo(() => options, [options]);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild id={name}>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between" // w-full ao invés de w-[100%]
            >
               {valueComp
                  ? optionsMemo.find((framework) => framework.value === valueComp)?.label
                  : (placeHolder ?? "Selecione um item")}
               <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>

         {/* w-[--radix-popover-trigger-width] garante que a lista tenha a mesma largura do botão */}
         <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command
               // Sua lógica de filtro customizada estava boa, mantive ajustada
               filter={(value, search) => {
                  const normalize = (str: string) =>
                     str
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                  const normalizedValue = normalize(value);
                  const normalizedSearch = normalize(search);

                  return normalizedSearch.split(/\s+/).every((word) => normalizedValue.includes(word)) ? 1 : 0;
               }}
            >
               <CommandInput placeholder="Pesquisa..." />
               <CommandList>
                  <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                  <CommandGroup>
                     {optionsMemo.map((framework) => (
                        <CommandItem
                           key={framework.value}
                           // Importante: Passamos o label aqui para a busca funcionar visualmente
                           value={framework.label}
                           onSelect={(currentValue) => {
                              // CORREÇÃO CRÍTICA:
                              // Comparamos normalizando para minúsculo, pois o currentValue vem minúsculo
                              const item = optionsMemo.find(
                                 (v) => v.label.toLowerCase() === currentValue.toLowerCase(),
                              );

                              if (item) {
                                 const newValue = item.value === valueComp ? "" : item.value;
                                 onChange?.(newValue);
                                 setOpen(false);
                              }
                           }}
                        >
                           <CheckIcon
                              className={cn(
                                 "mr-2 h-4 w-4",
                                 valueComp === framework.value ? "opacity-100" : "opacity-0",
                              )}
                           />
                           {framework.label}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
