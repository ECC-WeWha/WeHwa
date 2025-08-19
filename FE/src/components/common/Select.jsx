// components/common/SelectBox.jsx
import React from "react";

export default function SelectBox({
    name,
    value,
    onChange,
    options = [],
    placeholder = "선택하세요",
    style,
}) {
return (
    <select
        className="input-box"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        style={style}
    >
        <option value="">{placeholder}</option>
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
    </select>
);
}
