import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

function BackBoxUI() {
   const navigate = useNavigate();

   return (
      <Card className="mb-3">
         <CardContent>
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
         </CardContent>
      </Card>
   );
}

export default BackBoxUI;
