import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";

// Tipagem das props que o modal recebe
interface ConfirmContractProps {
   student: any;
   plan: any;
   onConfirm: () => Promise<void>; // A função que chama a API
}

export const ConfirmContract = NiceModal.create(({ student, plan, onConfirm }: ConfirmContractProps) => {
   const modal = useModal();
   const [isLoading, setIsLoading] = useState(false);

   // Formatação de valores e textos
   const valorFormatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      plan.valor_total,
   );

   const metodoLabel =
      {
         monthly: "Recorrência Mensal",
         cash: "À Vista",
         installments: `Parcelado em ${plan.parcelas || 1}x`,
      }[plan.metodo_pagamento as string] || plan.metodo_pagamento;

   const handleConfirm = async () => {
      setIsLoading(true);
      try {
         await onConfirm(); // Executa a função passada pelo pai
         modal.remove(); // Fecha o modal após sucesso
      } catch (error) {
         console.error(error);
         setIsLoading(false); // Para o loading se der erro
      }
   };

   return (
      <Dialog open={modal.visible} onOpenChange={modal.remove}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Confirmar Contratação</DialogTitle>
               <DialogDescription>
                  {student?.cod_aluno
                     ? `Olá, ${student?.nome_aluno}. Identificamos que você já possui cadastro.`
                     : `Olá, ${student?.nome_aluno}. Verifique os dados abaixo antes de finalizar.`}
               </DialogDescription>
            </DialogHeader>

            {/* Corpo do Modal - Resumo */}
            <div className="grid gap-4 py-4">
               <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-1">
                     <p className="text-sm font-medium leading-none">{plan?.nome_plano}</p>
                     <p className="text-sm text-muted-foreground">{metodoLabel}</p>
                  </div>
                  <div className="font-bold text-lg">{valorFormatado}</div>
               </div>

               {/* Exemplo: Se for parcelado, mostrar detalhe */}
               {plan.metodo_pagamento === "installments" && (
                  <p className="text-xs text-center text-muted-foreground">
                     As parcelas serão processadas no seu cartão de crédito.
                  </p>
               )}
            </div>

            <DialogFooter className="flex-row sm:justify-end gap-2">
               <Button variant="outline" onClick={modal.remove} disabled={isLoading}>
                  Cancelar
               </Button>
               <Button onClick={handleConfirm} disabled={isLoading}>
                  {isLoading ? "Processando..." : "Confirmar e Pagar"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
});

// Helper para abrir o modal com tipagem
export const modalConfirmContract = {
   show: (props: ConfirmContractProps) => NiceModal.show(ConfirmContract, props),
   hide: () => NiceModal.hide(ConfirmContract),
};
