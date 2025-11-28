import { RotateCcw } from "lucide-react";
import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Button } from "../../../components/ui/button";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";

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
}) {
   return (
      <div className="row g-3">
         {["biestiloide_punho", "biepicondilo_umeral", "biepicondilo_femoral"].map((campo, index) => {
            const obrigatorio = (index === 0 || index === 2) && tipoAvaliacao === "completo";
            return (
               <Field key={index} className={`col-md-4 ${!obrigatorio && ocultarCampos ? "d-none" : ""}`}>
                  <FieldLabel className={`${obrigatorio ? "fw-bold" : ""}`}>
                     {campo.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} {obrigatorio ? "*" : ""} (cm)
                  </FieldLabel>

                  <FieldContent>
                     <MediaInputUI
                        whatch={watch}
                        inputId={campo}
                        register={register}
                        defaultValue={getValues(campo)}
                        field={campo}
                        startSpeechRecognition={startSpeechRecognition}
                        setValue={setValue}
                        required={obrigatorio}
                     />

                     {showBringLast && (
                        <Button className="mt-1" variant="outline" size="sm" onClick={(e) => bringLast(e, campo)}>
                           <RotateCcw />
                           Usar da avaliação anterior
                        </Button>
                     )}
                  </FieldContent>
               </Field>
            );
         })}
      </div>
   );
}

export default Diametros;
