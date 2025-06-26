type ListComponentItemOptionProps = {
    title: string;
    icon: string;
    onClick: () => void;
    id?: string;
}

export default function ListComponentItemOption({ title, icon, onClick, id }: ListComponentItemOptionProps) {
    return (
        <button id={id} className="btn btn-sm btn-outline-info" onClick={onClick}>
            <i className={`${icon} me-2`}></i>
            {title}
        </button>
    )   
}