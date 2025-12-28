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
import { formatarData, formatarMoeda, getNestedError } from "@/utils";
import {
   ColumnFiltersState,
   FilterFn,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import FitPagination from "../TableComponent/FitPagination";
import ListComponentFilters from "./ListComponentFilters";

type ListComponentProps = {
   list: any[];
   title: string;
   description: string;
   buttonText?: string;
   fieldSearch: string;
   className?: string;
   rowCount?: number;
   hideSearch?: boolean;
   hideFooter?: boolean;
   hideHeader?: boolean;
   columns: DataColumnsProp[];
   buttonOnClick?: () => void;
   onClickItem?: (row: any) => void;
   buttonId?: string;
   children: (filteredList: any[]) => React.ReactNode;
   subHeader?: React.ReactNode;
};

type DataColumnsProp = {
   rowId?: string;
   fieldId?: string;
   name: string;
   header: string;
   Icon: any;
   className?: string;
   width?: number;
   visible?: (row: any) => boolean;
   onClick?: (row: any) => void;
   getValue?: (row: any) => any;
   getCell?: (row: any) => any;
   onChange?: (row: any, value: any) => void;
   inputProps?: any;
   value?: any;
   type?: "date" | "currency" | "image" | "option";
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
   subHeader,
}: ListComponentProps) {
   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: rowCount });
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

   const childrenFilters = useMemo(() => {
      if (React.isValidElement(children) && children?.type === ListComponentFilters) {
         return children;
      }
      if (Array.isArray(children)) {
         const childFilters = children.find(
            (child) => React.isValidElement(child) && child?.type === ListComponentFilters
         );
         if (childFilters) return childFilters;
      }
      return null;
   }, [children]);

   const dataColumns = useMemo(() => {
      return getColumns(columns);
   }, [columns]);

   const dataList = useMemo(() => list.map((v, i) => ({ ...v, id: v[fieldId] || i })), [list]);

   function normalizeText(text: string) {
      return text
         ?.toString()
         .normalize("NFD") // separa acentos
         .replace(/[\u0300-\u036f]/g, "") // remove acentos
         .toLowerCase(); // deixa minúsculo
   }

   const insensitiveIncludes: FilterFn<any> = (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return normalizeText(value).includes(normalizeText(filterValue));
   };

   const table = useReactTable({
      data: dataList,
      columns: dataColumns ?? [],
      state: {
         pagination: pagination,
         columnFilters,
      },
      filterFns: {
         insensitiveIncludes, // adiciona aqui
      },
      getCoreRowModel: getCoreRowModel(),
      manualPagination: false, // deixe false se os dados já estão todos carregados
      pageCount: Math.ceil(list.length / pagination.pageSize),
      onPaginationChange: setPagination,
      getPaginationRowModel: getPaginationRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
   });

   return (
      <Card className={`rounded-4 ${className ?? ""}`}>
         {!hideHeader && (
            <CardHeader>
               <div className="row d-flex justify-content-between">
                  <div className="col-md-4 col-7 d-flex align-items-center gap-2">
                     {!hideSearch && (
                        <Input
                           type="text"
                           placeholder="Pesquisar"
                           value={(table.getColumn(fieldSearch)?.getFilterValue() as string) ?? ""}
                           onChange={(event) => table.getColumn(fieldSearch)?.setFilterValue(event.target.value)}
                        />
                     )}

                     {childrenFilters}
                  </div>

                  <div className="col-md-3 col-5 d-flex flex-column items-end">
                     <CardTitle>{title}</CardTitle>
                     <CardDescription>{description}</CardDescription>
                  </div>
               </div>

               <div className="d-flex justify-content-end align-items-center">
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

         <CardContent className="p-0 pb-5">
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
               src={obj[name] ? obj[name] : "https://placehold.co/150x150?text=img"}
               alt="Imagem"
               className="img-fluid rounded-circle shadow-md border-3 border-success"
               width={50}
               height={50}
               loading="lazy"
            />
         );

      if (type === "date") return formatarData(obj[name]);

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
            filterFn: "insensitiveIncludes",
            cell: ({ row: { original } }) => getCell(original, col.name, col.type, col.getValue, col.getCell),
         });
      }
   });

   if (options.length === 1) {
      const option = options[0];
      cols.push({
         id: "option",
         header: "",
         cell: ({ row: { original } }) => {
            if (option.visible && !option.visible(original)) return null;
            return (
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                     e.stopPropagation();
                     option.onClick(original);
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
         cell: ({ row: { original } }) => {
            const rowOptions = options.filter((opt) => !opt.visible || opt.visible(original));

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
                              option.onClick(original);
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
