import React, { useEffect, useState } from "react";
import ProfileCardMini from "../components/board/profilecardmini.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import { useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
/*
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
]
*/ //다 버리기엔 아까워서 하나씩만 남겨놓
const border = "#ffffff";
const BASE = (import.meta.env.VITE_REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
//백엔드 가져오기

export default function FriendListPage() {
    const navigate = useNavigate();
    const isRequests = useMatch("/friendlist/requests") !== null;
    const context = isRequests ? "requests" : "list";

    const [friends, setFriends] = useState([]); //백엔드꺼
    const [requests, setRequests] = useState([]); //흠 주소가 friend-requensts 이긴 했는데

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
    //공통 매퍼..?
    const mapUser = (u) => ({
        id: u.id ?? u.userId,
        name: u.nickname ?? u.name,
        langs: u.languages ?? u.langs ?? [],
        country: u.country,
        bio: u.bio,
        tags: u.tags ?? [],
        img: u.profileImage ?? u.img,
    });

    // 데이터 로드
    useEffect(() => {
        (async () => {
        try {
        const [fRes, rRes] = await Promise.all([
            axios.get(`${BASE}/api/friends`, { withCredentials: true }),
            axios.get(`${BASE}/api/friend-requests`, { withCredentials: true }),
        ]);
        const fData = Array.isArray(fRes.data?.data) ? fRes.data.data : fRes.data || [];
        setFriends(fData.map(mapUser));
        const rRaw = Array.isArray(rRes.data?.data) ? rRes.data.data : rRes.data || [];
        const rData = rRaw.map((r) => ({
            requestId: r.requestId ?? r.id,   // 백엔드 키명에 맞게 보정
            user: mapUser(r.requester ?? r.user ?? r),
        }));
        setRequests(rData);
        } catch (e) {
        alert("친구/요청 데이터를 불러오지 못했습니다.");
        setFriends([]);
        setRequests([]);
    }
    })();
}, []);


    /*
    const getAcceptedSet = () => new Set(JSON.parse(sessionStorage.getItem("accepted_ids") || "[]")); 
    const getRejectedSet = () => new Set(JSON.parse(sessionStorage.getItem("rejected_ids") || "[]"));
    const getDeletedSet = () => new Set(JSON.parse(sessionStorage.getItem("deleted_friend_ids") || "[]"));
    const accepted = getAcceptedSet();  
    const rejected = getRejectedSet();
    const deleted = getDeletedSet(); */
    
    const acceptRequest = async (requestId) => {
        const target = requests.find((r) => r.requestId === requestId);
        if (!target) return;
        // UI 먼저 반영
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        setFriends((prev) => [...prev.filter((p) => p.id !== target.user,id), target.user]);
        try {
            await axios.post(`${BASE}/api/friend-requests/${requestId}/accept`, null, { withCredentials: true });
        } catch (e){
          // 롤백
            setFriends((prev) => prev.filter((u) => u.id !== traget.user.id));
            setRequests((prev) =>[target,...prev]);
            alert("수락에 실패했습니다.");
        }
    ;

    const rejectRequest = async (requestId) => {
        const prevRequests = requests;
        setRequests((prev) => prev.filter((u) => u.requestId !== requestId));
        try {
            await axios.post(`${BASE}/api/friends-requests/${requestId}/reject`, null, { withCredentials: true });
        } catch (e) {
            setRequests(prevRequests);
            alert("거절에 실패했습니다.");
        }
    };
    const deleteFriend = async (userId) => {
        const prevFriends = friends;
        setFriends((prev) => prev.filter((u) => u.id !== userId));
        try {
            await axios.delete(`${BASE}/api/friends/${userId}`, { withCredentials: true });
        } catch {
            setFriends(prevFriends);
            alert("삭제에 실패했습니다.");
        }
    };
    const DATA = isRequests ? requests.map((r) => ({ ...r.user, _requestId: r.requestId }))  :friends;


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
}
