import React, { forwardRef } from "react";
import { FieldErrors } from "react-hook-form";
import { getNestedError } from "../../utils";

type FitInputFormProps = {
    nameField: string,
    styleContainer: React.CSSProperties,
    classNameContainer: string,
    name: string,
    errors: FieldErrors,
    type: string,
    textHelp: string,
} & React.HTMLAttributes<HTMLInputElement>;

const FitInputForm = forwardRef<HTMLInputElement, FitInputFormProps>(({
    nameField,
    styleContainer,
    classNameContainer,
    name,
    errors,
    type = 'text',
    textHelp,
    ...inputProps
}, ref) => {
    
    return (
        <div style={styleContainer} className={classNameContainer}>
            <label className="form-label">{nameField}</label>

            <input
                ref={ref}
                type={type}
                { ...inputProps }
                name={name}
                className={`form-control ${getNestedError(errors, name) && 'border-danger'} ${inputProps.className || ''}`}
            />

            {getNestedError(errors, name)?.type === "required" && (
                <p className="text-danger fs-2" role="alert">{nameField} obrigatório</p>
            )}

            {getNestedError(errors, name)?.type === "minLength" && (
                <p className="text-danger fs-2" role="alert">{nameField} muito curto</p>
            )}

            {(!getNestedError(errors, name) && textHelp) && (
                <p className="text-info fs-2" role="alert">{textHelp}</p>
            )}
        </div>
    )
})

export default FitInputForm;