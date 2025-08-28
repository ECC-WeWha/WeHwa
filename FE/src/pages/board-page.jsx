// src/pages/BoardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import PostCard from "../components/board/postcard.jsx";
import { api } from "../api/client.js";

const green = "#00664F";
const softGreen = "#66A395";
const border = "#B4B4B4";

function formatDateTime(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return String(dateLike);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDescription(text = "", maxLen = 120) {
  const clean = String(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > maxLen ? `${clean.slice(0, maxLen)}…` : clean;
}

function normalizePost(p) {
  const postId = p.postId ?? p.id ?? p._id ?? "";
  const title = p.title ?? "";
  const body = p.content ?? p.body ?? p.fullText ?? p.description ?? "";
  const username = p.username ?? p.author ?? (p.anonymous ? "익명" : "user");
  const likes = p.likes ?? p.likeCount ?? 0;
  const comments =
    p.commentsCount ??
    p.commentCount ??
    (Array.isArray(p.comments) ? p.comments.length : 0) ??
    0;
  const createdAt =
    p.createdAt ?? p.created_at ?? p.time ?? p.created ?? p.createdDate ?? null;
  const category = p.category ?? p.board ?? "";
  const categoryLabel = p.categoryLabel ?? p.category ?? "";

  return {
    raw: p,
    postId,
    title,
    body,
    description: toDescription(body),
    username,
    likes,
    comments,
    createdAt,
    timeLabel: formatDateTime(createdAt ?? p.time),
    category,
    categoryLabel,
  };
}

function readLocalCachedPosts() {
  const arr = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("post:")) {
        const raw = JSON.parse(localStorage.getItem(key));
        if (raw) arr.push(normalizePost(raw));
      }
    }
  } catch {}
  arr.sort((a, b) => (new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
  return arr;
}

export default function BoardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const urlSort = new URLSearchParams(location.search).get("sort");
  const initialSort = urlSort === "popular" ? "popular" : "recent";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("sort", sort);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [sort]);


  useEffect(() => {
    const s = location.state || {};
    const incoming = s.newPost || s.created || s.post || null;
    if (!incoming) return;
    const inc = normalizePost(incoming);
    setPosts((prev) => (prev.some((p) => String(p.postId) === String(inc.postId)) ? prev : [inc, ...prev]));
    window.history.replaceState({}, "");
  }, [location.state]);

  useEffect(() => {
    let alive = true;

    async function fetchPosts() {
      setLoading(true);
      setErr("");

      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const paramsRecent = { page: 0, size: 20, sort: "createdAt,desc" };
      const paramsPopularA = { page: 0, size: 20, sort: "likeCount,desc" };
      const paramsPopularB = { page: 0, size: 20, sort: "likes,desc" };

      const tryFetch = async (params) => {
        const candidates = [
          { method: "get", url: "/api/posts" },
          { method: "get", url: "/api/national-posts" },
        ];
        for (const c of candidates) {
          try {
            const res =
              c.method === "get"
                ? await api.get(c.url, { headers, params })
                : await api.post(c.url, {}, { headers, params });
            const root = res.data;
            const data = root?.data ?? root?.result ?? root;
            const list =
              Array.isArray(data) ? data :
              Array.isArray(data?.content) ? data.content :
              Array.isArray(data?.items) ? data.items :
              Array.isArray(data?.posts) ? data.posts :
              null;
            if (Array.isArray(list)) return list;
          } catch (_) {}
        }
        return null;
      };

      let list = null;
      if (sort === "recent") {
        list = await tryFetch(paramsRecent);
      } else {
        list = await tryFetch(paramsPopularA);
        if (!list) list = await tryFetch(paramsPopularB);
        if (!list) list = await tryFetch(paramsRecent);
      }

      let normalized = [];
      if (Array.isArray(list)) {
        normalized = list.map(normalizePost);
      } else {
        normalized = readLocalCachedPosts();
      }

      if (!alive) return;
      setPosts(normalized);
      setLoading(false);

      try {
        localStorage.setItem("board:posts", JSON.stringify(normalized.map((p) => p.raw ?? p)));
      } catch {}
    }

    fetchPosts();
    return () => { alive = false; };
  }, [sort]); 

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = posts.filter((p) => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    });

    // sort safely on a copy
    if (sort === "popular") {
      return [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    // recent (default)
    return [...filtered].sort(
      (a, b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
        (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    );
  }, [posts, query, sort]);

  const openPost = (p) => {
    const detailState = {
      postId: p.postId,
      title: p.title,
      body: p.body || p.description || "",
      username: p.username,
      likes: p.likes,
      commentsCount: p.comments,
      time: p.timeLabel,
      category: p.category,
      categoryLabel: p.categoryLabel,
      createdAt: p.createdAt,
    };
    try {
      localStorage.setItem(`post:${p.postId}`, JSON.stringify(detailState));
    } catch {}
    navigate(`/board/${p.postId}`, { state: detailState });
  };

  const Tab = ({ value, label }) => {
    const active = sort === value;
    return (
      <button
        onClick={() => setSort(value)}
        aria-pressed={active}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          color: active ? "#F2978F" : "#888",
          padding: "6px 8px",
          borderBottom: active ? "2px solid #F2978F" : "2px solid transparent",
        }}
      >
        {label}
      </button>
    );
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
          {/* Header */}
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
                fontSize: 40,
                fontWeight: "bold",
                color: green,
                margin: 0,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              게시판 홈
            </h2>
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 70,
              marginBottom: 24,
            }}
          >
            <input
              type="text"
              placeholder="검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "15px 20px",
                border: `1px solid ${softGreen}`,
                borderRadius: 20,
                width: 240,
                fontSize: 20,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              marginBottom: 50,
              marginTop: 10,
              fontWeight: 500,
            }}
          >
            <Tab value="recent" label="최신순" />
            <Tab value="popular" label="인기순" />
          </div>

          {/* List / states */}
          {loading && (
            <div
              style={{
                border: `1px dashed ${border}`,
                borderRadius: 16,
                padding: 24,
                color: "#666",
                textAlign: "center",
              }}
            >
              불러오는 중…
            </div>
          )}

          {!loading && err && (
            <div
              style={{
                border: `1px dashed ${border}`,
                borderRadius: 16,
                padding: 24,
                color: "#FF5A5A",
                textAlign: "center",
              }}
            >
              {err}
            </div>
          )}

          {!loading && !err && visiblePosts.length === 0 && (
            <div
              style={{
                border: `1px dashed ${border}`,
                borderRadius: 16,
                padding: 24,
                color: "#666",
                textAlign: "center",
              }}
            >
              아직 게시글이 없어요. 첫 글을 작성해 보세요!
            </div>
          )}

          {!loading &&
            !err &&
            visiblePosts.map((p) => (
              <PostCard
                key={p.postId}
                username={p.username}
                title={p.title}
                description={p.description}
                likes={p.likes}
                comments={p.comments}
                time={p.timeLabel}
                onClick={() => openPost(p)}
              />
            ))}
        </main>
      </div>
    </div>
  );
}
