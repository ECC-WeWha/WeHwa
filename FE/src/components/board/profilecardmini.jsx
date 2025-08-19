import React from "react";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import KakaoLink from "../../assets/images/kakaologin.png";
import InstaLink from "../../assets/images/insta.png"

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
function ListBadge({badgeInfo, size = 30  }) {
  const hasLink = !!badgeInfo?.link; 
  const handleClick = (e) => {
    e.stopPropagation(); // onClick과 충돌 방지
    if (!hasLink) return;
  };
  const commonStyle = {                        
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    border: "none",
    display: "inline-flex",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    opacity: hasLink ? 1 : 0.5,               // 비활성 표시
    cursor: hasLink ? "pointer" : "default",  
  };

  const Img = (
    <img
      src={badgeInfo.image}
      alt={badgeInfo.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  if (hasLink) {
    return (
      <a
        href={badgeInfo.link}
        target="_blank"
        rel="noreferrer"
        title={badgeInfo.title}
        onClick={(e) => e.stopPropagation()}
        style={commonStyle}
        aria-label={badgeInfo.title}
      >
        {Img}
      </a>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${badgeInfo.title} (연결 예정)`}
      title={`${badgeInfo.title} (연결 예정)`}
      style={commonStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {Img}
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
  const badges = [
    { link: user?.kakao || null,     image: KakaoLink, title: "Kakao" },     
    { link: user?.instagram || null, image: InstaLink, title: "Instagram" },
  ];


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
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {badges.map((badge, index) => (
              <ListBadge key={index} badgeInfo={badge} size={30} />
            ))}
          </div>
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
