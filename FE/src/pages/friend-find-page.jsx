// src/pages/FriendMatchingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProfileCard from "../components/board/profilecard.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FindFriendSidebar from "../components/sidebar/friend-find-sidebar.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";

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
}
