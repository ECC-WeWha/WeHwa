import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { api } from "../api/client.js";

const green = "#00664F";
const border = "#B4B4B4";
const secondGreen = "#66A395";

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

function BoardDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [post, setPost] = useState(state ?? null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  const [me, setMe] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/api/users/me");
        const data = res.data?.data ?? res.data;
        const mapped = {
          userId: data.loginId,
          email: data.email,
          nickname: data.nickname,
          name: data.name,
        };
        if (alive) setMe(mapped);
      } catch (_) {}
    })();
    return () => { alive = false; };
  }, []);
  const displayName =
    me?.nickname || me?.name || me?.userId || (me?.email ? me.email.split("@")[0] : null) || "username";


  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);


        if (!post && state?.draft) {
          setLoadingPost(true);

          const token = localStorage.getItem("accessToken");
          const form = new FormData();
          form.append(
            "postData",
            new Blob([JSON.stringify({
              title: state.draft.title,
              content: state.draft.content,
              category: state.draft.category,
              keywords: state.draft.keywords,
              anonymous: state.draft.anonymous,
            })], { type: "application/json" })
          );
          const files = state?.draft?.files ?? state?.files ?? [];
          files.forEach((f) => form.append("Images", f));

          const { data } = await api.post("/api/posts", form, {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          const created = data?.data || data;
          setPost(created);
          try { localStorage.setItem(`post:${created.postId}`, JSON.stringify(created)); } catch {}
          if (!postId || String(postId) !== String(created.postId)) {
            navigate(`/board/${created.postId}`, { state: created, replace: true });
          }
          return;
        }


        if (!post && postId) {
          setLoadingPost(true);


          const saved = localStorage.getItem(`post:${postId}`);
          if (saved) {
            try { setPost(JSON.parse(saved)); } catch {}
          }

          const token = localStorage.getItem("accessToken");
          const { data } = await api.post(
            "/api/posts",
            { postId },
            {
              signal: controller.signal,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const fresh = data?.data || data;
          if (!fresh) throw new Error("포스트 데이터가 없어요.");

          setPost((prev) => ({ ...(prev || {}), ...fresh }));
          try { localStorage.setItem(`post:${postId}`, JSON.stringify(fresh)); } catch {}
        }
      } catch (e) {
        setError(e.message || "포스트 처리 중 오류가 발생했어요.");
      } finally {
        setLoadingPost(false);
      }
    }

    load();
    return () => controller.abort();
  }, [post, postId, state, navigate]);

  if (!post) {
    return (
      <div style={{ padding: 30 }}>
        {loadingPost ? (
          <p>포스트를 불러오는 중이에요…</p>
        ) : error ? (
          <>
            <p style={{ color: "#FF5A5A" }}>{error}</p>
            <button onClick={() => navigate(-1)} style={{ padding: "8px 12px" }}>
              목록으로 가기
            </button>
          </>
        ) : (
          <>
            <p>포스트가 없어요.</p>
            <button onClick={() => navigate(-1)} style={{ padding: "8px 12px" }}>
              목록으로 가기
            </button>
          </>
        )}
      </div>
    );
  }

  const author = post.author || post.username || "익명";
  const content = post.content ?? post.body ?? post.fullText ?? post.description ?? "";
  const createdAt = post.createdAt ?? post.created_at ?? post.time ?? null;
  const createdAtLabel = formatDateTime(createdAt);


  const imageUrls = (() => {
    const raw = post.imageUrls ?? post.images ?? post.photos ?? post.attachments ?? post.files ?? [];
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((v) => (typeof v === "string" ? v : v?.url || v?.imageUrl || v?.path))
        .filter(Boolean);
    }
    if (typeof raw === "string") return [raw];
    return [];
  })();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? post.likes ?? 0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const commentsCount = post.commentsCount ?? post.commentCount ?? comments.length;

  const toggleLike = () => {
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    setLiked((v) => !v);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    if (!isAnonymous && !me) {
      alert("로그인 후 댓글을 작성할 수 있어요.");
      return;
    }
    const newComment = {
      id: Date.now(),
      username: isAnonymous ? "익명" : displayName,
      time: "방금 전",
      text: commentText.trim(),
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setIsAnonymous(false);
    setPost((prev) => ({
      ...(prev || {}),
      commentsCount: (prev?.commentsCount ?? prev?.commentCount ?? 0) + 1,
    }));
  };

  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setPost((prev) => ({
      ...(prev || {}),
      commentsCount: Math.max(
        0,
        (prev?.commentsCount ?? prev?.commentCount ?? comments.length) - 1
      ),
    }));
  };

  const contentLooksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const contentAsHtml = contentLooksLikeHtml ? content : content.replace(/\n/g, "<br />");

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
              {post.categoryLabel || post.category || "게시판"}
            </h2>
          </div>

          {/* Back button */}
          <div style={{ marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: "#fff",
                border: `1px solid ${secondGreen}`,
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
          <article style={{ borderRadius: 20, padding: 30 }}>
            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "#E9E9E9",
                }}
              />
              <span style={{ color: "#1a1a1a", fontSize: 18 }}>{author}</span>
            </div>

            {/* Title */}
            <h1
              style={{
                margin: "12px 0 6px",
                color: green,
                fontSize: 25,
                fontWeight: 700,
                lineHeight: 2,
              }}
            >
              {post.title}
            </h1>

            {/* Stats */}
            <div
              style={{
                fontSize: 18,
                color: "#1a1a1a",
                display: "flex",
                gap: 20,
                alignItems: "center",
              }}
            >
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
                  color: "#1a1a1a",
                }}
              >
                {liked ? (
                  <FavoriteIcon sx={{ fontSize: 22, color: "red" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 22, color: "#1a1a1a" }} />
                )}
                {likeCount}
              </button>

              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 20, color: "#1a1a1a" }} />
                {commentsCount}
              </span>

              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "#1a1a1a" }} />
                {createdAtLabel}
              </span>
            </div>

            {/* Pictures */}
            {imageUrls.length > 0 ? (
              <div style={{ marginTop: 25, display: "grid", gap: 12 }}>
                {imageUrls.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`post-image-${i}`}
                    style={{
                      width: "100%",
                      maxHeight: 500,
                      objectFit: "cover",
                      borderRadius: 20,
                      border: `1px solid ${border}`,
                    }}
                  />
                ))}
              </div>
            ) : (
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
            )}

            {/* 🔸 Content directly BELOW the picture(s) */}
            <div
              style={{
                fontSize: 20,
                lineHeight: 1.7,
                color: "#1a1a1a",
                marginTop: 20,
              }}
            >
              {/* If HTML -> render; else preserve line breaks */}
              <div dangerouslySetInnerHTML={{ __html: contentAsHtml }} />
            </div>
          </article>

          {/* Comments */}
          <section style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 18, margin: "0 0 10px", color: "#1a1a1a" }}>댓글</h3>

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
                      textDecoration: "underline",
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div style={{ fontSize: 20 }}>{c.text}</div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    sx={{ color: green, "&.Mui-checked": { color: green } }}
                  />
                }
                label="익명"
                sx={{ fontSize: 25, color: "#1a1a1a", marginRight: 1 }}
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
