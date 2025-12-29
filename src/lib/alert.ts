import Swal from "sweetalert2";

//SOMENTE SE PRECISAR INJETAR COMPONENTES
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal)

export const Alert = Swal.mixin({
   // 1. Desliga o estilo padrão dos botões do SweetAlert
   buttonsStyling: false,

   // 2. Mapeia as classes do Tailwind/Shadcn
   customClass: {
      // popup: "bg-background text-foreground border border-border rounded-xl shadow-lg", // Card do Shadcn
      popup: "dark:bg-popover !bg-popover text-popover-foreground border border-border rounded-xl shadow-lg",
      title: "text-lg font-semibold text-foreground", // Título
      htmlContainer: "text-muted-foreground text-sm", // Texto do corpo

      confirmButton:
         "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ml-2", // Botão Default

      // cancelButton:
      // "bg-background hover:bg-accent hover:text-accent-foreground border border-input h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // Botão Outline/Ghost
      // Botão Cancelar VERMELHO (Destructive)
      cancelButton:
         "bg-destructive text-white text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

      actions: "gap-2", // Espaçamento entre botões
      icon: "border-none", // Remove borda estranha dos ícones padrão
   },
});

export const Toast = Swal.mixin({
   toast: true,
   position: "top-end",
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
   buttonsStyling: false,
   customClass: {
      popup: "bg-popover text-popover-foreground border border-border rounded-lg shadow-md",
      title: "text-sm font-semibold",
      timerProgressBar: "bg-primary", // A barra de tempo com a cor do tema
   },
});
