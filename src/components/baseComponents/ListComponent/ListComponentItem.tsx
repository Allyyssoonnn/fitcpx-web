type ListComponentItemProps = {
    index: number;
    urlImage?: string;
    title: string;
    description?: string;
    badge?: any[];
    onClickItem?: (item: any) => void;
    children?: React.ReactNode;
}

export default function ListComponentItem({ index, urlImage = undefined, title, description, badge, onClickItem, children }: ListComponentItemProps) {
    return (
        <div
            className={`d-flex cursor-pointer hover:bg-gray-300 justify-content-between
                align-items-center p-2 py-3 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}
            `}
            onClick={onClickItem}
        >
            <div className="d-flex align-items-center gap-2">
                {urlImage !== undefined && (
                    <img src={urlImage ? urlImage : 'https://placehold.co/150x150?text=img'}
                        alt="Imagem"
                        className="img-fluid rounded-circle shadow-lg border-3 border-success"
                        width={50} height={50} loading="lazy"
                    />
                )}

                <div className="d-flex flex-column">
                    <label className="fw-bold">{title}</label>
                    <label className="text-muted">{description}</label>
                    {badge && (
                        <div className="d-flex align-items-center gap-2">
                            {badge.map((item, index) => (
                                <span key={index} className="badge bg-primary">{item}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex align-items-center gap-2 pe-5">
                {children}
            </div>
        </div>
    )
}