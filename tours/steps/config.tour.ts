// tourSteps.ts

export const configSteps: any[] = [
   {
      element: "#avatar",
      popover: {
         title: "Perfil",
         description: "Clique na sua foto para acessar o menu",
      },
      isInput: false,
   },
   {
      element: "#avatar-config",
      popover: {
         title: "Configurações",
         description: "Gerencie seus dados da conta",
      },
      isInput: false,
   },
   {
      element: "#tab-business",
      popover: {
         title: "Dados Profissionais",
         description: "Preencha para validar sua conta e receber os pagamentos",
      },
      isInput: false,
   },
   {
      element: "#cnpj",
      popover: {
         title: "CNPJ/CPF",
         description: "Essencial para validar a conta e processar seus repasses",
      },
      isInput: true,
   },
   {
      element: "#pix",
      popover: {
         title: "Chave PIX",
         description: "Informe a chave para receber seus pagamentos",
      },
      isInput: true,
   },
   {
      element: "#name",
      popover: {
         title: "Nome",
         description: "Nome que será vinculado aos contratos",
      },
      isInput: true,
   },
   {
      element: "#phone",
      popover: {
         title: "Telefone",
         description: "Necessário para contato e para preencher contratos",
      },
      isInput: true,
   },
   {
      element: "#email",
      popover: {
         title: "E-mail",
         description: "Usado para avisos importantes e para preencher contratos",
      },
      isInput: true,
   },
   {
      element: "#cep",
      popover: {
         title: "CEP",
         description: "Usado para o preenchimento automático de endereço",
      },
      isInput: true,
   },
   {
      element: "#number",
      popover: {
         title: "Número predial",
         description: "Complete seu endereço para os contratos",
      },
      isInput: true,
   },
   {
      element: "#submit",
      popover: {
         title: "Salvar Alterações",
         description: "Clique para confirmar e salvar os dados",
      },
      isInput: false,
   },
];
