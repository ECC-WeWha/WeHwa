import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate, useMatch } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import KakaoLink from "../assets/images/kakaologin.png";
import InstaLink from "../assets/images/insta.png"
import {api} from "../api/client.js";
const green = "#00664F";
const border = "#E9E9E9";
const softText = "#6B6B6B";

const pushId = (key, id) => {
    const set = new Set(JSON.parse(sessionStorage.getItem(key) || "[]"));
    set.add(Number(id));
    sessionStorage.setItem(key, JSON.stringify([...set]));
};

const DEFAULT_IMG = "/images/profile.png"; // NEW
function normalizeImg(src) {               // CHANGED
  if (!src) return DEFAULT_IMG;
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `/images/${src}`;
}

function RequestActions({ onAccept, onReject }) {
    return (
    <div style={{ display: "flex", gap: 28 }}>
        <button
        type="button"
        onClick={onAccept}
        style={{
            border: "none",
            background: "#79BCCF",
            color: "#ffffff",
            padding: "15px 16px",
            borderRadius: 20,
            fontSize: 18,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
        >
            수락
        </button>
        <button
        type="button"
        onClick={onReject}
        style={{
            border: "none",
            background: "#f59d95",
            color: "#ffffff",
            padding: "15px 16px",
            borderRadius: 20,
            fontSize: 18,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
        >
            거절
        </button>
    </div>
    );
}
// link 없어도 렌더. link 있으면 <a>, 없으면 <div role="img">
function ListBadge({ badgeInfo, size = 57 }) {
  const hasLink = !!badgeInfo?.link;

  const commonStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    border: "none",
    display: "inline-flex",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    // 링크 없으면 흐리게 + 클릭 불가 커서
    opacity: hasLink ? 1 : 0.5,
    cursor: hasLink ? "pointer" : "default",
  };

  const Img = (
    <img
      src={badgeInfo.image}
      alt={badgeInfo.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  if (hasLink) {
    return (
      <a
        href={badgeInfo.link}
        target="_blank"
        rel="noreferrer"
        title={badgeInfo.title}
        onClick={(e) => e.stopPropagation()}
        style={commonStyle}
        aria-label={badgeInfo.title}
      >
        {Img}
      </a>
    );
  }

  // 링크 없을 때: 단순 표시용
  return (
    <div
      role="img"
      aria-label={`${badgeInfo.title} (연결 예정)`}
      title={`${badgeInfo.title} (연결 예정)`}
      style={commonStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {Img}
    </div>
  );
}

function buildBadgesFromUser(user) {
  return [
    { link: user?.kakao || null,     image: KakaoLink, title: "Kakao" },
    { link: user?.instagram || null, image: InstaLink, title: "Instagram" },
  ];
}


function SocialActions({ badges ,onDelete }) {
    return (
    <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <button
        type="button"
        onClick={onDelete}
        style={{
            borderWidth: "1px",
            borderColor:"#D80000",
            background:"#ffffff" ,
            color: "#D80000",
            padding: "15px 16px",
            borderRadius: 20,
            fontSize: 18,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
        >
        친구 삭제
        </button>
        {badges?.length > 0 &&
        badges.map((b, i) => <ListBadge key={`${b.title}-${i}`} badgeInfo={b} size={57} />)}    
    </div>
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

export default function FriendListDetail() {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    const matchRequestsByUrl = useMatch("/friendlist/requests/:id") !== null;
    const modeFromState = state?.mode; 
    const isRequests = matchRequestsByUrl || modeFromState === "requests";

    const requestId =
    state?.requestId ??
    state?.user?.requestId ??
    state?.user?._requestId ??
    null; 

    const user = useMemo(() => {
      const raw = state?.user ?? {};
      return {
        ...raw, // 원본 보존
        id: raw.userId ?? raw.senderId ?? raw.id ?? id,                           // CHANGED
        name: raw.nickname ?? raw.name ?? "익명",                                  // CHANGED
        img: normalizeImg(raw.profileImage ?? raw.img),                           // CHANGED
        region: raw.region ?? null,                                               // CHANGED
        purpose: raw.purpose ?? null,                                             // CHANGED
        langName: raw.languageName ?? null,                                       // CHANGED (모국어)
        langs: [raw.studyLanguageName].filter(Boolean),                           // CHANGED (학습언어 단일)
        topik: raw.koreanTopicScore ?? raw.koreanTopic ?? raw.topik ?? null,            // CHANGED
        major: raw.major ?? null,                                                 // CHANGED
        education: raw.studentStatus ?? raw.education ?? raw.grade ?? null,       // CHANGED
        bio: raw.introduction ?? raw.bio ?? "",                                   // CHANGED
        kakao: raw.kakaoId ?? null,
        instagram: raw.instagramId ?? null,
        requestId: requestId,                                                     // CHANGED
      };
    }, [state, id, requestId]);
//////////////////////////////////////////////////////
    const badges = useMemo(() => buildBadgesFromUser(user), [user]);

    const [processing, setProcessing] = useState(false); // 요청 수락/거절 API 처리 중 표시용(옵션)
    const handleAccept = async () => {
        try {
        setProcessing(true);
        const rid = requestId ?? user._requestId ?? user.requestId ?? null;

        await api.post(`/api/friend-requests/${rid ?? user.id}/accept`);
        alert("친구 요청을 수락했습니다.");
        pushId("accepted_ids", user.id);
        navigate("/friendlist", { replace: true }); 
        } finally {
        setProcessing(false);
        }
    };
    const handleReject = async () => {
        try {
        setProcessing(true);
        const rid = user._requestId ?? user.requestId ?? user.id;

        await api.post(`/api/friend-requests/${rid}/reject`);
        alert("친구 요청을 거절했습니다.");
        pushId("rejected_ids", user.id);
        navigate("/friendlist/requests", { replace: true });
        } finally {
        setProcessing(false);
        }
    };
    const handleDeleteFriend = async () => {
        try {
        setProcessing(true);
        await api.delete(`/api/friends/${user.id}`);
          // await api.deleteFriend(user.id)
        alert("친구를 삭제했습니다.");
        pushId("deleted_friend_ids", user.id);      
        navigate("/friendlist", { replace: true }); 
        } finally { setProcessing(false); }
    };


return (
    <>
    <BoardNav active="list" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
          <FriendListSidebar />
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
                role="img"
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

              {isRequests ? (
                <RequestActions onAccept={handleAccept} onReject={handleReject} />
              ) : (
                <SocialActions badges={badges} onDelete={handleDeleteFriend} />
              )}
            </div>

            {/* Bio */}
            <div style={{ padding: "0 24px 16px", color: softText, fontSize: 20, lineHeight: 1.7 }}>
              {user.bio || "소개가 없습니다."}
            </div>

            <hr style={{ border: 0, borderTop: `1px solid ${border}`, margin: "0 24px 16px" }} />

            {/* info list */}
            <div style={{ padding: "0 100px 24px", fontSize: 20, lineHeight:4}}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <InfoRow label="아이디" value={user.username || "-"} />
                <InfoRow label="국적" value={user.country || "-"} />
                <InfoRow label="목적" value={user.purpose || "-"} />
                <InfoRow label="모국어" value={user.langName || "-"} />           {/* CHANGED */}
                <InfoRow label="학습언어" value={user.langs?.[0] || "-"} />
                <InfoRow label="한국어 토픽" value={user.topik || "-"} />
                <InfoRow label="전공" value={user.major || "-"} />
                <InfoRow label="학적" value={user.education || "-"} />
              </div>

            </div>
          </section>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </>
  );
}
