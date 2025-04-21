
function NumberInput({ value, onChange, min }) {

    function change(e) {
        e.preventDefault();
        if (onChange) onChange(e.target.value);
    }

    function blur(e) {
        if (!e.target.value) {
            if (min && onChange) onChange(min);
        }
    }

    return (
        <input
            className="form-control"
            type="number"
            value={value}
            onChange={change}
            onBlur={blur}
        />
    )
}

export default NumberInput;