export const formatarData = (data: string | Date | number | null | undefined): string => {
   if (!data) return "";

   if (typeof data === "string") {
      data = data.replace(" ", "T");
   }

   const date = new Date(data);

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

export const toMoney = (value: number) => {
   return typeof value == "number"
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
      : "-";
};

export const states = [
   "AC",
   "AL",
   "AP",
   "AM",
   "BA",
   "CE",
   "DF",
   "ES",
   "GO",
   "MA",
   "MS",
   "MT",
   "MG",
   "PA",
   "PB",
   "PR",
   "PE",
   "PI",
   "RJ",
   "RN",
   "RS",
   "RO",
   "RR",
   "SC",
   "SP",
   "SE",
   "TO",
];

export const normalizeCpf = (value: string | undefined) => {
   if (!value) return "";

   return value
      .replace(/[\D]/g, "") // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após o 3º digito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após o 6º digito
      .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca traço após o 9º digito
      .replace(/(-\d{2})\d+?$/, "$1"); // Impede digitar mais que 11 dígitos
};

export const normalizePhone = (value: string | undefined) => {
   if (!value) return "";

   return value
      .replace(/[\D]/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
};

export const normalizeCep = (value: string | undefined) => {
   if (!value) return "";
   return value
      .replace(/[\D]/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
};

export function isValidCPF(cpf: string): boolean {
   if (typeof cpf !== "string") return false;

   // 1. Remove caracteres não numéricos
   cpf = cpf.replace(/[^\d]+/g, "");

   // 2. Verifica se tem 11 dígitos ou se todos são iguais (ex: 111.111.111-11)
   if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
      return false;
   }

   // 3. Validação do 1º Dígito Verificador
   const digits = cpf.split("").map((el) => +el); // Converte para array de números

   let rest = digits.slice(0, 9).reduce((soma, numero, index) => {
      return soma + numero * (10 - index);
   }, 0);

   let calculation = (rest * 10) % 11;
   if (calculation === 10 || calculation === 11) calculation = 0;

   if (calculation !== digits[9]) return false;

   // 4. Validação do 2º Dígito Verificador
   rest = digits.slice(0, 10).reduce((soma, numero, index) => {
      return soma + numero * (11 - index);
   }, 0);

   calculation = (rest * 10) % 11;
   if (calculation === 10 || calculation === 11) calculation = 0;

   return calculation === digits[10];
}

export const formatCurrency = (value: number) => {
   return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   }).format(value);
};

// Simula o cálculo do Asaas para exibição
export const calculateInstallment = (totalPrice: number, installmentCount: number) => {
   // Trabalhamos com centavos (inteiros) para evitar erros de arredondamento
   const totalCents = Math.round(totalPrice * 100);

   // Valor base da parcela (divisão inteira)
   const installmentValueCents = Math.floor(totalCents / installmentCount);

   // Resto que vai para a primeira parcela
   const remainder = totalCents % installmentCount;

   return {
      // Valor que será cobrado na maioria das parcelas (ex: 33,33)
      baseValue: installmentValueCents / 100,
      // Valor da primeira parcela (ex: 33,34)
      firstInstallment: (installmentValueCents + remainder) / 100,
      // Se tem resto, as parcelas não são iguais
      hasDifference: remainder > 0,
   };
};

export const searchCEP = async (CEP: string) => {
   const flatCEP = CEP?.replace(/\D/g, "") ?? "";

   var response = null as any;

   if (flatCEP.length === 8) {
      try {
         const resp = await fetch(`https://viacep.com.br/ws/${flatCEP}/json/`);
         if (!resp.ok) throw new Error("Erro CEP");
         const data = await resp.json();
         if (!data.erro) {
            response = {
               address: data.logradouro,
               neighbord: data.bairro,
               city: data.localidade,
               state: String(data.uf).toUpperCase(),
            };
         }
      } catch (error: any) {
         console.error("Erro busca CEP:", error);
      }
   }

   return response;
};
