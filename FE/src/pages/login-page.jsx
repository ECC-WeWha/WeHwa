//로그인하는 페이지
// src/pages/login-page.jsx
// 가장 처음 들어가며 뜨는 페이지

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GreenButton from "../components/common/GreenButton.jsx";
import InputBox from "../components/common/InputBox.jsx";
import kakaoLogin from "../assets/images/kakaologin.png";
import naverLogin from "../assets/images/naverlogin.png";
import googleLogin from "../assets/images/googlelogin.png";
import axios from "axios";

//로그인 관련 백엔드 필요한거

//카카오 로그인
// 1.백엔드 서버 관련 .env수정 2.kakaoredirection고치기 3.받는 api형식 확인 
//카카오 로그인 관련 백엔드의 끝내는 api


function LoginPage() {
  const [username, setId] =useState(""); //백엔드에서 username으로 했는데 그럼 이름은 어떻게 처리할건지
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}login`, {
        username,
        password,
    });
    if (res.data.status === "success") {
      const { token, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/");
    } else {
      alert(res.data.message || "로그인 실패 😢");
    }
  } catch (err) {
      console.error("서버 오류 ❌", err);
      alert("로그인 중 오류가 발생했습니다.");
  } 
};


  const REST_API_KEY = import.meta.env.VITE_REACT_APP_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI;
  const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthURL;
  };
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
          <InputBox
            placeholder="아이디 입력"
            value={username}
            onChange={(e)=>setId(e.target.value)}></InputBox>
          <h2 className="label-title">비밀번호</h2>
          <InputBox 
            placeholder="비밀번호 입력"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            ></InputBox>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width: "120%"}}>
          <div style={{
            fontFamily: "'IBM Plex Sans KR', sans-serif",
            fontWeight: "600",
            fontSize: "20px",
            color : "#014B3A"}}>아이디/비밀번호 찾기</div>
          <div>
            <Link to="/signup" className="signup-text">회원가입</Link>
          </div>
        </div>
        
        <div>
          <GreenButton style={{ marginTop: "25px" }} text="로그인" onClick={handleLogin} />
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width:"120%"}}>
          <img src={naverLogin} alt="네이버연동" className="use-login-image"/>
          <img src={kakaoLogin} alt="카카오연동"  className="use-login-image" onClick={handleKakaoLogin}/>
          <img src={googleLogin} alt="구글연동"  className="use-login-image"/>
        </div>
    </div>
  </div>
  );
}

export default LoginPage;
