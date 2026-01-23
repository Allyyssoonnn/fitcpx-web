import { Info } from "lucide-react";
import { useEffect } from "react";
import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

function Dobras({
   metodoDobras,
   setMetodoDobras,
   getValues,
   ocultarCampos,
   tipoAvaliacao,
   protocolo,
   register,
   setValue,
   startSpeechRecognition,
   watch,
   errors,
   clearErrors,
}: any) {
   useEffect(() => {
      foldFields.forEach((field) => {
         // Verifica a lógica de obrigatoriedade
         const isRequired =
            field.requiredProtocolos.includes(protocolo as number) ||
            (field.requiredType === "completo" && tipoAvaliacao === "completo");

         // Sobrescreve o registro do campo com a nova regra de required
         register(field.field, { required: isRequired });

         // Se o campo não for mais obrigatório e tiver um erro do tipo "required", limpa o erro
         if (!isRequired && errors?.[field.field]?.type === "required") {
            clearErrors(field.field);
         }
      });
   }, [protocolo, tipoAvaliacao, register, clearErrors, errors]);

   return (
      <div className="row g-3">
         <div className="col-md-3">
            <label>
               <Tooltip>
                  <TooltipTrigger>
                     <Info size={15} />
                  </TooltipTrigger>
                  <TooltipContent>
                     <div>
                        <strong>Normal:</strong> Apenas um campo para preencher medidas é liberado.
                     </div>
                     <p></p>
                     <div>
                        <strong>Média:</strong> É liberado 2 campos para informar 2 medidas, caso a diferença seja mais
                        de 1mm é aberto o terceiro campo para média.
                     </div>
                  </TooltipContent>
               </Tooltip>
               <span className="ms-1">Método</span>
            </label>

            <Select value={metodoDobras} onValueChange={(v) => setMetodoDobras(v)}>
               <SelectTrigger className="min-w-sm">
                  <SelectValue placeholder="Método" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <h5 className="text-muted">Dobras</h5>

         {foldFields.map((field) => (
            <Field
               key={field.field}
               className={`col-md-4 ${
                  ocultarCampos &&
                  !(
                     field.requiredProtocolos.includes(protocolo as number) ||
                     (field.requiredType === "completo" && tipoAvaliacao === "completo")
                  )
                     ? "d-none"
                     : ""
               }`}
            >
               <FieldLabel
                  className={`${field.requiredProtocolos.includes(protocolo as number) || (field.requiredType === "completo" && tipoAvaliacao === "completo") ? "fw-bold" : ""}`}
               >
                  {field.label}
                  {field.requiredProtocolos.includes(protocolo as number) ||
                  (field.requiredType === "completo" && tipoAvaliacao === "completo")
                     ? " *"
                     : ""}{" "}
                  (mm)
               </FieldLabel>

               <FieldContent>
                  <MediaInputUI
                     whatch={watch}
                     inputId={field.inputId}
                     register={register}
                     defaultValue={getValues(field.field)}
                     field={field.field}
                     startSpeechRecognition={startSpeechRecognition}
                     type={metodoDobras == "normal" ? "default" : "media"}
                     setValue={setValue}
                     required={
                        field.requiredProtocolos.includes(protocolo as number) ||
                        (field.requiredType === "completo" && tipoAvaliacao === "completo")
                     }
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

export function verifyFoldErrors(errors: any, protocolo: number, tipoAvaliacao: string) {
   for (let field of foldFields) {
      if (
         errors?.[field.field] &&
         (field.requiredProtocolos.includes(protocolo) ||
            (field.requiredType === "completo" && tipoAvaliacao === "completo"))
      ) {
         return true;
      }
   }
   return false;
}

export const foldFields = [
   {
      label: "Subescapular",
      field: "subescapular",
      inputId: "subescapular",
      requiredProtocolos: [2, 4],
   },
   {
      label: "Triciptal",
      field: "triciptal",
      inputId: "triciptal",
      requiredProtocolos: [2, 4],
      requiredType: "completo",
   },
   {
      label: "Biciptal",
      field: "biciptal",
      inputId: "biciptal",
      requiredProtocolos: [2, 4],
   },
   {
      label: "Peitoral",
      field: "peitoral",
      inputId: "peitoral",
      requiredProtocolos: [2, 3, 4],
   },
   {
      label: "Axilar Média",
      field: "axilar_media",
      inputId: "axilar_media",
      requiredProtocolos: [2, 4],
   },
   {
      label: "Supra Ilíaca",
      field: "supra_iliaca",
      inputId: "supra_iliaca",
      requiredProtocolos: [2, 3, 4],
   },
   {
      label: "Supra Espinhal",
      field: "supra_espinhal",
      inputId: "supra_espinhal",
      requiredProtocolos: [4],
   },
   {
      label: "Abdominal",
      field: "abdominal",
      inputId: "abdominal",
      requiredProtocolos: [2, 4],
   },
   {
      label: "Coxa",
      field: "coxa",
      inputId: "coxa",
      requiredProtocolos: [2, 3, 4],
      requiredType: "completo",
   },
   {
      label: "Panturrilha",
      field: "panturrilha",
      inputId: "panturrilha",
      requiredProtocolos: [4],
      requiredType: "completo",
   },
];

export default Dobras;
