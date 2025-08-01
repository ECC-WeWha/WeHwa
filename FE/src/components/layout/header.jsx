// src/components/layout/header.jsx

import React, { useState } from "react";  //로그인 로그아웃 상태를 위해
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
import languageImage from "../../assets/images/lang.png";
import alarmImge from "../../assets/images/alarm.png";
import profileImage from "../../assets/images/profile.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginBoxClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      alert("로그아웃되었습니다."); //확인용 팝업 - 추가로 만들기
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header-bar">
      <div style={{marginTop:"-10px"}}><img src={languageImage} alt="로고" className="lang-image"></img></div>
      <div>
        <Link to="/" className="logo-link">
          <img src={logoImage} alt="로고" className="logo-image" style={{marginTop:"-30px"}}/>
          <div className="logo-text">이대생을 위한 외국인 유학생 커뮤니티</div>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="main-button" onClick={handleLoginBoxClick}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </div>
        <img src={profileImage} alt="로고" className="profile-image" style={{marginTop:"-10px"}}/>
        {isLoggedIn && (
          <div className="user-id">id12345</div> )}
        <img src={alarmImge} alt="로고" className="alarm-image" style={{marginTop:"-10px"}}/>
      </div>
    </header>
  );
}

export default Header;




