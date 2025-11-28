import { Info } from "lucide-react";
import { MediaInputUI } from "../../../components/fitUI/numberInput.ui";
import { Field, FieldContent, FieldLabel } from "../../../components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
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

            <Select value={metodoPerimetro} onValueChange={(v) => setMetodoPerimetro(v)}>
               <SelectTrigger>
                  <SelectValue placeholder="Metódo" />
               </SelectTrigger>

               <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <h5 className="text-muted">Geral</h5>

         <div className="row g-3">
            {perimetros.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples" && ocultarCampos) return;

               return (
                  <Field key={index} className="col-md-4">
                     <FieldLabel className="d-flex align-items-center">
                        <label
                           className={`${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </FieldLabel>

                     <FieldContent>
                        <MediaInputUI
                           whatch={watch}
                           inputId={field.name}
                           register={register}
                           defaultValue={getValues(field.name)}
                           field={field.name}
                           startSpeechRecognition={startSpeechRecognition}
                           type={metodoPerimetro == "normal" ? "default" : "media"}
                           setValue={setValue}
                           required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        />

                        {errors && errors?.[field.name] && (
                           <div id="mediahelp" className="form-text text-danger">
                              Esse campo é obrigatório
                           </div>
                        )}
                     </FieldContent>
                  </Field>
               );
            })}
         </div>

         <h5 className="text-muted">Lado Direito</h5>

         <div className="row g-3">
            {perimetrosDireito.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples" && ocultarCampos) return;

               return (
                  <Field key={index} className="col-md-4">
                     <FieldLabel className="d-flex align-items-center">
                        <label
                           className={`${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </FieldLabel>

                     <FieldContent>
                        <MediaInputUI
                           whatch={watch}
                           inputId={field.name}
                           register={register}
                           defaultValue={getValues(field.name)}
                           field={field.name}
                           startSpeechRecognition={startSpeechRecognition}
                           type={metodoPerimetro == "normal" ? "default" : "media"}
                           setValue={setValue}
                           required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        />

                        {errors && errors?.[field.name] && (
                           <div id="mediahelp" className="form-text text-danger">
                              Esse campo é obrigatório
                           </div>
                        )}
                     </FieldContent>
                  </Field>
               );
            })}
         </div>

         <h5 className="text-muted">Lado Esquerdo</h5>

         <div className="row g-3">
            {perimetrosEsquerdo.map((field, index) => {
               if (!perimetrosRequired.includes(field.name) && ocultarCampos) return;
               if (tipoAvaliacao === "simples" && ocultarCampos) return;

               return (
                  <Field className="col-md-4" key={index}>
                     <FieldLabel className="d-flex align-items-center">
                        <label
                           className={`${
                              perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "fw-bold" : ""
                           }`}
                        >
                           {field.label}
                           {perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo" ? "*" : ""}
                        </label>
                     </FieldLabel>

                     <FieldContent>
                        <MediaInputUI
                           whatch={watch}
                           inputId={field.name}
                           register={register}
                           defaultValue={getValues(field.name)}
                           field={field.name}
                           startSpeechRecognition={startSpeechRecognition}
                           type={metodoPerimetro == "normal" ? "default" : "media"}
                           setValue={setValue}
                           required={perimetrosRequired.includes(field.name) && tipoAvaliacao === "completo"}
                        />

                        {errors && errors?.[field.name] && (
                           <div id="mediahelp" className="form-text text-danger">
                              Esse campo é obrigatório
                           </div>
                        )}
                     </FieldContent>
                  </Field>
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
