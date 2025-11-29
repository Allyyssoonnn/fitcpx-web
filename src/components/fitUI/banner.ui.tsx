import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";

interface BannerUIControlled {
   show: boolean;
   closeControlled: () => void;
}

export default function BannerUI({ show, closeControlled }: BannerUIControlled) {
   const navigate = useNavigate();
   const [notShowAgain, setNotShowAgain] = useState(false);

   function goTo() {
      closeControlled();
      navigate("/configuracao?tab=3");
   }

   function close() {
      if (notShowAgain) localStorage.setItem("Banner-BlackFriday", "hidden");
      closeControlled();
   }

   return (
      <Dialog open={show}>
         <DialogContent
            className="p-0 w-[100vw] max-w-sm sm:max-w-md md:max-w-lg max-h-[100vh] overflow-y-auto [&>button]:hidden"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
         >
            <img className="rounded-md w-full h-auto" src="../assets/images/app/banner.png" />

            <DialogFooter className="px-3 pb-3 flex items-center justify-between flex-wrap gap-3">
               <div className="flex items-center gap-1">
                  <Checkbox
                     checked={notShowAgain}
                     onCheckedChange={(checked: boolean) => setNotShowAgain(checked)}
                     id="hiddenBanner"
                  />
                  <Label htmlFor="hiddenBanner">Não mostrar novamente</Label>
               </div>

               <div className="flex gap-3">
                  <Button onClick={close} size="sm" variant="destructive">
                     Fechar
                  </Button>

                  <Button onClick={goTo} size="sm">
                     Conhecer plano
                  </Button>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
