import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Pen, Phone } from "lucide-react";
import { Company, Plan } from "../types";

// --- Componente Resume (Mantido igual, apenas tipagem limpa) ---
export function Resume({
   plans,
   selectedPlan,
   handlePlanChange,
   company,
   allowSelectPlan,
   register = false,
}: {
   plans: Plan[];
   company: Company | null;
   selectedPlan: Plan | undefined;
   handlePlanChange: (value: string) => void;
   allowSelectPlan: boolean;
   register: boolean;
}) {
   return (
      <Card className="h-fit shadow-sm border-muted-foreground/10 pb-0">
         <CardHeader>
            {!register ? (
               <>
                  <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                  <CardDescription>Confira os detalhes da sua assinatura</CardDescription>
               </>
            ) : (
               <CardTitle className="text-xl">Formulário de Inscrição</CardTitle>
            )}
         </CardHeader>

         <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
               {company?.img && company.img !== "-" && (
                  <img src={company.img} alt="Logo" className="rounded-lg object-cover border w-24 h-24 shadow-sm" />
               )}
               <div className="space-y-1.5 text-sm">
                  <h3 className="font-semibold text-lg text-foreground">{company?.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <MapPin className="h-4 w-4" />
                     <span>{company?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Phone className="h-4 w-4" />
                     <span>{company?.phone}</span>
                  </div>
               </div>
            </div>
            {!register && (
               <>
                  <Separator />

                  <div className="space-y-2">
                     <Label>Plano Selecionado</Label>
                     <Select onValueChange={handlePlanChange} value={selectedPlan?.value} disabled={!allowSelectPlan}>
                        <SelectTrigger className="w-full bg-background">
                           <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                           {plans.map((plan) => (
                              <SelectItem key={plan.value} value={plan.value}>
                                 {plan.label} -{" "}
                                 {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    plan.price,
                                 )}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     {selectedPlan?.contractId && (
                        <div className="flex items-center ms-2 gap-1 mt-2">
                           <Pen size={10} color="green" />
                           <Label className="text-primary text-[11px]">
                              Este plano contém contrato que deve ser assinado após a compra
                           </Label>
                        </div>
                     )}
                  </div>
               </>
            )}
         </CardContent>

         <CardFooter className="bg-muted/30 p-6 flex sm:flex-row justify-between items-start gap-4 rounded-b-xl border-t">
            {!register && (
               <>
                  <div className="text-sm text-muted-foreground">
                     Duração: <br />
                     <span className="font-medium text-foreground">
                        {selectedPlan?.duration ?? "-"} {selectedPlan && selectedPlan.duration > 1 ? "meses" : "mês"}
                     </span>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-muted-foreground block">Valor Total</span>
                     <span className="text-3xl font-bold text-primary">
                        {selectedPlan?.price
                           ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                selectedPlan.price,
                             )
                           : "-"}
                     </span>
                  </div>
               </>
            )}
         </CardFooter>
      </Card>
   );
}
