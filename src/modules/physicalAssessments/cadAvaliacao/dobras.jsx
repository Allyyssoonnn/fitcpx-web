import { useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import MediaInput from "../../../components/mediaInput";
import { protocolosCampos } from "../../../utils";

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
}) {
   return (
      <div className="row g-3">
         <div className="col-md-3">
            <label className="form-label">
               Metódo
               <OverlayTrigger placement="bottom" overlay={tooltipMetodo}>
                  <i className="bi bi-info-circle ms-2 text-primary" style={{ cursor: "pointer" }}></i>
               </OverlayTrigger>
            </label>
            <select value={metodoDobras} onChange={(e) => setMetodoDobras(e.target.value)} className="form-control">
               <option value="normal">Normal</option>
               <option value="media">Média</option>
            </select>
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
                     <div className="col-md-4" key={campo}>
                        <label className={`form-label ${hasAsterisk ? "fw-bold" : ""}`}>
                           {campo.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} {hasAsterisk ? " *" : ""}{" "}
                           (mm)
                        </label>
                        <MediaInput
                           id={campo}
                           required={camposComAsterisco.has(campo)}
                           campo={campo}
                           register={register}
                           setValue={setValue}
                           startSpeechRecognition={startSpeechRecognition}
                           metodo={metodoDobras}
                           defaultValue={getValues(campo)}
                           watch={watch}
                        />
                     </div>
                  );
               })}
            </>
         )}
      </>
   );
};

const tooltipMetodo = (
   <Tooltip id="tooltip">
      <div>
         <strong>Normal:</strong> Apenas um campo para preencher medidas é liberado.
      </div>
      <p></p>
      <div>
         <strong>Média:</strong> É liberado 2 campos para informar 2 medidas, caso a diferença seja mais de 1mm é aberto
         o terceiro campo para média.
      </div>
   </Tooltip>
);

export default Dobras;
