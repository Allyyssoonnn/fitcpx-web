import { Info } from "lucide-react";
import MediaInput from "../../../components/mediaInput";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

function Perimetros({
   metodoPerimetro,
   setMetodoPerimetro,
   ocultarCampos,
   tipoAvaliacao,
   register,
   setValue,
   startSpeechRecognition,
   getValues,
   watch,
}) {
   return (
      <div className="row g-3">
         <div className="col-md-3">
            <label className="form-label">
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

            <select
               value={metodoPerimetro}
               onChange={(e) => setMetodoPerimetro(e.target.value)}
               className="form-control"
            >
               <option value="normal">Normal</option>
               <option value="media">Média</option>
            </select>
         </div>

         <h5 className="text-muted">Geral</h5>

         <div className="row g-3">
            {perimetros.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples") return;

               return (
                  <div key={index} className="col-md-4">
                     <div className="d-flex align-items-center mb-2">
                        <label
                           className={`form-label ${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </div>

                     <MediaInput
                        id={field.name}
                        campo={field.name}
                        register={register}
                        setValue={setValue}
                        startSpeechRecognition={startSpeechRecognition}
                        metodo={metodoPerimetro}
                        required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        defaultValue={getValues(field.name)}
                        watch={watch}
                     />
                  </div>
               );
            })}
         </div>

         <h5 className="text-muted">Lado Direito</h5>

         <div className="row g-3">
            {perimetrosDireito.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples") return;

               return (
                  <div key={index} className="col-md-4">
                     <div className="d-flex align-items-center mb-2">
                        <label
                           className={`form-label ${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </div>

                     <MediaInput
                        id={field.name}
                        campo={field.name}
                        register={register}
                        setValue={setValue}
                        startSpeechRecognition={startSpeechRecognition}
                        metodo={metodoPerimetro}
                        required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        defaultValue={getValues(field.name)}
                        watch={watch}
                     />
                  </div>
               );
            })}
         </div>

         <h5 className="text-muted">Lado Esquerdo</h5>

         <div className="row g-3">
            {perimetrosEsquerdo.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples") return;

               return (
                  <div className="col-md-4" key={index}>
                     <div className="d-flex align-items-center mb-2">
                        <label
                           className={`form-label ${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </div>

                     <MediaInput
                        id={field.name}
                        campo={field.name}
                        register={register}
                        setValue={setValue}
                        startSpeechRecognition={startSpeechRecognition}
                        metodo={metodoPerimetro}
                        required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        defaultValue={getValues(field.name)}
                        watch={watch}
                     />
                  </div>
               );
            })}
         </div>
      </div>
   );
}

const perimetrosRequired = [
   "braco_relaxado_direito",
   "coxa_direita",
   "panturrilha_direita",
   // "antebraco_direito",
   // "abdomen",
];

const perimetros = [
   { name: "pescoco", label: "Pescoço (cm)", icon: "bi bi-body" },
   { name: "ombro", label: "Ombro (cm)", icon: "bi bi-rulers" },
   { name: "torax_expirado", label: "Tórax expirado (cm)", icon: "bi bi-body" },
   { name: "torax_inspirado", label: "Tórax inspirado (cm)", icon: "bi bi-body" },
   { name: "cintura", label: "Cintura (cm)", icon: "bi bi-body" },
   { name: "abdomen", label: "Abdômen (cm)", icon: "bi bi-body" },
   { name: "quadril", label: "Quadril (cm)", icon: "bi bi-body" },
];

const perimetrosDireito = [
   { name: "braco_relaxado_direito", label: "Braço Relaxado Direito (cm)", icon: "bi bi-body" },
   { name: "braco_contraido_direito", label: "Braço Contraído Direito (cm)", icon: "bi bi-body" },
   { name: "antebraco_direito", label: "Antebraço Direito (cm)", icon: "bi bi-rulers" },
   { name: "coxa_direita", label: "Coxa Direita (cm)", icon: "bi bi-shoe-prints" },
   { name: "panturrilha_direita", label: "Panturrilha Direita (cm)", icon: "bi bi-shoe-prints" },
];

const perimetrosEsquerdo = [
   { name: "braco_relaxado_esquerdo", label: "Braço Relaxado Esquerdo (cm)", icon: "bi bi-body" },
   { name: "braco_contraido_esquerdo", label: "Braço Contraído Esquerdo (cm)", icon: "bi bi-body" },
   { name: "antebraco_esquerdo", label: "Antebraço Esquerdo (cm)", icon: "bi bi-rulers" },
   { name: "coxa_esquerda", label: "Coxa Esquerda (cm)", icon: "bi bi-shoe-prints" },
   { name: "panturrilha_esquerda", label: "Panturrilha Esquerda (cm)", icon: "bi bi-shoe-prints" },
];

export default Perimetros;
