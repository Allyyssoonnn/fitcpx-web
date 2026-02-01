import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeCep, normalizeCpf, normalizePhone } from "@/utils/utils";
import { Control, Controller } from "react-hook-form";

type MaskType = "cpf" | "phone" | "cep";

interface FormInputProps extends React.ComponentProps<typeof Input> {
   control: Control<any>;
   name: string;
   description?: string;
   label: string;
   error?: string;
   mask?: MaskType;
}

const maskFunctions: Record<MaskType, (v: string) => string> = {
   cpf: normalizeCpf,
   phone: normalizePhone,
   cep: normalizeCep,
};

export function FormInput({ control, name, description, label, error, mask, ...props }: FormInputProps) {
   return (
      <div className="grid gap-2">
         <Label htmlFor={name}>{label}</Label>

         <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value, onBlur, ref } }) => (
               <Input
                  {...props}
                  id={name}
                  ref={ref}
                  onBlur={onBlur}
                  value={value || ""}
                  onChange={(e) => {
                     const rawValue = e.target.value;
                     // Se tiver máscara, aplica. Se não, usa o valor puro.
                     const finalValue = mask ? maskFunctions[mask](rawValue) : rawValue;
                     onChange(finalValue);
                  }}
                  className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
               />
            )}
         />

         {!error && description && <Label className="text-muted text-[10px] ms-2">{description}</Label>}
         {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
   );
}
