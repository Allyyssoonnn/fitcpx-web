import { Trash } from "lucide-react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import {
   Field,
   FieldContent,
   FieldDescription,
   FieldError,
   FieldLabel,
   FieldLegend,
   FieldSeparator,
   FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import CurrencyInput from "./currencyInput.ui";
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
   type?: "input" | "select" | "phone" | "currency" | "color" | "toggle";
   selectOptions?: SelectOption[] | string[];
   clearSelectButton?: boolean;
   inputType?: React.ComponentProps<"input">["type"];
   Component?: React.Component;
   colSpan: 1 | 2 | 3 | 4;
   hideField?: (data: any) => boolean;
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
   const { setValue, register, watch, control, getValues } = useFormContext?.() ?? {};

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
                        let fieldClassName = "";
                        let fieldVisible = true;
                        if (field?.hideField && field.hideField(getValues())) {
                           fieldClassName = `${fieldClassName} d-none`;
                           fieldVisible = false;
                        }
                        let fieldRequerid = (field?.options?.required && fieldVisible) || false;
                        if (field.colSpan) `${fieldClassName} col-span-${String(field.colSpan)}`;

                        if (field.type === "color") {
                           const value = watch(field.fieldName as string);
                           if (!value) {
                              const randomColor = getRandomColor();
                              setValue(field.fieldName, randomColor);
                           }

                           return (
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
                                 </FieldLabel>

                                 <Input
                                    id={field.id}
                                    type="color"
                                    value={value}
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: fieldRequerid,
                                         })
                                       : {})}
                                    onChange={(e) => setValue(field.fieldName, e.target.value)}
                                    disabled={field.options?.disabled}
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

                        if (field.type === "currency") {
                           return (
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
                                 </FieldLabel>

                                 <CurrencyInput id={field.id} name={field.fieldName} control={control} />

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

                        if (field.type === "phone") {
                           const value = watch(field.fieldName as string) || "";

                           return (
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
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

                        if (field.type === "toggle") {
                           const value = watch(field.fieldName as string) || "";

                           return (
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
                                 </FieldLabel>

                                 <Controller
                                    name={field.fieldName}
                                    control={control}
                                    defaultValue=""
                                    render={({ field: controllerField }) => (
                                       <ToggleGroup
                                          className="bg-accent p-1 rounded-md"
                                          type="single"
                                          disabled={field.options?.disabled}
                                          value={controllerField.value}
                                          onValueChange={controllerField.onChange}
                                       >
                                          {field.selectOptions?.map((option) => {
                                             const value = typeof option === "string" ? option : String(option.value);
                                             const label = typeof option === "string" ? option : option.label;
                                             return (
                                                <ToggleGroupItem
                                                   key={value}
                                                   value={value}
                                                   className="data-[state=on]:text-primary px-3 py-1 rounded-md"
                                                >
                                                   {label}
                                                </ToggleGroupItem>
                                             );
                                          })}
                                       </ToggleGroup>
                                    )}
                                 />

                                 <input
                                    type="hidden"
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: fieldRequerid,
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

                        if (field.type === "select") {
                           const value = watch(field.fieldName as string) || "";

                           return (
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
                                 </FieldLabel>

                                 <FieldContent className="flex flex-row items-center">
                                    <Select
                                       disabled={field.options?.disabled}
                                       value={String(value)}
                                       onValueChange={(val) => setValue(field.fieldName, val)}
                                    >
                                       <SelectTrigger id={field.id} className="w-[100%]">
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

                                    {field.clearSelectButton && value && (
                                       <Button
                                          className="w-1"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => setValue(field.fieldName, undefined)}
                                       >
                                          <Trash />
                                       </Button>
                                    )}
                                 </FieldContent>

                                 <input
                                    type="hidden"
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: fieldRequerid,
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
                              <Field className={fieldClassName}>
                                 <FieldLabel htmlFor={field.label}>
                                    {field.label} {fieldRequerid && "*"}
                                 </FieldLabel>

                                 <Input
                                    {...(register
                                       ? register(field.fieldName as string, {
                                            required: fieldRequerid,
                                            maxLength: field.options?.maxLength,
                                            minLength: field.options?.minLength,
                                         })
                                       : {})}
                                    value={value}
                                    onChange={(e) => setValue(field.fieldName, e.target.value)}
                                    disabled={field.options?.disabled}
                                    id={field.id}
                                    placeholder={field.label}
                                    type={field.inputType ?? "text"}
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

function getRandomColor() {
   // Gera uma cor hexadecimal aleatória
   const letters = "0123456789ABCDEF";
   let color = "#";
   for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
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
