// src/components/layout/header.jsx
import React from "react";
//import React, { useState, useEffect} from "react";  //로그인 로그아웃 상태를 위해
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
import languageImage from "../../assets/images/lang.png";
import alarmImage from "../../assets/images/alarm.png";
import profileImage from "../../assets/images/profile.png";

import { useAuth } from "../layout/AuthContext.jsx";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user?.token;
  const displayUserId = user?.userId || "";
  //const displayUserId = user?.userId || ""; 
  //로그인 상태 확인용 -> 그래야 바뀌지  //+지금 당장은 확인 불가능
  /*
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedId = localStorage.getItem("userId");
    if (token) {
      setIsLoggedIn(true);
      setUserId(savedId || "");
    } else {
      setIsLoggedIn(false);
      setUserId("");
    }
  }, [localStorage.getItem("token")]); 

  useEffect(() => {
    const syncLogin = () => {
      const token = localStorage.getItem("token");
      const savedId = localStorage.getItem("userId");
      if (token) {
        setIsLoggedIn(true);
        setUserId(savedId || "");
      } else {
        setIsLoggedIn(false);
        setUserId("");
      }
    };
    window.addEventListener("storage", syncLogin);
    syncLogin(); // 초기 1회 실행
    return () => window.removeEventListener("storage", syncLogin);
  }, []);  */

  const handleLoginBoxClick = () => {
    if (isLoggedIn) {
      logout();                    // ⬅️ 컨텍스트로 처리 (localStorage 직접 만지지 않음)
      alert("로그아웃되었습니다.");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    }
  };

  return (
  <header className="header-bar"> 
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft:"24px",marginTop:"6px",marginRight:"50px" }}>
    <div>
    <img src={languageImage} alt="로고" className="lang-image"></img>
    </div>

    <div style={{ textAlign: "center" }}>
      <Link to="/" className="logo-link">
        <img src={logoImage} alt="로고" className="logo-image" style={{marginTop:"-20px"}}/>
        <div className="logo-text">이대생을 위한 외국인 유학생 커뮤니티</div>
      </Link>
    </div>
    
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="main-button" onClick={handleLoginBoxClick}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </div>
        <img src={profileImage} alt="로고" className="profile-image" onClick={handleProfileClick} 
            style={{ cursor: "pointer" }} />
        {isLoggedIn && (
          <div className="user-id" onClick={handleProfileClick} style={{ cursor: "pointer" }}>{displayUserId}</div> )}
        <img src={alarmImage} alt="로고" className="alarm-image"/>
    </div>

  </div>        
</header>


  );
}

export default Header;
