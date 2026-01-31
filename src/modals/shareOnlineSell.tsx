import { getPlans } from "@/api/plans";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { stateUsuario } from "../states/states";

const ShareOnlineSell = NiceModal.create(
   ({
      studentId,
      studentName,
      addressJSON,
      personalJSON,
   }: {
      studentId: number;
      studentName: string;
      addressJSON: string;
      personalJSON: string;
   }) => {
      const [usuario] = useRecoilState(stateUsuario) as any;
      const { visible, remove } = useModal();
      const [planId, setPlanId] = useState<any>();

      const { data: planos } = useQuery({
         queryKey: ["planos"],
         queryFn: () => getPlans(false),
         initialData: [],
      });

      const generateLink = () => {
         // TODO: Replace this hardcoded token with a prop or context value if needed
         const paramsObj: Record<string, string> = {
            token: `1109-00${usuario?.cod_empresa ?? 0}-2001`,
         };

         if (planId) {
            paramsObj.planId = planId;
            paramsObj.token = `1109-10${usuario?.cod_empresa ?? 0}-2001`;
         }

         if (studentId && studentName) {
            paramsObj.studentId = String(studentId);
            paramsObj.studentName = studentName;
            paramsObj.addressJSON = addressJSON;
            paramsObj.personalJSON = personalJSON;
         }

         const searchParams = new URLSearchParams(paramsObj).toString();
         return `${window.location.origin}/checkout?${searchParams}`;
      };

      async function handleCopyLink() {
         const link = generateLink();

         try {
            await navigator.clipboard.writeText(link);
            toast.success("Link copiado para a área de transferência!");
         } catch (err) {
            console.error("Falha ao copiar", err);
         }
      }

      function handleOpenLink() {
         const link = generateLink();
         window.open(link, "_blank", "noopener,noreferrer");
      }

      return (
         <Dialog open={visible} onOpenChange={remove}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="text-black">Venda Online</DialogTitle>
                  <DialogDescription>
                     Compartilhe o link com {studentName ? <strong>{studentName}</strong> : "seu futuro aluno"} para que
                     realize a compra de um dos seus planos cadastrados.
                  </DialogDescription>
               </DialogHeader>

               <Field>
                  <FieldLabel>Selecione um plano (Opcional)</FieldLabel>
                  <FieldContent className="flex flex-row">
                     <Select key={planId ?? "empty"} value={planId ?? ""} onValueChange={setPlanId}>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>

                        <SelectContent>
                           {planos.map((plan: any) => (
                              <SelectItem value={plan.cod_plano}>{plan.nome_plano}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPlanId(undefined)}
                        disabled={!planId}
                        title="Limpar seleção"
                     >
                        <Trash className="h-4 w-4 text-destructive" />
                     </Button>
                  </FieldContent>

                  <FieldDescription className="mt-2 text-[11px] text-muted-foreground">
                     Caso selecione um plano, o aluno não poderá escolher outro e irá direto para o pagamento.
                  </FieldDescription>
               </Field>

               <DialogFooter className="flex items-center">
                  {!planos?.length && <Label className="text-[12px] text-destructive">Nenhum plano cadastrado</Label>}

                  <Button variant="outline" onClick={handleOpenLink} disabled={!planos?.length}>
                     Abrir Link
                  </Button>

                  <Button onClick={handleCopyLink} disabled={!planos?.length}>
                     Copiar Link
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   },
);

export const modalShareOnlineSell = {
   show: (props?: any) => NiceModal.show(ShareOnlineSell, props),
   hide: () => NiceModal.hide(ShareOnlineSell),
};
