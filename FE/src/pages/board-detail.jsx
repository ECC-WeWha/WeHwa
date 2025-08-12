import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function BoardDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const green = "#00664F";
  const gray = "#A0A0A0";
  const border = "#B4B4B4";
  const secondGreen = "#66A395";

  const [post, setPost] = useState(state ?? null);

  useEffect(() => {
    if (!post && postId) {
      const saved = localStorage.getItem(`post:${postId}`);
      if (saved) {
        setPost(JSON.parse(saved));
        return;
      }
    }
  }, [post, postId]);

  if (!post) {
    return (
      <div style={{ padding: 30 }}>
        <p>포스트를 불러오는 중이에요…</p>
        <button onClick={() => navigate(-1)} style={{ padding: "8px 12px" }}>
          목록으로 가기
        </button>
      </div>
    );
  }

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const [scrapped, setScrapped] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: 1, username: "user001", time: "2분 전", text: "정보 감사합니다!" },
    { id: 2, username: "foodie22", time: "5분 전", text: "여기 꼭 가볼게요" },
    { id: 3, username: "nalinishungry", time: "5분 전", text: "I will try!" },
  ]);

  const toggleLike = () => {
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setLiked((v) => !v);
  };

  const toggleScrap = () => {
    setScrapped((v) => !v);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      username: isAnonymous ? "익명" : "username",
      time: "방금 전",
      text: commentText.trim(),
    };
    setComments([newComment, ...comments]);
    setCommentText("");
    setIsAnonymous(false);
  };

  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <BoardNav active="board" />
      <div
        style={{
          display: "flex",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <BoardSidebar />
        <main style={{ flex: 1, padding: "0 80px" }}>
          {/* Title */}
          <div style={{ position: "relative", height: 72, marginBottom: 16 }}>
            <h2
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 40,
                fontWeight: 800,
                color: green,
                margin: 0,
              }}
            >
              맛집 게시판
            </h2>
          </div>

          {/* Back button */}
          <div style={{ marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: "#fff",
                border: secondGreen, // optional: `1px solid ${secondGreen}`
                borderRadius: 12,
                padding: "15px 18px",
                cursor: "pointer",
                fontSize: 16,
                fontFamily: "inherit",
                color: secondGreen,
              }}
            >
              &lt; 목록으로 가기
            </button>
          </div>

          {/* Post */}
          <article
            style={{
              borderRadius: 20,
              padding: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#E9E9E9",
                }}
              />
              <span style={{ color: "#1a1a1a", fontSize: 18 }}>
                {post.username}
              </span>
            </div>

            <h1
              style={{
                margin: "12px 0 6px",
                color: green,
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 2,
              }}
            >
              {post.title}
            </h1>

            {/* Like + Comment + Scrap */}
            <div
              style={{
                fontSize: 18,
                color: '#1a1a1a',
                display: "flex",
                gap: 20,
                alignItems: "center",
              }}
            >
              {/* Like */}
              <button
                onClick={toggleLike}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                  color: '#1a1a1a',
                }}
              >
                {liked ? (
                  <FavoriteIcon sx={{ fontSize: 22, color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 22, color: '#1a1a1a' }} />
                )}
                {likeCount}
              </button>

              {/* Comments */}
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 20, color: '#1a1a1a' }} />
                {post.comments}
              </span>

              {/* Time */}
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#1a1a1a' }} />
                {post.time}
              </span>

              {/* Scrap */}
              <button
                onClick={toggleScrap}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: `1px solid ${scrapped ? secondGreen : border}`,
                  background: scrapped ? secondGreen : "#fff",
                  color: scrapped ? "#fff" : "#1a1a1a",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                  fontFamily: "inherit",
                }}
              >
                {scrapped ? (
                  <BookmarkIcon sx={{ fontSize: 20, color: "#fff" }} />
                ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 20, color: "#1a1a1a" }} />
                )}
                {scrapped ? "스크랩됨" : "스크랩"}
              </button>
            </div>

            <div
              style={{
                marginTop: 25,
                width: "100%",
                height: 500,
                borderRadius: 20,
                background:
                  "repeating-conic-gradient(#f2f2f2 0% 25%, transparent 0% 50%) 50% / 24px 24px",
                border: `1px dashed ${border}`,
              }}
            />

            <div
              style={{
                fontSize: 20,
                lineHeight: 1.7,
                color: "#1a1a1a",
                marginTop: 20,
              }}
            >
              {post.body}
            </div>
          </article>

          {/* Comments */}
          <section style={{ marginTop: 20 }}>
            <h3
              style={{
                fontSize: 18,
                margin: "0 0 10px",
                color: "#1a1a1a",
              }}
            >
              댓글
            </h3>

            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    color: "#555",
                    marginBottom: 6,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {c.username} · {c.time}
                  </span>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#FF5A5A",
                      cursor: "pointer",
                      fontSize: 18,
                      textDecoration: "underline"
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div style={{ fontSize: 20 }}>{c.text}</div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              {/* 익명 Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    sx={{
                      color: green,
                      '&.Mui-checked': {
                        color: green,
                      },
                    }}
                  />
                }
                label="익명"
                sx={{
                  fontSize: 25,
                  color: "#1a1a1a",
                  marginRight: 1,
                }}
              />

              <input
                type="text"
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "12px 14px",
                  border: `1px solid ${border}`,
                  borderRadius: 12,
                  outline: "none",
                  fontSize: 18,
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                }}
              />
              <button
                type="button"
                style={{
                  padding: "10px 40px",
                  borderRadius: 12,
                  border: `1px solid ${green}`,
                  backgroundColor: green,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  fontSize: 18,
                }}
                onClick={handleSubmitComment}
              >
                등록
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BoardDetail;
