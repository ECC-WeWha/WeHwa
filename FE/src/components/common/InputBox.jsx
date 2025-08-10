import React from "react";
import "../../styles/button.css";

function InputBox({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  checked,
  options,
  min,
  max,
  step,
  defaultValue,
  style,
}) {
  if (type === "select" && options) { //일단 select는 안꾸미는걸로 
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
  if (type === "radio" && options) {
    return (
      <div style={{ display: "flex", gap: "45px" }}>
        {options.map((opt) => (
          <label key={opt.value} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
            />
            <span className="green-text-28px">{opt.label}</span>
          </label>
        ))}
      </div>
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
      style={style} 
    />
  );
}


export default InputBox;

