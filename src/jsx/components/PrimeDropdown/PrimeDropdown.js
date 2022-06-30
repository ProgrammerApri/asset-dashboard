import { Dropdown } from "primereact/dropdown";
import React from "react";

const PrimeDropdown = ({
  label,
  value,
  options,
  onChange = () => {},
  optionLabel,
  filter = false,
  filterBy,
  placeholder,
  error,
  errorMessage,
  disabled = false,
  valueTemplate,
  itemTemplate,
}) => {
  return (
    <div>
      <label className="text-label">{label}</label>
      <div className="p-inputgroup">
        <Dropdown
          value={value}
          options={options}
          onChange={(e) => onChange(e)}
          optionLabel={optionLabel}
          filter={filter}
          filterBy={filterBy}
          placeholder={placeholder}
          disabled={disabled}
          itemTemplate={itemTemplate}
          valueTemplate={valueTemplate}
        />
      </div>
      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> {errorMessage}
        </small>
      )}
    </div>
  );
};

export default PrimeDropdown;
