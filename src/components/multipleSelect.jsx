import { useState } from "react";

export default function MultiSelect({ name, options, chavePesquisa, valueChave, state: selectedItems, setState: setSelectedItems, className }) {
    // const [selectedItems, setSelectedItems] = useState([]);

    function getFilter() {
        return options.filter(option => !selectedItems.find(selected => {
            if (valueChave) {
                return (selected[valueChave] == option[valueChave]);
            } else {
                return (selected == option);
            }
        }));
    }

    const handleSelectChange = (event) => {
        const value = event.target.value;     
        const arrayFiltered = getFilter();
        if (value >= 0 && !selectedItems.includes(arrayFiltered[value])) {
            if (typeof arrayFiltered[value] == 'string') {
                setSelectedItems([...selectedItems, arrayFiltered[value]]);
            } else {
                setSelectedItems([...selectedItems, { ...arrayFiltered[value] }]);
            }
        }
    };

    const removeBadge = (item) => {
        setSelectedItems(selectedItems.filter(selected => selected !== item));
    };

    return (
        (<div className={className}>
            <div className="form-control d-flex flex-wrap gap-1 align-items-center" onClick={() => document.getElementById("multiSelect").focus()}>
                {selectedItems.map((item, index) => (
                    <span key={index} className="badge bg-primary d-flex align-items-center me-1">
                        {chavePesquisa ? item[chavePesquisa] : item}
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
                    <option value="" hidden>Clique para selecionar</option>
                    {getFilter().map((option, index) => (
                        <option key={index} value={index}>{chavePesquisa ? option[chavePesquisa] : option}</option>
                    ))}
                </select>
            </div>
        </div>)
    );
}