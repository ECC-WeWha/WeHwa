import React, { useEffect, useState, useRef } from "react";
import ProfileCardMini from "../components/board/profilecardmini.jsx";
import BoardNav from "../components/top-nav/top-nav.jsx";
import FriendListSidebar from "../components/sidebar/friend-list-sidebar.jsx";
import { useMatch, useNavigate, useLocation } from "react-router-dom";
//import axios from "axios";
import {api} from "../api/client.js";
const ENDPOINTS = {
    friends: "/api/friend-requests",
    requests: "/api/friend-requests/received",
    };
const border = "#ffffff";
const DEFAULT_IMG = "/images/profile.png"; 
const getId = (x) => x?.userId ?? x?.senderId ?? x?.id;                 // NEW
function mapUser(p = {}) {
  return {
    id: getId(p),
    name: p.nickname,
    langName: p.languageName,                        // 모국어
    langs: [p.studyLanguageName].filter(Boolean),    // 학습언어(단일)
    major: p.major,
    tags: [p.purpose].filter(Boolean),               // 목적만 태그로
    bio: p.introduction,
    img: normalizeImg(p.profileImage),
    region: p.region,
    topik: p.topik ?? p.koreanTopic ?? p.koreanTopicScore ?? null,
    education: p.studentStatus ?? p.education ?? p.grade ?? null,
    kakao: p.kakaoId ?? null,
    instagram: p.instagramId ?? null,
    // 원본도 보존 (필요시 접근)
    ...p,
  };
}

function normalizeImg(src) {
    // ✅ null/빈 문자열이면 기본 이미지로 대체
    if (!src) return DEFAULT_IMG;                    // CHANGED
    if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
    return `/images/${src}`;
  }

export default function FriendListPage() {
    const navigate = useNavigate();
    const isRequests = useMatch("/friendlist/requests") !== null;
    const context = isRequests ? "requests" : "list";
    ////
    const { pathname } = useLocation(); // [DEBUG]

    const [friends, setFriends] = useState([]); //백엔드꺼
    const [requests, setRequests] = useState([]); //흠 주소가 friend-requensts 이긴 했는데
    const abortRef = useRef(); 

    const [favorites, setFavorites] = useState(() => new Set());
    const toggleFavorite = (id) => {
        setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });
    }

    const openProfile = (user) => {
      if (!user) return;
      const id = getId(user);                                          // NEW
      navigate(`/friendlist/${id}`, {
        state: { user, mode: isRequests ? "requests" : "friends" },    // CHANGED: raw user 그대로
      });
    };

    useEffect(() => {
      
        if (abortRef.current) abortRef.current.abort();        
        const controller = new AbortController();             
        abortRef.current = controller;                         
    
        (async () => {
          try {
            const [fr, rr] = await Promise.allSettled([
              api.get(ENDPOINTS.friends, { signal: controller.signal }),
              api.get(ENDPOINTS.requests, { signal: controller.signal }),
            ]);
            if (fr.status === "fulfilled") {
              const rawFriends = Array.isArray(fr.value?.data?.data)
            ? fr.value.data.data
            : Array.isArray(fr.value?.data) ? fr.value.data : [];
            const mappedFriends = rawFriends.map(mapUser); 
            setFriends(mappedFriends);                                     // CHANGED: 매핑 제거
          } else {
            setFriends([]);
          }
    
            if (rr.status === "fulfilled") {
              const rawReq = Array.isArray(rr.value?.data?.data)
                ? rr.value.data.data
                : Array.isArray(rr.value?.data) ? rr.value.data : [];
                const mappedReq = rawReq.map((r) => ({
                  requestId: r.requestId ?? r.id ?? r.senderId, // 요청 고유키
                  ...mapUser(r),                                 // 유저 필드 매핑
                }));
                setRequests(mappedReq);                                        // CHANGED: 매핑 제거
                } else {
              setRequests([]); 
            }
          } catch (_) {
            setFriends([]);   
            setRequests([]);  
          }
        })();
    
        return () => controller.abort();                       // NEW
      }, [isRequests]);
  
    
    const acceptRequest = async (requestId) => {
        const prevRequests = requests; /////
        const prevFriends = friends;   /////

        const target = requests.find((r) => r.requestId === requestId);
        if (!target) return;
        const targetUserId = getId(target);                               // CHANGED
          setRequests((prev) => prev.filter((r) => getReqId(r) !== requestId));
          setFriends((prev) => [...prev.filter((p) => getId(p) !== targetUserId), target]);
        try {
            await api.post(`/api/friend-requests/${requestId}/accept`);
        } catch (_){ //여기 왜 이거일까나
          // 롤백
            setFriends(prevFriends);
            setRequests(prevRequests);
            alert("수락에 실패했습니다.");
        }
    };

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
    const EmptyState = () => (
        <div style={{ padding: 40, textAlign: "center" }}>
          친구목록이 없습니다. 😥
          <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
            친구매칭을 통해 친구를 추가해보세요.
          </div>
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
            {!isRequests && (
              friends.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                }}
            >
            {friends.map((u) => (
                <ProfileCardMini
                key={u.id}
                user={u}                                   // 매핑된 유저
                requested={favorites.has(u.id)}
                onToggleRequest={() => toggleFavorite(u.id)}
                onClick={() => openProfile(u)}
                context={context}
                onDelete={() => deleteFriend(u.id)}
                />
            ))}
            </div>
            )
        )}
        {isRequests && (
              requests.length === 0 ? (
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
                  {requests.map((r) => (
                      <ProfileCardMini
                      key={r.requestId}
                      user={r}                                   // {requestId, ...유저필드}
                      requested={favorites.has(r.id)}
                      onToggleRequest={() => toggleFavorite(r.id)}
                      onClick={() => openProfile(r)}
                      context={context}
                      onAccept={() => acceptRequest(r.requestId)}
                      onReject={() => rejectRequest(r.requestId)}   // CHANGED
                      />
                  
                  ))}
                </div>
                )
            )}
        </section>
      </div>
    </div>
    <div style={{ height: 40 }} />
  </>
);
}
