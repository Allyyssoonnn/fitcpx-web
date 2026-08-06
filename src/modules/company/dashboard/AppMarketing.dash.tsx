import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function FitCpxAlunoCard() {
   return (
      <Card className="border-0 bg-gradient-to-bl from-green-100 to-green-50 dark:bg-green-950 dark:bg-gradient-to-b dark:from-green-950 dark:to-green-900">
         <CardHeader>
            <CardTitle className="text-lg">FitCpx - Aluno</CardTitle>
            <CardDescription>
               Baixe o <strong>FitCpx</strong> e tenha acesso a uma ampla variedade de exercícios para melhorar sua
               performance física.
            </CardDescription>
         </CardHeader>

         <CardFooter className="flex justify-between">
            <ButtonAppStore
               ios="https://apps.apple.com/br/app/fitcpx-aluno/id6749808580?l"
               android="https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx&pcampaignid=web_share"
            />

            <img width={50} src="/assets/images/mobile/fitcpx-aluno.png" />
         </CardFooter>
      </Card>
   );
}

export function FitCpxAppCard() {
   return (
      <Card className="border-0 bg-gradient-to-bl from-green-100 to-green-50 dark:bg-green-950 dark:bg-gradient-to-b dark:from-green-950 dark:to-green-900">
         <CardHeader>
            <CardTitle className="text-lg">FitCpx - Biblioteca de Exercícios</CardTitle>
            <CardDescription>
               Baixe o <strong>FitCpx</strong> e tenha acesso a uma ampla variedade de exercícios para melhorar sua
               performance física.
            </CardDescription>
         </CardHeader>

         <CardFooter className="flex justify-between">
            <ButtonAppStore
               ios="https://apps.apple.com/br/app/fitcpx/id6749830273"
               android="https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx&pcampaignid=web_share"
            />

            <img width={50} src="/assets/images/mobile/fitcpx.png" />
         </CardFooter>
      </Card>
   );
}

function ButtonAppStore({ android, ios }: { android?: string; ios?: string }) {
   function copytoClipboard(link: string | undefined) {
      if (link) {
         navigator.clipboard.writeText(link);
         toast.success("Link copiado para área de transferência!");
      }
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <Button variant="outline" className="bg-green-100 hover:bg-green-200">
               Acessar
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent>
            <DropdownMenuItem onClick={() => copytoClipboard(android)}>
               Google Play{" "}
               <DropdownMenuShortcut>
                  <img width="24" height="24" src="https://img.icons8.com/color/48/android-os.png" alt="android-os" />
               </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copytoClipboard(ios)}>
               App Store{" "}
               <DropdownMenuShortcut>
                  <img width="24" height="24" src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="mac-os" />
               </DropdownMenuShortcut>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
