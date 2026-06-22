import { getPayouts } from "@/api/payments";
import FitSelectMonthDate from "@/components/baseComponents/FitSelectMonthDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarData, toMoney } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Download, Eye, LucideReceiptText, Share } from "lucide-react";
import { useState } from "react";

export default function Payouts() {
   const [date, setDate] = useState<Date>(new Date());

   const { data: payouts } = useQuery({
      queryKey: ["payouts", date],
      queryFn: () => getPayouts(date),
      initialData: [],
   });

   const table = useReactTable({
      data: payouts,
      columns: columns,
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div className="container-fluid">
         <Card>
            <CardHeader>
               <h5>Repasses</h5>
            </CardHeader>

            <CardContent>
               <div className="flex mb-3">
                  <div className="flex gap-3">
                     <FitSelectMonthDate date={date} setDate={setDate} />
                  </div>
               </div>

               <div className="border rounded-md">
                  <Table>
                     <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                           <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                 <TableHead key={header.id}>
                                    {header.isPlaceholder
                                       ? null
                                       : flexRender(header.column.columnDef.header, header.getContext())}
                                 </TableHead>
                              ))}
                           </TableRow>
                        ))}
                     </TableHeader>

                     <TableBody>
                        {table.getCoreRowModel().rows.map((row) => (
                           <TableRow key={row.id} className="odd:bg-muted/50">
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

function ShowPayments({ payments }: { payments: any[] }) {
   return (
      <Dialog>
         <DialogTrigger disabled={!payments.length}>
            <Button disabled={!payments.length} variant="outline" size="sm" className="h-7">
               {payments.length}
               <Eye />
            </Button>
         </DialogTrigger>

         <DialogContent className="text-black sm:max-w-[70vw]">
            <DialogHeader>
               <DialogTitle>Recebimentos</DialogTitle>
            </DialogHeader>

            <div className="overflow-auto rounded-md border mt-3 h-[70vh] w-full">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Forma pag.</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>

                  <TableBody>
                     {payments.map((payment: any) => {
                        const paymentInfo = payment?.payment;
                        const json = paymentInfo?.jsonwebhook_aluno_contrato_pagamento;
                        console.log(json);

                        return (
                           <TableRow>
                              <TableCell>{paymentInfo?.cod_aluno_contrato_pagamento}</TableCell>
                              <TableCell>{paymentInfo?.contract.nome_aluno_contrato}</TableCell>
                              <TableCell>{paymentInfo?.contract?.aluno?.nome_aluno ?? "-Não identificado-"}</TableCell>
                              <TableCell>
                                 {formatarData(new Date(paymentInfo?.expiracao_aluno_contrato_pagamento))}
                              </TableCell>
                              <TableCell>
                                 {json && JSON.parse(json)?.paymentDate
                                    ? formatarData(JSON.parse(json).paymentDate)
                                    : "-"}
                              </TableCell>
                              <TableCell>
                                 {json && JSON.parse(json)?.paymentDate ? JSON.parse(json).billingType : "-"}
                              </TableCell>
                              <TableCell>{toMoney(paymentInfo?.liquido_aluno_contrato_pagamento)}</TableCell>
                              <TableCell className="flex gap-3">
                                 <Button
                                    className="h-7"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => window.open(paymentInfo?.asaas_url, "_blank")}
                                 >
                                    <Share />
                                 </Button>

                                 <Button
                                    className="h-7"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => window.open(JSON.parse(json)?.transactionReceiptUrl, "_blank")}
                                 >
                                    <LucideReceiptText />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </div>

            <DialogClose>
               <DialogFooter>
                  <Button variant="outline" size="sm" className="w-full">
                     Fechar
                  </Button>
               </DialogFooter>
            </DialogClose>
         </DialogContent>
      </Dialog>
   );
}

const columns: ColumnDef<any>[] = [
   {
      header: "ID",
      accessorKey: "id",
   },
   {
      header: "Valor",
      accessorKey: "value",
      cell: ({ row: { original } }) => toMoney(original?.value),
   },
   {
      header: "Data",
      accessorKey: "date",
      cell: ({ row: { original } }) => formatarData(new Date(original?.date)),
   },
   {
      header: "Recebimentos",
      accessorKey: "payments",
      // cell: ({ row: { original } }) => original?.payments.length,
      cell: ({ row: { original } }) => <ShowPayments payments={original?.payments} />,
   },
   {
      header: "",
      accessorKey: "actions",
      cell: ({ row: { original } }) => (
         <div className="w-full flex justify-end">
            <Button
               size="sm"
               className="h-7"
               variant="outline"
               onClick={() => window.open(original.proofURL, "_blank", "noopener,noreferrer")}
            >
               <Download /> Baixar Comprovante{" "}
            </Button>
         </div>
      ),
   },
];
