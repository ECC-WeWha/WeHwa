// src/pages/FriendMatchingPage.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import ProfileCard from "../components/board/profilecard.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FindFriendSidebar from "../components/sidebar/friend-find-sidebar.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";

import { api } from "../api/client";


const border = "#ffffff";


// NEW: 파일명만 올 때 /images/ 접두어 보정
function normalizeImg(src) { // NEW
  if (!src) return "/images/default-profile.png";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `/images/${src}`;
}

export default function FriendFindPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [profiles, setProfiles] = useState([]);   
  const [requested, setRequested] = useState(() => new Set());
  const [langFilter, setLangFilter] = useState("Korean");

  //const [usedMock, setUsedMock] = useState(false);
  const abortRef = useRef();

  // URL ?lang= 읽기
  useEffect(() => {
    const lang = searchParams.get("lang");
    setLangFilter(lang && lang.trim() ? lang : "Korean"); // CHANGED:
  }, [searchParams]);

  // API 호출
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
  
      (async () => {
        try {
          const res = await api.get("/api/friend-matching/profiles", {
            params: { language: (langFilter || "Korean") }, // 백엔드 스펙 고정 // CHANGED
            signal: controller.signal,
          });
  
          const raw = Array.isArray(res?.data?.data) ? res.data.data : []; // CHANGED
  
          // ⭐ 핵심: 백엔드 키 → UI 키로 최소 매핑
          const mapped = raw.map((p) => ({
            id: p.userId ?? p.senderId,
            name: p.nickname,
            langName: p.languageName, // 모국어
            langs: [p.studyLanguageName].filter(Boolean), // 학습 언어만
            major: p.major, // 별도 필드
            tags: [p.purpose].filter(Boolean),
            bio: p.introduction,
            img: normalizeImg(p.profileImage),
            region: p.region, // 국적
            topik: p.topik ?? p.koreanTopic ?? p.koreanTopicScore ?? null,
            education: p.studentStatus ?? p.education ?? p.grade ?? null,
            kakao: p.kakaoId ?? null,
            instagram: p.instagramId ?? null,
            ...p, // 원본 유지
          }));
  
          setProfiles(mapped);                              // CHANGED
  
          // friendRequested 초기 반영 (id 기준)
          const init = new Set(mapped.filter(x => x.friendRequested).map(x => x.id)); // CHANGED
          setRequested(init);                               
        } catch (e) {
          setProfiles([]); // CHANGED
        }
      })();
  
      return () => controller.abort();
    }, [langFilter]);

  const visibleUsers = useMemo(() => {
    if (langFilter === "All") return profiles;
    const t = (langFilter || "").toLowerCase();
    return profiles.filter(u => (u.langs || []).map(x => (x || "").toLowerCase()).includes(t));
  }, [profiles, langFilter]);
  


  const toggleRequest = (id) => {
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openProfile = (user) => {
    navigate(`/friendfind/${user.id}`, { state: { user } });
  };

  // 빈 목록 시
  const EmptyState = () => (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ marginBottom: 12 }}>조건에 맞는 프로필이 없습니다. 😥</div>
      <div style={{ fontSize: 13, color: "#888" }}>
        사이드바에서 언어를 바꾸거나, 필터를 완화해 보세요.
      </div>
    </div>
  );

  return (
    <>
      <BoardNav active="match" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
          <FindFriendSidebar />
          <section
            style={{
              background: "#ffffff",
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 0,
            }}
          >
            {visibleUsers.length === 0 ? ( 
              <EmptyState />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  padding: 16,
                }}
              >
                {visibleUsers.map((u) => (
                  <ProfileCard
                    key={u.id}                       // CHANGED
                    user={u}                         // (id,name,langs,country,bio,tags,img) 사용
                    requested={requested.has(u.id)}  // CHANGED
                    onToggleRequest={() => toggleRequest(u.id)} // CHANGED
                    onClick={() => openProfile(u)}   // CHANGED
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </>
  );
}
/*
export default function FriendFindPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requested, setRequested] = useState(() => new Set());
  const [langFilter, setLangFilter] = useState("Korean");

  useEffect(() => {
    const lang = searchParams.get("lang");
    if (lang) setLangFilter(lang);
  }, [searchParams]);

  const visibleUsers = useMemo(() => {
    if (langFilter === "All") return USERS;
    return USERS.filter((u) =>
      u.langs.map((x) => x.toLowerCase()).includes(langFilter.toLowerCase())
    );
  }, [langFilter]);

  const toggleRequest = (id) => {
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openProfile = (user) => {
    navigate(`/friendfind/${user.id}`, { state: { user } });
  };
{visibleUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                }}
              > 
                {visibleUsers.map((u) => (
                  <ProfileCard
                    key={u.id}
                    user={u}
                    requested={requested.has(u.id)}
                    onToggleRequest={() => toggleRequest(u.id)}
                    onClick={() => openProfile(u)}
                  />
                ))}
              </div>
            )}
  return (
    <>
      <BoardNav active="match" />
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
          <FindFriendSidebar />
          <section
            style={{
              background: "#ffffff",
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 0,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {visibleUsers.map((u) => (
                <ProfileCard
                  key={u.id}
                  user={u}
                  requested={requested.has(u.id)}
                  onToggleRequest={() => toggleRequest(u.id)}
                  onClick={() => openProfile(u)} 
                />
              ))}
            </div>
          </section>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </>
  );
}*/
