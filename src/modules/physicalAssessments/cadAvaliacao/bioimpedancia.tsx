import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";

export const fieldsBio = [
   {
      label: "Gordura Visceral",
      field: "gordura_viceral",
      inputId: "gordura_viceral",
      requiredProtocolos: [], // Não obrigatório em nenhum
   },
   {
      label: "% Gordura",
      field: "bioimpedancia_gordura",
      inputId: "bioimpedancia_gordura",
      requiredProtocolos: [7], // Obrigatório no protocolo 7
   },
   {
      label: "% Muscular",
      field: "bioimpedancia_muscular",
      inputId: "bioimpedancia_muscular",
      requiredProtocolos: [7],
   },
   {
      label: "Idade Corporal",
      field: "bioimpedancia_idade",
      inputId: "bioimpedancia_idade",
      requiredProtocolos: [],
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
         {fieldsBio.map((field) => {
            // Verifica se o campo é obrigatório para o protocolo atual
            const isRequired = field.requiredProtocolos.includes(protocolo);

            // Se deve ocultar campos E não for obrigatório, esconde
            if (ocultarCampos && !isRequired) return null;

            return (
               <Field key={field.field} className="col-md-4">
                  <FieldLabel className={`${isRequired ? "fw-bold" : ""}`}>
                     {field.label}
                     {isRequired ? " *" : ""}
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
                        // Apenas visual, a validação real é feita no Pai
                        required={isRequired}
                     />
                  </FieldContent>

                  {errors && errors?.[field.field] && (
                     <div id="mediahelp" className="form-text text-danger">
                        Esse campo é obrigatório
                     </div>
                  )}
               </Field>
            );
         })}
      </div>
   );
}

export function verifyBioimpedanceErrors(errors: any, protocolo: number) {
   for (let field of fieldsBio) {
      if (errors?.[field.field] && field.requiredProtocolos.includes(protocolo)) {
         return true;
      }
   }
   return false;
}

export default Bioimpedancia;
