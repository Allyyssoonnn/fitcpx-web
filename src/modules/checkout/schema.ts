import { isValidCPF } from "@/utils/utils";
import z from "zod";

export const checkoutSchema = z
   .object({
      nome_aluno: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
      email_aluno: z.string().email("E-mail inválido"),
      telefone_aluno: z.string().min(15, "Telefone inválido"),
      // cpf_aluno: z.string().min(14, "CPF inválido"),
      cpf_aluno: z.string().refine((val) => isValidCPF(val), {
         message: "CPF inválido",
      }),
      data_nascimento_aluno: z.string().refine((val) => val !== "", "Data de nascimento obrigatória"),
      sexo_aluno: z.string().min(1, "Selecione um gênero"), // Select precisa de validação

      // Endereço
      cep_aluno: z.string().min(9, "CEP inválido"),
      cidade_aluno: z.string().min(1, "Cidade obrigatória"),
      endereco_aluno: z.string().min(1, "Rua obrigatória"),
      bairro_aluno: z.string().min(1, "Bairro obrigatório"),
      numero_aluno: z.string().min(1, "Número obrigatório"),
      estado_aluno: z.string().min(2, "Estado obrigatório"),

      // Pagamento
      metodo_pagamento: z
         .enum(["monthly", "cash", "installments"])
         .refine((val) => val !== undefined, { message: "Selecione uma forma de pagamento" }),
      metodo_recorrencia: z
         .enum(["monthly_app", "monthly_card"])
         .refine((val) => val !== undefined, { message: "Selecione uma forma de pagamento para recorrência" }),

      parcelas: z.string().optional(),
   })
   .superRefine((data, ctx) => {
      // Validação extra: Se escolheu parcelado, TEM que escolher a quantidade
      if (data.metodo_pagamento === "installments" && !data.parcelas) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione a quantidade de parcelas",
            path: ["parcelas"],
         });
      }
   });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
