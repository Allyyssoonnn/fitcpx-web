type Locale = "pt" | "en" | "es";

const data = {
   pt: {
      units: [
         "zero",
         "um",
         "dois",
         "três",
         "quatro",
         "cinco",
         "seis",
         "sete",
         "oito",
         "nove",
         "dez",
         "onze",
         "doze",
         "treze",
         "quatorze",
         "quinze",
         "dezesseis",
         "dezessete",
         "dezoito",
         "dezenove",
      ],
      tens: ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"],
      // CORREÇÃO: Usamos "cento" como base para números > 100
      hundreds: [
         "",
         "cento",
         "duzentos",
         "trezentos",
         "quatrocentos",
         "quinhentos",
         "seiscentos",
         "setecentos",
         "oitocentos",
         "novecentos",
      ],
      thousand: "mil",
      conjunction: " e ",
   },
   en: {
      units: [
         "zero",
         "one",
         "two",
         "three",
         "four",
         "five",
         "six",
         "seven",
         "eight",
         "nine",
         "ten",
         "eleven",
         "twelve",
         "thirteen",
         "fourteen",
         "fifteen",
         "sixteen",
         "seventeen",
         "eighteen",
         "nineteen",
      ],
      tens: ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
      hundreds: [
         "",
         "one hundred",
         "two hundred",
         "three hundred",
         "four hundred",
         "five hundred",
         "six hundred",
         "seven hundred",
         "eight hundred",
         "nine hundred",
      ],
      thousand: "thousand",
      conjunction: " and ", // 'and' é opcional em alguns dialetos, mas comum.
   },
   es: {
      units: [
         "cero",
         "uno",
         "dos",
         "tres",
         "cuatro",
         "cinco",
         "seis",
         "siete",
         "ocho",
         "nueve",
         "diez",
         "once",
         "doce",
         "trece",
         "catorce",
         "quince",
         "dieciséis",
         "diecisiete",
         "dieciocho",
         "diecinueve",
         "veinte",
         "veintiuno",
         "veintidós",
         "veintitrés",
         "veinticuatro",
         "veinticinco",
         "veintiséis",
         "veintisiete",
         "veintiocho",
         "veintinueve",
      ],
      tens: ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"],
      // CORREÇÃO: Usamos "ciento" como base para números > 100
      hundreds: [
         "",
         "ciento",
         "doscientos",
         "trescientos",
         "cuatrocientos",
         "quinientos",
         "seiscientos",
         "setecientos",
         "ochocientos",
         "novecientos",
      ],
      thousand: "mil",
      conjunction: " y ",
   },
} as const;

export function convertNumberToText(numero: number, locale: Locale = "pt"): string {
   if (numero < 0 || numero > 100000 || isNaN(numero) || !Number.isInteger(numero)) {
      throw new Error("O número deve ser um inteiro entre 0 e 100.000.");
   }

   const lang = data[locale];

   if (numero === 0) return lang.units[0];
   // CORREÇÃO: Tratamento especial para 100.000 para simplificar a lógica principal
   if (numero === 100000) {
      if (locale === "pt") return "cem mil";
      if (locale === "es") return "cien mil";
      return "one hundred thousand";
   }

   function belowThousand(n: number): string {
      // CORREÇÃO: Lógica para "cien" vs "ciento" e "cem" vs "cento"
      if (n === 100) {
         if (locale === "pt") return "cem";
         if (locale === "es") return "cien";
      }

      if (n < 20) return lang.units[n];

      // CORREÇÃO: Em espanhol, números de 21 a 29 são uma palavra só.
      if (locale === "es" && n > 20 && n < 30) {
         return lang.units[n];
      }

      if (n < 100) {
         const ten = Math.floor(n / 10);
         const unit = n % 10;
         if (unit === 0) return lang.tens[ten];
         const separator = locale === "en" ? "-" : lang.conjunction.trim();
         // CORREÇÃO: Para espanhol, "treinta y uno" etc.
         return `${lang.tens[ten]}${separator}${lang.units[unit]}`;
      }

      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      const hundredStr = lang.hundreds[hundred];

      if (remainder === 0) return hundredStr;

      return `${hundredStr}${lang.conjunction}${belowThousand(remainder)}`;
   }

   const thousands = Math.floor(numero / 1000);
   const remainder = numero % 1000;

   let thousandsStr = "";
   if (thousands > 0) {
      if (thousands === 1) {
         // CORREÇÃO: Em PT/ES "mil" é usado, não "um mil". Em EN, "one thousand".
         thousandsStr = locale === "en" ? `one ${lang.thousand}` : lang.thousand;
      } else {
         // CORREÇÃO: Apócope de "veintiuno" para "veintiún" em espanhol
         let thousandsText = belowThousand(thousands);
         if (locale === "es" && thousandsText.endsWith("uno")) {
            thousandsText = thousandsText.slice(0, -1) + "n";
         }
         thousandsStr = `${thousandsText} ${lang.thousand}`;
      }
   }

   if (remainder === 0) return thousandsStr;

   // CORREÇÃO: Lógica de conjunção aprimorada para PT/ES
   let separator = " ";
   if (locale === "pt" && (remainder < 100 || remainder % 100 === 0)) {
      separator = lang.conjunction;
   }
   if (locale === "en") {
      separator = " "; // Ex: "one thousand one", não "one thousand and one"
   }
   // A regra em espanhol é não usar "y", então o espaço padrão funciona.

   return `${thousandsStr}${separator}${belowThousand(remainder)}`;
}

interface CurrencyUnit {
   singular: string;
   plural: string;
}

export interface CurrencyOptions {
   currency: {
      integer: CurrencyUnit;
      decimal: CurrencyUnit;
   };
   conjunction?: string;
}

export function convertNumberToTextWithDecimals(
   numero: number,
   locale: Locale = "pt",
   options?: CurrencyOptions
): string {
   // --- Validação da Entrada ---
   if (isNaN(numero) || numero < 0 || numero > 100000) {
      throw new Error("O número deve ser um valor numérico entre 0 e 100.000.");
   }
   if (Math.round(numero * 100) / 100 !== numero) {
      throw new Error("O número pode ter no máximo 2 casas decimais.");
   }

   // --- Opções de Moeda Padrão ---
   const defaultOptions: Record<Locale, CurrencyOptions> = {
      pt: {
         currency: {
            integer: { singular: "real", plural: "reais" },
            decimal: { singular: "centavo", plural: "centavos" },
         },
         conjunction: " e ",
      },
      en: {
         currency: {
            integer: { singular: "dollar", plural: "dollars" },
            decimal: { singular: "cent", plural: "cents" },
         },
         conjunction: " and ",
      },
      es: {
         currency: {
            integer: { singular: "peso", plural: "pesos" },
            decimal: { singular: "centavo", plural: "centavos" },
         },
         conjunction: " y ",
      },
   };

   const config = { ...defaultOptions[locale], ...options };
   const { currency, conjunction } = config;

   // --- Função Interna para Converter Inteiros ---
   function integerToText(numToConvert: number): string {
      const lang = data[locale];

      if (numToConvert === 0) return lang.units[0];
      if (numToConvert === 100000) {
         if (locale === "pt") return "cem mil";
         if (locale === "es") return "cien mil";
         return "one hundred thousand";
      }

      function belowThousand(n: number): string {
         if (n === 100) {
            if (locale === "pt") return "cem";
            if (locale === "es") return "cien";
         }
         if (n < 20) return lang.units[n];
         if (locale === "es" && n > 20 && n < 30) return lang.units[n];
         if (n < 100) {
            const ten = Math.floor(n / 10);
            const unit = n % 10;
            if (unit === 0) return lang.tens[ten];
            const separator = locale === "en" ? "-" : lang.conjunction;
            return `${lang.tens[ten]}${separator}${lang.units[unit]}`;
         }
         const hundred = Math.floor(n / 100);
         const remainder = n % 100;
         const hundredStr = lang.hundreds[hundred];
         if (remainder === 0) return hundredStr;
         return `${hundredStr}${lang.conjunction}${belowThousand(remainder)}`;
      }

      const thousands = Math.floor(numToConvert / 1000);
      const remainder = numToConvert % 1000;
      let thousandsStr = "";

      if (thousands > 0) {
         if (thousands === 1) {
            thousandsStr = locale === "en" ? `one ${lang.thousand}` : lang.thousand;
         } else {
            let thousandsText = belowThousand(thousands);
            if (locale === "es" && thousandsText.endsWith("uno")) {
               thousandsText = thousandsText.slice(0, -1) + "n";
            }
            thousandsStr = `${thousandsText} ${lang.thousand}`;
         }
      }

      if (remainder === 0) return thousandsStr;
      let separator = " ";
      if (locale === "pt" && (remainder < 100 || remainder % 100 === 0)) {
         separator = lang.conjunction;
      }
      if (!thousandsStr) separator = " ";
      return `${thousandsStr}${separator}${belowThousand(remainder)}`;
   }

   // --- Separação e Conversão das Partes ---
   const integerPart = Math.floor(numero);
   const decimalPart = Math.round((numero - integerPart) * 100);

   const integerText = integerToText(integerPart);

   // --- Construção do Texto Final ---
   let resultParts = [];

   if (integerPart > 0) {
      const integerCurrency = integerPart === 1 ? currency.integer.singular : currency.integer.plural;
      resultParts.push(`${integerText} ${integerCurrency}`);
   }

   if (decimalPart > 0) {
      const decimalText = integerToText(decimalPart);
      const decimalCurrency = decimalPart === 1 ? currency.decimal.singular : currency.decimal.plural;
      resultParts.push(`${decimalText} ${decimalCurrency}`);
   }

   if (resultParts.length > 1) {
      return resultParts.join(conjunction);
   } else if (resultParts.length === 1) {
      return resultParts[0];
   } else {
      return `${integerToText(0)} ${currency.integer.plural}`; // "zero reais"
   }
}
