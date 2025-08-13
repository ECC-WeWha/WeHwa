import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FindFriendSidebar from "../components/sidebar/friend-find-sidebar.jsx";

const green = "#00664F";
const border = "#E9E9E9";
const softText = "#6B6B6B";
const badge = "#66A395";

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
  const { id } = useParams();
  const navigate = useNavigate();

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
    };
  }, [state, id]);

  const [requested, setRequested] = useState(false);

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
