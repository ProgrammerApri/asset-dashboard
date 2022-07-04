import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const PrimeNumber = ({
  value,
  onChange = () => {},
  placeholder,
  error,
  disabled = false,
  type,
}) => {
  return (
    <div>
      <div className="p-inputgroup">
        <InputText
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-describedby="name-error"
          className={error ? "p-invalid" : ""}
          disabled={disabled}
          type={type}
        />
      </div>

      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> Field ini tidak boleh kosong
        </small>
      )}
    </div>
  );
};

export default PrimeNumber;
