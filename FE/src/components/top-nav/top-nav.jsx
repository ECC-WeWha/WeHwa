import React from "react";
import { useNavigate } from "react-router-dom";

function BoardNav({ active }) {
  const navigate = useNavigate();

  const navButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#333",
    padding: "8px 0"
  };

  return (
    <nav style={{ borderBottom: "2px solid #eee" }}>
    <div
      style={{
        display: "flex",
        width: "100%",           
        maxWidth: "700px",      
        margin: "0 auto",
        padding: "16px 60px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <button onClick={() => navigate("/matching")} style={navButtonStyle}>
        친구 매칭
      </button>
  
      <button onClick={() => navigate("/friends-list")} style={navButtonStyle}>
        친구 목록
      </button>
  
      <button
        disabled
        style={{
          ...navButtonStyle,
          color: active === "board" ? "#FF5A5A" : "#333",
          fontWeight: active === "board" ? "bold" : "normal",
          cursor: "default",
        }}
      >
        게시판
      </button>
    </div>
  </nav>
  
  );
}

export default BoardNav;
