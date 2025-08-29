export interface CompanyType {
   cod_empresa: number;
   nome_empresa?: string;
   status_empresa?: string;
   descricao_empresa?: string;
   razao_social_empresa?: string;
   doc_empresa?: string;
   pix_empresa?: string;
   email_empresa?: string;
   email_confirmado?: "S" | "N";
   email_codigo?: string;
   telefone_empresa?: string;
   celular_empresa?: string;
   cep_empresa?: string;
   endereco_empresa?: string;
   numero_empresa?: string;
   complemento_empresa?: string;
   bairro_empresa?: string;
   estado_empresa?: string;
   cidade_empresa?: string;
   imagem_empresa?: string;
   walletid_empresa?: string;
   dev_stripe_customer_id?: string;
   asaas_apikey?: string;
   asaas_id?: string;
   dev_walletid_empresa?: string;
   stripe_customer_id?: string;
   dev_asaas_apikey?: string;
   dev_stripe_id?: string;
   stripe_id?: string;
   titular_banco_conta?: string;
   codigo_banco_conta?: string;
   agencia_banco_conta?: string;
   numero_banco_conta?: string;
   presets_treino_inteligente?: string;

   // Associações opcionais
   //   licenses?: Array<{
   //     cod_empresa_licenca: number;
   //     nome_licenca?: string;
   //     // outros campos da licença que você precisar
   //   }>;
}
