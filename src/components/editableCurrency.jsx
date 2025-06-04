import { useState } from "react";
import { formatarMoeda } from "../utils";
import FitInputCurrency from "./baseComponents/FitInputCurrency";

const EditableCurrency = ({ value, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleBlur = (v) => {
        setIsEditing(false);
        if (onUpdate) {
            onUpdate(v);
        }
    };

    if (isEditing) return (
        <FitInputCurrency
            className="form-control d-inline-block"
            style={{ width: "auto" }}
            onBlur={handleBlur}
            onKeyDown={(e, v) => e.key === 'Enter' ? handleBlur(v) : null}
            autoFocus
        />
    )

    return (
        <>
            {formatarMoeda(value)}
            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil"></i>
            </button>
        </>
    );
};

export default EditableCurrency;