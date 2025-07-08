import React from "react";

type ListComponentItemsProps = {
    list: any[];
    children: (filteredList: any[]) => React.ReactNode | React.ReactNode[];
}

export default function ListComponentItems({ list, children }: ListComponentItemsProps) {
    if (!list?.length) return <h5 className="text-center">Nenhum registro encontrado</h5>
    
    return (
        <div className="d-flex flex-column">
            {children(list)}
        </div>
    )
}