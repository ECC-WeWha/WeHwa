// src/pages/board-my-page.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import PostCard from "../components/board/postcard.jsx";
import { api } from "../api/client.js";

const green = "#00664F";
const softGreen = "#66A395";
const border = "#B4B4B4";


function formatKoreanDotDate(input) {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  let h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  h = h % 12;
  if (h === 0) h = 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${y}. ${m}. ${day}. ${ampm} ${h}:${minute}`;
}

function extractList(payload) {
  const d = payload?.data ?? payload;
  if (Array.isArray(d)) return d;
  const candidates = [
    d?.posts,
    d?.items,
    d?.content,   
    d?.contents,
    d?.list,
    d?.rows,
    d?.result,
    d?.results,
    d?.data,        
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
}


function belongsToMe(post, me) {
  if (!post || !me) return false;


  const myLoginId = me.userId;
  const loginCandidates = [
    post.userLoginId,
    post.authorLoginId,
    post.loginId,
    post.user?.loginId,
    post.author?.loginId,
    post.createdBy?.loginId,
  ].filter(Boolean);
  if (myLoginId && loginCandidates.some(v => String(v).toLowerCase() === String(myLoginId).toLowerCase())) {
    return true;
  }


  const myId = me.id;
  const idCandidates = [
    post.userId,
    post.authorId,
    post.createdById,
    post.user?.id,
    post.author?.id,
    post.createdBy?.id,
  ].filter(Boolean);
  if (myId && idCandidates.some(v => String(v) === String(myId))) return true;


  if (me.nickname) {
    const names = [post.username, post.author, post.nickname, post.user?.nickname, post.author?.nickname];
    if (names.filter(Boolean).some(v => String(v) === String(me.nickname))) return true;
  }
  if (me.name) {
    const names = [post.name, post.user?.name, post.author?.name, post.createdBy?.name];
    if (names.filter(Boolean).some(v => String(v) === String(me.name))) return true;
  }
  if (me.email) {
    const emails = [post.email, post.user?.email, post.author?.email, post.createdBy?.email].filter(Boolean);
    if (emails.some(v => String(v).toLowerCase() === String(me.email).toLowerCase())) return true;
    const myLocal = String(me.email).split("@")[0];
    const nameLikes = [post.username, post.author, post.nickname, post.user?.nickname, post.author?.nickname];
    if (myLocal && nameLikes.filter(Boolean).some(v => String(v) === String(myLocal))) return true;
  }

  if (post.mine === true || post.ownedByMe === true) return true;
  return false;
}

export default function BoardMyPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");

  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [meError, setMeError] = useState("");

  const [query, setQuery] = useState("");

  // Load profile (same shape as your ProfilePage mappedData)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingMe(true);
        setMeError("");
        const res = await api.get("/api/users/me");
        const d = res.data?.data ?? res.data;
        const mapped = {
          userId: d.loginId,
          email: d.email,
          nickname: d.nickname,
          name: d.name,
          birthYear: d.birthYear,
          studentStatus: d.status,
          nationality: d.nationality,
          grade: d.year,
          major: d.major,
          nativeLanguage: d.language,
          studyLanguage: d.studyLanguage,
          kakao: d.kakaoId,
          instagram: d.instaId,
          bio: d.introduction,
          id: d.id ?? d.userId, 
        };
        if (alive) setMe(mapped);
      } catch (e) {
        if (alive) {
          setMe(null);
          setMeError(e.response?.status === 403 || e.response?.status === 401
            ? "로그인이 필요합니다."
            : (e.message || "프로필 로드 실패"));
        }
      } finally {
        if (alive) setLoadingMe(false);
      }
    })();
    return () => { alive = false; };
  }, []);


  useEffect(() => {
    if (loadingMe) return;
    let alive = true;

    async function tryGet(url) {
      try {
        const res = await api.get(url);
        const list = extractList(res.data);
        return Array.isArray(list) ? list : [];
      } catch {
        return [];
      }
    }

    (async () => {
      try {
        setLoadingPosts(true);
        setPostsError("");

        let list = [];

 
        if (me) {
          const candidates = [
            "/api/posts/me",
            "/api/users/me/posts",
            "/api/posts?mine=true",
            `/api/posts?authorLoginId=${encodeURIComponent(me.userId)}`, // common server filter
            me.nickname ? `/api/posts?authorNickname=${encodeURIComponent(me.nickname)}` : null,
          ].filter(Boolean);

          for (const url of candidates) {
            const arr = await tryGet(url);
            if (arr.length) { list = arr; break; }
          }
        }

        if (!list.length) {
          const res = await api.get("/api/posts");
          list = extractList(res.data);
        }

        if (!alive) return;
        setPosts(list);
      } catch (e) {
        if (!alive) return;
        setPosts([]);
        setPostsError(e.response?.status === 403 || e.response?.status === 401
          ? "게시글을 보려면 로그인해 주세요."
          : (e.message || "글 목록 로드 실패"));
      } finally {
        if (alive) setLoadingPosts(false);
      }
    })();

    return () => { alive = false; };
  }, [loadingMe, me]);


  const myPosts = useMemo(() => {
    if (!me) return [];
    return posts.filter(p => belongsToMe(p, me));
  }, [posts, me]);


  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const src = myPosts;
    if (!q) return src;
    return src.filter((p) => {
      const fields = [
        p.title,
        p.username,
        p.author,
        p.nickname,
        p.description,
        p.content,
        p.body,
      ].filter(Boolean).map(String);
      return fields.some((f) => f.toLowerCase().includes(q));
    });
  }, [myPosts, query]);

  const openPost = (post) => {
    const id = post.postId ?? post.id;
    try { localStorage.setItem(`post:${id}`, JSON.stringify(post)); } catch {}
    navigate(`/board/${id}`, { state: post });
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

          {/* Search */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 70, marginBottom: 24 }}>
            <input
              type="text"
              placeholder="검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: "15px 20px", border: `1px solid ${softGreen}`, borderRadius: 20, width: 240, fontSize: 20, fontFamily: "inherit", outline: "none" }}
            />
          </div>

          {/* States */}
          {(loadingMe || loadingPosts) && (
            <div style={{ border: `1px dashed ${border}`, borderRadius: 16, padding: 24, color: "#666", textAlign: "center" }}>
              불러오는 중…
            </div>
          )}

          {!loadingMe && meError && (
            <div style={{ border: `1px dashed ${border}`, borderRadius: 16, padding: 24, color: "#FF5A5A", textAlign: "center" }}>
              {meError}
            </div>
          )}

          {!loadingPosts && postsError && (
            <div style={{ border: `1px dashed ${border}`, borderRadius: 16, padding: 24, color: "#FF5A5A", textAlign: "center" }}>
              {postsError}
            </div>
          )}

          {!loadingMe && !loadingPosts && !meError && !postsError && visible.length === 0 && (
            <div style={{ border: `1px dashed ${border}`, borderRadius: 16, padding: 24, color: "#666", textAlign: "center" }}>
              내가 쓴 글이 없어요.
            </div>
          )}

          {/* List */}
          {!loadingMe && !loadingPosts && !meError && !postsError && visible.map((p) => {
            const id = p.postId ?? p.id;
            const username = p.username ?? p.author ?? "익명";
            const title = p.title;
            const description = p.description ?? p.content ?? p.body ?? "";
            const likes = p.likes ?? p.likeCount ?? 0;
            const comments = p.comments ?? p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0) ?? 0;
            const created = p.createdAt ?? p.created_at ?? p.time ?? p.created ?? p.createdDate;
            const time = formatKoreanDotDate(created);

            return (
              <PostCard
                key={id}
                username={username}
                title={title}
                description={description}
                likes={likes}
                comments={comments}
                time={time}
                onClick={() => openPost(p)}
              />
            );
          })}
        </main>
      </div>
    </div>
  );
}
