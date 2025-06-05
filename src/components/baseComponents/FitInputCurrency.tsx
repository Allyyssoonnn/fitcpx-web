import React, { useState, KeyboardEvent } from "react";
import { NumericFormat } from "react-number-format";
import { Control, Controller, FieldValues } from "react-hook-form";

type FitInputCurrencyProps<T extends FieldValues = any> = {
  id?: string;
  name?: string;
  control?: Control<T>;
  placeholder?: string;
  className?: string;
  rules?: object;
  value?: number | null;
  onChange?: (value: number | null) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>, value?: number | null) => void;
  style?: React.CSSProperties;
  autoFocus?: boolean;
};

function FitInputCurrency<T extends FieldValues>({
  id = "",
  name = "",
  control,
  placeholder = "R$ 0,00",
  className = "form-control",
  rules,
  value,
  onChange,
  onBlur,
  onKeyDown,
  style,
  autoFocus = false,
}: FitInputCurrencyProps<T>) {
  const [localValue, setLocalValue] = useState<number | null>(value ?? null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, current: number | null) => {
    if (onKeyDown) onKeyDown(e, current);
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <NumericFormat
              id={id}
              placeholder={placeholder}
              className={className + (fieldState.error ? " is-invalid" : "")}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              value={field.value ?? ""}
              onValueChange={(values) => {
                field.onChange(values.floatValue ?? null);
              }}
              onBlur={onBlur ?? field.onBlur}
              name={field.name}
              style={style}
              autoFocus={autoFocus}
              onKeyDown={(e) => handleKeyDown(e, field.value)}
            />
            {fieldState.error && (
              <div className="invalid-feedback">{fieldState.error.message}</div>
            )}
          </>
        )}
      />
    );
  }

  // Standalone (sem react-hook-form)
  return (
    <NumericFormat
      placeholder={placeholder}
      className={className}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      value={localValue ?? ""}
      onValueChange={(values) => {
        const val = values.floatValue ?? null;
        setLocalValue(val);
        onChange?.(val);
      }}
      onBlur={onBlur}
      name={name}
      style={style}
      autoFocus={autoFocus}
      onKeyDown={(e) => handleKeyDown(e, localValue)}
    />
  );
}

export default FitInputCurrency;