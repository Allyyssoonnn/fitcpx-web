import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type ListComponentFilterProps = {
   type: "select" | "switch";
   options?: { label: string; value: string }[];
   name?: string;
   value?: string | boolean;
   onChange?: (value: string | boolean) => void;
};

export default function ListComponentFilter({ type, options, name, value, onChange }: ListComponentFilterProps) {
   if (type === "select") {
      return (
         <div className="flex-between grid grid-cols-2">
            <label htmlFor={name}>{name}</label>

            <Select value={value as string} onValueChange={onChange}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder={name} />
               </SelectTrigger>

               <SelectContent>
                  {options?.map((option) => (
                     <SelectItem key={option.value} value={option.value}>
                        {option.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>
      );
   }

   if (type === "switch") {
      return (
         <div className="flex-between grid grid-cols-2">
            <label htmlFor={name}>{name}</label>
            <div className="flex justify-end items-center">
               <Switch id={name} checked={value as boolean} onCheckedChange={(checked) => onChange?.(checked)} />
            </div>
         </div>
      );
   }

   return null;
}
