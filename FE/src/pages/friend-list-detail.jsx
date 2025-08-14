import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate, useMatch } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import KakaoLink from "../assets/images/kakaologin.png";
import InstaLink from "../assets/images/insta.png"

const green = "#00664F";
const border = "#E9E9E9";
const softText = "#6B6B6B";
const badge = "#66A395";

const pushId = (key, id) => {
    const set = new Set(JSON.parse(sessionStorage.getItem(key) || "[]"));
    set.add(Number(id));
    sessionStorage.setItem(key, JSON.stringify([...set]));
};


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
function SocialActions({ instagram, kakao,onDelete }) {
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
        {/*여긴 아직 확인 전*/}
        {kakao && (
        <a href={kakao} target="_blank" rel="noreferrer" title="Kakao"
            style={{ width: "57px",height: "57px", borderRadius: "50%", border: "none" }}>
            <img src={KakaoLink} alt="카카오 링크"/>
        </a>
        )}
        {instagram && (
        <a href={instagram} target="_blank" rel="noreferrer" title="Instagram"
            style={{ width: "57px",height: "57px", borderRadius: "50%", border: "none" }}>
            <img src={InstaLink} alt="인스타 링크"/> 
        </a>
        )}
        
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

    const user = useMemo(() => {
        if (state?.user) return state.user;
        return {
        id,
        name: "Heejin",
        username: "heejin0316",
        country: "한국",
        langs: ["Korean", "English"],
        interests: ["여행", "음악", "커피"],
        purpose: "언어 교류",
        contact: "DM",
        bio:
            "Hi! I’m Heejin from Korea. My native language is Korean, and I’m looking for a language exchange partner to practice English. I’d be happy to help with Korean too! If you’re interested, feel free to send me a friend request. 😊",
        banner:
            "linear-gradient(135deg, rgba(255,124,142,0.9), rgba(255,189,125,0.9))",
        instagram: "https://instagram.com/test_account",
        kakao: "https://open.kakao.com/o/test",
        };
    }, [state, id]);

    const [processing, setProcessing] = useState(false); // 요청 수락/거절 API 처리 중 표시용(옵션)
    const handleAccept = async () => {
        try {
        setProcessing(true);
        // TODO: 수락 API 호출
        // await api.acceptFriend(user.id)
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
        // TODO: 거절 API 호출
        // await api.rejectFriend(user.id)
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
                <SocialActions instagram={user.instagram} kakao={user.kakao} onDelete={handleDeleteFriend}/>
              )}
            </div>

            {/* Bio */}
            <div style={{ padding: "0 24px 16px", color: softText, fontSize: 20, lineHeight: 1.7 }}>
              {user.bio}
            </div>

            <hr style={{ border: 0, borderTop: `1px solid ${border}`, margin: "0 24px 16px" }} />

            {/* info list */}
            <div style={{ padding: "0 100px 24px", fontSize: 20, lineHeight:4}}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <InfoRow label="아이디" value={user.username || "-"} />
                <InfoRow label="국적" value={user.country || "-"} />
                <InfoRow label="목적" value={user.purpose || "-"} />
                <InfoRow
                  label="모국어"
                  value={
                    Array.isArray(user.nativeLanguage) && user.nativeLanguage.length
                      ? user.nativeLanguage.join(" · ")
                      : "-"
                  }
                />
                <InfoRow
                  label="학습언어"
                  value={
                    Array.isArray(user.targetLanguage) && user.targetLanguage.length
                      ? user.targetLanguage.join(", ")
                      : "-"
                  }
                />
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
