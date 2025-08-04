import React from "react";
import "../../styles/button.css";

function InputBox({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      className="input-box"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default InputBox;

