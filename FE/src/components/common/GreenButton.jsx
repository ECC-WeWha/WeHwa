//green-button-컴포넌트 계속 사용가능
import React from "react";
import "../../styles/button.css";

function GreenButton({ text, onClick , disabled}) {
  return (
      <button className="green-button" onClick={onClick} disabled={disabled} >
        <span className="green-button-text">{text}</span>
      </button>
  );
}

export default GreenButton;
