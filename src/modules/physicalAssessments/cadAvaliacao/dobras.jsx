import { Info } from "lucide-react";
import { useMemo } from "react";
import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

// Definição dos protocolos fora do componente para evitar recriação
export const protocolosCampos = {
   1: [],
   2: ["subescapular", "triciptal", "supra_iliaca", "coxa", "peitoral", "axilar_media", "abdominal"],
   3: ["supra_iliaca", "peitoral", "coxa"],
   4: ["peitoral", "axilar_media", "triciptal", "subescapular", "abdominal", "supra_iliaca", "coxa"],
   5: [],
   6: [],
   7: [],
};

const dobrasDisponiveis = [
   "subescapular",
   "triciptal",
   "biciptal",
   "peitoral",
   "axilar_media",
   "supra_iliaca",
   "supra_espinhal",
   "abdominal",
   "coxa",
   "panturrilha",
];

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
}) {
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

         <DobrasCampos
            getValues={getValues}
            ocultarCampos={ocultarCampos}
            tipoAvaliacao={tipoAvaliacao}
            protocolo={protocolo}
            metodoDobras={metodoDobras}
            register={register}
            setValue={setValue}
            startSpeechRecognition={startSpeechRecognition}
            watch={watch}
            errors={errors}
         />
      </div>
   );
}

const DobrasCampos = ({
   protocolo,
   register,
   setValue,
   startSpeechRecognition,
   metodoDobras,
   tipoAvaliacao,
   ocultarCampos,
   getValues,
   watch,
   errors,
}) => {
   // Garante que seja um array mesmo se protocolo for null/undefined
   const camposDoProtocolo = protocolosCampos[protocolo] || [];

   // Define quais campos fazem parte do protocolo (para colocar o asterisco e controlar o filtro)
   const camposNecessarios =
      tipoAvaliacao === "completo"
         ? [...new Set([...camposDoProtocolo, "triciptal", "coxa", "panturrilha"])]
         : camposDoProtocolo;

   const setCamposNecessarios = new Set(camposNecessarios);

   // Lógica principal de exibição:
   const filteredDobras = useMemo(() => {
      return dobrasDisponiveis.filter((campo) => {
         // Se ocultarCampos for FALSE: !ocultarCampos é TRUE -> Retorna tudo (curto-circuito no OR)
         // Se ocultarCampos for TRUE: verifica se o campo está no setCamposNecessarios
         return !ocultarCampos || setCamposNecessarios.has(campo);
      });
   }, [dobrasDisponiveis, ocultarCampos, setCamposNecessarios]);

   return (
      <>
         {filteredDobras.map((campo) => {
            const isRequired = setCamposNecessarios.has(campo);

            return (
               <Field className="col-md-4" key={campo}>
                  <FieldLabel className={`${isRequired ? "fw-bold" : ""}`}>
                     {campo.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} {isRequired ? " *" : ""} (mm)
                  </FieldLabel>

                  <FieldContent>
                     <MediaInputUI
                        whatch={watch}
                        inputId={campo}
                        register={register}
                        defaultValue={getValues(campo)}
                        field={campo}
                        startSpeechRecognition={startSpeechRecognition}
                        type={metodoDobras == "normal" ? "default" : "media"}
                        setValue={setValue}
                        required={isRequired}
                     />

                     {errors && errors?.[campo] && (
                        <div id="mediahelp" className="form-text text-danger">
                           Esse campo é obrigatório
                        </div>
                     )}
                  </FieldContent>
               </Field>
            );
         })}
      </>
   );
};

export default Dobras;
