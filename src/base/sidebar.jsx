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
import { PRODUCAO } from "../api/api";
import { sendFeedback } from "../api/companies";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
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
            borderLeft: `0.30rem solid ${PRODUCAO ? "#85D446" : "#FF0000"}`,
         }}
      >
         <SidebarHeader className="shadow-sm">
            <div className="d-flex align-items-center w-100 justify-content-center py-1">
               <div className="position-relative">
                  <img src="../assets/images/logos/logo.png" alt="Logo" width="45" className="rounded-circle" />
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
                        <SidebarMenuButton id={item.id} asChild className="p-4">
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
                              <SidebarMenuButton id={menu.id} className="w-full justify-between p-4">
                                 <span className="fs-4">{menu.label}</span>
                                 <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                           </CollapsibleTrigger>

                           <CollapsibleContent>
                              <SidebarMenuSub>
                                 {menu.items.map((item, indexItem) => (
                                    <SidebarMenuSubItem key={indexItem}>
                                       <SidebarMenuSubButton id={item.id} asChild className="p-4">
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
            id: "services",
            label: "Modalidades",
            Icon: BoxIcon,
            path: "modalidades",
         },
         {
            id: "contractTemplates",
            label: "Mod. Contratos",
            Icon: BoxSelect,
            path: "modcontratos",
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
      <div className="d-flex items-center justify-around w-100">
         <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => window.open("https://wa.me/55449991654044", "_blank")}
         >
            Suporte
            <i className="bi bi-chat-right-text ms-2"></i>
         </button>
         <Dialog>
            <DialogTrigger>
               <button className="btn btn-sm btn-outline-info">
                  Enviar feedback
                  <i className="bi bi-chat-right-text ms-2"></i>
               </button>
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
         </Dialog>
      </div>
   );
}

export default AppSidebar;
