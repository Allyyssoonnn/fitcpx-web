import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share } from "lucide-react";
import { toast } from "sonner";

export default function AppMarketingDash() {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
         <AppCard
            title="FitCpx - Aluno"
            img="/assets/images/mobile/fitcpx-aluno.png"
            ios="https://apps.apple.com/br/app/fitcpx-aluno/id6749808580?l"
            android="https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx&pcampaignid=web_share"
         />
         <AppCard
            title="Biblioteca de exercícios"
            badge="Gratuito"
            img="/assets/images/mobile/fitcpx.png"
            ios="https://apps.apple.com/br/app/fitcpx/id6749830273"
            android="https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx&pcampaignid=web_share"
         />
      </div>
   );
}

function AppCard({
   title,
   img,
   badge,
   android,
   ios,
}: {
   title?: string;
   img?: string;
   badge?: string;
   android?: string;
   ios?: string;
}) {
   function copytoClipboard(link: string | undefined) {
      if (link) {
         navigator.clipboard.writeText(link);
         toast.success("Link copiado para área de transferência!");
      }
   }

   return (
      <Card>
         <CardHeader className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
               <img width={50} src={img} />
               <div className="d-flex flex-col gap-2">
                  {badge && <Badge>{badge}</Badge>}
                  {title}
               </div>
            </div>

            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Button size="sm">
                     <Share />
                  </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => copytoClipboard(android)}>
                     Google Play{" "}
                     <DropdownMenuShortcut>
                        <img
                           width="24"
                           height="24"
                           src="https://img.icons8.com/color/48/android-os.png"
                           alt="android-os"
                        />
                     </DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => copytoClipboard(ios)}>
                     App Store{" "}
                     <DropdownMenuShortcut>
                        <img
                           width="24"
                           height="24"
                           src="https://img.icons8.com/ios-filled/50/mac-os.png"
                           alt="mac-os"
                        />
                     </DropdownMenuShortcut>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </CardHeader>
      </Card>
   );
}

{
   /* <CardAction className="d-flex w-full justify-center gap-3">
               <a href="https://apps.apple.com/br/app/fitcpx-aluno/id6749808580?l">
                  <img width={90} src="/assets/images/mobile/appStore-black.png" />
               </a>

               <a href="https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx&pcampaignid=web_share">
                  <img width={100} src="/assets/images/mobile/googlePlay-black.png" />
               </a>
            </CardAction> */
}

{
   /* <CardAction className="d-flex w-full justify-center gap-3">
               <a href="https://apps.apple.com/br/app/fitcpx/id6749830273">
                  <img width={90} src="/assets/images/mobile/appStore-black.png" />
               </a>

               <a href="https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx&pcampaignid=web_share">
                  <img width={100} src="/assets/images/mobile/googlePlay-black.png" />
               </a>
            </CardAction> */
}
