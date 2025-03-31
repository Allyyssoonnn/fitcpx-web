import { useState } from "react";

export default function MultiSelect({ name, options, chavePesquisa, valueChave, state: selectedItems, setState: setSelectedItems, className }) {
    // const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectChange = (event) => {
        const value = event.target.value;     
        const arrayFiltered = options.filter(option => !selectedItems.find(selected => selected[valueChave] == option[valueChave]));
        if (value >= 0 && !selectedItems.includes(arrayFiltered[value])) {
            setSelectedItems([...selectedItems, { ...arrayFiltered[value] }]);
        }
    };

    const removeBadge = (item) => {
        setSelectedItems(selectedItems.filter(selected => selected !== item));
    };

    return (
        (<div className={className}>
            <label htmlFor={`multiSelect-${name}`} className="form-label">{name ?? 'Selecione os itens'}</label>
            <div className="form-control d-flex flex-wrap gap-1 align-items-center" onClick={() => document.getElementById("multiSelect").focus()}>
                {selectedItems.map((item, index) => (
                    <span key={index} className="badge bg-primary d-flex align-items-center me-1">
                        {item[chavePesquisa]}
                        <button 
                            type="button" 
                            className="btn-close btn-close-white ms-2" 
                            aria-label="Remover" 
                            onClick={() => removeBadge(item)}
                        ></button>
                    </span>
                ))}
                <select 
                    id={`multiSelect-${name}`}
                    className="form-control border-0 flex-grow-1" 
                    onChange={handleSelectChange}
                    value=""
                >
                    <option value="" disabled hidden>Clique para selecionar</option>
                    {options.filter(option => !selectedItems.find(selected => selected[valueChave] == option[valueChave]))
                    .map((option, index) => (
                        <option key={index} value={index}>{option[chavePesquisa]}</option>
                    ))}
                </select>
            </div>
        </div>)
    );
}