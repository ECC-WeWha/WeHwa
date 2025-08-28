import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FindFriendSidebar from "../components/sidebar/friend-find-sidebar.jsx";

const green = "#00664F";
const border = "#E9E9E9";
const softText = "#6B6B6B";

// NEW: 파일명만 올 때 /images/ 접두어 보정
function normalizeImg(src) { // NEW
  if (!src) return "/images/profile.png";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `/images/${src}`;
}


function RequestButton({ requested, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        border: "none",
        background: requested ? "#f59d95" : "#79BCCF",
        color: requested ? "#ffffff" : "#ffffff",
        padding: "15px 16px",
        borderRadius: 20,
        fontSize: 18,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
      aria-label={requested ? "친구 요청 취소" : "친구 신청"}
    >
      {requested ? "요청 취소" : "친구 신청"}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
      <div style={{ color: green, fontWeight: 700, minWidth: 64 }}>{label}</div>
      <div style={{ color: "#1a1a1a", flex: 1 }}>{value}</div>
    </div>
  );
}

export default function FriendFindDetail() {
  const { state } = useLocation();
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const user = useMemo(() => {
    const raw = state?.user ?? {};
    return {
      id: raw.userId ?? raw.senderId ?? routeId,                    // CHANGED: 아이디
      name: raw.nickname,                                           // CHANGED: 이름
      img: normalizeImg(raw.profileImage ?? raw.img),               // CHANGED: 이미지
      region: raw.region,                                           // CHANGED: 국적
      purpose: raw.purpose,                                         // CHANGED: 목적
      langName: raw.languageName,                                   // CHANGED: 모국어
      langs: [raw.studyLanguageName].filter(Boolean),               // CHANGED: 학습언어(단일)
      topik: raw.topik ?? raw.koreanTopic ?? raw.koreanTopicScore ?? "",  // CHANGED: 한국어 토픽
      major: raw.major,                                             // CHANGED: 전공
      education: raw.studentStatus ?? raw.education ?? raw.grade ?? "", // CHANGED: 학적
      bio: raw.introduction ?? "",                                  // CHANGED: 소개
      friendRequested: !!raw.friendRequested,
      // 원본도 보존(필요 시 접근)
      ...raw,
    };
  }, [state, routeId]);

  const [requested, setRequested] = useState(!!user.friendRequested);       // CHANGED


  return (
    <>
      <BoardNav active="match" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
          <FindFriendSidebar />

          {/* Right: detail card */}
          <section
            style={{
              background: "#fff",
              border: `1px solid ${border}`,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {/* Header banner */}
            <div
              style={{
                height: 170,
                background:
                  user.banner ||
                  "linear-gradient(135deg, rgba(121,188,207,0.25), rgba(255,165,158,0.25))",
                borderBottom: `1px solid ${border}`,
                position: "relative",
              }}
            >
              {/* Avatar */}
              <div
                role="img"                                 // NEW: 접근성 힌트
                aria-label="사용자 프로필 이미지"
                style={{
                  position: "absolute",
                  left: 40,
                  bottom: -70,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `url(${user.img}) center/cover no-repeat`,
                  border: "4px solid #fff",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
              />
            </div>

            {/* Top row */}
            <div
              style={{
                padding: "80px 24px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 22,
                    color: "#1a1a1a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={user.name}
                >
                  {user.name}
                </h1>
              </div>

              <RequestButton
                requested={requested}
                onToggle={() => setRequested((v) => !v)}
              />
            </div>

            {/* Bio */}
            <div style={{ padding: "0 24px 16px", color: softText, fontSize: 20, lineHeight: 1.7 }}>
            {user.bio || "소개가 없습니다."}
            </div>

            <hr style={{ border: 0, borderTop: `1px solid ${border}`, margin: "0 24px 16px" }} />

            {/* info list */}
            <div style={{ padding: "0 100px 24px", fontSize: 20, lineHeight:4}}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InfoRow label="아이디" value={user.id ?? "-"} />                 {/* CHANGED */}
                <InfoRow label="국적" value={user.region || "-"} />               {/* CHANGED */}
                <InfoRow label="목적" value={user.purpose || "-"} />              {/* CHANGED */}
                <InfoRow label="모국어" value={user.langName || "-"} />           {/* CHANGED */}
                <InfoRow label="학습언어" value={user.langs[0] || "-"} />         {/* CHANGED */}
                <InfoRow label="한국어 토픽" value={user.topik || "-"} />         {/* CHANGED */}
                <InfoRow label="전공" value={user.major || "-"} />                {/* CHANGED */}
                <InfoRow label="학적" value={user.education || "-"} />            {/* CHANGED */}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </>
  );
}
