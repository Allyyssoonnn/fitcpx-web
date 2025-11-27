"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Mic, Minus, Plus } from "lucide-react";
import * as React from "react";
import { NumericFormat } from "react-number-format";
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
               value={currentValue === undefined ? "" : currentValue}
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

interface MediaInputUIProps {
   field: string;
   register?: any;
   whatch?: any;
   setValue: (field: string, value: any) => void;
   startSpeechRecognition?: any;
   type?: "default" | "media";
   defaultValue?: any;
   inputId?: string;
   className?: string;
   required?: boolean;
}

export const MediaInputUI = ({
   field,
   register,
   whatch,
   setValue,
   startSpeechRecognition,
   type = "default",
   defaultValue,
   inputId,
   className,
   required,
}: MediaInputUIProps) => {
   const valueWatch = whatch?.(field);

   const [value1, setValue1] = React.useState("");
   const [value2, setValue2] = React.useState("");
   const [value3, setValue3] = React.useState("");
   const [again, setAgain] = React.useState(false);
   const [media, setMedia] = React.useState("");

   React.useEffect(() => {
      setMedia(defaultValue);
   }, [defaultValue]);

   React.useEffect(() => {
      if (valueWatch) setMedia(valueWatch);
   }, [valueWatch]);

   // Calcula a média quando os valores 1 ou 2 mudam
   React.useEffect(() => {
      //Se metodo for media e existir os 2 valor vai calcular
      if (type === "media" && value1 && value2) {
         setMedia(((parseFloat(value1) + parseFloat(value2)) / 2).toFixed(1));
         setValue(field, ((parseFloat(value1) + parseFloat(value2)) / 2).toFixed(1));
         const diff = Math.abs(parseFloat(value1) - parseFloat(value2));

         if (diff > 1 && value3) {
            const att = calculate(value1, value2, value3);
            setMedia(att);
            setValue(field, att);
         }
         setAgain(diff > 1);
      } else setAgain(false);
   }, [value1, value2, value3, type]);

   function changeValue(v: any) {
      setMedia(v);
      setValue(field, v);
   }

   return (
      <div>
         <ButtonGroup className={cn("w-full", className)}>
            <InputGroup>
               {type === "media" && (
                  <>
                     <NumericFormat
                        className={cn(
                           "h-full w-full border-e-2 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        )}
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                     />
                     <NumericFormat
                        className={cn(
                           "h-full w-full border-e-2 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        )}
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                     />
                     {again && (
                        <NumericFormat
                           className={cn(
                              "h-full w-full border-e-2 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                           )}
                           value={value3}
                           onChange={(e) => setValue3(e.target.value)}
                        />
                     )}
                  </>
               )}

               <NumericFormat
                  {...register(field, { required: required })}
                  disabled={type === "media"}
                  id={inputId}
                  value={media}
                  className={cn(
                     "h-full w-full text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                     type === "media" ? "bg-accent" : ""
                  )}
                  onChange={(e) => {
                     const val = e.target.value;
                     changeValue(val === "" ? "" : Number(val));
                  }}
               />
            </InputGroup>

            {type === "default" && !!startSpeechRecognition && (
               <Button type="button" variant="outline" onClick={() => startSpeechRecognition(field)}>
                  <Mic color="green" />
               </Button>
            )}
         </ButtonGroup>

         {!!again && (
            <div id="mediahelp" className="form-text">
               3º medida necessária
            </div>
         )}
      </div>
   );
};

function calculate(num1: any, num2: any, num3: any) {
   const numeros = [num1, num2, num3];

   // Verifica se há números repetidos
   if (numeros.some((num, index) => numeros.indexOf(num) !== index)) {
      // Se houver, retorna o primeiro número repetido encontrado
      return numeros.find((num, index) => numeros.indexOf(num) !== index);
   }

   // Se não houver repetidos, calcula a mediana
   const numerosOrdenados = numeros.sort((a, b) => a - b);
   return numerosOrdenados[1];
}
