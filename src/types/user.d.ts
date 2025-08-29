export interface UserType {
   cod_usuario: number;
   cod_empresa?: number;
   nome_usuario?: string;
   email_usuario?: string;
   senha_usuario?: string;
   telefone_usuario?: string;
   celular_usuario?: string;
   cpf_usuario?: string;
   data_nascimento_usuario?: string;
   cep_usuario?: string;
   endereco_usuario?: string;
   numero_usuario?: string;
   complemento_usuario?: string;
   bairro_usuario?: string;
   estado_usuario?: string;
   cidade_usuario?: string;
   imagem_usuario?: string;
   refreshToken?: string;
   stripe_id?: string;
   dev_stripe_id?: string;
   stripe_account_id?: string;
   dev_stripe_account_id?: string;
   front_doc_id?: string;
   back_doc_id?: string;
   titular_banco_conta?: string;
   codigo_banco_conta?: string;
   agencia_banco_conta?: string;
   numero_banco_conta?: string;
   admin_usuario?: "S" | "N";
   deletedAt?: string | null;

   // Associações opcionais
   //   empresa?: {
   //     cod_empresa: number;
   //     nome_empresa?: string;
   //     // outros campos da empresa que você precisar
   //   };
}
