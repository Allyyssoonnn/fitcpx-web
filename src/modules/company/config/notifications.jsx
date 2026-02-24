import { useQuery } from "@tanstack/react-query";
import {
   Activity,
   BookmarkX,
   CalendarCheck,
   Dumbbell,
   FilePlus,
   Handshake,
   Mail,
   Receipt,
   Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getNotificationsConfig, saveNotificationsConfig } from "../../../api/companies";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../../../components/ui/item";
import { Label } from "../../../components/ui/label";

export default function Notifications() {
   const [notifications, setNotifications] = useState({});

   const { data } = useQuery({
      queryKey: ["notificationsConfig"],
      queryFn: getNotificationsConfig,
      initialData: {},
   });

   useEffect(() => {
      if (data) setNotifications(data);
   }, [data]);

   async function saveNotifications() {
      await saveNotificationsConfig(JSON.stringify(notifications));
      toast.success("Notificações salvas com sucesso");
   }

   return (
      <div className="grid gap-3">
         <h5>Notificações para o Aluno</h5>
         {notificationsItems.map((item, index) => {
            const config = notifications[item.key] ?? defaultNotifications[item.key];

            return (
               <Item key={index} variant="outline">
                  <ItemMedia className="h-full bg-accent p-3 rounded">
                     <item.icon className="size-5" />
                  </ItemMedia>

                  <ItemContent>
                     <ItemTitle>{item.title}</ItemTitle>
                     <ItemDescription>{item.desciption}</ItemDescription>
                  </ItemContent>

                  <ItemActions className="grid border-l ps-3 min-w-[12%]">
                     {typeof config?.app === "boolean" ? (
                        <div className="flex gap-3">
                           <Checkbox
                              id={`checked-app-${index}`}
                              checked={config.app}
                              onCheckedChange={(check) =>
                                 setNotifications((prev) => ({ ...prev, [item.key]: { ...config, app: check } }))
                              }
                           />
                           <Label htmlFor={`checked-app-${index}`} className="cursor-pointer">
                              App
                           </Label>
                           <Smartphone size={15} />
                        </div>
                     ) : (
                        <Disabled type="app" />
                     )}

                     {typeof config?.email === "boolean" ? (
                        <div className="flex gap-3">
                           <Checkbox
                              id={`checked-email-${index}`}
                              checked={config.email}
                              onCheckedChange={(check) =>
                                 setNotifications((prev) => ({ ...prev, [item.key]: { ...config, email: check } }))
                              }
                           />
                           <Label htmlFor={`checked-email-${index}`} className="cursor-pointer">
                              E-mail
                           </Label>
                           <Mail size={15} />
                        </div>
                     ) : (
                        <Disabled type="email" />
                     )}

                     {/* {typeof config?.whatsapp === "boolean" ? (
                        <div className="flex gap-3">
                           <Checkbox
                              id={`checked-whatsapp-${index}`}
                              checked={config?.whatsapp}
                              onCheckedChange={(check) =>
                                 setNotifications((prev) => ({ ...prev, [item.key]: { ...config, whatsapp: check } }))
                              }
                           />
                           <Label htmlFor={`checked-whatsapp-${index}`} className="cursor-pointer">
                              Whatsapp
                           </Label>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                              <path
                                 fill="currentColor"
                                 d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                              />
                           </svg>
                        </div>
                     ) : (
                        <Disabled type="whatsapp" />
                     )} */}
                  </ItemActions>
               </Item>
            );
         })}

         <div className="flex justify-end">
            <Button onClick={saveNotifications}>Confirmar</Button>
         </div>
      </div>
   );
}

function Disabled({ type }) {
   if (type === "app") {
      return (
         <div className="flex gap-3">
            <Checkbox disabled />
            <Label className="text-muted">App</Label>
            <Smartphone size={15} className="text-muted" />
         </div>
      );
   }
   if (type === "email") {
      return (
         <div className="flex gap-3">
            <Checkbox disabled />
            <Label className="text-muted">E-mail</Label>
            <Mail size={15} className="text-muted" />
         </div>
      );
   }
   if (type === "whatsapp") {
      return (
         <div className="flex gap-3">
            <Checkbox disabled />
            <Label className="text-muted">Whatsapp</Label>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-muted">
               <path
                  fill="currentColor"
                  d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
               />
            </svg>
         </div>
      );
   }
}

const defaultNotifications = {
   invoiceOverdue: { app: true, whatsapp: true },
   invoiceCreated: { app: true },
   paymentConfirmed: { app: true },
   physicalAssessmentCreated: { app: true },
   workoutCreated: { app: true },
   contractCreated: { app: true },
   eventCreated: { app: true },
};

const notificationsItems = [
   {
      key: "invoiceOverdue",
      icon: BookmarkX,
      title: "Fatura Vencida",
      desciption: "Notificação enviada quando fatura do aluno ultrapassa o vencimento",
   },
   {
      key: "invoiceCreated",
      icon: FilePlus,
      title: "Fatura Criada",
      desciption: "Notificação enviada quando uma nova fatura do contrato é gerada",
   },
   {
      key: "paymentConfirmed",
      icon: Receipt,
      title: "Pagamento Confirmado",
      desciption: "Notificação enviada quando o pagamento da fatura é confirmado",
   },
   {
      key: "contractCreated",
      icon: Handshake,
      title: "Novo Contrato",
      desciption: "Notificação enviada quando um novo contrato é gerado",
   },
   {
      key: "physicalAssessmentCreated",
      icon: Activity,
      title: "Nova Avaliação Física",
      desciption: "Notificação enviada quando uma nova avaliacao física é cadastrada",
   },
   {
      key: "workoutCreated",
      icon: Dumbbell,
      title: "Novo Treino",
      desciption: "Notificação enviada quando um novo treino é cadastrado",
   },
   {
      key: "eventCreated",
      icon: CalendarCheck,
      title: "Novo Evento",
      desciption: "Notificação enviada quando um novo evento é agendado",
   },
];
