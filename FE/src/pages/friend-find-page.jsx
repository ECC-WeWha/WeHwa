// src/pages/FriendMatchingPage.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import ProfileCard from "../components/board/profilecard.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FindFriendSidebar from "../components/sidebar/friend-find-sidebar.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";

import { api } from "../api/client";

const USERS = [
    { 
      id: 2, 
      name: "Angella", 
      langs: ["English"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["미국", "컴퓨터공학", "친목"], 
      img: `/images/profile-2.jpg`
    },
    { 
      id: 3, 
      name: "Angella", 
      langs: ["Finnish", "Korean"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["영국", "컴퓨터공학", "친목"], 
      img: `/images/profile-3.jpg`
    },
    { 
      id: 5, 
      name: "Angella", 
      langs: ["English", "Burmese"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["스페인", "컴퓨터공학", "친목"], 
      img: `/images/profile-5.jpg`
    },
    { 
      id: 8, 
      name: "Lalisa", 
      langs: ["Thai"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["일본", "컴퓨터공학", "친목"], 
      img: `/images/profile-8.jpg`
    }
  ]
  ;

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
          const mapped = raw.map((p) => ({ // CHANGED
            id: p.userId,                                   // CHANGED
            name: p.nickname,                               // CHANGED
            langs: [p.languageName, p.studyLanguageName].filter(Boolean), // CHANGED
            country: p.region,                              // CHANGED
            bio: p.introduction,                            // CHANGED
            tags: [p.major, p.purpose].filter(Boolean),     // CHANGED
            img: normalizeImg(p.profileImage),              // CHANGED
            // ⬇️ 기존 코드들이 쓸 수도 있는 원본/추가 필드는 보존
            ...p,                                           // NEW (friendRequested, friend 등 유지)
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
