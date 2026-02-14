import { getContracts } from "@/api/contracts";
import { getNextPayout, markPaymentReceived } from "@/api/payments";
import FitSelectMonthDate, { MONTHS } from "@/components/baseComponents/FitSelectMonthDate";
import { FitTable } from "@/components/baseComponents/FitTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { stateEmpresa } from "@/states/states";
import { useQuery } from "@tanstack/react-query";
import { BanknoteArrowDown, Check, Clipboard, Coins, HandCoins, MoreHorizontal, Paperclip } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"; // UseRecoilValue se não for setar o estado
import { formatarMoeda } from "../../utils/utils";

// --- Interfaces ---
interface PaymentType {
   asaas_id: string;
   valor_aluno_contrato_pagamento: number;
   liquido_aluno_contrato_pagamento: number;
   status_aluno_contrato_pagamento: string;
   expiracao_aluno_contrato_pagamento: string;
   pagamento_aluno_contrato_pagamento?: string;
   repasse_aluno_contrato_pagamento?: string;
   forma_aluno_contrato_pagamento: string;
   jsonwebhook_aluno_contrato_pagamento?: string;
   asaas_url?: string;
   contract: {
      cod_aluno_contrato: string;
      cod_aluno: string;
      aluno: {
         nome_aluno: string;
      };
   };
}

interface CompanyType {
   pix_empresa: string;
}

// --- Componente Principal ---
export default function FinanceOverview() {
   const [date, setDate] = useState<Date>(new Date());
   const empresa = useRecoilValue<CompanyType>(stateEmpresa);

   const { data: nextPayout } = useQuery({
      queryKey: ["nextPayout"],
      queryFn: () => getNextPayout(),
      initialData: { value: 0, date: null },
   });

   const { data: contratos, refetch } = useQuery({
      queryKey: ["contratos"],
      queryFn: () => getContracts(),
      initialData: [],
   });

   // 1. Unificar todos os pagamentos
   const allPayments: PaymentType[] = useMemo(() => {
      return (
         contratos.reduce(
            (resp: any, contract: any) => [
               ...resp,
               ...(contract?.pagamentos?.map((payment: any) => ({
                  ...payment,
                  contract,
               })) ?? []),
            ],
            [],
         ) || []
      );
   }, [contratos]);

   // 2. Filtrar e Calcular Totais aqui no Pai (Evita render loop)
   const { filteredPayments, totals } = useMemo(() => {
      const year = date.getFullYear();
      const month = date.getMonth();

      let total = 0;
      let toReceive = 0;
      let toReceiveConfirmed = 0; // Se não for usar na UI, não precisa calcular

      const filtered = allPayments.filter((payment) => {
         if (!payment.expiracao_aluno_contrato_pagamento) return false;
         const d = new Date(payment.expiracao_aluno_contrato_pagamento);
         return d.getFullYear() === year && d.getMonth() === month;
      });

      filtered.forEach((payment) => {
         total += payment.valor_aluno_contrato_pagamento;

         const status = payment.status_aluno_contrato_pagamento;

         // Lógica de "A receber"
         if (["Pending", "overdue", "Pendente"].includes(status)) {
            toReceive += payment.liquido_aluno_contrato_pagamento;
         }

         // Lógica de "Confirmado" (se necessário futuramente)
         if (["confirmed", "succeeded"].includes(status)) {
            toReceiveConfirmed += payment.liquido_aluno_contrato_pagamento;
         }
      });

      return { filteredPayments: filtered, totals: { total, toReceive, toReceiveConfirmed } };
   }, [allPayments, date]);

   return (
      <div className="w-full p-4 space-y-4">
         {(!empresa?.pix_empresa || empresa?.pix_empresa === "") && (
            <div className="text-center py-3 bg-secondary rounded-md">
               Você não preencheu a chave PIX para repasses,{" "}
               <Link to="/configuracao?tab=2" className="text-green-600 font-bold hover:underline">
                  clique aqui
               </Link>{" "}
               e preencha para receber os repasses.
            </div>
         )}

         {/* Grid de Cards (Substituído Bootstrap por Tailwind Grid) */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex flex-col justify-between h-35">
               <CardHeader>
                  <CardTitle>Resumo financeiro</CardTitle>
               </CardHeader>
               <CardContent>
                  <Label className="m-0">Selecione o mês</Label>
                  <FitSelectMonthDate date={date} setDate={setDate} />
               </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all flex flex-col justify-between">
               <CardHeader>
                  <CardTitle>Total</CardTitle>
               </CardHeader>
               <CardContent className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-muted-foreground" />
                  <h5 className="text-xl font-bold">{formatarMoeda(totals.total)}</h5>
               </CardContent>
               <CardFooter>
                  <CardDescription>Valor total de pagamentos</CardDescription>
               </CardFooter>
            </Card>

            <Card className="hover:scale-105 transition-all flex flex-col justify-between">
               <CardHeader>
                  <CardTitle>A receber</CardTitle>
               </CardHeader>
               <CardContent className="flex items-center gap-2">
                  <HandCoins className="h-5 w-5 text-muted-foreground" />
                  <div>
                     <h5 className="text-xl font-bold mb-0">{formatarMoeda(totals.toReceive)}</h5>
                     <Label className="text-primary text-xs">{formatarMoeda(totals.toReceiveConfirmed)}</Label>
                  </div>
               </CardContent>
               <CardFooter className="flex flex-col items-start gap-1">
                  <CardDescription>Valor total a ser recebido</CardDescription>
                  <span className="text-xs text-muted-foreground">* Não inclui recebidos manualmente</span>
               </CardFooter>
            </Card>

            <Card className="hover:scale-105 transition-all flex flex-col justify-between">
               <CardHeader>
                  <CardTitle>Próximo repasse</CardTitle>
               </CardHeader>
               <CardContent className="flex items-center gap-2">
                  <BanknoteArrowDown className="h-5 w-5 text-muted-foreground" />
                  <h5 className="text-xl font-bold">{formatarMoeda(nextPayout.value)}</h5>
               </CardContent>
               <CardFooter>
                  <CardDescription>
                     Transação em <strong className="text-primary">{nextPayout.date || "--/--"}</strong>
                  </CardDescription>
               </CardFooter>
            </Card>
         </div>

         <div className="mt-4">
            <PaymentsTable
               payments={filteredPayments} // Passa a lista JÁ filtrada
               date={date}
               refetch={refetch}
            />
         </div>
      </div>
   );
}

// --- Componente da Tabela ---
const fields = [
   { value: "all", label: "Todos os status" },
   { value: "Pending", label: "Aguardando" },
   { value: "confirmed", label: "Processando" },
   { value: "overdue", label: "Vencido" },
   { value: "succeeded", label: "Disponível" },
   { value: "deleted", label: "Removida" },
   { value: "refunded", label: "Reembolsada" },
   { value: "paid", label: "Repassado" },
   { value: "receivedCash", label: "Recebido Manual" },
];

function PaymentsTable({ payments, date, refetch }: { payments: PaymentType[]; date: Date; refetch: () => void }) {
   async function onRecieved(id: string) {
      await markPaymentReceived(id);
      refetch();
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>
               Pagamentos criados em{" "}
               <strong className="text-green-500">
                  {MONTHS[date.getMonth()]}/{date.getFullYear()}
               </strong>
            </CardTitle>
         </CardHeader>

         <CardContent className="min-h-[400px]">
            <FitTable.Root
               // Removemos globalFilterFn complexo pois os dados já chegam filtrados por data do pai
               fieldSearch="contract.aluno.nome_aluno"
               className="shadow-none"
               columns={[
                  {
                     header: "Status",
                     name: "status_aluno_contrato_pagamento",
                     getCell: (row) => getStatusBadge(row.status_aluno_contrato_pagamento),
                     canSort: true,
                     accessorFn: (row) => row.status_aluno_contrato_pagamento,
                     filterFn: (row, columnId, filterValue: string[]) => {
                        if (!filterValue || filterValue.length === 0 || filterValue.includes("all")) return true;
                        const status = row.getValue(columnId) as string;
                        let normalizedKey = status;
                        if (status === "Pendente") normalizedKey = "Pending";
                        return filterValue.includes(normalizedKey);
                     },
                  },
                  {
                     header: "Aluno",
                     name: "contract.aluno.nome_aluno",
                     accessorFn: (row) => row.contract?.aluno?.nome_aluno,
                     filterFn: "includesString",
                     canSort: true,
                  },
                  {
                     header: "Vencimento",
                     name: "expiracao_aluno_contrato_pagamento",
                     type: "date",
                     canSort: true,
                  },
                  {
                     header: "Pagamento",
                     name: "pagamento_aluno_contrato_pagamento",
                     getCell: (row) => {
                        if (!row.jsonwebhook_aluno_contrato_pagamento) return "-";
                        try {
                           const parsed = JSON.parse(row.jsonwebhook_aluno_contrato_pagamento);
                           return parsed.paymentDate ? moment(parsed.paymentDate).format("DD/MM/YYYY") : "-";
                        } catch {
                           return "-";
                        }
                     },
                  },
                  {
                     header: "Repasse",
                     name: "repasse_aluno_contrato_pagamento",
                     getCell: (row) =>
                        row.repasse_aluno_contrato_pagamento
                           ? getNextDate(new Date(row.repasse_aluno_contrato_pagamento))
                           : "-",
                  },
                  {
                     header: "Forma",
                     name: "forma_aluno_contrato_pagamento",
                     getCell: (row) => {
                        const tipo = row?.forma_aluno_contrato_pagamento;
                        if (tipo === "CREDIT_CARD") return "Crédito";
                        if (tipo === "PIX") return "PIX";
                        return tipo;
                     },
                     canSort: true,
                  },
                  {
                     header: "Valor",
                     name: "valor_aluno_contrato_pagamento",
                     type: "currency",
                     canSort: true,
                  },
                  {
                     header: "",
                     name: "option",
                     getCell: (row) => <PaymentActions row={row} onRecieved={onRecieved} />,
                  },
               ]}
               list={payments}
            >
               <FitTable.Visibles options={fields} prefixLocalStorage="hidden-finance" />
            </FitTable.Root>
         </CardContent>
      </Card>
   );
}

// --- Componente de Ações (Corrigido Dialog) ---
function PaymentActions({ row, onRecieved }: { row: PaymentType; onRecieved: (id: string) => void }) {
   const navigate = useNavigate();
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const canMarkReceived =
      row.status_aluno_contrato_pagamento === "Pending" ||
      row.status_aluno_contrato_pagamento === "overdue" ||
      row.status_aluno_contrato_pagamento === "Pendente";

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
               <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                     navigate("/contrato", {
                        state: {
                           cod_aluno_contrato: row.contract?.cod_aluno_contrato,
                           cod_aluno: row.contract?.cod_aluno,
                        },
                     })
                  }
               >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Ver contrato
               </DropdownMenuItem>

               {row?.asaas_url && (
                  <DropdownMenuItem
                     className="cursor-pointer"
                     onClick={() => window.open(row.asaas_url, "_blank", "noopener,noreferrer")}
                  >
                     <Clipboard className="mr-2 h-4 w-4" />
                     Link de pagamento
                  </DropdownMenuItem>
               )}

               {canMarkReceived && (
                  <DropdownMenuItem
                     className="cursor-pointer text-green-600 focus:text-green-700"
                     onSelect={(e) => {
                        e.preventDefault(); // Impede o fechamento imediato se necessário, mas usar state é melhor
                        setIsDialogOpen(true);
                     }}
                  >
                     <Check className="mr-2 h-4 w-4" />
                     Marcar como recebido
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Dialog movido para fora do DropdownMenu para evitar bugs de unmount */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <CardTitle className="text-start">Confirmação de pagamento recebido</CardTitle>
               </DialogHeader>

               <p className="text-sm text-muted-foreground">
                  Ao confirmar o pagamento, a cobrança será cancelada automaticamente, pois entendemos que você recebeu
                  o valor por outro meio manualmente.
               </p>

               <DialogFooter className="flex flex-row justify-end gap-2">
                  <DialogClose asChild>
                     <Button variant="destructive">Fechar</Button>
                  </DialogClose>

                  <Button
                     variant="default"
                     className="bg-green-600 hover:bg-green-700 text-white"
                     onClick={() => {
                        onRecieved(row.asaas_id);
                        setIsDialogOpen(false);
                     }}
                  >
                     Confirmar
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}

// --- Funções Auxiliares ---

function getStatusBadge(status: string) {
   const pattern: Record<string, { label: string; description: string; type: string }> = {
      receivedCash: {
         label: "Manual",
         description: "Recebimento manual registrado; o app não controla este pagamento.",
         type: "text-green-600 border-green-600",
      },
      overdue: {
         label: "Vencido",
         description: "A fatura ultrapassou a data de vencimento.",
         type: "text-red-600 border-red-600",
      },
      Pendente: {
         label: "Aguardando",
         description: "A fatura ultrapassou a data de vencimento.",
         type: "text-amber-600 border-amber-600",
      },
      Pending: {
         label: "Aguardando",
         description: "O aluno ainda não efetuou o pagamento.",
         type: "text-amber-600 border-amber-600",
      },
      confirmed: {
         label: "Processando",
         description: "Pagamento efetuado pelo aluno, aguardando confirmação de recebimento.",
         type: "text-blue-600 border-blue-600",
      },
      succeeded: {
         label: "Disponível",
         description: "Valor já disponível para repasse.",
         type: "text-green-600 border-green-600",
      },
      paid: {
         label: "Repassado",
         description: "Valor já disponível em sua conta.",
         type: "text-green-600 border-green-600",
      },
      deleted: {
         label: "Removida",
         description: "Cobrança cancelada e removida.",
         type: "text-red-600 border-red-600",
      },
      refunded: {
         label: "Reembolsada",
         description: "Cobrança reembolsada para o cliente.",
         type: "text-amber-600 border-amber-600",
      },
   };

   const badgeData = pattern[status];

   if (!badgeData) {
      return <Badge variant="outline">Desconhecido</Badge>;
   }

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <Badge variant="outline" className={cn("gap-1 cursor-default", badgeData.type)}>
                  <i className="bi bi-circle-fill text-[8px]" /> {/* ou use um ícone Lucide */}
                  {badgeData.label}
               </Badge>
            </TooltipTrigger>
            <TooltipContent>
               <p>{badgeData.description}</p>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}

function getNextDate(date: Date) {
   const DAYS = [10, 20, 30];
   const now = date ?? new Date();
   const today = now.getDate();

   for (const day of DAYS) {
      if (today < day) {
         return new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString();
      }
   }

   // Se passou do dia 30, vai para o dia 10 do próximo mês
   return new Date(now.getFullYear(), now.getMonth() + 1, DAYS[0]).toLocaleDateString();
}
