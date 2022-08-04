import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const PrimeNumber = ({
  label,
  value,
  onChange = () => {},
  placeholder,
  error,
  errorMessage,
  disabled = false,
  min,
  maxLength,
  type,
  mode,
  price = false,
}) => {
  return (
    <div>
      {label && <label className="text-label">{label}</label>}
      <div className="p-inputgroup">
        {price ? (
          <>
            <InputNumber
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              aria-describedby="name-error"
              className={error ? "p-invalid" : ""}
              disabled={disabled}
              min={min}
              maxLength={maxLength}
              mode={mode}
            />
          </>
        ) : (
          <InputText
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-describedby="name-error"
            className={error ? "p-invalid" : ""}
            disabled={disabled}
            min={min}
            maxLength={maxLength}
            type={type}
          />
        )}
      </div>

      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i>{" "}
          {errorMessage ? errorMessage : "Field ini tidak boleh kosong"}
        </small>
      )}
    </div>
  );
};

export default PrimeNumber;
