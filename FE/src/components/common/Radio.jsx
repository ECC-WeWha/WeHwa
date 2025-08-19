// components/common/RadioBox.jsx
import React from "react";

export default function RadioBox({
    name,
    value,
    onChange,
    options = [],     
    direction = "row",
    style,
    gap = 45,  //라디오 사이
    itemGap = 25, //라디오 - 텍스트 사이
    labelClassName = "green-text-28px",
    inputStyle,
}) {
return (
    <div
    style={{
        display: "flex",
        alignItems:"center",
        gap,
        ...style,
    }}
    >
    {options.map((opt) => (
        <label key={opt.value} style={{display: "flex", alignItems: "center", gap: itemGap}}>
            <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                style={inputStyle}
            />
            <span className={labelClassName}>{opt.label}</span>
        </label>
    ))}
    </div>
);
}




