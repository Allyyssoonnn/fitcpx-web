import { getContracts } from "@/api/contracts";
import { getNextPayout, markPaymentReceived } from "@/api/payments";
import FitSelectMonthDate, { MONTHS } from "@/components/baseComponents/FitSelectMonthDate";
import FitPagination from "@/components/baseComponents/TableComponent/FitPagination";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { stateEmpresa } from "@/states/states";
import { formatarMoeda } from "@/utils";
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { BanknoteArrowDown, Check, Clipboard, Coins, HandCoins, MoreHorizontal, Paperclip } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

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

function Payments({ payments, date, refetch, onTotalsChange }: { date: Date }) {
   const navigate = useNavigate();
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState(null);
   const [columnFilters, setColumnFilters] = useState([]);

   const getColumns = useMemo(() => getPaymentColumns(navigate, onRecieved), [navigate, onRecieved]) as any;

   const table = useReactTable({
      data: payments,
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      columns: getColumns,
      state: {
         pagination,
         columnFilters,
         globalFilter,
      },
      getRowId: (row: any) => row.cod_aluno_contrato_pagamento.toString(),
      getCoreRowModel: getCoreRowModel(),
      manualPagination: false, // deixe false se os dados já estão todos carregados
      onPaginationChange: setPagination,
      getPaginationRowModel: getPaginationRowModel(),
      globalFilterFn: (row: any, _columnId, filterValue) => {
         if (!filterValue) return true; // sem filtro
         const raw = row.original.expiracao_aluno_contrato_pagamento;
         if (!raw) return false;
         const d = new Date(raw);
         return d.getFullYear() === filterValue.year && d.getMonth() === filterValue.month;
      },
   });

   const totals = useMemo(() => {
      if (!table.getState().globalFilter) return { total: 0, toReceive: 0 };

      const { year, month } = table.getState().globalFilter;

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
   }, [payments, table.getState().globalFilter]);

   useEffect(() => {
      // importante criar um novo objeto para disparar a refiltragem
      setGlobalFilter(date ? { year: date.getFullYear(), month: date.getMonth() } : null);
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

            <div className="mt-3 flex justify-between gap-2">
               <Input
                  placeholder="Pesquisar aluno"
                  value={table.getColumn("client")?.getFilterValue() ?? ""}
                  onChange={(e) => table.getColumn("client")?.setFilterValue(e.target.value)}
                  className="max-w-sm"
               />

               <Select
                  value={table.getColumn("status")?.getFilterValue() ?? ""}
                  onValueChange={(value) =>
                     table.getColumn("status")?.setFilterValue(value == "all" ? undefined : value)
                  }
                  className="max-w-sm"
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>

                  <SelectContent>
                     <SelectItem value="all">Todos os status</SelectItem>
                     <SelectItem value="Pending">Pendente</SelectItem>
                     <SelectItem value="overdue">Vencido</SelectItem>
                     <SelectItem value="succeeded">Disponível</SelectItem>
                     <SelectItem value="deleted">Removida</SelectItem>
                     <SelectItem value="refunded">Reembolsada</SelectItem>
                     <SelectItem value="paid">Repassado</SelectItem>
                     <SelectItem value="receivedCash">Recebido Manual</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </CardHeader>

         <CardContent>
            <div className="border rounded-md min-h-100">
               <Table className="min-h-100">
                  <TableHeader>
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow id={headerGroup.id}>
                           {headerGroup.headers.map((header) => (
                              <TableHead key={header.id} colSpan={header.colSpan}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                           ))}
                        </TableRow>
                     ))}
                  </TableHeader>

                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={getColumns.length} className="h-24 text-center">
                              Nenhum resultado
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>

                  <TableFooter>
                     <TableRow>
                        <TableCell colSpan={getColumns.length}>
                           <FitPagination table={table} />
                        </TableCell>
                     </TableRow>
                  </TableFooter>
               </Table>
            </div>
         </CardContent>
      </Card>
   );
}

const getPaymentColumns = (navigate, onRecieved) => [
   {
      id: "status",
      header: "Status",
      accessorFn: (row) => row.status_aluno_contrato_pagamento,
      filterFn: "includesString",
      cell: ({ row: { original } }) => {
         const status = original.status_aluno_contrato_pagamento;
         if (status === "receivedCash")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Manual
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Recebimento manual registrado; o app não controla este pagamento.</TooltipContent>
               </Tooltip>
            );
         if (status === "overdue")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-x-circle-fill text-danger" />
                        Vencido
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>A fatura ultrapassou a data de vencimento.</TooltipContent>
               </Tooltip>
            );
         if (status === "Pendente" || status === "Pending")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-x-circle-fill text-warning" />
                        Aguardando
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>O aluno ainda não efetuou o pagamento.</TooltipContent>
               </Tooltip>
            );
         if (status === "confirmed")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-info" />
                        Processando
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Pagamento efetuado pelo aluno, aguardando confirmação de recebimento.</TooltipContent>
               </Tooltip>
            );
         if (status === "succeeded")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Aprovado
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Valor já disponível para repasse.</TooltipContent>
               </Tooltip>
            );
         if (status === "paid")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Repassado
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Valor já disponível em sua conta.</TooltipContent>
               </Tooltip>
            );
         if (status === "deleted")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-x-circle-fill text-danger" />
                        Removida
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Cobraça cancelada e removida.</TooltipContent>
               </Tooltip>
            );
         if (status === "refunded")
            return (
               <Tooltip>
                  <TooltipTrigger>
                     <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Reembolsada
                     </Badge>
                  </TooltipTrigger>

                  <TooltipContent>Cobrança reembolsada para o cliente.</TooltipContent>
               </Tooltip>
            );
      },
   },
   {
      id: "client",
      header: "Aluno",
      accessorFn: (row) => row.contract?.aluno?.nome_aluno,
      filterFn: "includesString",
      cell: ({ row: { original } }) => original?.contract?.aluno?.nome_aluno,
   },
   {
      id: "dueDate",
      header: "Vencimento",
      cell: ({ row: { original } }) => moment(original?.expiracao_aluno_contrato_pagamento).format("DD/MM/YYYY"),
   },
   {
      id: "payoutDate",
      header: "Pagamento",
      cell: ({ row: { original } }) =>
         original.jsonwebhook_aluno_contrato_pagamento &&
         JSON.parse(original.jsonwebhook_aluno_contrato_pagamento)?.paymentDate
            ? moment(JSON.parse(original.jsonwebhook_aluno_contrato_pagamento).paymentDate).format("DD/MM/YYYY")
            : "-",
   },
   {
      id: "payoutDate",
      header: "Repasse",
      cell: ({ row: { original } }) =>
         original.repasse_aluno_contrato_pagamento
            ? // ? moment(original.repasse_aluno_contrato_pagamento).format("DD/MM/YYYY")
              getNextDate(new Date(original.repasse_aluno_contrato_pagamento))
            : "-",
   },
   {
      id: "type",
      header: "Forma de pag.",
      cell: ({ row: { original } }) => {
         const tipo = original?.forma_aluno_contrato_pagamento;
         if (tipo === "CREDIT_CARD") return "Crédito";
         if (tipo === "PIX") return "PIX";
         return tipo;
      },
   },
   {
      id: "value",
      header: "Valor",
      cell: ({ row: { original } }) => formatarMoeda(original?.valor_aluno_contrato_pagamento),
   },
   {
      id: "options",
      header: "",
      cell: ({ row: { original } }) => (
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
                           cod_aluno_contrato: original.contract?.cod_aluno_contrato,
                           cod_aluno: original.contract?.cod_aluno,
                        },
                     })
                  }
               >
                  <Paperclip />
                  Ver contrato
               </DropdownMenuItem>

               <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => window.open(original?.asaas_url, "_blank", "noopener,noreferrer")}
               >
                  <Clipboard />
                  Link de pagamento
               </DropdownMenuItem>

               {(original.status_aluno_contrato_pagamento === "Pending" ||
                  original.status_aluno_contrato_pagamento === "overdue" ||
                  original.status_aluno_contrato_pagamento === "Pendente") && (
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
                              Ao confirmar o pagamento, a cobrança será cancelada automaticamente, pois entendemos que
                              você recebeu o valor por outro meio manualmente.
                           </p>

                           <DialogFooter>
                              <DialogClose>
                                 <button className="btn btn-danger rounded">Fechar</button>
                              </DialogClose>

                              <button className="btn btn-success rounded" onClick={() => onRecieved(original.asaas_id)}>
                                 Confirmar
                              </button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  </div>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

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
