import { Calendar } from "primereact/calendar";
import React from "react";

const PrimeCalendar = ({
  label,
  value,
  onChange = () => {},
  placeholder,
  error,
  disabled = false,
  showIcon,
  dateFormat,
  disabledDates,
  disabledDays,
  minDate,
  maxDate,
  view,
}) => {
  return (
    <div>
      <label className="text-label">{label}</label>
      <div className="p-inputgroup">
        <Calendar
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          disabled={disabled}
          showIcon={showIcon}
          dateFormat={dateFormat}
          disabledDates={disabledDates}
          disabledDays={disabledDays}
          minDate={minDate}
          maxDate={maxDate}
          view={view}
        />
      </div>
      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> Tanggal Belum Dipilih
        </small>
      )}
    </div>
  );
};

export default PrimeCalendar;
