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
function RequestBadge({onAccept, onReject }) {
    return (
    <div style={{ display: "flex", gap: 28 }}>
        <button
        type="button"
        onClick={onAccept}
        style={{
            border: "none",
            background: "#79BCCF",
            color: "#ffffff",
            padding: "8px 15px",
            borderRadius: 20,
            fontSize: 14,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
        >
            수락
        </button>
        <button
        type="button"
        onClick={onReject}
        style={{
            border: "none",
            background: "#f59d95",
            color: "#ffffff",
            padding: "8px 15px",
            borderRadius: 20,
            fontSize: 14,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
        >
            거절
        </button>
    </div>
    );
}
function ListBadge({ instagram, kakao,onDelete }) {
    return (
    <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {kakao && (
        <a href={kakao} target="_blank" rel="noreferrer" title="Kakao"
            style={{ width: "30px",height: "30px", borderRadius: "50%", border: "none" }}>
            <img src={KakaoLink} alt="카카오 링크"/>
        </a>
        )}
        {instagram && (
        <a href={instagram} target="_blank" rel="noreferrer" title="Instagram"
            style={{ width: "30px",height: "30px", borderRadius: "50%", border: "none" }}>
            <img src={InstaLink} alt="인스타 링크"/> 
        </a>
        )}
        
    </div>
    );
}

export default function ProfileCard({
    user,
    requested,
    onToggleRequest,
    onClick,
    context = "search",         // "search" | "list" | "requests"
    onAccept, onReject,         // requests 전용
    onDelete, onInstagram, onKakao, // list 전용
}) {

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

        {/* 작은 버튼을 추가하기 위한 이런..*/}
        {context === "list" && (
            <ListBadge
            onDelete={onDelete}
            onInstagram={onInstagram}
            onKakao={onKakao}
        />
        )}
        {context === "requests" && (
            <RequestBadge
            onAccept={onAccept}
            onReject={onReject}
        />      
        )}
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
