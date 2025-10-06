import { getContracts } from "@/api/contracts";
import { markPaymentReceived } from "@/api/payments";
import FitSelectDate from "@/components/baseComponents/FitSelectDate";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Check, Clipboard, Coins, HandCoins, MessageCircleMore, MoreHorizontal, Paperclip } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export default function FinanceOverview() {
   const [date, setDate] = useState();
   const [empresa] = useRecoilState(stateEmpresa);
   const [value, setValue] = useState(0);
   const [valueRecieve, setValueRecieve] = useState(0);

   const { data: contratos, refetch } = useQuery({
      queryKey: ["contratos", empresa.cod_empresa],
      queryFn: getContracts,
      initialData: [],
      enabled: !!empresa.cod_empresa,
   });

   const payments = useMemo(() => {
      return (
         contratos.reduce(
            (resp, contract) => [
               ...resp,
               ...(contract?.pagamentos?.map((payment) => ({
                  ...payment,
                  contract,
               })) ?? []),
            ],
            []
         ) || []
      );
   }, [contratos]);

   const maxDate = useMemo(() => {
      const max = payments
         .map((p) => new Date(p?.expiracao_aluno_contrato_pagamento))
         .reduce((a, b) => (a > b ? a : b), new Date());

      return max ?? new Date();
   }, [payments]);

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

         <div className="row">
            <div className="col-md-3">
               <Card className="h-45">
                  <CardHeader>
                     <CardTitle>Resumo financeiro</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <FitSelectDate
                        minDate={payments[0]?.data_aluno_contrato_pagamento ?? new Date()}
                        maxDate={maxDate}
                        value={date}
                        onChange={(value) => setDate(value)}
                     />
                  </CardContent>
               </Card>
            </div>

            <div className="col-md-3">
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

            <div className="col-md-3">
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

                  <CardFooter className="d-flex flex-column">
                     <CardDescription>Valor total a ser recebido</CardDescription>
                     <CardDescription className="fs-1 text-muted">* Não inclui recebidos manualmente</CardDescription>
                  </CardFooter>
               </Card>
            </div>

            <div className="col-md-3">
               <Card className="hover:scale-105 transition-all h-45">
                  <CardHeader>
                     <CardTitle>Entrar em contato</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="d-flex justify-center">
                        <button
                           className="btn d-flex btn-outline-success rounded-3 py-1"
                           onClick={() => window.open("https://wa.me/5544991654044", "_blank")}
                        >
                           <MessageCircleMore size={20} className="me-2" />
                           Suporte
                        </button>
                     </div>
                  </CardContent>

                  <CardFooter>
                     <CardDescription>Tirar dúvidas sobre pagamentos</CardDescription>
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

function Payments({ payments, date, refetch, onTotalsChange }) {
   const navigate = useNavigate();
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState(null);
   const [columnFilters, setColumnFilters] = useState([]);

   const getColumns = useMemo(() => getPaymentColumns(navigate, onRecieved), [navigate, onRecieved]);

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
      getRowId: (row) => row.cod_aluno_contrato_pagamento.toString(),
      getCoreRowModel: getCoreRowModel(),
      manualPagination: false, // deixe false se os dados já estão todos carregados
      onPaginationChange: setPagination,
      getPaginationRowModel: getPaginationRowModel(),
      globalFilterFn: (row, _columnId, filterValue) => {
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

      payments.forEach((payment) => {
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
      setGlobalFilter(date ? { year: date.year, month: date.month } : null);
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
               Pagamentos de {String(date?.month).padStart(2, "0")}/{String(date?.year).padEnd(2, "0")}
            </CardTitle>
         </CardHeader>

         <CardContent>
            <div className="mb-3 d-flex gap-2">
               <input
                  placeholder="Filtrar aluno"
                  value={table.getColumn("client")?.getFilterValue() ?? ""}
                  onChange={(e) => table.getColumn("client")?.setFilterValue(e.target.value)}
                  className="form-control"
               />

               <select
                  value={table.getColumn("status")?.getFilterValue() ?? ""}
                  onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value)}
                  className="form-select"
               >
                  <option value="">Todos os status</option>
                  <option value="Pending">Pendente</option>
                  <option value="overdue">Vencido</option>
                  <option value="succeeded">Disponível</option>
                  <option value="paid">Repassado</option>
                  <option value="receivedCash">Recebido Manual</option>
               </select>
            </div>

            <Table>
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
            </Table>
         </CardContent>

         <CardFooter className="d-flex justify-end">
            <FitPagination table={table} />
         </CardFooter>
      </Card>
   );
}

const getPaymentColumns = (navigate, onRecieved) => [
   {
      id: "status",
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

                  <TooltipContent>A fatura ultrapassou a data de vencimento."</TooltipContent>
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
      header: "Data pagamento",
      cell: ({ row: { original } }) =>
         original.jsonwebhook_aluno_contrato_pagamento &&
         JSON.parse(original.jsonwebhook_aluno_contrato_pagamento)?.paymentDate
            ? moment(JSON.parse(original.jsonwebhook_aluno_contrato_pagamento).paymentDate).format("DD/MM/YYYY")
            : "-",
   },
   {
      id: "payoutDate",
      header: "Data repasse",
      cell: ({ row: { original } }) =>
         original.repasse_aluno_contrato_pagamento
            ? moment(original.repasse_aluno_contrato_pagamento).format("DD/MM/YYYY")
            : "-",
   },
   {
      id: "type",
      header: "Forma",
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
      id: "liquid",
      header: "A receber",
      cell: ({ row: { original } }) =>
         original.status_aluno_contrato_pagamento === "recievedCash"
            ? formatarMoeda(0)
            : formatarMoeda(original?.liquido_aluno_contrato_pagamento),
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
