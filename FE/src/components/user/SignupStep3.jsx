import React from "react"

import { useNavigate } from "react-router-dom";
import InputBox from "../common/InputBox"
import GreenButton from "../../components/common/GreenButton";

function Step3Form({ formData, onChange,backStep}){
    const navigate = useNavigate();
    //이 아래에 api관련 데이터 전송하는거 추가 할 예정
    const handleSignup = () => {
        navigate("/login");
    };

    return (
        <>
            <h2>여기에 체크박스 만들꺼임 근데 그건 아직</h2>

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