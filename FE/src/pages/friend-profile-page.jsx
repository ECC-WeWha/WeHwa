import React,{useState}from "react"
import InputBox from "../components/common/InputBox";
import SelectBox from "../components/common/Select";
import RadioBox from "../components/common/Radio";
import GreenButton from "../components/common/GreenButton";
import { useNavigate } from "react-router-dom";   

import { api } from "../api/client";

function ProfileSetupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nativeLanguage: "",
        targetLanguage: "",
        purpose: "",
        bio: "",
        /////
        topik:"",
        major:"",
        kakao: "",
        instagram: "",
    });
    const isValid = !!(
        formData.nativeLanguage &&
        formData.targetLanguage &&
        formData.purpose &&
        formData.bio
      ); // NEW

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSave = async () => {
        // NEW: 클라이언트단 하드가드
        if (!isValid) {
          alert("모국어, 학습언어, 목적, 자기소개를 모두 입력해주세요.");
          return;
        }

        const koreanTopicScore =
        formData.topik !== "" && formData.topik !== null
            ? Number(formData.topik)
            : undefined;
        if (koreanTopicScore !== undefined && Number.isNaN(koreanTopicScore)) {
        alert("한국어 토픽 점수는 숫자로 입력해주세요.");
        return;
    }

        // 서버 요구 스키마로 페이로드 구성
        const payload = {
            languageName: formData.nativeLanguage,        // 예: "Thai"
            studyLanguageName: formData.targetLanguage,   // 예: "Korean"
            purpose: formData.purpose,                    // "Friendship" | "Language exchange"
            introduction: formData.bio?.trim(),
            koreanTopicScore,                             // 숫자 또는 undefined
            major: formData.major || undefined,
            kakaoId: formData.kakaoId || undefined,
            instaId: formData.instaId || undefined,
          };
        try {
          // CHANGED: 그대로 전송(추가 매핑 없음)
          const response = await api.post("/api/friend-matching/settings", payload);
          console.log("프로필 설정 완료:", response.data);
          navigate("/friendfind", { replace: true });
        } catch (error) {
          console.error("프로필 설정 실패:", error);
          alert("프로필 설정 중 오류가 발생했습니다. 로그인 상태를 확인해주세요.");
        }
      };
    
    /*
    const handleSave = () => {

        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend-match/settings/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), //문자열로 보낸다
        });

        navigate("/friendfind", { replace: true });
    };*/
    
return (
    <div style={{display:"flex",width:"737px",marginTop:"250px",marginLeft:"330px",flexDirection: "column",gap:"60px" }}>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center"}}>
            <div className="label-title">모국어</div>
            <SelectBox
                style={{ width: "200px",marginRight:"230px" }}
                name="nativeLanguage"
                value={formData.nativeLanguage}
                placeholder=""
                onChange={onChange}
                options={[
                    { value: "English", label: "English" },
                    { value: "Korean", label: "Korean" },
                    { value: "Japanese", label: "Japanese" },
                    { value: "Chinese", label: "Chinese" },
                    { value: "Thai", label: "Thai" },
                    { value: "French", label: "French" },
                    { value: "German", label: "German" },
                    { value: "Spanish", label: "Spanish" },
                    { value: "Vietnamese", label: "Vietnamese" },
                    { value: "Russian", label: "Russian" },
                ]} />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center"}}>
            <div className="label-title">학습언어</div>
            <SelectBox
                style={{ width: "200px",marginRight:"230px"}}
                name="targetLanguage"
                value={formData.targetLanguage}
                placeholder=""
                onChange={onChange}
                options={[
                    { value: "English", label: "English" },
                    { value: "Korean", label: "Korean" },
                    { value: "Japanese", label: "Japanese" },
                    { value: "Chinese", label: "Chinese" },
                    { value: "Thai", label: "Thai" },
                    { value: "French", label: "French" },
                    { value: "German", label: "German" },
                    { value: "Spanish", label: "Spanish" },
                    { value: "Vietnamese", label: "Vietnamese" },
                    { value: "Russian", label: "Russian" },
                ]}
                
            />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center"}}>
            <div className="label-title">목적</div>
            <div style={{gap:"60px",marginRight:"140px",display:"flex"}}>
                <RadioBox
                    style={{ display: "flex", alignItems: "center", gap: "50px" }}
                    name="purpose"
                    value={formData.purpose}
                    onChange={onChange}
                    options={[
                        { value: "Friendship", label: "친목" },
                        { value: "Language exchange", label: "언어교류" },
                    ]}
                />
            </div>
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom:"50px"}}>
            <div className="label-title">자기소개</div>
            <InputBox
                type="text"
                name="bio"
                value={formData.bio}
                placeholder="자기소개를 입력해주세요."
                onChange={onChange}
            />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom:"50px"}}>
            <div className="label-title">한국어 토픽</div>
            <InputBox
                type="number"
                name="topik"
                value={formData.topik}
                placeholder="토픽 점수를 입력해주세요."
                onChange={onChange}
            />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom:"50px"}}>
            <div className="label-title">전공</div>
            <InputBox
                type="text"
                name="major"
                value={formData.major}
                placeholder="전공을 입력해주세요."
                onChange={onChange}
            />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom:"50px"}}>
            <div className="label-title">카카오 ID</div>
            <InputBox
                type="text"
                name="kakaoId"
                value={formData.kakaoId}
                placeholder="카카오 ID를 입력해주세요."
                onChange={onChange}
            />
        </div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom:"50px"}}>
            <div className="label-title">인스타 ID</div>
            <InputBox
                type="text"
                name="instaId"
                value={formData.instaId}
                placeholder="인스타 ID를 입력해주세요."
                onChange={onChange}
            />
        </div>

        <GreenButton  text="저장하기" onClick={handleSave} disabled={!isValid}></GreenButton>
    </div>
);
}
export default ProfileSetupPage;

/*{ value: "1", label: "English" },
                { value: "2",  label: "Korean" },
                { value: "3",label: "Japanese" },
                { value: "4", label: "Chinese" },
                { value: "10",    label: "Thai" },
                { value: "5",    label: "French" },
                { value: "6",    label: "German" },
                { value: "7",    label: "Spanish" },
                { value: "8",    label: "Vietnamese" },
                { value: "9",    label: "Russian" },*/