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

import { useAuth } from "../components/layout/AuthContext.jsx";


//import axios from "axios";
import {api} from "../api/client.js";
//import { VerifiedUserOutlined } from "@mui/icons-material";
//로그인 관련 백엔드 필요한거


function LoginPage() {
  const [userId, setId] =useState(""); //백엔드에서 username으로 했는데 그럼 이름은 어떻게 처리할건지
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const logErr = (err, tag) => {
    console.error(`서버 오류(${tag})`, {
      url: err.config?.url,
      method: err.config?.method,
      req: err.config?.data,
      status: err.response?.status,
      res: err.response?.data,
    });
  };

  /*
 const afterLogin = (data) => {
  const ok = data?.status === "success" || data?.success === true;
  if (!ok) {
    alert(data?.message || "로그인 실패");
    return false;
  }
  const { token, userId } = data;
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`; // ★ 추가
  }
  if (userId) localStorage.setItem("userId", userId);
  navigate("/", { replace: true });
  return true;
};
*/
  // afterLogin 재활용 + 분기 단일화
  const { login } = useAuth();

  const afterLogin = (data) => {
    console.log("afterLogin 호출됨", data);
  
    const ok = data?.message === "로그인 성공"; // 또는 다른 성공 조건
    if (!ok) {
      alert(data?.message || "로그인 실패");
      return false;
    }
    // LoginPage.jsx
    const token = data?.accessToken;
    const userId = data?.userId;
  
    if (!token || !userId) {
      alert("로그인 응답에 토큰 또는 유저ID가 없습니다.");
      return false;
    }
  
    login(token, userId);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log("로그인 성공, 홈으로 이동합니다");
  
    navigate("/", { replace: true });
    return true;
  };


const handleLogin = async () => {
  try {
    const res = await api.post("/api/auth/login", { userId, password });
    const token = res.data?.accessToken;
    localStorage.setItem("accessToken", token)
    console.log("login res", res.data);
    afterLogin(res.data);
  } catch (err) {
    logErr(err, "JSON");
    alert(err.response?.data?.message || "로그인 중 서버 오류가 발생했습니다.");
  }

};


  //const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const REST_API_KEY = import.meta.env.VITE_REACT_APP_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI;
  const KAKAO_AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
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
            value={userId}
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
