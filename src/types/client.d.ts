export interface ClientType {
   cod_aluno: number;
   nome_aluno: string;
   status_aluno: "A" | "I" | "B";
   cpf_aluno?: string;
   rg_aluno?: string;
   telefone_aluno?: string;
   email_aluno?: string;
   data_nascimento_aluno?: string;
   sexo_aluno?: string;
   etnia_aluno?: string;
   cep_aluno?: string;
   endereco_aluno?: string;
   numero_aluno?: string;
   complemento_aluno?: string;
   bairro_aluno?: string;
   estado_aluno?: string;
   cidade_aluno?: string;
   observacao_aluno?: string;
   senha_aluno?: string;
   imagem_aluno?: string;
   dev_stripe_id?: string;
   stripe_id?: string;
   asaas_id?: string;
   payment_stripe_id?: string;
   dev_payment_stripe_id?: string;
   createdAt?: string;
   updatedAt?: string;
   deletedAt?: string | null;

   // // Associações (opcional)
   // usuario?: {
   //    cod_usuario: number;
   //    // outros campos do usuário que você precisar
   // };
   // empresa?: {
   //    cod_empresa: number;
   //    // outros campos da empresa
   // };
   // avaliacao?: Array<{
   //    cod_avaliacao: number;
   //    // outros campos da avaliação
   // }>;
}
