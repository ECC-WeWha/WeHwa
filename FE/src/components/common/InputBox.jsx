import React from "react";
import "../../styles/button.css";


function InputBox({
  name,
  type = "text",
  placeholder="",
  value,
  onChange,
  min,
  max,
  step,
  disabled = false,
  style,
  ...rest
}) 
  {
  return (
    <input
      className="input-box"
      name={name}
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      style={style} 
      {...rest}
    />
  );
  }


export default InputBox;

