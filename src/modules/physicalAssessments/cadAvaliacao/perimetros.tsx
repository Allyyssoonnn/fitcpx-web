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
   cod_protocolo, // Certifique-se que o Pai está passando esta prop (pode ser 'protocolo' ou 'cod_protocolo')
}: any) {
   // Função auxiliar para renderizar os grupos de campos
   const renderFieldGroup = (fields: typeof perimeterFields) => {
      return fields.map((field) => {
         const isRequired =
            field.requiredProtocolos?.includes(cod_protocolo) ||
            (field.requiredType === "completo" && tipoAvaliacao === "completo");

         // Lógica de Ocultar: Se ocultar estiver ativado E o campo não for obrigatório -> esconde
         if (ocultarCampos && !isRequired) return null;

         // No tipo 'Simples', se estiver ocultando campos, esconde os que não são 'Simples' (se houver essa lógica específica)
         // Mas seguindo a lógica do pai, 'tipoAvaliacao' já controla o requiredType.

         return (
            <Field key={field.field} className="col-md-4">
               <FieldLabel className="d-flex align-items-center">
                  <label className={`${isRequired ? "fw-bold" : ""}`}>
                     {field.label}
                     {isRequired ? " *" : ""}
                  </label>
               </FieldLabel>

               <FieldContent>
                  <MediaInputUI
                     whatch={watch}
                     inputId={field.field}
                     register={register}
                     defaultValue={getValues(field.field)}
                     field={field.field}
                     startSpeechRecognition={startSpeechRecognition}
                     type={metodoPerimetro == "normal" ? "default" : "media"}
                     setValue={setValue}
                     // A validação real required vem do register no Pai, aqui é só visual/html
                     required={isRequired}
                  />

                  {errors && errors?.[field.field] && (
                     <div id="mediahelp" className="form-text text-danger">
                        Esse campo é obrigatório
                     </div>
                  )}
               </FieldContent>
            </Field>
         );
      });
   };

   // Filtramos a lista mestra para manter a separação visual
   const geralFields = perimeterFields.filter((f) => f.category === "Geral");
   const direitoFields = perimeterFields.filter((f) => f.category === "Direito");
   const esquerdoFields = perimeterFields.filter((f) => f.category === "Esquerdo");

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

            <Select value={metodoPerimetro} onValueChange={(v) => setMetodoPerimetro(v)}>
               <SelectTrigger className="min-w-sm">
                  <SelectValue placeholder="Método" />
               </SelectTrigger>

               <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Renderização visual mantendo os grupos */}
         {geralFields.length > 0 && (
            <>
               <h5 className="text-muted mt-3">Geral</h5>
               <div className="row g-3">{renderFieldGroup(geralFields)}</div>
            </>
         )}

         {direitoFields.length > 0 && (
            <>
               <h5 className="text-muted mt-3">Lado Direito</h5>
               <div className="row g-3">{renderFieldGroup(direitoFields)}</div>
            </>
         )}

         {esquerdoFields.length > 0 && (
            <>
               <h5 className="text-muted mt-3">Lado Esquerdo</h5>
               <div className="row g-3">{renderFieldGroup(esquerdoFields)}</div>
            </>
         )}
      </div>
   );
}

// Função para auxiliar badges (mantida compatibilidade com o pai se necessário)
export function verifyPerimeterErrors(errors: any, protocolo: number, tipoAvaliacao: string) {
   for (let field of perimeterFields) {
      const isRequired =
         field.requiredProtocolos?.includes(protocolo) ||
         (field.requiredType === "completo" && tipoAvaliacao === "completo");

      if (isRequired && errors?.[field.field]) {
         return true;
      }
   }
   return false;
}

// --- CONSTANTES E CONFIGURAÇÃO ---

/* Mapeamento consolidado das regras baseadas no seu código original:
  Protocolo 5: abdomen, quadril, crista_iliaca
  Protocolo 6: pescoco, cintura, quadril
  Required Default (Completo): braco_relaxado_direito, coxa_direita, panturrilha_direita
*/

export const perimeterFields = [
   // --- GERAL ---
   {
      field: "pescoco",
      label: "Pescoço (cm)",
      category: "Geral",
      requiredProtocolos: [6],
   },
   {
      field: "ombro",
      label: "Ombro (cm)",
      category: "Geral",
      requiredProtocolos: [],
   },
   {
      field: "torax_expirado",
      label: "Tórax expirado (cm)",
      category: "Geral",
      requiredProtocolos: [],
   },
   {
      field: "torax_inspirado",
      label: "Tórax inspirado (cm)",
      category: "Geral",
      requiredProtocolos: [],
   },
   {
      field: "cintura",
      label: "Cintura (cm)",
      category: "Geral",
      requiredProtocolos: [6],
   },
   {
      field: "abdomen",
      label: "Abdômen (cm)",
      category: "Geral",
      requiredProtocolos: [5],
   },
   {
      field: "quadril",
      label: "Quadril (cm)",
      category: "Geral",
      requiredProtocolos: [5, 6],
   },
   {
      field: "crista_iliaca",
      label: "Crista Ilíaca (cm)",
      category: "Geral",
      requiredProtocolos: [5],
   },

   // --- DIREITO ---
   {
      field: "braco_relaxado_direito",
      label: "Braço Relaxado Direito (cm)",
      category: "Direito",
      requiredType: "completo",
   },
   {
      field: "braco_contraido_direito",
      label: "Braço Contraído Direito (cm)",
      category: "Direito",
      requiredProtocolos: [],
   },
   {
      field: "antebraco_direito",
      label: "Antebraço Direito (cm)",
      category: "Direito",
      requiredProtocolos: [],
   },
   {
      field: "coxa_direita",
      label: "Coxa Direita (cm)",
      category: "Direito",
      requiredType: "completo",
   },
   {
      field: "panturrilha_direita",
      label: "Panturrilha Direita (cm)",
      category: "Direito",
      requiredType: "completo",
   },

   // --- ESQUERDO ---
   {
      field: "braco_relaxado_esquerdo",
      label: "Braço Relaxado Esquerdo (cm)",
      category: "Esquerdo",
      requiredProtocolos: [],
   },
   {
      field: "braco_contraido_esquerdo",
      label: "Braço Contraído Esquerdo (cm)",
      category: "Esquerdo",
      requiredProtocolos: [],
   },
   {
      field: "antebraco_esquerdo",
      label: "Antebraço Esquerdo (cm)",
      category: "Esquerdo",
      requiredProtocolos: [],
   },
   {
      field: "coxa_esquerda",
      label: "Coxa Esquerda (cm)",
      category: "Esquerdo",
      requiredProtocolos: [],
   },
   {
      field: "panturrilha_esquerda",
      label: "Panturrilha Esquerda (cm)",
      category: "Esquerdo",
      requiredProtocolos: [],
   },
];

export default Perimetros;
