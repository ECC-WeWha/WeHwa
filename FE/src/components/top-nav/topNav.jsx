import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="topnav">
      {/* left: language pills */}
      <div className="topnav__left">
        <button className="lang-pill">EN</button>
        <button className="lang-pill lang-pill--active">한</button>
      </div>

      {/* center: brand + menu */}
      <div className="topnav__center">
        <div className="brand" onClick={() => navigate("/board")}>
          <span className="brand__logo">WeWha</span>
        </div>
        <nav className="topnav__menu">
          <NavLink to="/matching" className="menu-link">친구 매칭</NavLink>
          <NavLink to="/friends" className="menu-link">친구 목록</NavLink>
          <NavLink to="/board" className="menu-link">게시판</NavLink>
        </nav>
      </div>

      {/* right: search + user */}
      <div className="topnav__right">
        <div className="search">
          <FiSearch className="search__icon" />
          <input className="search__input" placeholder="검색" />
        </div>
        <button className="icon-btn" aria-label="알림"><FiBell /></button>
        <button className="btn" onClick={() => navigate("/login")}>로그인</button>
        <button className="avatar" aria-label="내 프로필"><FiUser /></button>
      </div>
    </header>
  );
}
