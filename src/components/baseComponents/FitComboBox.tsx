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
   value?: string;
   onChange?: (value: string) => void;
};

export default function FitComboBox({ name, options = [], placeHolder, value, onChange }: FitComboBoxProps) {
   const [open, setOpen] = React.useState(false);
   const [valueComp, setValueComp] = React.useState(String(value));

   React.useEffect(() => {
      setValueComp(String(value));
   }, [value]);

   const optionsMemo = useMemo(() => options, [options]);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               name={name}
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-[100%] justify-between"
            >
               {valueComp
                  ? optionsMemo.find((framework) => framework.value === valueComp)?.label
                  : placeHolder ?? "Selecione um item"}
               <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[100%] p-0">
            <Command>
               <CommandInput name={`input-${name}`} placeholder="Pesquisa" />
               <CommandList>
                  <CommandEmpty>Nenhum item encontrado</CommandEmpty>
                  <CommandGroup>
                     {optionsMemo.map((framework) => (
                        <CommandItem
                           key={framework.value}
                           value={framework.label}
                           onSelect={(currentValue) => {
                              let item = optionsMemo.find((v) => v.label === currentValue) as any;
                              setValueComp(item?.value === valueComp ? "" : item.value);
                              onChange?.(item?.value === valueComp ? "" : item.value);
                              setOpen(false);
                           }}
                        >
                           <CheckIcon
                              className={cn(
                                 "mr-2 h-4 w-4",
                                 valueComp === framework.value ? "opacity-100" : "opacity-0"
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
