import React from "react";
import { useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import PostCard from "../components/board/PostCard.jsx";

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
                color: "#00664F",
                margin: 0,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              게시판
            </h2>
          </div>

          {/* Search bar (between title and tabs, aligned right) */}
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
                border: "1px solid #66A395",
                borderRadius: "20px",
                width: "240px",
                fontSize: "20px",
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
