import { useEffect, useRef } from "react";
import AutoNumeric from "autonumeric";
import { Controller } from "react-hook-form";

function CurrencyInput({ name, control, required, ...props }) {
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
    
    return (
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
    )
}

export default CurrencyInput;