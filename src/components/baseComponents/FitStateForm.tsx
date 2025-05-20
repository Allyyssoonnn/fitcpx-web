import React, { forwardRef } from "react";
import { FieldErrors } from "react-hook-form";

const list = [ 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR',
    'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type FitStateFormProps = {
    nameField: string,
    classNameContainer: string,
    name: string,
    textHelp: string,
    errors: FieldErrors,
} & React.HTMLAttributes<HTMLSelectElement>;

const FitStateForm = forwardRef<HTMLSelectElement, FitStateFormProps>(({
    nameField,
    classNameContainer,
    name,
    textHelp,
    errors,
    children,
    ...inputProps
}, ref) => {

    return (
        <div className="col-md-3">
            <label className="form-label">{nameField}</label>
            <select
                ref={ref}
                { ...inputProps }
                name={name}
                className={`form-control ${errors[name] && 'border-danger'} ${inputProps.className || ''}`}
            >
                <option value='' disabled></option>
                {list.map((uf) => (
                    <option value={uf}>{uf}</option>
                ))}
            </select>

            {errors[name]?.type === "required" && (
                <p className="text-danger fs-2" role="alert">{nameField} obrigatório</p>
            )}

            {(!errors[name] && textHelp) && (
                <p className="text-info fs-2" role="alert">{textHelp}</p>
            )}
        </div>
    )
})

export default FitStateForm;