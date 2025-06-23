import React, { useMemo, useState } from "react";
import ListComponentItems from "./ListComponentItems";
import ListComponentFilters from "./ListComponentFilters";

type ListComponentProps = {
    list: any[];
    title: string;
    description: string;
    buttonText?: string;
    fieldSearch: string;
    buttonOnClick?: () => void;
    children: (filteredList: any[]) => React.ReactNode;
}

export default function ListComponentWrapper({ list, title, description, buttonText, fieldSearch, buttonOnClick, children }: ListComponentProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
        return list.filter((item) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
            item[fieldSearch]?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word))
            // && (fieldStatus ? item[fieldStatus] === statusFilter : true)
        )
    }, [list, searchTerm]);
    
    const childrenList = useMemo(() => {
        if (React.isValidElement(children) && children?.type === ListComponentItems) {
            return React.cloneElement(children, { list: filteredList });
        }
        if (Array.isArray(children)) {
            const childList = children.find(
                (child) => React.isValidElement(child) && child?.type === ListComponentItems
            );
            if (childList) {
                return React.cloneElement(childList, { list: filteredList });
            }
        }
        return null;
    }, [children, filteredList]);

    const childrenFilters = useMemo(() => {
        if (React.isValidElement(children) && children?.type === ListComponentFilters) {
            return children;
        }
        if (Array.isArray(children)) {
            const childFilters = children.find(
                (child) => React.isValidElement(child) && child?.type === ListComponentFilters
            );
            if (childFilters) return childFilters;
        }
        return null;
    }, [children]);

    return (
        <div className="card shadow-lg rounded-4">
            <div className="card-header">
                <div className="row d-flex justify-content-between">
                    <div className="col-md-3 col-7 d-flex align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {childrenFilters}
                    </div>

                    <div className="col-md-3 col-5 d-flex flex-column items-end">
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                </div>

                <div className="d-flex justify-content-end align-items-center">
                    {buttonOnClick && (
                        <button className="btn btn-outline-success" onClick={buttonOnClick}>
                            <i className="bi bi-plus-circle me-2"></i>
                            {buttonText ?? "Novo"}
                        </button>
                    )}
                </div>
            </div>

            <div className="card-body p-0 pb-5">
                {childrenList}
            </div>
        </div>
    );
}