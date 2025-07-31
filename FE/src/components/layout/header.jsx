// src/components/layout/header.jsx

import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
        <div>eng/한</div>
        <div>
            <Link to="/" className="main-title-link">이대생을 위한 외국인 유학생 커뮤니티</Link>
        </div>
        <div className="main-menubar">
            <Link to="/login">로그인</Link>
            {/*<Link to="/Alams" style={{ marginRight: "10px" }}></Link> 알림 표시관련인데 이거 까지는 구현하기는 아직..*/}
        </div>
</header>
  );
}

export default Header;

