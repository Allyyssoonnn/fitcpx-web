import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";

function Bioimpedancia({ register, startSpeechRecognition, setValue, watch, getValues, protocolo, errors }) {
   return (
      <div className="row g-3">
         <Field className="col-md-4">
            <FieldLabel>Gordura Visceral</FieldLabel>

            <FieldContent>
               <MediaInputUI
                  whatch={watch}
                  inputId="gordura_viceral"
                  register={register}
                  defaultValue={getValues("gordura_viceral")}
                  field="gordura_viceral"
                  startSpeechRecognition={startSpeechRecognition}
                  setValue={setValue}
               />
            </FieldContent>
         </Field>

         <Field className="col-md-4">
            <FieldLabel className={`${protocolo == 7 ? "fw-bold" : ""}`}>
               % Gordura
               {protocolo == 7 ? " *" : ""}
            </FieldLabel>

            <FieldContent>
               <MediaInputUI
                  whatch={watch}
                  inputId="bioimpedancia_gordura"
                  register={register}
                  defaultValue={getValues("bioimpedancia_gordura")}
                  field="bioimpedancia_gordura"
                  startSpeechRecognition={startSpeechRecognition}
                  setValue={setValue}
                  required={protocolo == 7}
               />
            </FieldContent>

            {errors && errors?.["bioimpedancia_gordura"] && (
               <div id="mediahelp" className="form-text text-danger">
                  Esse campo é obrigatório
               </div>
            )}
         </Field>

         <Field className="col-md-4">
            <FieldLabel className={`${protocolo == 7 ? "fw-bold" : ""}`}>
               % Muscular
               {protocolo == 7 ? " *" : ""}
            </FieldLabel>

            <FieldContent>
               <MediaInputUI
                  whatch={watch}
                  inputId="bioimpedancia_muscular"
                  register={register}
                  defaultValue={getValues("bioimpedancia_muscular")}
                  field="bioimpedancia_muscular"
                  startSpeechRecognition={startSpeechRecognition}
                  setValue={setValue}
                  required={protocolo == 7}
               />
            </FieldContent>

            {errors && errors?.["bioimpedancia_muscular"] && (
               <div id="mediahelp" className="form-text text-danger">
                  Esse campo é obrigatório
               </div>
            )}
         </Field>

         <Field className="col-md-4">
            <FieldLabel>Idade Corporal</FieldLabel>

            <FieldContent>
               <MediaInputUI
                  whatch={watch}
                  inputId="bioimpedancia_idade"
                  register={register}
                  defaultValue={getValues("bioimpedancia_idade")}
                  field="bioimpedancia_idade"
                  startSpeechRecognition={startSpeechRecognition}
                  setValue={setValue}
               />
            </FieldContent>
         </Field>
      </div>
   );
}

export default Bioimpedancia;
