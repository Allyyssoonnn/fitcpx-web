import React, { useMemo, useState } from 'react';

const AutoComplete = ({ sugestoes, chave, chavePesquisa, onBlur, onKeyDown, style, autoFocus, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            // const filtered = sugestoes.filter((suggestion) =>
            //     suggestion[chavePesquisa].toLowerCase().includes(value.toLowerCase())
            // );
            // setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleInputBlur = (e) => {
        // Se o clique foi numa sugestão, não dispara o onBlur
        if (isClickingSuggestion) {
            e.preventDefault(); // Impede o fechamento prematuro
            return;
        }

        onBlur(); // Dispara o onBlur passado pelo componente pai
        setShowSuggestions(false); // Fecha as sugestões
    };

    const handleSuggestionClick = (suggestion) => {
        onChange(suggestion[chave], suggestion);
        setInputValue(suggestion[chavePesquisa]);
        setShowSuggestions(false);
    };

    const filteredSuggestions = useMemo(() => {
        if (inputValue.trim()) {
            return sugestoes.filter((suggestion) =>
                suggestion[chavePesquisa].toLowerCase().includes(inputValue.toLowerCase())
            );
        }
        return [];
    }, [inputValue, sugestoes]);
    

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control d-inline-block"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Digite para pesquisar"
                onBlur={handleInputBlur}
                onKeyDown={onKeyDown}
                style={style}
                autoFocus={autoFocus}
            />

            {showSuggestions && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onMouseDown={() => setIsClickingSuggestion(true)}
                            onMouseUp={() => handleSuggestionClick(suggestion)}
                            // onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: 'pointer' }}
                        >
                            {suggestion[chavePesquisa]}
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