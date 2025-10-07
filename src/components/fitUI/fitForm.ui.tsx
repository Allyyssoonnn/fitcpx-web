import React from "react";
import { useFormContext } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PhoneInput } from "./phoneInput.ui";

type BackBoxUIType = {
   errors: any;
   fields: BackBoxUIGridType[];
};

type BackBoxUIFieldType = {
   id?: string;
   label: string;
   description?: string;
   options?: Options;
   fieldName: string;
   type?: "input" | "select" | "phone";
   format?: "documentId" | "CEP";
   selectOptions?: SelectOption[] | string[];
   inputType?: React.ComponentProps<"input">["type"];
   Component?: React.Component;
};

type Options = {
   required?: boolean;
   disabled?: boolean;
   maxLength?: number;
   minLength?: number;
};

type SelectOption = {
   label: string;
   value: string;
};

type BackBoxUIGridType = {
   title?: "";
   separator?: boolean;
   cols: number;
   fields: BackBoxUIFieldType[];
};

export const getNestedError = (obj: any, path: string) => {
   if (!path) return null;
   return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

function FitFormUI({ fields, errors }: BackBoxUIType) {
   const { setValue, register, watch } = useFormContext?.() ?? {};

   return (
      <FieldSet className="d-flex g-3">
         {fields.map((grid, index) => {
            const lgMap = {
               1: "lg:grid-cols-1",
               2: "lg:grid-cols-2",
               3: "lg:grid-cols-3",
               4: "lg:grid-cols-4",
               5: "lg:grid-cols-5",
               6: "lg:grid-cols-6",
            } as any;
            const lgClass = lgMap[grid.cols] ?? "lg:grid-cols-3";

            return (
               <React.Fragment>
                  {grid.title && <FieldLegend>{grid.title}</FieldLegend>}
                  <div className={`grid grid-cols-1 ${lgClass} gap-4`}>
                     {grid.fields.map((field) => {
                        if (field.type === "phone") {
                           const value = watch(field.fieldName as string) || "";

                           return (
                              <Field>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {field.options?.required && "*"}
                                 </FieldLabel>

                                 <PhoneInput
                                    value={value}
                                    onChange={(v) => setValue(field.fieldName, v)}
                                    focusInputOnCountrySelection={false}
                                 />

                                 {getNestedError(errors, field.fieldName)?.type === "required" && (
                                    <FieldError>{field.label} obrigatório</FieldError>
                                 )}

                                 {getNestedError(errors, field.fieldName)?.type === "minLength" && (
                                    <FieldError>{field.label} muito curto</FieldError>
                                 )}

                                 {!getNestedError(errors, field.fieldName) && field.description && (
                                    <FieldDescription>{field.description || "ㅤㅤ"}</FieldDescription>
                                 )}
                              </Field>
                           );
                        }

                        if (field.type === "select") {
                           const value = watch(field.fieldName as string) || "";

                           return (
                              <Field>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {field.options?.required && "*"}
                                 </FieldLabel>

                                 <Select
                                    disabled={field.options?.disabled}
                                    value={String(value)}
                                    onValueChange={(val) => setValue(field.fieldName, val)}
                                 >
                                    <SelectTrigger id={field.id}>
                                       <SelectValue placeholder={field.label} />
                                    </SelectTrigger>

                                    <SelectContent>
                                       {field.selectOptions?.map((option) => {
                                          const value = typeof option === "string" ? option : String(option.value);
                                          const label = typeof option === "string" ? option : option.label;
                                          return <SelectItem value={value}>{label}</SelectItem>;
                                       })}
                                    </SelectContent>
                                 </Select>

                                 <input
                                    type="hidden"
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: field.options?.required || false,
                                         })
                                       : {})}
                                    value={value}
                                 />

                                 {getNestedError(errors, field.fieldName)?.type === "required" && (
                                    <FieldError>{field.label} obrigatório</FieldError>
                                 )}

                                 {getNestedError(errors, field.fieldName)?.type === "minLength" && (
                                    <FieldError>{field.label} muito curto</FieldError>
                                 )}

                                 {!getNestedError(errors, field.fieldName) && field.description && (
                                    <FieldDescription>{field.description || "ㅤㅤ"}</FieldDescription>
                                 )}
                              </Field>
                           );
                        }

                        if (!field.type || field.type === "input") {
                           const value = watch(field.fieldName as string);

                           return (
                              <Field>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {field.options?.required && "*"}
                                 </FieldLabel>

                                 <Input
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: field.options?.required || false,
                                            maxLength: field.options?.maxLength,
                                            minLength: field.options?.minLength,
                                         })
                                       : {})}
                                    value={value}
                                    // onChange={(e) => setValue(field.fieldName, e.target.value)}
                                    onChange={(e) =>
                                       setValue(field.fieldName, formatValue(e.target.value, field.format))
                                    }
                                    disabled={field.options?.disabled}
                                    type={field.inputType ?? "text"}
                                    id={field.label}
                                    placeholder={field.label}
                                 />

                                 {getNestedError(errors, field.fieldName)?.type === "required" && (
                                    <FieldError>{field.label} obrigatório</FieldError>
                                 )}

                                 {getNestedError(errors, field.fieldName)?.type === "minLength" && (
                                    <FieldError>{field.label} muito curto</FieldError>
                                 )}

                                 {!getNestedError(errors, field.fieldName) && field.description && (
                                    <FieldDescription>{field.description || "ㅤㅤ"}</FieldDescription>
                                 )}
                              </Field>
                           );
                        }
                     })}
                  </div>
                  {grid.separator && <FieldSeparator className="my-2" />}
               </React.Fragment>
            );
         })}
      </FieldSet>
   );
}

const formatValue = (value: string, format?: string) => {
   if (!value || !format) return value;

   const onlyNumbers = value.replace(/\D/g, "");

   switch (format) {
      case "documentId": // CPF ou CNPJ
         if (onlyNumbers.length <= 11) {
            // CPF
            return onlyNumbers
               .replace(/^(\d{3})(\d)/, "$1.$2")
               .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
               .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
         } else {
            // CNPJ
            return onlyNumbers
               .replace(/^(\d{2})(\d)/, "$1.$2")
               .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
               .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
               .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
         }

      case "CEP":
         return onlyNumbers.replace(/^(\d{5})(\d)/, "$1-$2");

      default:
         return value;
   }
};

export default FitFormUI;
