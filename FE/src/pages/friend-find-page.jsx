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
      id: 4, 
      name: "Angella", 
      langs: ["English", "Korean"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["중국", "컴퓨터공학", "친목"], 
      img: `/images/profile-4.jpg`
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
      id: 6, 
      name: "Heejin", 
      langs: ["English", "Korean"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["태국", "컴퓨터공학", "친목"], 
      img: `/images/profile-6.jpg`
    },
    { 
      id: 7, 
      name: "Angella", 
      langs: ["English", "Korean"], 
      country: "United States", 
      bio: "Hi, I'm Angella! Let's be friends", 
      tags: ["일본", "컴퓨터공학", "친목"], 
      img: `/images/profile-7.jpg`
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
export default function FriendFindPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requested, setRequested] = useState(() => new Set());
  const [langFilter, setLangFilter] = useState("Korean");
  const [profiles, setProfiles] = useState([]);
  const [usedMock, setUsedMock] = useState(false);
  const abortRef = useRef();

  // URL ?lang= 읽기
  useEffect(() => {
    const lang = searchParams.get("lang");
    if (lang) setLangFilter(lang);
  }, [searchParams]);

  // API 호출
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await api.get("/api/friend-matching/profiles", {
          params: { language: langFilter },
          signal: controller.signal,
        });
        const arr = Array.isArray(res.data)
          ? res.data
          : (res.data?.content || res.data?.profiles || []);

        const mapped = arr.map((p) => ({
          id: p.id ?? p.userId ?? p.profileId ?? p.idx,
          name: p.nickname ?? p.name ?? "",
          langs: Array.isArray(p.languages) && p.languages.length > 0
            ? p.languages
            : [p.studyLanguage].filter(Boolean),
          country: p.nationality ?? p.country ?? "",
          bio: p.bio ?? p.intro ?? "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          img: p.profileImageUrl ?? p.avatarUrl ?? "/images/default-profile.png",
          _raw: p,
        }));

        setProfiles(mapped);
        setUsedMock(false);
      } catch (_) {
        // 에러 시 메시지 없이 무시
      }
    })();

    return () => controller.abort();
  }, [langFilter]);

  const visibleUsers = useMemo(() => {
    if (langFilter === "All") return profiles;
    return profiles.filter((u) =>
      (u.langs || []).map((x) => (x || "").toLowerCase()).includes(langFilter.toLowerCase())
    );
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

  // 빈 목록 시 → 데모 버튼
  const EmptyState = () => (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ marginBottom: 16 }}>
        조건에 맞는 프로필이 없습니다.
      </div>
      <button
        type="button"
        onClick={() => { setProfiles(USERS); setUsedMock(true); }}
        style={{ padding: "8px 14px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
      >
        데모 데이터 보기
      </button>
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
