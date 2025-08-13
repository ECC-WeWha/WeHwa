import React from "react";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";

const Tag = ({ children }) => (
  <span
    style={{
      border: "1px solid #00664F",
      background: "#FFFFFF",
      color: "#6B6B6B",
      fontSize: 16,
      padding: "6px 10px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

function RequestBadge({ requested, onToggle }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); 
        onToggle();
      }}
      style={{
        border: "none",
        background: requested ? "#f59d95" : "#79BCCF",
        color: "#ffffff",
        padding: "8px 15px",
        borderRadius: 20,
        fontSize: 14,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {requested ? "요청 취소" : "친구 신청"}
    </button>
  );
}

export default function ProfileCard({ user, requested, onToggleRequest, onClick }) {
  return (
    <div
      style={{
        width: 300,
        border: "1px solid #ECECEC",
        borderRadius: 20,
        padding: 14,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        background: "#fff",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "transform .12s ease, box-shadow .12s ease",
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
      }}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          height: 150,
          borderRadius: 20,
          background: `url(${user.img}) center/cover no-repeat`,
        }}
        aria-label={`${user.name} profile image`}
        role="img"
      />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <strong
            style={{
              fontSize: 20,
              color: "#1a1a1a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
            title={user.name}
          >
            {user.name}
          </strong>
        </div>

        <RequestBadge requested={requested} onToggle={onToggleRequest} />
      </div>

      {/* Languages */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <strong
          style={{
            fontSize: 16,
            color: "#1a1a1a",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
          title={user.langs.join(", ")}
        >
          {user.langs.join(", ")}
        </strong>
      </div>

      {/* Bio */}
      <div
        style={{
          fontSize: 16,
          color: "#6B6B6B",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
        title={user.bio}
      >
        {user.bio}
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {user.tags.map((t, i) => (
          <Tag key={i}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
