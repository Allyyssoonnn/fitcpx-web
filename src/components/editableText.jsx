import { useState } from "react";

const EditableText = ({ text, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(text);

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue.trim() && inputValue !== text) {
            onUpdate(inputValue.trim());
        }
    };

    return isEditing ? (
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
    ) : (
        <h5>
            {text}
            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil me-2"></i>
                Renomear
            </button>
        </h5>
    );
};

export default EditableText;