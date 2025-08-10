import React, { useState } from "react";

function PostCard({
  username,
  title,
  description,
  likes,
  comments,
  time,
  onClick, // pass from parent
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const toggleLike = (e) => {
    e.stopPropagation(); // prevent card navigation when clicking heart
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setLiked((v) => !v);
  };

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #B4B4B4",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer", // 👈 pointer cursor on hover
        userSelect: "none",
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div style={{ flex: 1, marginRight: "20px", fontSize: "20px" }}>
        <p style={{ margin: 0 }}>{username}</p>
        <h3 style={{ margin: "8px 0", color: "#00664F" }}>{title}</h3>
        <p style={{ color: "#A0A0A0" }}>{description}</p>
        <div style={{ fontSize: "16px", marginTop: "20px" }}>
          <span
            onClick={toggleLike}
            style={{
              cursor: "pointer",
              color: liked ? "red" : "black",
              marginRight: "8px",
            }}
            aria-label={liked ? "unlike" : "like"}
          >
            {liked ? "❤️" : "🤍"} {likeCount}
          </span>
          💬 {comments} · {time}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
