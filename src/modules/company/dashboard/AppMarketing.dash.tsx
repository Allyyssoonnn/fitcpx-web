import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";

export default function AppMarketingDash() {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <Card>
            <CardHeader>
               <CardDescription className="d-flex justify-between items-center">
                  FitCpx - Aluno
                  <img width={50} src="/assets/images/mobile/fitcpx-aluno.png" />
               </CardDescription>
            </CardHeader>

            <CardAction className="d-flex w-full justify-center gap-3">
               <a href="https://apps.apple.com/br/app/fitcpx-aluno/id6749808580?l">
                  <img width={90} src="/assets/images/mobile/appStore-black.png" />
               </a>

               <a href="https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx&pcampaignid=web_share">
                  <img width={100} src="/assets/images/mobile/googlePlay-black.png" />
               </a>
            </CardAction>
         </Card>

         <Card>
            <CardHeader>
               <CardDescription className="d-flex justify-between items-center">
                  <div className="d-flex flex-col gap-2">
                     <Badge>Gratuito</Badge>
                     Biblioteca de exercícios
                  </div>
                  <img width={50} src="/assets/images/mobile/fitcpx.png" />
               </CardDescription>
            </CardHeader>

            <CardAction className="d-flex w-full justify-center gap-3">
               <a href="https://apps.apple.com/br/app/fitcpx/id6749830273">
                  <img width={90} src="/assets/images/mobile/appStore-black.png" />
               </a>

               <a href="https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx&pcampaignid=web_share">
                  <img width={100} src="/assets/images/mobile/googlePlay-black.png" />
               </a>
            </CardAction>
         </Card>
      </div>
   );
}
