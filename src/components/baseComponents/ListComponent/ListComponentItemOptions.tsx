import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

type ListComponentItemOptionsProps = {
    children: React.ReactNode;
}

export default function ListComponentItemOptions({ children }: ListComponentItemOptionsProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <button onClick={e => { e.stopPropagation(); setOpen(!open) }} className="btn btn-sm btn-outline-info">
                    <i className="bi bi-three-dots-vertical"></i>
                </button>
            </PopoverTrigger>

            <PopoverContent className="p-2 w-100">
                <div className="d-flex flex-column gap-2">
                    {children}
                </div>
            </PopoverContent>
        </Popover>
    )
}