import { useEffect, useRef } from "react";
import AutoNumeric from "autonumeric";
import { Controller } from "react-hook-form";

function CurrencyInput({ name, control, onChange, onBlur, onKeyDown, ...props }) {
    const currencyRef = useRef(null);
    const autoNumericRef = useRef(null);

    useEffect(() => {
        if (currencyRef.current) {
            autoNumericRef.current = new AutoNumeric(currencyRef.current, {
                digitGroupSeparator: ".",
                decimalCharacter: ",",
                currencySymbol: "R$ ",
                currencySymbolPlacement: "p",
                decimalPlaces: 2,
                watchExternalChanges: true,
            });
        }
    }, []);
    
    return control ? (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => (
                <input
                    className='form-control'
                    {...field}
                    {...props}
                    ref={(e) => {
                        field.ref(e);
                        currencyRef.current = e;
                    }}
                    placeholder="R$ 0,00"
                    onBlur={() => {
                        const value = autoNumericRef.current.getNumber(); // Obtém valor numérico real
                        field.onChange(value); // Atualiza o react-hook-form corretamente
                    }}
                />
            )}
        />
    ) : (
        <input
            className='form-control'
            {...props}
            ref={(e) => {
                currencyRef.current = e;
            }}
            placeholder="R$ 0,00"
            onBlur={() => {
                const value = autoNumericRef.current.getNumber(); // Obtém valor numérico real
                if (onChange) onChange(value);
                if (onBlur) onBlur(value);
            }}
            onKeyDown={(e) => {
                const value = autoNumericRef.current.getNumber();
                if (onKeyDown) onKeyDown(e, value);  
            }}
        />
    )
}

export default CurrencyInput;