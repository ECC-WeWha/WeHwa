
import React, { useState,useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import BoardNav from "../components/top-nav/top-nav.jsx";
import ProfileSidebar from "../components/sidebar/profile-sidebar.jsx";
import "../styles/signup.css";
import GreenButton from "../components/common/GreenButton.jsx";
import {api} from "../api/client.js";

export default function ProfilePage() {

const location = useLocation();
const navigate = useNavigate(); 
const [formData, setFormData] = useState({  //DB에서 받
    userId: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    name: "",
    email: "",

    nationality: "",
    studentStatus: "",
    grade: "",
    birthYear: "",

    nativeLanguage: "",
    kakao: "",
    instagram: "",
    bio:""
});  
const green = "#00664F";
const [originalData, setOriginalData] = useState(null); //취소 시 복구용
const [isEditing, setIsEditing] = useState(false);      //읽기/편집 토글
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    // 1) 쿼리스트링으로 편집 모드 여부 확인
    const q = new URLSearchParams(location.search);
    const edit = q.get("edit");
    setIsEditing(!!edit && ["1", "true", "yes"].includes(edit.toLowerCase()));
    // 2) 프로필 로딩
    let isMounted = true;
    (async () => {
        /*
        try {

            const res = await api.get("/api/users/me");
            console.log("응답:", res.data); // 🔍 실제 응답 구조 확인
        } catch (e) {
            console.log(localStorage);
            console.error("에러 전체:", e); // 🔍 전체 에러 객체 확인 // 🔥 에러 메시지 확인
        }
        */
        try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/users/me");
        console.log("응답:", res.data); // 실제 구조 확인

        const data = res.data?.data ?? res.data;
        //const data = 
        const mappedData = {
            userId: data.userId,
            email: data.email,
            nickname: data.nickname,
            name: data.name,
            birthYear: data.birthYear,
            studentStatus: data.status,
            nationality: data.nationality,
            grade: data.year,
            major: data.major,                     // ✅ 추가
            nativeLanguage: data.language,
            studyLanguage: data.studyLanguage,     // ✅ 추가
            kakao: data.kakaoId,
            instagram: data.instaId,
            bio: data.introduction,
        };
        if (isMounted) {
            setFormData(mappedData);
            setOriginalData(mappedData);
        }
    } catch (e) {

        console.log(localStorage);
        console.error("에러 전체:", e);
        if (isMounted) setError(e.message || "로드 중 오류가 발생했습니다.");
    } finally {
        if (isMounted) setLoading(false);
    }
    })();

    return () => {
        isMounted = false;
    };
}, [location.search]);


const onChange = (e) => {  //입력
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
};
const startEdit = () => {  //편집시작
    setIsEditing(true);
    navigate("/profile?edit=1");
};
const cancelEdit = () => { //취소(원상복구)
    if (originalData) setFormData(originalData);
    setIsEditing(false);
    navigate("/profile");
};
const onSubmit = async () => {
    try {
      // 백엔드가 받는 필드만 골라서 payload로 구성
        const payload = {
        nickname: formData.nickname,
        name: formData.name,
        birthYear: formData.birthYear,
        major: formData.major,
        language: formData.language,
        studyLanguage: formData.studyLanguage,
        kakaoId: formData.kakaoId,
        instaId: formData.instaId,
        introduction: formData.introduction
    };
        await api.patch("/api/users/me", payload); // ✅ payload를 함께 보냄
        alert("저장 완료");
        setOriginalData(formData);
        setIsEditing(false);
        navigate("/profile");
    } catch (e) {
        alert(e.message || "저장 중 오류가 발생했습니다.");
    }
};
/*
const onSubmit = async () => {
    try {
        await api.patch("/api/users/me");
        alert("저장 완료");
        setOriginalData(formData);
        setIsEditing(false);
        navigate("/profile");
    } catch (e) {
    alert(e.message || "저장 중 오류가 발생했습니다.");
    }
};*/
const fieldProps = (name) => ({  //이건 뭐시여
    name,
    value: formData[name] || "",
    onChange,
    disabled: !isEditing,
    style: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
    boxSizing: "border-box",
    },
});
const Row = ({ label, name, type = "text", renderView }) => {
    return (
    <div
        style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        alignItems: "center",
        padding: "10px 0",
        marginTop:"70px",
        gap:"70px"
        }}
    >
        <div className="signup-green-text">
        {label}
        </div>
        {!isEditing ? (
        <div
            className="profile-light-green"
            style={!formData[name] ? { color: "#9E9E9E" } : undefined}
        >
        {renderView
        ? renderView(formData[name])
        : (formData[name] ? (type === "password" ? "••••••" : formData[name]) : "미입력")}
        </div>
        ) : (
          // 편집 모드: input/textarea
        type === "textarea" ? (
            <textarea rows={4}  {...fieldProps(name)} />
        ) : (
            <input type={type}  {...fieldProps(name)} />
        )
        )}
    </div>
    );
};


if (error)   return <div style={{ padding: 24, color: "red" }}>{error}</div>;

return (
    <div
    style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",        
        gridTemplateColumns: "280px 1fr",     
        height: "100vh",
        backgroundColor: "#fff",
    }}
    >
      {/* 헤더 고정 */}
    <div style={{ gridColumn: "1 / 3", position: "sticky", top: 0, zIndex: 10 }}>
        <BoardNav />
    </div>
      {/* 사이드바 고정 */}
    <aside
        style={{
            borderRight: "1px solid #eee",
            marginTop:"50px",
            position: "sticky",
            top: 64,
            alignSelf: "start",
            height: `calc(100vh - 64px)`,
            overflow: "hidden", // 사이드바는 스크롤 없음
        }}
    >
        <ProfileSidebar />
    </aside>
      {/* 메인만 스크롤 */}
    <main
        style={{
        overflowY: "auto",
        height: `calc(100vh - 64px)`,
        padding: "24px 56px",
        }}
    >
    <h2 style={{ fontSize: 40, fontWeight: "bold", color: green, margin: 0, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            나의 프로필
    </h2>
    <div style={{ maxWidth: 720, marginTop:"100px"}}>

        <Row label="아이디" name="userId" />
        <Row label="비밀번호" name="password" type="password"  />
        <Row label="비밀번호 확인" name="passwordCheck" type="password"  />

        <Row label="닉네임" name="nickname"  />
        <Row label="이름" name="name"  />
        <Row label="이메일" name="email" type="email"  />

        <Row label="국적" name="nationality" />
        <Row label="학적" name="studentStatus"/>
        <Row label="학년" name="grade" />
        <Row label="출생년도" name="birthYear"  />

        <Row label="모국어" name="nativeLanguage" />
        <Row label="카카오 ID" name="kakao"  />
        <Row label="인스타" name="instagram"  />
        <Row label="자기소개" name="bio"  />

    </div>
    <div style={{ display: "flex", gap: 8, marginBottom: 16,marginTop:40 }}>
        {!isEditing ? (
            <GreenButton text="수정" onClick={startEdit}></GreenButton>
        ) : (
            <>
            <GreenButton text="저장" onClick={onSubmit}></GreenButton>
            <GreenButton text="취소" onClick={cancelEdit}></GreenButton>
            </>
        )}
    </div>
    <div style={{ height: 80 }} />
    </main>
    </div>
);
}