import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSetupPage from "../pages/friend-profile-page";


function FriendFindPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    
    useEffect(() => {
        let alive = true;
    
        (async () => {
            try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/friend-match/settings/me`,
                { credentials: "include" }
            );
    
            if (res.status === 404) {
                navigate("/profilesetup", {
                    replace: true,
                    state: { from: "/friendfind" },
                    });
                return;
                }
            if (!res.ok) throw new Error("설정 조회 실패");
            const json = await res.json();
            if (alive) setSettings(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            if (alive) setLoading(false);
        }
        })();

        return () => {
        alive = false;
        };
    }, [navigate]);

    if (loading) return <div>로딩 중…</div>;
    if (!settings) return null;
    
    
    
    
    {/*
    const [formData, setFormData] = useState({
        nativeLanguage: "",
        targetLanguage: "",
        purpose: "",
        bio: "",
    });
    useEffect(() => {
        async function checkSettings() {
        try {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/friend-match/settings/me`,
        );
        if (res.status === 404) {
          // 설정 없으면 프로필 입력 페이지로 이동
            navigate("/profilesetup", { replace: true });
        return;
        }
        if (!res.ok) throw new Error("설정 조회 실패");
        const json = await res.json();
        setSettings(json.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    }
    checkSettings();
    }, [navigate]);
    if (!settings) {
        return (
            <ProfileSetupPage
            formData={formData}
            setFormData={setFormData}
            />
        );
    } */}





return (
    <div style={{ fontFamily: "'IBM Plex Sans KR', sans-serif" }}>
        <h1>친구 매칭</h1>
    </div>
    );
}

export default FriendFindPage;



