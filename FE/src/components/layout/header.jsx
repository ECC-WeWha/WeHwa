// src/components/layout/header.jsx

import React, { useState, useEffect} from "react";  //로그인 로그아웃 상태를 위해
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
import languageImage from "../../assets/images/lang.png";
import alarmImge from "../../assets/images/alarm.png";
import profileImage from "../../assets/images/profile.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(""); //이것도 백엔드랑 이름 바뀌면 바뀌는거여
  const navigate = useNavigate();
  //로그인 상태 확인용 -> 그래야 바뀌지  //+지금 당장은 확인 불가능
    useEffect(() => {
      const token = localStorage.getItem("token");
      const savedId = localStorage.getItem("userId");
      if (token) {
        setIsLoggedIn(true);
        setUserId(savedId || "");
      }
    }, []);

  const handleLoginBoxClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      setUserId("");
      alert("로그아웃되었습니다."); //확인용 팝업 - 추가로 만들기
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
          <div className="user-id" onClick={handleProfileClick} style={{ cursor: "pointer" }}>{userId}</div> )}
        <img src={alarmImge} alt="로고" className="alarm-image"/>
    </div>

  </div>        
</header>


  );
}

export default Header;
