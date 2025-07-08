import React, { useMemo, useState } from "react";
import ListComponentFilters from "./ListComponentFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import FitPagination from "../TableComponent/FitPagination";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatarMoeda, formatarData, getNestedError } from "@/utils"

type ListComponentProps = {
    list: any[];
    title: string;
    description: string;
    buttonText?: string;
    fieldSearch: string;
    columns: DataColumnsProp[];
    buttonOnClick?: () => void;
    onClickItem?: (row: any) => void;
    buttonId?: string;
    children: (filteredList: any[]) => React.ReactNode;
}

type DataColumnsProp = {
    name: string;
    header: string;
    Icon: any;
    className?: string;
    width?: number;
    visible?: (row: any) => boolean;
    onClick?: (row: any) => void;
    getValue?: (row: any) => any;
    type?: "date" | "currency" | "image" | "option";
}

export default function ListComponentWrapper({
    list,
    title,
    description,
    buttonText,
    fieldSearch,
    buttonOnClick,
    buttonId,
    children,
    columns,
    onClickItem
}: ListComponentProps) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

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
    }, [columns])

    const dataList = useMemo(() => list.map((v, i) => ({ ...v, id: i })), [list]);
    
    const table = useReactTable({
        data: dataList,
        columns: dataColumns ?? [],
        state: {
            pagination: pagination,
            columnFilters,
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
        <div className="card shadow-lg rounded-4">
            <div className="card-header">
                <div className="row d-flex justify-content-between">
                    <div className="col-md-3 col-7 d-flex align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar"
                            value={(table.getColumn(fieldSearch)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(fieldSearch)?.setFilterValue(event.target.value)
                            }
                        />

                        {childrenFilters}
                    </div>

                    <div className="col-md-3 col-5 d-flex flex-column items-end">
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                </div>

                <div className="d-flex justify-content-end align-items-center">
                    {buttonOnClick && (
                        <button id={buttonId} className="btn btn-outline-success" onClick={buttonOnClick}>
                            <i className="bi bi-plus-circle me-2"></i>
                            {buttonText ?? "Novo"}
                        </button>
                    )}
                </div>
            </div>

            <div className="card-body p-0 pb-5">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow id={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer odd:bg-muted/50"
                                    onClick={() => onClickItem !== undefined && onClickItem(row?.original)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.columnDef.className}
                                            width={cell.column.columnDef.size}
                                        >
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
                </Table>

                <FitPagination table={table} />
            </div>
        </div>
    );
}

const getColumns = (columns: DataColumnsProp) => {
    let cols: any[] = [];
    let options: { name: string, Icon: any, onClick: (row: any) => void }[] = [];

    if (!columns) return;

    function getCell(
        obj: string,
        name: string,
        type: string,
        onClick?: () => void,
        Icon?: any,
        visible?: () => boolean,
        getValue?: () => any,
    ) {
        if (type === "image") return (
            <img src={obj[name] ? obj[name] : 'https://placehold.co/150x150?text=img'}
                alt="Imagem"
                className="img-fluid rounded-circle shadow-md border-3 border-success"
                width={50} height={50} loading="lazy"
            />
        )

        if (type === "date") return formatarData(obj[name]);

        if (type === "currency") return formatarMoeda(obj[name]);
        
        if (type === "option") {
            // Evita duplicação de opções com mesmo nome
            if (!options.find((opt) => opt.name === name)) {
                if (visible && visible(obj) || !visible) {
                    options.push({ name, onClick, Icon });
                }
            }
            return ""; // não renderiza nada visível na célula da coluna
        }

        if (getValue) return getValue(obj);

        if (name.split(".")?.length > 1) {
            return getNestedError(obj, name);    
        }

        return obj[name];
    }

    columns?.forEach((v, i) => {
        cols.push({
            id: v.name,
            header: v.header,
            size: v.width,
            className: v.className,
            accessorKey: v.name,
            cell: ({ row: { original } }) => getCell(original, v.name, v.type, v.onClick, v.Icon, v.visible, v.getValue),
        })
    })

    
    if (options) {
        cols.push({
            id: "options",
            header: "",
            cell: ({ row: { original } }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        {options.map((option, index) => (
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Impede o clique da linha
                                    option.onClick(original);
                                }}
                            >
                                <option.Icon />
                                {option.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        })
    }

    return cols;
}