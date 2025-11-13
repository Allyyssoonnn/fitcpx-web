import { Pen } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditableText = ({ text, onUpdate, title }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [inputValue, setInputValue] = useState(text);

   const handleBlur = () => {
      setIsEditing(false);
      if (inputValue.trim() && inputValue !== text) {
         onUpdate(inputValue.trim());
      }
   };

   if (isEditing)
      return (
         <Input
            type="text"
            style={{ width: "auto", fontSize: "13px" }}
            onKeyDownCapture={(e) => e.stopPropagation()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => (e.key === "Enter" ? handleBlur() : null)}
            autoFocus
         />
      );

   if (title)
      return (
         <Label>
            <Button
               variant="outline"
               size="icon"
               className="me-2"
               onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
               }}
            >
               <Pen />
            </Button>
            {text}
         </Label>
      );

   if (!title)
      return (
         <a>
            <Button
               variant="outline"
               size="icon"
               className="me-2"
               onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
               }}
            >
               <Pen />
            </Button>
            {text}
         </a>
      );
};

export default EditableText;
