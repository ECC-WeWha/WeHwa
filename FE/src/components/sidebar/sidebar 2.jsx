import React from "react";
import { Link, useLocation } from "react-router-dom";

function BoardSidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "게시판 홈", path: "/board" },
    { label: "글쓰기", path: "/board/write" },
    { label: "내가 쓴 글", path: "/board/my-posts" },
    { label: "스크랩", path: "/board/scrap" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      style={{
        width: "220px",
        paddingRight: "20px",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "100vh",
        alignSelf: "stretch",
      }}
    >
      {menuItems.map(({ label, path }) => (
        <Link
          key={label}
          to={path}                              // ✅ navigates via router
          aria-current={isActive(path) ? "page" : undefined}
          style={{
            display: "block",
            textDecoration: "none",
            textAlign: "center",
            padding: "15px",
            fontSize: "20px",
            borderRadius: "20px",
            border: isActive(path) ? "none" : "1px solid #66A395",
            backgroundColor: isActive(path) ? "#66A395" : "#fff",
            color: isActive(path) ? "#fff" : "#1a1a1a",
            transition: "0.2s",
          }}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}

export default BoardSidebar;
