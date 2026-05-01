import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { modalShareOnlineSell } from "@/modals/shareOnlineSell";
import { Dumbbell, ShoppingCart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MenuBar() {
   const navigate = useNavigate();

   return (
      <ButtonGroup className="mb-3">
         <Button variant="outline" onClick={() => navigate("/planilha")}>
            <Dumbbell />
            Treinar aluno
         </Button>

         <Button variant="outline" onClick={() => navigate("/cadaluno")}>
            <Users />
            Novo aluno
         </Button>

         <Button variant="outline" onClick={() => modalShareOnlineSell.show()}>
            <ShoppingCart />
            Venda online
         </Button>
      </ButtonGroup>
   );
}
