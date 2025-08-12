import React, { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

function PostCard({
  username,
  title,
  description,
  likes,
  comments,
  time,
  onClick,
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const toggleLike = (e) => {
    e.stopPropagation();
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
        cursor: "pointer",
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
              <FavoriteIcon sx={{ fontSize: 20, color: 'red' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: '#1a1a1a' }} />
            )}
            {likeCount}
          </span>

          {/* Comments */}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 20, color: '#1a1a1a' }} />
            {comments}
          </span>

          {/* Time */}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#1a1a1a' }} />
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
