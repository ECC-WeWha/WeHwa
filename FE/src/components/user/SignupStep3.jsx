import React from "react"

import { useNavigate } from "react-router-dom";
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";
import "../../styles/signup.css";


//맨위에꺼 선택하면 아래 자동 선택되는건 아직...
function Step3Form({ formData, onChange,backStep}){
    const navigate = useNavigate();
    //이 아래에 api관련 데이터 전송하는거 추가 할 예정
    const handleSignup = () => {
        navigate("/login");
    };

    return (
        <>  
            <div style={{ width: "660px", margin: "0 auto"}}>
                <div className="signup-horizontal-div">
                    
                    <div style={{ display:"flex",alignItems:"center",gap:"8px"}}>
                        <input type="checkbox" className="custom-checkbox"/>
                        <div className="green-text-24px">전체 약관 동의</div>
                    </div>

                    <div style={{
                            fontFamily: "'IBM Plex Sans KR', sans-serif",
                            fontSize: "24px",
                            lineHeight: "100%",
                            color: "#36AE92",
                            textDecoration:'underline'
                            }}> 자세히 보기 &gt;&gt;
                    </div>
                </div>
                <div className="signup-horizontal-div">
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"58px",marginTop:"10px"}}>
                        <input type="checkbox" className="custom-checkbox"/>
                        <div className="green-text-24px">[필수] 만 14세 이상입니다.</div>
                    </div>
                </div>
                <div className="signup-horizontal-div">
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginLeft:"58px",marginTop:"10px"}}>
                        <input type="checkbox" className="custom-checkbox"/>
                        <div className="green-text-24px">[선택] 마케팅 정보 수신 및 선택적 개인정보 제공.</div>
                    </div>
                </div>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "500px",
                margin: "0 auto", }}>
                <GreenButton onClick={backStep} text="이전"></GreenButton>
                <GreenButton onClick={handleSignup} text="회원가입"></GreenButton>
            </div>
        </>
    );
}

export default Step3Form;