// src/components/board/postcard.jsx
import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";


function toStamp(input) {
  if (!input && input !== 0) return "";
  const s = String(input).trim();

  const m = s.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]} ${m[2]}:${m[3]}:${m[4]}`;

  const num = Number(s);
  if (!Number.isNaN(num)) {
    const d = new Date(num > 1e12 ? num : num * 1000);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 19).replace("T", " ");
    }
  }

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }

  return s;
}


function toPreview(input, maxLen = 120) {
  if (input == null) return "";
  const s = String(input);

  const clean = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > maxLen ? `${clean.slice(0, maxLen)}…` : clean;
}

function PostCard({
  username,
  title,
  description,    
  body,           
  content,        
  likes,
  comments,
  time,
  onClick,
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.max(0, Number(likes) || 0));

  const preview = toPreview(
    description != null && description !== "" ? description : (body ?? content ?? "")
  );

  const toggleLike = (e) => {
    e.stopPropagation();
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    setLiked((v) => !v);
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
      }}
      style={{
        border: "1px solid #B4B4B4",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "transform .12s ease, box-shadow .12s ease",
        background: "#fff",
      }}
    >
      <div style={{ flex: 1, marginRight: "20px", fontSize: "20px" }}>
        <p style={{ margin: 0 }}>{username}</p>
        <h3 style={{ margin: "8px 0", color: "#00664F" }}>{title}</h3>

        {/* Description preview (never undefined) */}
        <p style={{ color: "#A0A0A0", fontSize: 16, whiteSpace: "normal" }}>
          {preview}
        </p>

        <div
          style={{
            fontSize: "16px",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#1a1a1a",
          }}
        >
          {/* Like */}
          <span
            onClick={toggleLike}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            aria-label={liked ? "unlike" : "like"}
          >
            {liked ? (
              <FavoriteIcon sx={{ fontSize: 20, color: "red" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: "#1a1a1a" }} />
            )}
            {likeCount}
          </span>

          {/* Comments */}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 20, color: "#1a1a1a" }} />
            {Number(comments) || 0}
          </span>

          {/* Time */}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "#1a1a1a" }} />
            {toStamp(time)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
