
function Select({ options = [], value, setValue, className = "", fieldName, fieldValue, label, onChange }) {
    function change(e) {
        if (onChange) {
            const resp = options.find((opt) => opt[fieldValue] == e.target.value);
            onChange(resp, e.target.value);
        }

        e.preventDefault();
        setValue(e.target.value);
    }

    return (
        (<div className={`form-floating ${className}`}>
            <select className="form-control"
                value={value}
                onChange={change}
            >
                <option value="" hidden>Clique para selecionar</option>
                {options?.map((opt, i) => (
                    <option key={i} value={opt[fieldValue]}>{opt[fieldName]}</option>
                ))}
            </select>
            <label className="form-label">{label ?? '(Clique para selecionar)'}</label>
        </div>)
    );
}

export default Select;