type ListComponentItemOptionProps = {
    title: string;
    icon: string;
    onClick: () => void;
}

export default function ListComponentItemOption({ title, icon, onClick }: ListComponentItemOptionProps) {
    return (
        <button className="btn btn-sm btn-outline-info" onClick={onClick}>
            <i className={`${icon} me-2`}></i>
            {title}
        </button>
    )   
}