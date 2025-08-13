import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// board top navigation bar
function BoardNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navButtonStyle = (isActive) => ({
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "8px 0",
    color: isActive ? "#FF5A5A" : "#333",
    fontWeight: isActive ? "bold" : "normal",
    transition: "color 0.2s ease",
  });

  const menuItems = [
    { label: "친구 매칭", path: "/friendfind" },
    { label: "친구 목록", path: "/friendlist" },
    { label: "게시판", path: "/board" },
  ];

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
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={navButtonStyle(isActive)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BoardNav;
