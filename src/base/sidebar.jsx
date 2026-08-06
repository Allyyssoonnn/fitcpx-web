import {
   Activity,
   BanknoteArrowDown,
   BookOpenText,
   BoxIcon,
   BoxSelect,
   Calendar,
   ChartBarIncreasing,
   ChevronRight,
   Coins,
   Dumbbell,
   Handshake,
   HelpCircle,
   Home,
   PenIcon,
   User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { modalIntroduction } from "../modals/introduction";

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
         <SidebarHeader>
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
            label: "Biblioteca",
            Icon: BookOpenText,
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
            label: "Repasses",
            Icon: BanknoteArrowDown,
            path: "payouts",
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
   // {
   //    id: "adminMenu",
   //    label: "ADMIN",
   //    items: [
   //       {
   //          id: "users",
   //          label: "Usuários",
   //          Icon: User2,
   //          path: "users",
   //       },
   //    ],
   // },
];

function Footer() {
   return (
      <div className="flex flex-wrap items-center justify-around w-100 border-t-1 pt-2">
         <SidebarMenuButton asChild className="p-6">
            <a href="#" onClick={() => window.open("https://wa.me/551152866458", "_blank")}>
               <HelpCircle />
               <span className="fs-4">Suporte</span>
            </a>
         </SidebarMenuButton>

         <SidebarMenuButton asChild className="p-6">
            <a href="#" onClick={() => modalIntroduction.show()}>
               <Handshake />
               <span className="fs-4">Introdução</span>
            </a>
         </SidebarMenuButton>
      </div>
   );
}

export default AppSidebar;
