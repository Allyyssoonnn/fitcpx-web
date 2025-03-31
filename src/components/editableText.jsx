import { useState } from "react";

const EditableText = ({ text, onUpdate, title }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(text);

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue.trim() && inputValue !== text) {
            onUpdate(inputValue.trim());
        }
    };

    if (isEditing) return (
        <input
            type="text"
            className="form-control d-inline-block"
            style={{ width: "auto" }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === 'Enter' ? handleBlur() : null}
            autoFocus
        />
    )

    if (title) return (
        <h5 className="card-title">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={e => { e.preventDefault(); setIsEditing(true) }}>
                <i className="bi bi-pencil"></i>
                {/* Renomear */}
            </button>
            {text}
        </h5>
    );

    if (!title) return (
        <a>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil"></i>
                {/* Renomear */}
            </button>
            {text}
        </a>
    );
};

export default EditableText;