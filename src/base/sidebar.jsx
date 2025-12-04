import {
   Activity,
   BoxIcon,
   BoxSelect,
   Calendar,
   ChartBarIncreasing,
   ChevronRight,
   ClipboardCheck,
   Coins,
   Dumbbell,
   Home,
   PenIcon,
   User,
   User2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendFeedback } from "../api/companies";
import { Button } from "../components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from "../components/ui/sidebar";
import { useNotificacao } from "../states/states";

function AppSidebar() {
   const navigate = useNavigate();

   function go(route) {
      navigate(route);
   }

   return (
      <Sidebar
         style={{
            // borderLeft: `0.30rem solid ${PRODUCAO ? "#85D446" : "#FF0000"}`,
            borderLeft: `0.30rem solid #85D446`,
         }}
      >
         <SidebarHeader className="shadow-sm">
            <div className="d-flex align-items-center w-100 justify-content-center py-1">
               <div className="position-relative">
                  <img src="../assets/images/logos/natal2.png" alt="Logo" width="45" className="rounded-circle" />
               </div>
               <h3 className="ms-3 mb-0 fs-6">FitCpx</h3>
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Menu</SidebarGroupLabel>

               <SidebarMenu className="px-1">
                  {items.map((item, index) => (
                     <SidebarMenuItem key={index}>
                        <SidebarMenuButton id={item.id} asChild className="p-6">
                           <a
                              href="#"
                              onClick={(e) => {
                                 e.preventDefault();
                                 go(item.path);
                              }}
                           >
                              <item.Icon />
                              <span className="fs-4">{item.label}</span>
                           </a>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  ))}

                  {dropdown.map((menu, index) => (
                     <Collapsible key={index} className="group/collapsible">
                        <SidebarMenuItem>
                           <CollapsibleTrigger asChild>
                              <SidebarMenuButton id={menu.id} className="w-full justify-between p-6">
                                 <span className="fs-4">{menu.label}</span>
                                 <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                           </CollapsibleTrigger>

                           <CollapsibleContent>
                              <SidebarMenuSub>
                                 {menu.items.map((item, indexItem) => (
                                    <SidebarMenuSubItem key={indexItem}>
                                       <SidebarMenuSubButton id={item.id} asChild className="p-6">
                                          <a
                                             href="#"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                go(item.path);
                                             }}
                                          >
                                             <item.Icon />
                                             <span className="fs-4">{item.label}</span>
                                          </a>
                                       </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                 ))}
                              </SidebarMenuSub>
                           </CollapsibleContent>
                        </SidebarMenuItem>
                     </Collapsible>
                  ))}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <Footer />
         </SidebarFooter>
      </Sidebar>
   );
}

const items = [
   {
      label: "Dashboard",
      Icon: Home,
      path: "dashboard",
   },
   {
      id: "clients",
      label: "Alunos",
      Icon: User,
      path: "alunos",
   },
   {
      label: "Agenda",
      Icon: Calendar,
      path: "agenda",
   },
   {
      label: "Treinar aluno",
      Icon: Dumbbell,
      path: "planilha",
   },
   {
      label: "Avaliações físicas",
      Icon: Activity,
      path: "avaliacoes",
   },
];

const dropdown = [
   {
      id: "workoutsMenu",
      label: "Treinos",
      items: [
         {
            label: "Exercícios",
            Icon: Activity,
            path: "exercicios",
         },
         {
            id: "workouts",
            label: "Treinos",
            Icon: ClipboardCheck,
            path: "treinos",
         },
      ],
   },
   {
      id: "financeMenu",
      label: "Financeiro",
      items: [
         {
            label: "Resumo",
            Icon: ChartBarIncreasing,
            path: "financeOverview",
         },
         {
            label: "Contratos",
            Icon: PenIcon,
            path: "contratos",
         },
         {
            id: "contractTemplates",
            label: "Mod. Contratos",
            Icon: BoxSelect,
            path: "modcontratos",
         },
         {
            id: "services",
            label: "Modalidades",
            Icon: BoxIcon,
            path: "modalidades",
         },
         {
            label: "Planos",
            Icon: Coins,
            path: "planos",
         },
      ],
   },
   {
      id: "adminMenu",
      label: "ADMIN",
      items: [
         {
            id: "users",
            label: "Usuários",
            Icon: User2,
            path: "users",
         },
      ],
   },
];

function Footer() {
   const { nSuccess } = useNotificacao();
   const { handleSubmit, register, reset, watch, setValue } = useForm();

   const feedbackType = watch("feedbackType");

   async function handleFeedbackSubmit(data) {
      sendFeedback(data.feedbackType, data.feedbackMessage);
      reset();
      nSuccess("Feedback enviado com sucesso!", "Obrigado por nos ajudar a melhorar a sua experiencia!");
   }

   return (
      <div className="d-flex items-center justify-around w-100 border-t-1 pt-2">
         <Button size="sm" onClick={() => window.open("https://wa.me/551152866458", "_blank")}>
            {/* <MessageCircle /> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path
                  fill="currentColor"
                  d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
               />
            </svg>
            Atendimento
         </Button>

         {/* <Dialog>
            <DialogTrigger>
               <Button size="sm">
                  <MessageSquareMore />
                  Feedback
               </Button>
            </DialogTrigger>

            <DialogContent>
               <DialogTitle className="text-black fs-6">Enviar feedback</DialogTitle>

               <form onSubmit={handleSubmit(handleFeedbackSubmit)}>
                  <div>
                     <Select value={feedbackType} onValueChange={(value) => setValue("feedbackType", value)}>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>

                        <SelectContent>
                           <SelectItem value="Reportar problema">Reportar problema</SelectItem>
                           <SelectItem value="Sugestão de melhoria">Sugestão de melhoria</SelectItem>
                           <SelectItem value="Alteração de exercício base">Alteração de exercício base</SelectItem>
                           <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                     </Select>

                     <textarea
                        className="form-control mt-3"
                        rows="3"
                        placeholder="Escreva aqui..."
                        {...register("feedbackMessage")}
                     />
                  </div>

                  <DialogFooter className="d-flex justify-content-end align-items-center mt-3">
                     <DialogClose className="d-flex justify-content-end gap-3">
                        <button type="button" className="btn btn-danger rounded">
                           Fechar
                        </button>

                        <button type="submit" className="btn btn-success rounded">
                           Enviar
                        </button>
                     </DialogClose>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog> */}
      </div>
   );
}

export default AppSidebar;
