import React,{useState}from "react"
import InputBox from "../components/common/InputBox";
import SelectBox from "../components/common/Select";
import RadioBox from "../components/common/Radio";
import GreenButton from "../components/common/GreenButton";
import { useNavigate } from "react-router-dom";   

function ProfileSetupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nativeLanguage: "",
        targetLanguage: "",
        purpose: "",
        bio: "",
    });

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSave = () => {

        fetch(`${import.meta.env.VITE_API_BASE_URL}/friend-match/settings/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), //문자열로 보낸다
        });

        navigate("/friendfind", { replace: true });
    };
    
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
                { value: "english", label: "English" },
                { value: "korean",  label: "Korean" },
                { value: "japanese",label: "Japanese" },
                { value: "chinese", label: "Chinese" },
                { value: "thai",    label: "Thai" },
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
                { value: "english", label: "English" },
                { value: "korean",  label: "Korean" },
                { value: "japanese",label: "Japanese" },
                { value: "chinese", label: "Chinese" },
                { value: "thai",    label: "Thai" },
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
                        { value: "friendship", label: "친목" },
                        { value: "language_exchange", label: "언어교류" },
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

        <GreenButton  text="저장하기" onClick={handleSave}></GreenButton>
    </div>
);
}
export default ProfileSetupPage;