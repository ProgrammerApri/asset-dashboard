import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const PrimeInput = ({
  label,
  value,
  onChange = () => {},
  placeholder,
  error,
  disabled = false,
  isNumber = false,
  number = false,
  mode,
  useGrouping = false,
  isEmail = false,
}) => {
  const [email, setEmail] = useState(null);
  const validateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  };

  return (
    <div>
      {label && <label className="text-label">{label}</label>}
      <div className="p-inputgroup">
        {isNumber ? (
          <>
            <span className="p-inputgroup-addon">+62</span>
            <InputNumber
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              aria-describedby="name-error"
              className={error ? "p-invalid" : ""}
              disabled={disabled}
              mode={mode}
              useGrouping={useGrouping}
            />
          </>
        ) : number ? (
          <>
            <InputNumber
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              aria-describedby="name-error"
              className={error ? "p-invalid" : ""}
              disabled={disabled}
              mode={mode}
              useGrouping={useGrouping}
            />
          </>
        ) : (
          <InputText
            value={value}
            onChange={(e) => {
              onChange(e);
              if (isEmail) {
                setEmail(e.target.value);
              }
            }}
            placeholder={placeholder}
            aria-describedby="name-error"
            className={error ? "p-invalid" : ""}
            disabled={disabled}
          />
        )}
      </div>

      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> Field ini tidak boleh kosong
        </small>
      )}
      {!error && email && isEmail && !validateEmail(email) && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> Email tidak sesuai
        </small>
      )}
    </div>
  );
};

export default PrimeInput;
