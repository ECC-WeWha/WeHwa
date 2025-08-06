import React from "react";
import "../../styles/button.css";

function InputBox({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  min,
  max,
  step,
  defaultValue
}) {
  if (type === "select" && options) {
    return (
      <select
        className="input-box"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder || "선택하세요"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className="input-box"
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
    />
  );
}


export default InputBox;

