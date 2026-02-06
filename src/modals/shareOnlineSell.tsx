import { getCheckoutLink } from "@/api/companies";
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
      studentPhone,
   }: {
      studentId: number;
      studentName: string;
      addressJSON: string;
      personalJSON: string;
      studentPhone: string;
   }) => {
      const [usuario] = useRecoilState(stateUsuario) as any;
      const { visible, remove } = useModal();
      const [planId, setPlanId] = useState<any>();

      const { data: planos } = useQuery({
         queryKey: ["onlinePlans"],
         queryFn: async () => {
            const resp = await getPlans(false);
            return (resp ?? []).filter((plan: any) => plan.vende_online === "S");
         },
         initialData: [],
      });

      const generateLink = async () => {
         const sID = await getCheckoutLink(planId, studentId);

         // TODO: Replace this hardcoded token with a prop or context value if needed
         const paramsObj: Record<string, string> = {
            s: sID,
         };

         const searchParams = new URLSearchParams(paramsObj).toString();
         return `${window.location.origin}/checkout?${searchParams}`;
      };

      async function handleCopyLink() {
         const link = await generateLink();

         try {
            await navigator.clipboard.writeText(link);
            toast.success("Link copiado para a área de transferência!");
         } catch (err) {
            console.error("Falha ao copiar", err);
         }
      }

      async function handleOpenLink() {
         const link = await generateLink();
         window.open(link, "_blank", "noopener,noreferrer");
      }

      async function handleSendLink() {
         const link = await generateLink();
         const firstName = studentName.split(" ")[0];

         // TEXTO MELHORADO
         // Opção 1 (Mais amigável):
         const text = `Olá, ${firstName}! Tudo bem? \n\nAqui está o link seguro para finalizar sua matrícula e garantir seu plano:\n\n${link}\n\nQualquer dúvida, é só chamar!`;

         // Codifica o texto para URL
         const encodedText = encodeURIComponent(text);

         window.open(`https://wa.me/${studentPhone}?text=${encodedText}`, "_blank");
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
                     <Select
                        key={planId ?? "empty"}
                        value={planId ?? ""}
                        onValueChange={setPlanId}
                        disabled={!planos?.length}
                     >
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

                  {studentPhone && (
                     <Button variant="outline" onClick={handleSendLink} disabled={!planos?.length}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                           <path
                              fill="currentColor"
                              d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                           />
                        </svg>
                        Enviar
                     </Button>
                  )}

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
