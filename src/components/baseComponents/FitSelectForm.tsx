import React, { forwardRef } from "react";
import { FieldErrors } from "react-hook-form";
import { getNestedError } from "../../utils";

type FitSelectFormProps = {
    nameField: string,
    classNameContainer: string,
    name: string,
    textHelp: string,
    errors: FieldErrors,
} & React.HTMLAttributes<HTMLSelectElement>;

const FitSelectForm = forwardRef<HTMLSelectElement, FitSelectFormProps>(({
    nameField,
    classNameContainer,
    name,
    textHelp,
    errors,
    children,
    ...inputProps
}, ref) => {

    return (
        <div className={classNameContainer}>
            <label className="form-label">{nameField}</label>
            <select
                ref={ref}
                { ...inputProps }
                name={name}
                className={`form-control ${getNestedError(errors, name) && 'border-danger'} ${inputProps.className || ''}`}
            >
                {children}
            </select>

            {getNestedError(errors, name)?.type === "required" && (
                <p className="text-danger fs-2" role="alert">{nameField} obrigatório</p>
            )}

            {(!getNestedError(errors, name) && textHelp) && (
                <p className="text-info fs-2" role="alert">{textHelp}</p>
            )}
        </div>
    )
})

export default FitSelectForm;