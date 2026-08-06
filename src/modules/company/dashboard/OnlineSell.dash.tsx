import { Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { modalShareOnlineSell } from "@/modals/shareOnlineSell";

export function OnlineSellDash() {
   return (
      <Card className="overflow-hidden border bg-gradient-to-r from-primary/5 via-background to-primary/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
         <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
         <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />

         {/* <CardContent className="grid items-center gap-8 p-8 md:grid-cols-[1fr_240px]"> */}
         <CardContent className="relative grid items-center gap-8 p-8 md:grid-cols-[1fr_240px]">
            {/* Conteúdo */}
            <div className="space-y-5">
               <Badge variant="secondary" className="w-fit">
                  Venda Online
               </Badge>

               <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Compartilhe seu link de vendas</h2>

                  <p className="max-w-md text-sm text-muted-foreground leading-6">
                     Permita que novos alunos contratem seus planos de forma totalmente online, sem precisar entrar em
                     contato com você.
                  </p>
               </div>

               <Button onClick={() => modalShareOnlineSell.show()} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar Link
               </Button>
            </div>

            {/* Imagem */}
            <div className="hidden justify-center md:flex">
               <img
                  src="/assets/images/sell.png"
                  alt="Venda Online"
                  className="w-56 drop-shadow-xl transition-transform duration-300 hover:scale-105"
               />
            </div>
         </CardContent>
      </Card>
   );
}
