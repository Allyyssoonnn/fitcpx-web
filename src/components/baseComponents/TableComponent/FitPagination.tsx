import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { ArrowLeft, ArrowLeftToLine, ArrowRight, ArrowRightToLine } from "lucide-react";

type FitPaginationProps<T> = {
   table: Table<T>;
};

export default function FitPagination<T>({ table }: FitPaginationProps<T>) {
   return (
      <div className="flex items-center justify-between px-4 py-2">
         <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {/* {table.getFilteredSelectedRowModel().rows.length} de{" "} */}
            {/* {table.getFilteredRowModel().rows.length} linha(s) selecionada. */}
         </div>

         <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
               <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Linhas por página
               </Label>

               <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                     table.setPageSize(Number(value));
                  }}
               >
                  <SelectTrigger size="sm" id="rows-per-page">
                     {table.getState().pagination.pageSize}
                  </SelectTrigger>
                  <SelectContent side="top">
                     {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex w-fit items-center justify-center text-sm font-medium">
               Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
               <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
               >
                  <span className="sr-only">Ir para primeira página</span>
                  <ArrowLeftToLine />
               </Button>

               <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <span className="sr-only">Página anterior</span>
                  <ArrowLeft />
               </Button>

               <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <span className="sr-only">Próxima página</span>
                  <ArrowRight />
               </Button>

               <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
               >
                  <span className="sr-only">Última página</span>
                  <ArrowRightToLine />
               </Button>
            </div>
         </div>
      </div>
   );
}
