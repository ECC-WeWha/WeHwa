//회원가입하는 페이지

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import GreenButton from "../components/common/GreenButton.jsx";
import "../styles/signup.css";
import Step1Form from "../components/user/SignupStep1";
import Step2Form from "../components/user/SignupStep2";
import Step3Form from "../components/user/SignupStep3";

function SignupPage() { 
  const [step, setStep] = useState(1); //단계별로 바뀌는 페이지를 만들기 위해
  
  const [formData, setFormData] = useState({ //저장할 데이터들 회원가입 완료 되면 한번에 전송할 데이터
    userId: "",
    //loginId:"",
    password: "",
    passwordCheck: "",
    nickname: "",
    name: "",
    email: "",
    nationality: "",
    studentStatus: "",
    grade: "",
    birthYear: "",
    year:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));  //서버 관련 데이터 관련은 아직 없
  };

  const nextStep = () => {  //다음단계로 가기 위해서 
    setStep(step + 1);
  };
  const backStep =() => { //뒤로 가려고 만들
    setStep(step - 1);
  };

  return (
    <div style={{
      maxWidth: "1000px",  // 최대 너비 지정
      margin: "0 auto",   // 가운데 정렬
      padding: "0 20px",
    }}>
      <div style={{
          display : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",         // 가로 가운데
          minHeight: "100vh",
      }}>
        <div className="signup-title" style={{marginTop:"100px", marginBottom:"50px"}}>회원가입</div>

        <div style={{ display: "flex",gap: "45px",flexDirection: "column",width: "100%" }}>
          {step === 1 && <Step1Form formData={formData} onChange={handleChange} nextStep={nextStep}/>}
          {step === 2 && <Step2Form formData={formData} onChange={handleChange} nextStep={nextStep} backStep={backStep} />}
          {step === 3 && <Step3Form formData={formData} onChange={handleChange} nextStep={nextStep} backStep={backStep} />}

      </div>
    </div>
    </div>
  );
}

export default SignupPage;
