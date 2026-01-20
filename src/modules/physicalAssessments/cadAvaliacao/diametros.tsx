import { RotateCcw } from "lucide-react";
import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Button } from "../../../components/ui/button";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";

const fields = [
   {
      label: "Biestiloide do Punho",
      field: "biestiloide_punho",
      inputId: "biestilo_punho",
      requiredType: "completo",
   },
   {
      label: "Biepicôndilo Umeral",
      field: "biepicondilo_umeral",
      inputId: "biepicondilo_umeral",
   },
   {
      label: "Biepicôndilo Femoral",
      field: "biepicondilo_femoral",
      inputId: "biepicondilo_femoral",
      requiredType: "completo",
   },
];

function Diametros({
   tipoAvaliacao,
   ocultarCampos,
   register,
   startSpeechRecognition,
   bringLast,
   showBringLast,
   watch,
   setValue,
   getValues,
   errors,
}: any) {
   return (
      <div className="row g-3">
         {fields.map((field) => (
            <Field
               key={field.field}
               className={`col-md-4 ${ocultarCampos && field.requiredType !== tipoAvaliacao ? "d-none" : ""}`}
            >
               <FieldLabel className={`${field.requiredType && tipoAvaliacao == field.requiredType ? "fw-bold" : ""}`}>
                  {field.label}
                  {field.requiredType && tipoAvaliacao == field.requiredType ? " *" : ""}
               </FieldLabel>

               <FieldContent>
                  <MediaInputUI
                     whatch={watch}
                     inputId={field.inputId}
                     register={register}
                     defaultValue={getValues(field.field)}
                     field={field.field}
                     startSpeechRecognition={startSpeechRecognition}
                     setValue={setValue}
                     required={!!field.requiredType && tipoAvaliacao == field.requiredType}
                  />

                  {errors && errors?.[field.field] && (
                     <div id="mediahelp" className="form-text text-danger">
                        Esse campo é obrigatório
                     </div>
                  )}

                  {showBringLast && (
                     <Button className="mt-1" variant="outline" size="sm" onClick={(e) => bringLast(e, field.field)}>
                        <RotateCcw />
                        Usar da avaliação anterior
                     </Button>
                  )}
               </FieldContent>
            </Field>
         ))}
      </div>
   );
}

export function verifyDiameterErrors(errors: any, tipoAvaliacao: string) {
   for (let field of fields) {
      if (errors?.[field.field] && tipoAvaliacao == field.requiredType) {
         return true;
      }
   }
   return false;
}

export default Diametros;
