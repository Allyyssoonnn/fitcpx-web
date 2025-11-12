"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

interface NumberInputProps {
   value?: number | "";
   defaultValue?: number;
   min?: number;
   max?: number;
   step?: number;
   className?: string;
   onChange?: (value: number | "") => void;
   disabled?: boolean;
   prefix?: string;
}

export function NumberInputUI({
   value,
   defaultValue = 0,
   min = 0,
   max = Infinity,
   step = 1,
   className,
   disabled,
   onChange,
   prefix,
}: NumberInputProps) {
   const isControlled = value !== undefined;
   // const [internalValue, setInternalValue] = React.useState(defaultValue);
   const [internalValue, setInternalValue] = React.useState<number | "">(defaultValue);

   const currentValue = isControlled ? value : internalValue;

   const handleChange = (newVal: number | "") => {
      if (newVal !== "" && (newVal < min || newVal > max)) return;
      if (onChange) onChange(newVal);
      setInternalValue(newVal);
   };

   const increase = () => {
      const num = currentValue === "" ? 0 : currentValue;
      handleChange(num + step);
   };

   const decrease = () => {
      const num = currentValue === "" ? 0 : currentValue;
      handleChange(num - step);
   };

   return (
      <ButtonGroup className={cn("w-full", className)}>
         <InputGroup>
            {prefix && <InputGroupAddon align="inline-end">{prefix}</InputGroupAddon>}
            <InputGroupInput
               type="number"
               min={min}
               max={max}
               step={step}
               disabled={disabled}
               className={cn(
                  "text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
               )}
               // value={currentValue}
               value={currentValue === undefined ? "" : currentValue}
               // onChange={(e) => handleChange(Number(e.target.value))}
               onChange={(e) => {
                  const val = e.target.value;
                  handleChange(val === "" ? "" : Number(val));
               }}
            />
         </InputGroup>

         <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrease}
            aria-label="Diminuir"
            disabled={disabled || (currentValue !== "" && Number(currentValue) <= min)}
         >
            <Minus />
         </Button>

         <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={increase}
            aria-label="Aumentar"
            disabled={disabled || (currentValue !== "" && Number(currentValue) >= max)}
         >
            <Plus />
         </Button>
      </ButtonGroup>
   );
}
