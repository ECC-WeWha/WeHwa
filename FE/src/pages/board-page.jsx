import React from "react";
import { useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";

const green = "#00664F";
const softGreen = "#66A395";
const border = "#B4B4B4";
const gray = "#888";


function PostCard({ username, title, description, likes, comments, time, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#E9E9E9",
          }}
        />
        <span style={{ fontSize: 14, color: "#1a1a1a" }}>{username}</span>
      </div>

      <h3
        style={{
          margin: "10px 0 6px",
          color: green,
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.6,
        }}
      >
        {title}
      </h3>

      <p style={{ margin: 0, color: "#333", fontSize: 16 }}>{description}</p>

      <div style={{ marginTop: 10, display: "flex", gap: 16, color: gray, fontSize: 14 }}>
        <span>❤️ {likes}</span>
        <span>💬 {comments}</span>
        <span>· {time}</span>
      </div>
    </article>
  );
}

function BoardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Navigation bar */}
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

        {/* Main Board */}
        <main style={{ flex: 1, padding: "0 80px", justifyContent: "center" }}>
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                color: green,
                margin: 0,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              게시판
            </h2>
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "70px",
              marginBottom: "24px",
            }}
          >
            <input
              type="text"
              placeholder="검색"
              style={{
                padding: "15px 20px",
                border: `1px solid ${softGreen}`,
                borderRadius: "20px",
                width: "240px",
                fontSize: "20px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "50px",
              marginTop: "10px",
              fontWeight: "500",
            }}
          >
            <span style={{ color: "#F2978F", cursor: "pointer" }}>인기순</span>
            <span style={{ color: "#888", cursor: "pointer" }}>최신순</span>
            <span style={{ color: "#888", cursor: "pointer" }}>스크랩 많은 글</span>
          </div>

          {/* Posts */}
          <PostCard
            username="heejin0316"
            title="생방송투데이 강서구 MZ맛집 야장 6900 돌판짜장 맛집 위치 정보"
            description="안녕하세요:)"
            likes={17}
            comments={17}
            time="3분 전"
            onClick={() => navigate("/board/123")}
          />
          <PostCard
            username="user123"
            title="다른 포스트 예시 제목"
            description="설명 내용"
            likes={5}
            comments={2}
            time="10분 전"
            onClick={() => navigate("/board/456")}
          />
        </main>
      </div>
    </div>
  );
}
export default BoardPage;
