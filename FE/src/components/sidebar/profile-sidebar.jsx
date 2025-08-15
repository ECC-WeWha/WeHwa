import React from "react";
import { Link, useLocation } from "react-router-dom";

function ProfileSidebar() {
    const location = useLocation();

    const menuItems = [
    { label: "나의 프로필", path: "/profile" },
    { label: "프로필 수정", path: "/profile?edit=1"},
];

    const isActive = (path) => {
        if (!path.includes("?")) {
            return location.pathname === path && !new URLSearchParams(location.search).get("edit");
        }
        const [base, query] = path.split("?");
        if (location.pathname !== base) return false;
        const current = new URLSearchParams(location.search);
        const target = new URLSearchParams(query);
        for (const [k, v] of target) {
            if (k=="edit"){
                const cur = (current.get("edit") || "").toLowerCase();
                if (!["1", "true", "yes"].includes(cur)) return false;
            } else {
                if ((current.get(k) || "") !== v) return false;
            }
        }
        return true;
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

export default ProfileSidebar;
