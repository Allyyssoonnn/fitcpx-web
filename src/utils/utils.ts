export const formatarData = (data: string | Date | number | null | undefined): string => {
   if (!data) return "";

   let date: Date;

   if (typeof data === "string") {
      // Caso seja uma string no formato YYYY-MM-DD
      const [year, month, day] = data.split("-");
      date = new Date(Number(year), Number(month) - 1, Number(day));
   } else if (data instanceof Date) {
      // Caso já seja um objeto Date
      date = data;
   } else if (typeof data === "number") {
      // Caso seja um timestamp
      date = new Date(data);
   } else {
      return "";
   }

   return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   });
};

export const arrayBackgrounds = [
   "bg-amber-400",
   "bg-blue-400",
   "bg-green-400",
   "bg-yellow-400",
   "bg-indigo-400",
   "bg-purple-400",
   "bg-pink-400",
   "bg-gray-100",
   "bg-slate-400",
   "bg-emerald-400",
];

export const arrayBorders = [
   "border-amber-400",
   "border-blue-400",
   "border-green-400",
   "border-yellow-400",
   "border-indigo-400",
   "border-purple-400",
   "border-pink-400",
   "border-gray-100",
   "border-slate-400",
   "border-emerald-400",
];

export function sleep(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}
