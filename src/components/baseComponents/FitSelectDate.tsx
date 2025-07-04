import React, { useMemo, useState, useEffect } from "react";

const MONTHS = [
	"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
	"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

type MonthYear = {
	month: number; // 0-11
	year: number;
};

type Props = {
	minDate?: Date | string;
	maxDate?: Date | string;
	onChange?: (value: MonthYear) => void;
	value?: MonthYear;
	className?: string;
	id?: string;
	label?: string;
	disabled?: boolean;
};

export default function FitSelectDate({
	minDate = new Date(),
	maxDate = new Date(),
	onChange,
	value,
	className,
	id,
	label = "Selecione o mês",
	disabled = false,
}: Props) {
	const today = new Date();
	const currentMonthYear: MonthYear = {
		month: today.getMonth(),
		year: today.getFullYear(),
	};

	// Garante que min/max sejam Dates válidas mesmo que venham como string
	const parsedMin = new Date(minDate ?? Date.now());
	const parsedMax = new Date(maxDate ?? Date.now());

	// Garante que o mês atual esteja dentro do intervalo
	const adjustedMinDate = new Date(
		Math.min(parsedMin.getTime(), today.getTime())
	);
	const adjustedMaxDate = new Date(
		Math.max(parsedMax.getTime(), today.getTime())
	);

	const options = useMemo(() => {
		const opts: MonthYear[] = [];
		let current = new Date(adjustedMinDate.getFullYear(), adjustedMinDate.getMonth(), 1);
		const last = new Date(adjustedMaxDate.getFullYear(), adjustedMaxDate.getMonth(), 1);

		while (current <= last) {
			opts.push({ month: current.getMonth(), year: current.getFullYear() });
			current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
		}

		return opts;
	}, [adjustedMinDate, adjustedMaxDate]);

	// Estado interno se não for controlado
	const [internalValue, setInternalValue] = useState<MonthYear>(value ?? currentMonthYear);

	// Se for não controlado, define o mês atual inicialmente
	useEffect(() => {
		if (!value && onChange) {
			onChange(currentMonthYear);
		}
	}, []);

	const selected = value ?? internalValue;

	const selectedValue = selected
		? `${selected.year}-${(selected.month + 1).toString().padStart(2, "0")}`
		: "";

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const [yearStr, monthStr] = e.target.value.split("-");
		const selected = { year: Number(yearStr), month: Number(monthStr) - 1 };
		if (!value) setInternalValue(selected);
		onChange && onChange(selected);
	};

	return (
		<div className={className}>
			{label && (
				<label htmlFor={id} className="form-label">
					{label}
				</label>
			)}
			<select
				id={id}
				className="form-select"
				value={selectedValue}
				onChange={handleChange}
				disabled={disabled}
			>
				<option value="" disabled>
					Selecione mês/ano
				</option>
				{options.map(({ month, year }) => {
					const valueStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;
					return (
						<option key={valueStr} value={valueStr}>
							{MONTHS[month]}/{year}
						</option>
					);
				})}
			</select>
		</div>
	);
}