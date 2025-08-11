// BoardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import PostCard from "../components/board/postcard.jsx";

const green = "#00664F";
const softGreen = "#66A395";

const posts = [
  {
    id: "123",
    username: "heejin0316",
    title: "생방송투데이 강서구 MZ맛집 야장 6900 돌판짜장 맛집 위치 정보",
    description: "안녕하세요:)",
    likes: 17,
    comments: 17,
    time: "3분 전",
    body: "안녕하세요 :) ",
  },
  {
    id: "456",
    username: "user123",
    title: "A Taste of Thailand in the Heart of Seoul: Uraproud Review",
    description: "Living in Seoul doesn’t mean you have to leave the flavors of Thailand behind. In fact, tucked between the buzzing streets of the city are gems that will instantly transport you to Bangkok with just one bite. One of my absolute favorites is [Restaurant Name], a cozy spot that serves up authentic Thai flavors with the kind of warmth that feels like home.",
    likes: 5,
    comments: 2,
    time: "10분 전",
    body: "본문 예시 입니다.",
  },
];

function BoardPage() {
  const navigate = useNavigate();

  const openPost = (post) => {
    localStorage.setItem(`post:${post.id}`, JSON.stringify(post));
    navigate(`/board/${post.id}`, { state: post });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <BoardNav active="board" />
      <div style={{ display: "flex", maxWidth: "1440px", margin: "0 auto", padding: "40px 20px", boxSizing: "border-box" }}>
        <BoardSidebar />
        <main style={{ flex: 1, padding: "0 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "16px", position: "relative" }}>
            <h2 style={{ fontSize: 40, fontWeight: "bold", color: green, margin: 0, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              내가 쓴 글
            </h2>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 70, marginBottom: 24 }}>
            <input
              type="text"
              placeholder="검색"
              style={{ padding: "15px 20px", border: `1px solid ${softGreen}`, borderRadius: 20, width: 240, fontSize: 20, fontFamily: "inherit", outline: "none" }}
            />
          </div>

          {posts.map((p) => (
            <PostCard
              key={p.id}
              username={p.username}
              title={p.title}
              description={p.description}
              likes={p.likes}
              comments={p.comments}
              time={p.time}
              onClick={() => openPost(p)}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
export default BoardPage;
