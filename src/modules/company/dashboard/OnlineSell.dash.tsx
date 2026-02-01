import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { modalShareOnlineSell } from "@/modals/shareOnlineSell";
import { Earth } from "lucide-react";

export function OnlineSellDash() {
   return (
      <Card className="relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

         <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex gap-2 items-center">
               <Earth className="text-primary" />
               <div>
                  <CardTitle>Venda Online</CardTitle>
                  <CardDescription className="d-flex justify-between items-center">
                     Link para seu aluno contratar um plano
                  </CardDescription>
               </div>
            </div>

            <Button size="sm" className="w-full sm:w-auto" onClick={() => modalShareOnlineSell.show()}>
               Compartilhar Link
            </Button>
         </CardHeader>
      </Card>
   );
}
