import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";

function BoardDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const green = "#00664F";
  const gray = "#A0A0A0";
  const border = "#B4B4B4";

  const [post] = useState({
    id: postId || "123",
    username: "heejin0316",
    title: "생방송투데이 강서구 MZ맛집 야장 6900 돌판짜장 맛집 위치 정보",
    body: "안녕하세요 :) ",
    time: "3분 전",
    likes: 17,
    comments: 17,
  });

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [commentText, setCommentText] = useState("");

  // NEW: comments state
  const [comments, setComments] = useState([
    { id: 1, username: "user001", time: "2분 전", text: "정보 감사합니다!" },
    { id: 2, username: "foodie22", time: "5분 전", text: "여기 꼭 가볼게요" },
  ]);

  const toggleLike = () => {
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setLiked((v) => !v);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      username: isAnonymous ? "익명" : "myUsername",
      time: "방금 전",
      text: commentText.trim(),
    };
    setComments([newComment, ...comments]);
    setCommentText("");
    setIsAnonymous(false);
  };

  // NEW: delete comment
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
        {/* Sidebar */}
        <BoardSidebar />

        {/* Main */}
        <main style={{ flex: 1, padding: "0 80px" }}>
          {/* Page title */}
          <div style={{ position: "relative", marginBottom: "16px", height: 0 }}>
            <h2
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "32px",
                fontWeight: "800",
                color: green,
                margin: 0,
              }}
            >
              맛집 게시판
            </h2>
          </div>

          {/* Back button */}
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                border: `1px solid ${border}`,
                background: "#ffffff",
                borderRadius: 12,
                padding: "15px 18px",
                cursor: "pointer",
                fontSize: 18,
                fontFamily: "inherit",
              }}
            >
              목록으로 가기
            </button>
          </div>

          {/* Post card */}
          <article
            style={{
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 24,
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#E9E9E9",
                }}
              />
              <span style={{ color: "#1a1a1a", fontSize: 14 }}>
                {post.username}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                margin: "12px 0 6px",
                color: green,
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 2,
              }}
            >
              {post.title}
            </h1>

            {/* Stats */}
            <div
              style={{
                fontSize: 14,
                color: gray,
                display: "flex",
                gap: 16,
              }}
            >
              <span
                onClick={toggleLike}
                style={{ cursor: "pointer", color: liked ? "red" : "#444" }}
              >
                {liked ? "❤️" : "🤍"} {likeCount}
              </span>
              <span>💬 {post.comments}</span>
              <span> · {post.time}</span>
            </div>

            {/* Image block */}
            <div
              style={{
                marginTop: 16,
                width: "100%",
                height: 260,
                borderRadius: 16,
                background:
                  "repeating-conic-gradient(#f2f2f2 0% 25%, transparent 0% 50%) 50% / 24px 24px",
                border: `1px dashed ${border}`,
              }}
            />

            {/* Body */}
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "#333",
                marginTop: 18,
              }}
            >
              {post.body}
            </div>
          </article>

          {/* Comments */}
          <section style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 18, margin: "0 0 10px", color: "#1a1a1a" }}>
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
                    fontSize: 14,
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
                      fontSize: 14,
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div style={{ fontSize: 16 }}>{c.text}</div>
              </div>
            ))}

            {/* comment composer */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              {/* 익명 체크박스 */}
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  color: "#1a1a1a",
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                익명
              </label>

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
                  fontSize: 16,
                  fontFamily: "inherit",
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
                  fontSize: "18px",
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
