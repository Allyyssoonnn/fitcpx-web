import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export const MONTHS = [
   "Janeiro",
   "Fevereiro",
   "Março",
   "Abril",
   "Maio",
   "Junho",
   "Julho",
   "Agosto",
   "Setembro",
   "Outubro",
   "Novembro",
   "Dezembro",
];

type Props = {
   setDate: (date: Date) => void;
   date: Date | undefined;
};

export default function FitSelectMonthDate({ setDate, date }: Props) {
   return (
      <div className="w-full">
         <Popover>
            <PopoverTrigger asChild>
               <Button variant="outline" id="date" className="w-full justify-between font-normal">
                  {date ? `${MONTHS[date.getMonth()]} - ${date.getFullYear()}` : "Select date"}
                  <ChevronDownIcon />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
               <div className="flex gap-3 p-3">
                  <DropdownMonth date={date} setDate={setDate} />
                  <DropdownYear date={date} setDate={setDate} />
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
}

function DropdownYear({ date, setDate }: { date: Date | undefined; setDate: (date: Date) => void }) {
   return (
      <Select
         value={date ? date.getFullYear().toString() : undefined}
         onValueChange={(value) => {
            const year = Number(value);
            const current = date ?? new Date();

            setDate(new Date(year, current.getMonth(), 1));
         }}
      >
         <SelectTrigger className="w-18">{date ? date.getFullYear() : "Ano"}</SelectTrigger>

         <SelectContent className="max-h-[400px]">
            {[
               2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038,
               2039, 2040,
            ].map((year, index) => (
               <SelectItem key={index} value={`${year}`}>
                  {year}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}

function DropdownMonth({ date, setDate }: { date: Date | undefined; setDate: (date: Date) => void }) {
   return (
      <Select
         value={date ? date.getMonth().toString() : undefined}
         onValueChange={(value) => {
            const month = Number(value);
            const current = date ?? new Date();

            setDate(new Date(current.getFullYear(), month, 1));
         }}
      >
         <SelectTrigger className="w-28">{date ? MONTHS[date.getMonth()] : "Mês"}</SelectTrigger>

         <SelectContent>
            {MONTHS.map((month, index) => (
               <SelectItem key={index} value={`${index}`}>
                  {month}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}
