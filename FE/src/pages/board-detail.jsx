// src/pages/board-detail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";

function BoardDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  // palette
  const green = "#00664F";
  const softGreen = "#66A395";
  const gray = "#A0A0A0";
  const border = "#B4B4B4";

  // mock data (swap with API fetch using postId)
  const [post] = useState({
    id: postId || "123",
    username: "heejin0316",
    title:
      "생방송투데이 강서구 MZ맛집 야장 6900 돌판짜장 맛집 위치 정보",
    body: "안녕하세요 :) ",
    time: "3분 전",
    likes: 17,
    comments: 17,
  });

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setLiked((v) => !v);
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
          {/* Page title (center) */}
          <div
            style={{
              position: "relative",
              marginBottom: "16px",
              height: 0, // keep absolute title without pushing layout
            }}
          >
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

          {/* Search (right, between title and content) */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "36px",
              marginBottom: "24px",
            }}
          >
            <input
              type="text"
              placeholder="검색"
              style={{
                padding: "12px 18px",
                border: `1px solid ${softGreen}`,
                borderRadius: "20px",
                width: "220px",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                border: `1px solid ${border}`,
                background: "#fff",
                borderRadius: 12,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 14,
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
            {/* Header row: badge + avatar + username */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* small red number bubble (e.g., index) */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#F2978F",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                1
              </div>

              {/* avatar circle */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#E9E9E9",
                }}
              />

              {/* username */}
              <span style={{ color: "#1a1a1a", fontSize: 14 }}>{post.username}</span>
            </div>

            {/* Title */}
            <h1
              style={{
                margin: "12px 0 6px",
                color: green,
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {post.title}
            </h1>

            {/* Stats */}
            <div style={{ fontSize: 14, color: gray, display: "flex", gap: 16 }}>
              <span
                onClick={toggleLike}
                style={{ cursor: "pointer", color: liked ? "red" : "#444" }}
                title={liked ? "좋아요 취소" : "좋아요"}
              >
                {liked ? "❤️" : "🤍"} {likeCount}
              </span>
              <span>💬 {post.comments}</span>
              <span>⏱ {post.time}</span>
            </div>

            {/* Image block (placeholder look) */}
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
            <div style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 18 }}>
              {post.body}
            </div>
          </article>

          {/* Comments (simple mock) */}
          <section style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 18, margin: "0 0 10px", color: "#1a1a1a" }}>
              댓글
            </h3>

            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
                user001 · 2분 전
              </div>
              <div style={{ fontSize: 16 }}>정보 감사합니다!</div>
            </div>

            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
                foodie22 · 5분 전
              </div>
              <div style={{ fontSize: 16 }}>여기 꼭 가볼게요 </div>
            </div>

            {/* Add comment */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "12px 14px",
                  border: `1px solid ${border}`,
                  borderRadius: 12,
                  outline: "none",
                }}
              />
              <button
                type="button"
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: `1px solid ${green}`,
                  backgroundColor: green,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => alert("댓글 등록 (API 연동 필요)")}
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
