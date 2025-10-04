import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "../../ui/dialog";

type ListComponentFiltersProps = {
   children: React.ReactNode;
};

export default function ListComponentFilters({ children }: ListComponentFiltersProps) {
   return (
      <Dialog>
         <DialogTrigger>
            <Button size="sm">
               <Funnel />
            </Button>
         </DialogTrigger>

         <DialogContent className="col-md-3 col-12">
            <DialogHeader>
               <DialogTitle className="text-start">Filtros</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2">{children}</div>

            <DialogFooter>
               <DialogClose>
                  <button className="btn btn-outline-danger rounded">Fechar</button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
