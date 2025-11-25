// tourSteps.ts

export const configSteps: any[] = [
   {
      element: "#avatar",
      popover: {
         title: "Perfil",
         description: "Clique na foto para abrir o menu",
      },
      isInput: false,
   },
   {
      element: "#avatar-config",
      popover: {
         title: "Configurações",
         description: "Clique aqui para editar suas configurações",
      },
      isInput: false,
   },
   {
      element: "#tab-business",
      popover: {
         title: "Configurações profissionais",
         description: "Vamos para aba mais importante para conseguirmos avançar",
      },
      isInput: false,
   },
   {
      element: "#cnpj",
      popover: {
         title: "CNPJ ou CPF",
         description: "Informe seu CNPJ ou CPF usaremos para válidar conta e enviar os repasses",
      },
      isInput: true,
   },
   {
      element: "#pix",
      popover: {
         title: "Chave PIX",
         description: "Enviaremos os repasses para essa conta",
      },
      isInput: true,
   },
   {
      element: "#name",
      popover: {
         title: "Nome profissional",
         description: "Nome que aparecerá nos contratos caso queira editar",
      },
      isInput: true,
   },
   {
      element: "#phone",
      popover: {
         title: "Telefone",
         description: "Usado nos contratos com alunos e precisamos do seu telefone para contato em caso de problemas",
      },
      isInput: true,
   },
   {
      element: "#email",
      popover: {
         title: "E-mail",
         description: "Usado para preenchimento dos contratos e para avisos",
      },
      isInput: true,
   },
   {
      element: "#cep",
      popover: {
         title: "CEP",
         description: "Usado para preenchimento dos contratos",
      },
      isInput: true,
   },
   {
      element: "#number",
      popover: {
         title: "Número predial",
         description: "Usado para preenchimento dos contratos",
      },
      isInput: true,
   },
   {
      element: "#submit",
      popover: {
         title: "Pronto",
         description: "Vamos confirmar e salvar as alterações",
      },
      isInput: false,
   },
];
