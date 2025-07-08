import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";

type ListComponentFiltersProps = {
    children: React.ReactNode;
}

export default function ListComponentFilters({ children }: ListComponentFiltersProps) {
    return (
        <Dialog>
            <DialogTrigger>
                <button className="btn btn-sm btn-outline-info">
                    <i className="bi bi-funnel"></i>
                </button>
            </DialogTrigger>

            <DialogContent className="col-md-3 col-12">
                <DialogHeader>
                    <DialogTitle className="text-start">Filtros</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    {children}
                </div>

                <DialogFooter>
                    <DialogClose>
                        <button className="btn btn-outline-danger rounded">Fechar</button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};