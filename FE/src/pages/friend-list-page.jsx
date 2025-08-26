import React, { useEffect, useState } from "react";
import ProfileCardMini from "../components/board/profilecardmini.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import { useMatch, useNavigate } from "react-router-dom";
//import axios from "axios";
import {api} from "../api/client.js";
const ENDPOINTS = {
    friends: "/api/friend-requests",
    requests: "/api/friend-requests/received",
    };
const border = "#ffffff";

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
        country: u.region ?? "",
        bio: u.introduction ?? u.bio ?? "",
        tags: u.tags ?? [],
        img: u.profileImage ?? u.img,
    });

    // 데이터 로드
    useEffect(() => {
        (async () => {
        try {
        const [fRes, rRes] = await Promise.all([
        api.get(ENDPOINTS.friends),
        api.get(ENDPOINTS.requests),
        ]);


        const fData = Array.isArray(fRes.data?.data) ? fRes.data.data : fRes.data || [];
        setFriends(fData.map(mapUser));
        const rRaw = Array.isArray(rRes.data?.data) ? rRes.data.data : rRes.data || [];
        const rData = rRaw.map((r) => ({
            requestId: r.requestId ?? r.id,   // 백엔드 키명에 맞게 보정
            user: mapUser(r.requester ?? r.user ?? r),
        }));
        setRequests(rData);
        } 
        catch (_) {
            //const s = e?.response?.status;
            //if (s === 401) alert("로그인이 필요합니다. 🔑");
            //else if (s === 403) alert("접근 권한이 없습니다. 🛑");
            //else alert("친구/요청 데이터를 불러오지 못했습니다.");
        //console.error("친구 목록 실패:", e?.response?.status, e?.response?.data || e?.message);
        //alert("친구/요청 데이터를 불러오지 못했습니다.");
        //setFriends([]);
        //setRequests([]);
        }
    })();
}, []);


    
    const acceptRequest = async (requestId) => {
        const target = requests.find((r) => r.requestId === requestId);
        if (!target) return;
        const prevRequests = requests; /////
        const prevFriends = friends;   /////
        // UI 먼저 반영
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        setFriends((prev) => [...prev.filter((p) => p.id !== target.user.id), target.user]);
        try {
            await api.post(`/api/friend-requests/${requestId}/accept`);
            //await axios.post(`${BASE}/api/friend-requests/${requestId}/accept`, null, { withCredentials: true });
        } catch (_){ //여기 왜 이거일까나
          // 롤백
            setFriends(prevFriends);
            setRequests(prevRequests);
            ///setFriends((prev) => prev.filter((u) => u.id !== target.user.id));
            ///setRequests((prev) =>[target,...prev]);
            alert("수락에 실패했습니다.");
        }
    ;

    const rejectRequest = async (requestId) => {
        const prevRequests = requests;
        setRequests((prev) => prev.filter((u) => u.requestId !== requestId));
        try {
            await api.post(`/api/friend-requests/${requestId}/reject`);
            
        } catch (_) {
            setRequests(prevRequests);
            alert("거절에 실패했습니다.");
        }
    };
    const deleteFriend = async (userId) => {
        const prevFriends = friends;
        setFriends((prev) => prev.filter((u) => u.id !== userId));
        try {
            await api.delete(`/api/friends/${userId}`);
        } catch {
            setFriends(prevFriends);
            alert("삭제에 실패했습니다.");
        }
    };
    const DATA = isRequests ? requests.map((r) => ({ ...r.user, _requestId: r.requestId }))  :friends;

      // 빈목록 → 데모 버튼
  const EmptyState = () => (
    <div style={{ padding: 40, textAlign: "center" }}>
      <button
        type="button"
        onClick={() => {
          if (isRequests) {
            setRequests(REQUESTS.map((u, i) => ({ requestId: 1000 + i, user: u })));
          } else {
            setFriends(FRIENDS);
          }
        }}
        style={{ padding: "8px 14px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
      >
        데모 데이터 보기
      </button>
    </div>
  );

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
            {DATA.length === 0 ? (
              <EmptyState />
            ) : (
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
                    onAccept={u._requestId ? () => acceptRequest(u._requestId) : undefined}
                    onReject={u._requestId ? () => rejectRequest(u._requestId) : undefined}
                    onDelete={!u._requestId ? () => deleteFriend(u.id) : undefined}
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
}
