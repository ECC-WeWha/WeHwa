//로그인하는 페이지
// src/pages/login-page.jsx
// 가장 처음 들어가며 뜨는 페이지

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GreenButton from "../components/common/GreenButton.jsx";
import InputBox from "../components/common/InputBox.jsx";
import kakaoLogin from "../assets/images/kakaologin.png";
import naverLogin from "../assets/images/naverlogin.png";
import googleLogin from "../assets/images/googlelogin.png";

function LoginPage() {
  return (
    <div style={{
      maxWidth: "340px",  // 최대 너비 지정
      margin: "0 auto",   // 가운데 정렬
    }}>
      <div style={{
          display : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",         // 가로 가운데
          gap: "20px",
          minHeight: "80vh",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"}}>
          <h2 className="label-title">아이디</h2>
          <InputBox placeholder="아이디 입력"></InputBox>
          <h2 className="label-title">비밀번호</h2>
          <InputBox placeholder="비밀번호 입력"></InputBox>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width: "120%"}}>
          <div style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "20px",
            color : "#014B3A"}}>아이디/비밀번호 찾기</div>
          <div>
            <Link to="/signup" className="signup-text">회원가입</Link>
          </div>
        </div>
        
        <div>
          <GreenButton style={{ marginTop: "25px" }} text="로그인"/>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width:"120%"}}>
          <img src={naverLogin} alt="네이버연동" className="use-login-image"/>
          <img src={kakaoLogin} alt="카카오연동"  className="use-login-image"/>
          <img src={googleLogin} alt="구글연동"  className="use-login-image"/>
        </div>
    </div>
  </div>
  );
}
export default LoginPage;

{/* import React, { useState } from "react";
import InputBox from "../components/common/InputBox";

function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = () => {
    console.log("아이디:", id, "비번:", pw);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>로그인</h2>
      <InputBox
        placeholder="아이디 입력"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br />
      <InputBox
        type="password"
        placeholder="비밀번호 입력"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}
*/}