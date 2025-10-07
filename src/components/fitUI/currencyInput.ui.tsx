import React, { KeyboardEvent, useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";

type CurrencyInputProps<T extends FieldValues = any> = {
   id?: string;
   name?: string;
   nameField?: string;
   control?: Control<T>;
   placeholder?: string;
   rules?: object;
   value?: number | null;
   onChange?: (value: number | null) => void;
   onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
   onKeyDown?: (e: KeyboardEvent<HTMLInputElement>, value?: number | null) => void;
   style?: React.CSSProperties;
   autoFocus?: boolean;
   disabled?: boolean;
};

function CurrencyInput<T extends FieldValues>({
   id = "",
   name = "",
   control,
   placeholder = "R$ 0,00",
   rules,
   value,
   onChange,
   onBlur,
   onKeyDown,
   style,
   autoFocus = false,
   disabled = false,
}: CurrencyInputProps<T>) {
   const [localValue, setLocalValue] = useState<number | null>(value ?? null);

   useEffect(() => {
      // if (!control) return;
      setLocalValue(value ?? null);
   }, [value, control]);

   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, current: number | null) => {
      if (onKeyDown) onKeyDown(e, current);
   };

   if (control && name) {
      return (
         <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
               <>
                  <NumericFormat
                     id={id}
                     placeholder={placeholder}
                     className={fieldState.error ? " is-invalid" : ""}
                     thousandSeparator="."
                     decimalSeparator=","
                     prefix="R$ "
                     decimalScale={2}
                     fixedDecimalScale
                     allowNegative={false}
                     value={field.value ?? ""}
                     onValueChange={(values) => {
                        field.onChange(values.floatValue ?? null);
                     }}
                     onBlur={onBlur ?? field.onBlur}
                     name={field.name}
                     style={style}
                     autoFocus={autoFocus}
                     onKeyDown={(e) => handleKeyDown(e, field.value)}
                     customInput={Input}
                  />
                  {fieldState.error && <div className="invalid-feedback">{fieldState.error.message}</div>}
               </>
            )}
         />
      );
   }

   // Standalone (sem react-hook-form)
   return (
      <NumericFormat
         disabled={disabled}
         placeholder={placeholder}
         thousandSeparator="."
         decimalSeparator=","
         prefix="R$ "
         decimalScale={2}
         fixedDecimalScale
         allowNegative={false}
         value={localValue ?? ""}
         onValueChange={(values) => {
            const val = values.floatValue ?? null;
            setLocalValue(val);
            onChange?.(val);
         }}
         onBlur={onBlur}
         name={name}
         style={style}
         autoFocus={autoFocus}
         onKeyDown={(e) => handleKeyDown(e, localValue)}
         customInput={Input}
      />
   );
}

export default CurrencyInput;
