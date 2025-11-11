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
