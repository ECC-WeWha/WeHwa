import React from "react";
import { Link, useLocation } from "react-router-dom";

function FriendListSidebar() {
    const location = useLocation();
    const pathname = location.pathname;
    const stateMode = location.state?.mode;              
    const fromRequests =                                  
        stateMode === "requests" || pathname.startsWith("/friendlist/requests");
    const menuItems = [
        { label: "친구 신청 목록", path: "/friendlist/requests" }, //일단 이렇게
        { label: "친구 목록", path: "/friendlist" }, //일단 이렇게
    ];

        const isActive = (targetPath) => {
            if (fromRequests) return targetPath === "/friendlist/requests";
            // 요청 목록 페이지 및 하위 경로는 첫 번째 버튼 활성화
            if (pathname.startsWith("/friendlist/requests")) {
            return targetPath === "/friendlist/requests";
            }
            // 친구 상세(/friendlist/:id) 포함한 나머지는 "친구 목록" 활성화
            if (
            pathname === "/friendlist" ||
            (pathname.startsWith("/friendlist/") && !pathname.startsWith("/friendlist/requests"))
            ) {
            return targetPath === "/friendlist";
            }
            return pathname === targetPath;
        };

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
            to={path}                              
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

export default FriendListSidebar;
