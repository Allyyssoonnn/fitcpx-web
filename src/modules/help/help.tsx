import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
   Activity,
   CalendarCheck,
   Clipboard,
   ClipboardCheck,
   Coins,
   Dumbbell,
   Lightbulb,
   Mail,
   Pen,
   User,
   Video,
} from "lucide-react";

export default function Help() {
   return (
      <div className="container-fluid">
         <Card>
            <CardHeader>
               <h5>Ajuda</h5>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">
               <HelpRow />

               <Separator />

               <div>
                  <h5 className="mt-0">Vídeos tutoriais</h5>

                  <Accordion type="multiple" className="w-full">
                     {data.map(({ label: category, items, icon: Icon }: any, index: number) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-0">
                           <AccordionTrigger className="group border-1 p-3 hover:no-underline">
                              <span className="text-sm font-medium flex items-center gap-2 transition-all duration-300 group-data-[state=open]:pl-4 group-data-[state=open]:text-primary">
                                 <Icon size={15} />
                                 {category}
                              </span>
                           </AccordionTrigger>

                           <AccordionContent>
                              <div className="flex flex-col gap-2 pt-2">
                                 {items.map((item: any, i: number) => (
                                    <Item key={i}>
                                       <ItemMedia>
                                          <item.icon size={15} />
                                       </ItemMedia>

                                       <ItemContent>
                                          <ItemTitle>{item.label}</ItemTitle>
                                       </ItemContent>

                                       <ItemActions>
                                          <Button size="sm">
                                             <Video />
                                             Como fazer
                                          </Button>
                                       </ItemActions>
                                    </Item>
                                 ))}
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     ))}
                  </Accordion>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

const data = [
   {
      icon: User,
      label: "Alunos",
      items: [
         { icon: Pen, label: "Conhecendo a tela de cadastro", video: "https://google.com" },
         { icon: Pen, label: "Visualização do aluno", video: "https://google.com" },
      ],
   },
   {
      icon: Dumbbell,
      label: "Treinos",
      items: [
         { icon: Pen, label: "Conhecendo a tela de cadastro", video: "https://google.com" },
         { icon: Lightbulb, label: "Treino inteligente", video: "https://google.com" },
         { icon: Lightbulb, label: "Acompanhamento de resultados", video: "https://google.com" },
         { icon: Lightbulb, label: "Reajuste de treino", video: "https://google.com" },
      ],
   },
   {
      icon: Activity,
      label: "Avaliações Físicas",
      items: [
         { icon: Pen, label: "Conhecendo a tela de cadastro", video: "https://google.com" },
         { icon: ClipboardCheck, label: "Entendendo a tela de resultado", video: "https://google.com" },
      ],
   },
   {
      icon: Clipboard,
      label: "Contratos",
      items: [
         { icon: Pen, label: "Conhecendo a tela de cadastro", video: "https://google.com" },
         { icon: Coins, label: "Status de pagamentos e repasses", video: "https://google.com" },
      ],
   },
   {
      icon: Clipboard,
      label: "Agenda",
      items: [
         { icon: Pen, label: "Cadastro de eventos e disponibilidades", video: "https://google.com" },
         { icon: CalendarCheck, label: "Agendando disponibilidade", video: "https://google.com" },
      ],
   },
];

function HelpRow() {
   return (
      <div className="w-full flex justify-between gap-3">
         <Card
            className="w-full bg-red-300 hover:scale-102 transition-all cursor-pointer"
            onClick={() => window.open("https://www.youtube.com/@FitCpx", "_blank", "noopener,noreferrer")}
         >
            <CardContent>
               Conferir Vídeos
               <div className="card-body p-3 d-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                     <path
                        fill="currentColor"
                        d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73z"
                     />
                  </svg>
                  <h5 className="card-title ms-2">Youtube</h5>
               </div>
            </CardContent>
         </Card>

         <Card
            className="w-full bg-green-300 hover:scale-102 transition-all cursor-pointer"
            onClick={() => window.open("https://wa.me/551152866458", "_blank")}
         >
            <CardContent>
               Entrar em Contato
               <div className="card-body p-3 d-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                     <path
                        fill="currentColor"
                        d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                     />
                  </svg>
                  <h5 className="card-title ms-2">WhatsApp</h5>
               </div>
            </CardContent>
         </Card>

         <Card
            className="w-full bg-gray-300 hover:scale-102 transition-all cursor-pointer"
            onClick={() => window.open("mailto:fitcomplex@fitcpx.com", "_blank")}
         >
            <CardContent>
               Entrar em Contato
               <div className="card-body p-3 d-flex">
                  <Mail />
                  <h5 className="card-title ms-2">E-mail</h5>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
