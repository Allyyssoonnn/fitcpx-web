import { useState } from "react";
import { formatarMoeda } from "../utils";
import CurrencyInput from "./fitUI/currencyInput.ui";
import { Field } from "./ui/field";

const EditableCurrency = ({ value, onUpdate }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [tempValue, setTempValue] = useState(value || 0);
   const [edited, setEdited] = useState(false);

   const handleBlur = () => {
      setIsEditing(false);

      if (!edited) return; // se não digitou nada, não muda

      if (onUpdate && tempValue !== value) {
         onUpdate(tempValue);
      }
      setEdited(false);
   };

   const handleChange = (v) => {
      let numberValue;
      if (typeof v === "string") {
         numberValue = parseFloat(v.replace(/\./g, "").replace(",", ".").replace("R$ ", "")) || 0;
      } else {
         numberValue = v || 0;
      }
      setTempValue(numberValue);
      setEdited(true);
   };

   if (isEditing)
      return (
         <Field className="w-[150px]">
            <CurrencyInput
               value={edited ? tempValue : ""}
               placeholder={formatarMoeda(value)}
               autoFocus
               onBlur={handleBlur}
               onChange={handleChange}
               onKeyDown={(e) => (e.key === "Enter" ? handleBlur(e) : null)}
            />
         </Field>
      );

   return (
      <>
         {formatarMoeda(value)}
         <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={() => {
               setTempValue(value || 0);
               setIsEditing(true);
               setEdited(false);
            }}
         >
            <i className="bi bi-pencil"></i>
         </button>
      </>
   );
};

export default EditableCurrency;
