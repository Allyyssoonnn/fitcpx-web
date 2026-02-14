import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
   ColumnFiltersState,
   FilterFn,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   GlobalFilterTableState,
   SortingState,
   useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import { formatarData, formatarHora, formatarMoeda, formatarSegundos, getNestedError } from "../../../utils/utils";
import FitPagination from "../TableComponent/FitPagination";
import ListComponentFilters from "./ListComponentFilters";
import ListComponentVisibles from "./ListComponentVisibles";

type ListComponentProps = {
   list: any[];
   title?: string;
   description?: string;
   buttonText?: string;
   fieldSearch?: string;
   className?: string;
   rowCount?: number;
   hideSearch?: boolean;
   hideFooter?: boolean;
   hideHeader?: boolean;
   columns: DataColumnsProp[];
   buttonOnClick?: () => void;
   onClickItem?: (row: any) => void;
   buttonId?: string;
   children?: React.ReactNode;
   subHeader?: React.ReactNode;
   moreButtonsHeader?: React.ReactNode;
   canSort?: boolean;
   globalFilter?: GlobalFilterTableState;
   globalFilterFn?: (row: any, _columnId: string, filterValue: any) => any;
   rowId?: string;
   fieldId?: string;
};

type DataColumnsProp = {
   fieldId?: string;
   name: string;
   canSort?: boolean;
   header: string;
   Icon?: any;
   className?: string;
   width?: number;
   visible?: (row: any) => boolean;
   onClick?: (row: any) => void;
   getValue?: (row: any) => any;
   getCell?: (row: any) => any;
   filterFn?: string | ((row: any, columnId: any, filterValue: string[]) => any);
   accessorFn?: (row: any) => any;
   onChange?: (row: any, value: any) => void;
   inputProps?: any;
   value?: any;
   type?: "date" | "time" | "currency" | "image" | "option" | "seconds";
};

export default function ListComponentWrapper({
   rowId,
   fieldId,
   list,
   title,
   description,
   buttonText,
   fieldSearch,
   buttonOnClick,
   buttonId,
   children,
   columns,
   onClickItem,
   className,
   rowCount = 10,
   hideSearch = false,
   hideHeader = false,
   hideFooter = false,
   canSort = false,
   subHeader,
   globalFilter,
   globalFilterFn,
   moreButtonsHeader,
}: ListComponentProps) {
   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: rowCount });
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const childrenFilters = useMemo(() => {
      if (React.isValidElement(children) && children?.type === ListComponentFilters) {
         return children;
      }
      if (Array.isArray(children)) {
         const childFilters = children.find(
            (child) => React.isValidElement(child) && child?.type === ListComponentFilters,
         );
         if (childFilters) return childFilters;
      }
      return null;
   }, [children]);

   const childrenVisibles = useMemo(() => {
      if (React.isValidElement(children) && children?.type === ListComponentVisibles) {
         return children;
      }
      if (Array.isArray(children)) {
         const childFilters = children.find(
            (child) => React.isValidElement(child) && child?.type === ListComponentVisibles,
         );
         if (childFilters) return childFilters;
      }
      return null;
   }, [children]);

   const dataColumns = useMemo(() => {
      return getColumns(columns);
   }, [columns]);

   const dataList = useMemo(() => list.map((v, i) => ({ ...v, id: fieldId ? v[fieldId] : i })), [list, fieldId]);

   function normalizeText(text: string) {
      return text
         ?.toString()
         .normalize("NFD") // separa acentos
         .replace(/[\u0300-\u036f]/g, "") // remove acentos
         .toLowerCase(); // deixa minúsculo
   }

   const insensitiveIncludes: FilterFn<any> = (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as any;
      return normalizeText(value).includes(normalizeText(filterValue));
   };

   const table = useReactTable({
      data: dataList,
      columns: dataColumns ?? [],
      state: {
         pagination: pagination,
         columnFilters,
         sorting,
         globalFilter,
      },
      filterFns: {
         insensitiveIncludes, // adiciona aqui
      },
      getCoreRowModel: getCoreRowModel(),
      manualPagination: false, // deixe false se os dados já estão todos carregados
      // ** REMOVIDO - TABLE CONTA SOZINHO
      // pageCount: Math.ceil(list.length / pagination.pageSize),
      onPaginationChange: setPagination,
      getPaginationRowModel: getPaginationRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      globalFilterFn,
   });

   const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
         // Se o filho for o componente de visibilidade ou filtros, passamos o setColumnFilters
         return React.cloneElement(child as React.ReactElement<any>, { setColumnFilters });
      }
      return child;
   });

   return (
      <Card className={`rounded-4 ${className ?? ""} pb-0`}>
         {!hideHeader && (
            <CardHeader>
               <div className="row d-flex justify-content-between">
                  <div className="col-md-4 col-7 d-flex align-items-center gap-2">
                     {!hideSearch && fieldSearch && (
                        <Input
                           type="text"
                           placeholder="Pesquisar"
                           value={(table.getColumn(fieldSearch)?.getFilterValue() as string) ?? ""}
                           onChange={(event) => table.getColumn(fieldSearch)?.setFilterValue(event.target.value)}
                        />
                     )}

                     {/* Renderiza os filtros injetados */}
                     {childrenWithProps?.filter((c: any) => c.type === ListComponentFilters)}
                  </div>

                  <div className="col-md-3 col-5 d-flex flex-column items-end">
                     <CardTitle>{title}</CardTitle>
                     <CardDescription>{description}</CardDescription>
                     {/* Renderiza o botão de Exibição injetado */}
                     {childrenWithProps?.filter((c: any) => c.type === ListComponentVisibles)}
                  </div>
               </div>

               <div className="d-flex justify-content-end align-items-center gap-3">
                  {moreButtonsHeader}
                  {buttonOnClick && (
                     <Button variant="outline" id={buttonId} onClick={buttonOnClick}>
                        <PlusCircle />
                        {buttonText ?? "Novo"}
                     </Button>
                  )}
               </div>
            </CardHeader>
         )}

         {subHeader}

         <CardContent className="p-0">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow id={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <TableHead key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder ? null : (
                                 <div
                                    className={
                                       header.column.getCanSort()
                                          ? "cursor-pointer select-none d-flex align-items-center gap-1"
                                          : ""
                                    }
                                    onClick={header.column.getToggleSortingHandler()}
                                 >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                       asc: <ArrowUp className="h-4 w-4" />,
                                       desc: <ArrowDown className="h-4 w-4" />,
                                    }[header.column.getIsSorted() as string] ??
                                       // Mostra ícone neutro se a coluna for ordenável mas não estiver ativa
                                       (header.column.getCanSort() ? (
                                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                                       ) : null)}
                                 </div>
                              )}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>

               <TableBody>
                  {table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row, index) => (
                        <TableRow
                           id={`${rowId}${index}`}
                           key={row.id}
                           className="cursor-pointer odd:bg-muted/50"
                           onClick={() => onClickItem !== undefined && onClickItem(row?.original)}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} width={cell.column.columnDef.size}>
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={columns?.length} className="h-24 text-center">
                           Nenhum resultado
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>

               {!hideFooter && (
                  <TableFooter>
                     <TableRow>
                        <TableCell colSpan={columns?.length}>
                           <FitPagination table={table} />
                        </TableCell>
                     </TableRow>
                  </TableFooter>
               )}
            </Table>
         </CardContent>
      </Card>
   );
}

const getColumns = (columns: DataColumnsProp[]) => {
   if (!columns) return [];

   let cols: any[] = [];
   const options = columns.filter((col) => col.type === "option");

   function getCell(obj: any, name: string, type?: string, getValue?: (row: any) => any, getCell?: (row: any) => any) {
      if (getCell) return getCell(obj);

      if (type === "image")
         return (
            <img
               src={obj[name] ? obj[name] : "assets/images/placeholder/person.png"}
               alt="Imagem"
               className="img-fluid rounded-circle shadow-md border-3 border-success"
               width={50}
               height={50}
               loading="lazy"
            />
         );

      if (type === "date") return formatarData(obj[name]);

      if (type === "seconds") return formatarSegundos(obj[name]);

      if (type === "time") return formatarHora(obj[name]);

      if (type === "currency") return formatarMoeda(obj[name]);

      if (type === "option") return ""; // já tratado externamente

      if (getValue) return getValue(obj);

      if (name.includes(".")) return getNestedError(obj, name);

      return obj[name];
   }

   columns.forEach((col) => {
      if (col.type !== "option") {
         cols.push({
            id: col.name,
            header: col.header,
            size: col.width,
            className: col.className,
            accessorKey: col.name,
            filterFn: col.filterFn || "insensitiveIncludes",
            accessorFn: col.accessorFn,
            enableSorting: col.canSort ?? false,
            cell: ({ row }: { row: any }) => getCell(row.original, col.name, col.type, col.getValue, col.getCell),
         });
      }
   });

   if (options.length === 1) {
      const option = options[0];
      cols.push({
         id: "option",
         header: "",
         enableSorting: false,
         cell: ({ row }: { row: any }) => {
            if (option.visible && !option.visible(row.original)) return null;
            return (
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                     e.stopPropagation();
                     option.onClick?.(row.original);
                  }}
               >
                  <option.Icon />
               </Button>
            );
         },
      });
   } else if (options.length > 1) {
      cols.push({
         id: "options",
         header: "",
         enableSorting: false,
         cell: ({ row }: { row: any }) => {
            const rowOptions = options.filter((opt) => !opt.visible || opt.visible(row.original));

            if (rowOptions.length === 0) return null;
            return (
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                     {rowOptions.map((option, index) => (
                        <DropdownMenuItem
                           key={index}
                           className="cursor-pointer"
                           onClick={(e) => {
                              e.stopPropagation();
                              option.onClick?.(row.original);
                           }}
                        >
                           <option.Icon />
                           {option.name}
                        </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         },
      });
   }

   return cols;
};
