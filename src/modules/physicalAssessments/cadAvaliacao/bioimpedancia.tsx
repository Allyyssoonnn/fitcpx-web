import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";

const fields = [
   {
      label: "Gordura Visceral",
      field: "gordura_viceral",
      inputId: "gordura_viceral",
      required: false,
   },
   {
      label: "% Gordura",
      field: "bioimpedancia_gordura",
      inputId: "bioimpedancia_gordura",
      requiredProtocolo: 7,
   },
   {
      label: "% Muscular",
      field: "bioimpedancia_muscular",
      inputId: "bioimpedancia_muscular",
      requiredProtocolo: 7,
   },
   {
      label: "Idade Corporal",
      field: "bioimpedancia_idade",
      inputId: "bioimpedancia_idade",
      required: false,
   },
];

function Bioimpedancia({
   register,
   startSpeechRecognition,
   setValue,
   watch,
   getValues,
   protocolo,
   errors,
   ocultarCampos,
}: any) {
   return (
      <div className="row g-3">
         {fields.map((field) => (
            <Field
               key={field.field}
               className={`col-md-4 ${ocultarCampos && !(protocolo == field.requiredProtocolo) ? "hidden" : ""}`}
            >
               <FieldLabel className={`${protocolo == field.requiredProtocolo ? "fw-bold" : ""}`}>
                  {field.label}
                  {field.requiredProtocolo && protocolo == field.requiredProtocolo ? " *" : ""}
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
                     required={!!field.requiredProtocolo && protocolo == field.requiredProtocolo}
                  />
               </FieldContent>

               {errors && errors?.[field.field] && (
                  <div id="mediahelp" className="form-text text-danger">
                     Esse campo é obrigatório
                  </div>
               )}
            </Field>
         ))}
      </div>
   );
}

export function verifyBioimpedanceErrors(errors: any, protocolo: number) {
   for (let field of fields) {
      if (errors?.[field.field] && protocolo == field.requiredProtocolo) {
         return true;
      }
   }
   return false;
}

export default Bioimpedancia;
