import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateEmpresa } from "@/states/states";
import { getAlunoContratos } from "@/api/aluno";
import moment from 'moment';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, Coins, HandCoins, LogIn, MessageCircleMore, MoreHorizontal, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatarMoeda, getFieldJSON } from "@/utils";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import FitPagination from "@/components/baseComponents/TableComponent/FitPagination";
import FitSelectDate from "@/components/baseComponents/FitSelectDate";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { marcarCobrancaRecebida } from "@/api/pagamento";

export default function FinanceOverview() {
    const [date, setDate] = useState();
    const [empresa] = useRecoilState(stateEmpresa);
    const [value, setValue] = useState(0);
    const [valueRecieve, setValueRecieve] = useState(0);

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', empresa.cod_empresa],
        queryFn: () => getAlunoContratos(null, empresa.cod_empresa),
        initialData: [],
        enabled: !!empresa.cod_empresa,
    });

    const payments = useMemo(() => {
        return (contratos.reduce((resp, contract) => ([
            ...resp,
            ...(contract?.pagamentos?.map((payment) => ({ ...payment, contract })))
        ]), [])) || [];
    }, [contratos]);

    const filteredPayments = useMemo(() => {
        if (!date) return [];
        let filteredValue = 0;
        let ValueToRecieve = 0;

        const resp = payments.filter((payment) => {
            const rawDate = payment?.expiracao_aluno_contrato_pagamento;
            if (!rawDate) return false;
            
            const d = new Date(rawDate);
            if (d.getFullYear() === date.year && d.getMonth() === date.month) {
                filteredValue += payment?.liquido_aluno_contrato_pagamento;
                if (
                    payment?.status_aluno_contrato_pagamento !== "success"
                    && payment?.status_aluno_contrato_pagamento !== "recievedCash"
                ) ValueToRecieve += payment?.liquido_aluno_contrato_pagamento;
                return true;
            }
        });
        setValueRecieve(ValueToRecieve);
        setValue(filteredValue);
        return resp;
    }, [payments, date]);

    const maxDate = useMemo(() => {
        const max = payments
            .map(p => new Date(p?.expiracao_aluno_contrato_pagamento))
            .reduce((a, b) => a > b ? a : b, new Date())

        return max ?? new Date()
    }, [payments]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <div className="card shadow-lg rounded-4 p-4">
                        <h5 className="card-title">Resumo financeiro</h5>
                        <FitSelectDate
                            minDate={payments[0]?.data_aluno_contrato_pagamento ?? new Date()}
                            maxDate={maxDate}
                            value={date}
                            onChange={value => setDate(value)}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-lg rounded-4 p-4 hover:scale-105 transition-all">
                        <div className="card-subtitle">Total</div>

                        <div className="card-body p-3 d-flex">
                            <Coins />
                            <h5 className="card-title ms-2">{formatarMoeda(value)}</h5>
                        </div>

                        <label>Valor total de pagamentos</label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-lg rounded-4 p-4 hover:scale-105 transition-all">
                        <div className="card-subtitle">A receber</div>

                        <div className="card-body p-3 d-flex">
                            <HandCoins />
                            <h5 className="card-title ms-2">{formatarMoeda(valueRecieve)}</h5>
                        </div>

                        <label>Valor total a ser recebido</label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-lg rounded-4 p-4 hover:scale-105 transition-all">
                        <div className="card-subtitle">Entrar em contato</div>

                        <div className="card-body p-3 d-flex justify-center">
                            <button className="btn d-flex btn-outline-success rounded py-1"
                                onClick={() => window.open('https://wa.me/5544991654044', '_blank')}
                            >
                                <MessageCircleMore size={20} className="me-2" />
                                Suporte
                            </button>
                        </div>

                        <label>Tirar dúvidas sobre pagamentos</label>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <Payments payments={filteredPayments} date={date} refetch={refetch} />
                </div>
            </div>
        </div>
    );
}

function Payments({ payments, date, refetch }) {
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const getColumns = useMemo(() => getPaymentColumns(navigate, onRecieved), [navigate, onRecieved]);

    const table = useReactTable({
        data: payments,
        columns: getColumns,
        state: {
            pagination: pagination
        },
        getRowId: (row) => row.cod_aluno_contrato_pagamento.toString(),
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false, // deixe false se os dados já estão todos carregados
        pageCount: Math.ceil(payments.length / pagination.pageSize),
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
    });

    async function onRecieved(id) {
        await marcarCobrancaRecebida(id);
        refetch();
    }

    return (
        <div className="card shadow-lg rounded-4 p-4">
            <div className="card-title">Pagamentos de {String(date?.month).padStart(2, "0")}/{String(date?.year).padEnd(2, "0")}</div>

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
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
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

            <FitPagination table={table} />
        </div>
    )
}

const getPaymentColumns = (navigate, onRecieved) => [
	{
		id: "status",
		cell: ({ row: { original } }) => {
			const status = original.status_aluno_contrato_pagamento;
			if (status === "recievedCash")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Recebido Manual
                    </Badge>
                );
			if (status === "overdue")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-x-circle-fill text-danger" />
                        Vencido
                    </Badge>
                );
			if (status === "Pendente" || status === "Pending")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-x-circle-fill text-warning" />
                        Pendente
                    </Badge>
                );
			if (status === "confirmed")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-info" />
                        Confirmado
                    </Badge>
                );
			if (status === "succeeded")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Disponível
                    </Badge>
                );
			if (status === "paied")
				return (
                    <Badge variant="outline">
                        <i className="bi bi-check-circle-fill text-success" />
                        Repassado
                    </Badge>
                );
		},
	},
	{
		id: "client",
		header: "Aluno",
		cell: ({ row: { original } }) => original?.contract?.aluno?.nome_aluno,
	},
	{
		id: "dueDate",
		header: "Venc.",
		cell: ({ row: { original } }) =>
			moment(original?.expiracao_aluno_contrato_pagamento).format("DD/MM/YYYY"),
	},
	{
		id: "dueDate",
		header: "Data pag.",
		cell: ({ row: { original } }) =>
			getFieldJSON(original?.jsonwebhook_aluno_contrato_pagamento, "confirmedDate")
                ? moment(getFieldJSON(original?.jsonwebhook_aluno_contrato_pagamento, "confirmedDate")).format("DD/MM/YYYY")
                : "-"
	},
	{
		id: "withdrawDate",
		header: "Disponível",
		cell: ({ row: { original } }) =>
			getFieldJSON(original?.jsonwebhook_aluno_contrato_pagamento, "estimatedCreditDate")
                ? moment(getFieldJSON(original?.jsonwebhook_aluno_contrato_pagamento, "estimatedCreditDate")).format("DD/MM/YYYY")
                : "-"
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
		cell: ({ row: { original } }) =>
			formatarMoeda(original?.valor_aluno_contrato_pagamento),
	},
	{
		id: "liquid",
		header: "A receber",
		cell: ({ row: { original } }) => original.status_aluno_contrato_pagamento === "recievedCash"
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
                    
                    {(original.status_aluno_contrato_pagamento === "Pending"
                        || original.status_aluno_contrato_pagamento === "Pendente"
                    ) && (<div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost"
                                    className="ps-2 py-0.5"
                                >
                                    <Check />
                                    Marcar como recebido
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="col-md-3 col-12">
                                <DialogHeader>
                                    <h5 className="text-start card-title">Confirmação de pagamento recebido</h5>
                                </DialogHeader>

                                <p>Ao confirmar o pagamento, a cobrança será cancelada automaticamente, pois entendemos que você recebeu o valor por outro meio manualmente.</p>

                                <DialogFooter>
                                    <DialogClose>
                                        <button className="btn btn-danger rounded">Fechar</button>
                                    </DialogClose>

                                    <button className="btn btn-success rounded"
                                        onClick={() => onRecieved(original.asaas_id)}
                                    >Confirmar</button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>)}
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];