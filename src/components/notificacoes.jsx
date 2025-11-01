import { Bell } from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getNotifications } from "../api/companies";
import { stateEmpresa } from "../states/states";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";

function Notificacoes() {
   const [empresa] = useRecoilState(stateEmpresa);
   const navigate = useNavigate();

   const { data: notifications } = useQuery({
      queryKey: ["notifications"],
      queryFn: getNotifications,
      initialData: [],
      enabled: !!empresa.cod_empresa,
   });

   function clickNotify(type) {
      if (type === "Licença") navigate("/configuracao?tab=4");
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <Button size="sm" variant="ghost">
               {notifications.length > 0 && <Badge>{notifications.length}</Badge>}
               <Bell />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent>
            {notifications.map((notificacao, i) => (
               <DropdownMenuItem key={i} onClick={clickNotify}>
                  <Item className="w-[300px] p-3 pb-2">
                     <ItemMedia>
                        <Bell />
                     </ItemMedia>

                     <ItemContent>
                        <ItemTitle>{notificacao.type}</ItemTitle>
                        <ItemDescription>{notificacao.content}</ItemDescription>
                     </ItemContent>
                  </Item>
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default Notificacoes;
