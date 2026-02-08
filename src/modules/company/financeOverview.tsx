import { getContracts } from "@/api/contracts";
import { getNextPayout, markPaymentReceived } from "@/api/payments";
import FitSelectMonthDate, { MONTHS } from "@/components/baseComponents/FitSelectMonthDate";
import { FitTable } from "@/components/baseComponents/FitTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { stateEmpresa } from "@/states/states";
import { BanknoteArrowDown, Check, Clipboard, Coins, HandCoins, MoreHorizontal, Paperclip } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { formatarMoeda } from "../../utils/utils";

interface CompanyType {
   pix_empresa: string;
}

export default function FinanceOverview() {
   const [date, setDate] = useState<Date>(new Date());
   const [empresa] = useRecoilState<CompanyType>(stateEmpresa);
   const [value, setValue] = useState(0);
   const [valueRecieve, setValueRecieve] = useState(0);

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

   const payments = useMemo(() => {
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

   return (
      <div className="container-fluid">
         {(!empresa?.pix_empresa || empresa?.pix_empresa == "") && (
            <div>
               <div className="text-center py-3 bg-secondary">
                  Você não preencheu a chave PIX para repasses,{" "}
                  <a href="/configuracao?tab=2" className="text-success">
                     clique aqui
                  </a>{" "}
                  e preencha para receber os repasses.
               </div>
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-3">
            <div>
               <Card className="h-45">
                  <CardHeader>
                     <CardTitle>Resumo financeiro</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <Label>Selecione o mês</Label>
                     <FitSelectMonthDate date={date} setDate={setDate} />
                  </CardContent>
               </Card>
            </div>

            <div>
               <Card className="hover:scale-105 transition-all h-45">
                  <CardHeader>
                     <CardTitle>Total</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="card-body p-3 d-flex">
                        <Coins />
                        <h5 className="card-title ms-2">{formatarMoeda(value)}</h5>
                     </div>
                  </CardContent>

                  <CardFooter>
                     <CardDescription>Valor total de pagamentos</CardDescription>
                  </CardFooter>
               </Card>
            </div>

            <div>
               <Card className="hover:scale-105 transition-all h-45">
                  <CardHeader>
                     <CardTitle>A receber</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="card-body p-3 d-flex">
                        <HandCoins />
                        <h5 className="card-title ms-2">{formatarMoeda(valueRecieve)}</h5>
                     </div>
                  </CardContent>

                  <CardFooter className="d-flex flex-column items-start">
                     <CardDescription>Valor total a ser recebido</CardDescription>
                     <CardDescription className="fs-1 text-muted">* Não inclui recebidos manualmente</CardDescription>
                  </CardFooter>
               </Card>
            </div>

            <div>
               <Card className="hover:scale-105 transition-all h-45">
                  <CardHeader>
                     <CardTitle>Próximo repasse</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="card-body p-3 d-flex">
                        <BanknoteArrowDown />
                        <h5 className="card-title ms-2">{formatarMoeda(nextPayout.value)}</h5>
                     </div>
                  </CardContent>

                  <CardFooter>
                     <CardDescription>
                        Transação em <strong className="text-primary">{nextPayout.date}</strong>
                     </CardDescription>
                  </CardFooter>
               </Card>
            </div>
         </div>

         <div className="row mt-3">
            <div className="col-md-12">
               <Payments
                  payments={payments}
                  date={date}
                  refetch={refetch}
                  onTotalsChange={({ total, toReceive }) => {
                     setValue(total);
                     setValueRecieve(toReceive);
                  }}
               />
            </div>
         </div>
      </div>
   );
}

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

const globalFilterFn = (row: any, _columnId: string, filterValue: any) => {
   if (!filterValue) return true; // sem filtro
   const raw = row.original.expiracao_aluno_contrato_pagamento;
   if (!raw) return false;
   const d = new Date(raw);
   return d.getFullYear() === filterValue.year && d.getMonth() === filterValue.month;
};

function Payments({ payments, date, refetch, onTotalsChange }: { date: Date }) {
   const [globalFilter, setGlobalFilter] = useState();

   const totals = useMemo(() => {
      if (!globalFilter) return { total: 0, toReceive: 0 };

      const { year, month } = globalFilter;

      let total = 0;
      let toReceive = 0;

      payments.forEach((payment: any) => {
         const raw = payment.expiracao_aluno_contrato_pagamento;
         if (!raw) return;

         const d = new Date(raw);
         if (d.getFullYear() === year && d.getMonth() === month) {
            total += payment.valor_aluno_contrato_pagamento;
            if (
               payment?.status_aluno_contrato_pagamento !== "overdue" &&
               payment?.status_aluno_contrato_pagamento !== "receivedCash"
            )
               toReceive += payment.liquido_aluno_contrato_pagamento;
         }
      });

      return { total, toReceive };
   }, [payments, globalFilter]);

   useEffect(() => {
      // importante criar um novo objeto para disparar a refiltragem
      setGlobalFilter(date ? { year: date.getFullYear(), month: date.getMonth() } : undefined);
   }, [date]);

   useEffect(() => {
      if (onTotalsChange) {
         onTotalsChange(totals);
      }
   }, [totals, onTotalsChange]);

   async function onRecieved(id) {
      await markPaymentReceived(id);
      refetch();
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>
               Pagamentos criados em{" "}
               <strong className="text-green-400">
                  {MONTHS[date.getMonth()]}/{date.getFullYear()}
               </strong>
            </CardTitle>
         </CardHeader>

         <CardContent className="min-h-100">
            <FitTable.Root
               globalFilter={globalFilter}
               globalFilterFn={globalFilterFn}
               fieldSearch="contract.aluno.nome_aluno"
               className="shadow-none"
               columns={[
                  {
                     header: "Status",
                     name: "status_aluno_contrato_pagamento",
                     getCell: (row) => getStatusBadge(row.status_aluno_contrato_pagamento),
                     canSort: true,
                     accessorFn: (row) => row.status_aluno_contrato_pagamento,
                     // 'includesString' não funciona com Arrays. Usamos esta função personalizada:
                     filterFn: (row, columnId, filterValue: string[]) => {
                        // Se não houver filtro ou se "all" estiver no array, mostra tudo
                        if (!filterValue || filterValue.length === 0) return false;
                        // Lógica defensiva para caso 'all' seja passado
                        if (filterValue.includes("all")) return true;

                        const status = row.getValue(columnId) as string;

                        // Normalização para garantir que 'Pendente' (banco) bata com 'Pending' (filtro)
                        let normalizedKey = status;
                        if (status === "Pendente") normalizedKey = "Pending";

                        // Verifica se o status da linha existe no array de filtros marcados
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
                     getCell: (row) =>
                        row.jsonwebhook_aluno_contrato_pagamento &&
                        JSON.parse(row.jsonwebhook_aluno_contrato_pagamento)?.paymentDate
                           ? moment(JSON.parse(row.jsonwebhook_aluno_contrato_pagamento).paymentDate).format(
                                "DD/MM/YYYY",
                             )
                           : "-",
                  },
                  {
                     header: "Repasse",
                     name: "repasse_aluno_contrato_pagamento",
                     getCell: (row) =>
                        row.repasse_aluno_contrato_pagamento
                           ? // ? moment(original.repasse_aluno_contrato_pagamento).format("DD/MM/YYYY")
                             getNextDate(new Date(row.repasse_aluno_contrato_pagamento))
                           : "-",
                  },
                  {
                     header: "Forma de pagamento",
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
               <FitTable.Visibles options={fields} prefixLocalStorage="hiddne-finance" />
            </FitTable.Root>
         </CardContent>
      </Card>
   );
}

function getStatusBadge(status: string) {
   const pattern: Record<string, { label: string; description: string; type: string }> = {
      receivedCash: {
         label: "Manual",
         description: "Recebimento manual registrado; o app não controla este pagamento.",
         type: "success",
      },
      overdue: { label: "Vencido", description: "A fatura ultrapassou a data de vencimento.", type: "danger" },
      Pendente: { label: "Aguardando", description: "A fatura ultrapassou a data de vencimento.", type: "warning" },
      Pending: { label: "Aguardando", description: "O aluno ainda não efetuou o pagamento.", type: "warning" },
      confirmed: {
         label: "Processando",
         description: "Pagamento efetuado pelo aluno, aguardando confirmação de recebimento.",
         type: "info",
      },
      succeeded: { label: "Processando", description: "Valor já disponível para repasse.", type: "success" },
      paid: { label: "Repassado", description: "Valor já disponível em sua conta.", type: "success" },
      deleted: { label: "Removida", description: "Cobraça cancelada e removida.", type: "danger" },
      refunded: { label: "Reembolsada", description: "Cobrança reembolsada para o cliente.", type: "warning" },
   };

   const badgeData = pattern[status];
   if (!badgeData) {
      return <Badge variant="outline">Desconhecido</Badge>;
   }
   const classType = `text-${badgeData.type}`;

   return (
      <Tooltip>
         <TooltipTrigger>
            <Badge variant="outline">
               <i className={cn(["bi bi-check-circle-fill", classType])} />
               {badgeData.label}
            </Badge>
         </TooltipTrigger>

         <TooltipContent>{badgeData.description}</TooltipContent>
      </Tooltip>
   );
}

function PaymentActions({ row, onRecieved }: { row: any; onRecieved: (id: string) => void }) {
   const navigate = useNavigate();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
               <MoreHorizontal />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent>
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
               <Paperclip />
               Ver contrato
            </DropdownMenuItem>

            <DropdownMenuItem
               className="cursor-pointer"
               onClick={() => window.open(row?.asaas_url, "_blank", "noopener,noreferrer")}
            >
               <Clipboard />
               Link de pagamento
            </DropdownMenuItem>

            {(row.status_aluno_contrato_pagamento === "Pending" ||
               row.status_aluno_contrato_pagamento === "overdue" ||
               row.status_aluno_contrato_pagamento === "Pendente") && (
               <div>
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button variant="ghost" className="ps-2 py-0.5">
                           <Check />
                           Marcar como recebido
                        </Button>
                     </DialogTrigger>

                     <DialogContent className="col-md-3 col-12">
                        <DialogHeader>
                           <h5 className="text-start card-title">Confirmação de pagamento recebido</h5>
                        </DialogHeader>

                        <p>
                           Ao confirmar o pagamento, a cobrança será cancelada automaticamente, pois entendemos que você
                           recebeu o valor por outro meio manualmente.
                        </p>

                        <DialogFooter>
                           <DialogClose>
                              <button className="btn btn-danger rounded">Fechar</button>
                           </DialogClose>

                           <button className="btn btn-success rounded" onClick={() => onRecieved(row.asaas_id)}>
                              Confirmar
                           </button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </div>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
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

   return new Date(now.getFullYear(), now.getMonth() + 1, DAYS[0]).toLocaleDateString();
}
