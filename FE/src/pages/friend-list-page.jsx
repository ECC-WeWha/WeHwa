import React, { useEffect, useMemo, useState } from "react";
//import ProfileCard from "../components/board/profilecard.jsx";
import ProfileCardMini from "../components/board/profilecardmini.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import { useMatch, useNavigate } from "react-router-dom";

const FRIENDS = [
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
]
;
const REQUESTS = [
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
const border = "#ffffff";


export default function FriendListPage() {
    const navigate = useNavigate();
    const isRequests = useMatch("/friendlist/requests") !== null;
    const context = isRequests ? "requests" : "list";

    const [favorites, setFavorites] = useState(() => new Set());
    const toggleFavorite = (id) => {
        setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });
    }

    const openProfile = (user) => {
        navigate(`/friendlist/${user.id}`, { state: { user, mode: isRequests ? "requests" : "friends" } });
    };
    //친구 수락, 거절을 적용하기 위해
    const getAcceptedSet = () => new Set(JSON.parse(sessionStorage.getItem("accepted_ids") || "[]")); 
    const getRejectedSet = () => new Set(JSON.parse(sessionStorage.getItem("rejected_ids") || "[]"));
    const getDeletedSet = () => new Set(JSON.parse(sessionStorage.getItem("deleted_friend_ids") || "[]"));
    const accepted = getAcceptedSet();  
    const rejected = getRejectedSet();
    const deleted = getDeletedSet();
    
    const REQUESTS_VISIBLE = REQUESTS
    .filter(u => !rejected.has(u.id) && !accepted.has(u.id)); 
    //친구 추가하면 그게 친구 목록에 보이게
    const FRIENDS_AUG = FRIENDS
    .concat(REQUESTS.filter(u => accepted.has(u.id)))
    .filter((u, idx, arr) => idx === arr.findIndex(x => x.id === u.id))
    .filter(u => !deleted.has(u.id));

    const DATA = isRequests ? REQUESTS_VISIBLE : FRIENDS_AUG;


return (
    <>
    <BoardNav active="list" />

    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
            <FriendListSidebar />
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
              {DATA.map((u) => (
                <ProfileCardMini
                    key={u.id}
                    user={u}
                    requested={favorites.has(u.id)}
                    onToggleRequest={() => toggleFavorite(u.id)}
                    onClick={() => openProfile(u)}
                    context={context}
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
