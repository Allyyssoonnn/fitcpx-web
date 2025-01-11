import React, { useState } from 'react';

const AutoComplete = ({ sugestoes, chave }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
        const filtered = sugestoes.filter((suggestion) =>
            suggestion[chave].toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion[chave]);
        setShowSuggestions(false);
    };

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Digite para pesquisar"
            />

            {showSuggestions && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: 'pointer' }}
                        >
                            {suggestion[chave]}
                        </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">Nenhuma sugestão encontrada</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;