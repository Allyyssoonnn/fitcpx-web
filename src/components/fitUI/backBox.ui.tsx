import { ArrowLeft, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface BackBoxUIProps {
   actions?: ActionBackBoxUIProps[];
}

interface ActionBackBoxUIProps {
   label: string;
   action: () => void;
   Icon?: LucideIcon;
}

function BackBoxUI({ actions }: BackBoxUIProps) {
   const navigate = useNavigate();

   return (
      <Card className="mb-3">
         <CardContent className="flex justify-between flex-wrap">
            <Button
               variant="outline"
               onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
               }}
            >
               <ArrowLeft />
               Voltar
            </Button>

            <div className="flex gap-3 flex-wrap flex-col lg:flex-row">
               {actions?.map((ac) => (
                  <Button variant="outline" onClick={ac.action}>
                     {ac.Icon && <ac.Icon />}
                     {ac.label}
                  </Button>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}

export default BackBoxUI;
