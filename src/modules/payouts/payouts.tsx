import { getPayouts } from "@/api/payments";
import FitSelectMonthDate from "@/components/baseComponents/FitSelectMonthDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarData, toMoney } from "@/utils/utils";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

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

const columns: ColumnDef<any>[] = [
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
      cell: ({ row: { original } }) => original?.payments.length,
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
