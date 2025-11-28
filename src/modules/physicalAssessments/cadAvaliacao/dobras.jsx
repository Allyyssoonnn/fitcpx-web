import { Info } from "lucide-react";
import { useMemo } from "react";
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
               <span className="ms-1">Metódo</span>
            </label>

            <Select value={metodoDobras} onValueChange={(v) => setMetodoDobras(v)}>
               <SelectTrigger>
                  <SelectValue placeholder="Metódo" />
               </SelectTrigger>

               <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {!protocolo ? (
            <h5 className="text-muted text-center">Você precisa selecionar um protocolo para visualizar as dobras</h5>
         ) : (
            <h5 className="text-muted">Dobras</h5>
         )}

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

   //Evita uma renderização caso protocolo não esteja definido
   if (!protocolosCampos[protocolo]) return <></>;

   const camposParaExibir =
      tipoAvaliacao === "completo"
         ? [...new Set([...protocolosCampos[protocolo], "triciptal", "coxa", "panturrilha"])]
         : protocolosCampos[protocolo] || [];

   const camposComAsterisco = new Set(camposParaExibir);

   // Utilizando useMemo para memorizar o resultado da filtragem
   const filteredDobras = useMemo(() => {
      return dobrasDisponiveis.filter((campo) => !ocultarCampos || camposComAsterisco.has(campo));
   }, [dobrasDisponiveis, ocultarCampos, camposComAsterisco]);

   return (
      <>
         {[1, 2, 3, 4, 5].includes(protocolo) && (
            <>
               {filteredDobras.map((campo) => {
                  const hasAsterisk = camposComAsterisco.has(campo); // Verifica se o campo está filtrado
                  return (
                     <Field className="col-md-4" key={campo}>
                        <FieldLabel className={`${hasAsterisk ? "fw-bold" : ""}`}>
                           {campo.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} {hasAsterisk ? " *" : ""}{" "}
                           (mm)
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
                              required={camposComAsterisco.has(campo)}
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
         )}
      </>
   );
};

export const protocolosCampos = {
   1: [],
   2: ["subescapular", "triciptal", "supra_iliaca", "coxa", "peitoral", "axilar_media", "abdominal"],
   3: ["supra_iliaca", "peitoral", "coxa"],
   4: ["peitoral", "axilar_media", "triciptal", "subescapular", "abdominal", "supra_iliaca", "coxa"],
   5: [], // *** NÃO IMPLEMENTADO ***
};

export default Dobras;
