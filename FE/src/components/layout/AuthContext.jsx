// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => ({
    token: localStorage.getItem("accessToken"),
    userId: localStorage.getItem("userId"),
    loginId: localStorage.getItem("loginId"),

  }));
  /*
  const login = (token, userId) => {
    if (token) localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    setUser({ token, userId });
  };

const login = (token, userId) => {
  localStorage.setItem("accessToken", token);
  ////localStorage.setItem("userId", userId);
  ////setUser({ token, userId }); 
  if (userId) localStorage.setItem("userId", userId);
  setUser({ token, userId: userId || null })
};*/
const login = (token, ids = {}) => {
  const { userId = null, loginId = null } = ids;
  localStorage.setItem("accessToken", token);
  if (loginId) localStorage.setItem("loginId", loginId);
  if (userId)  localStorage.setItem("userId",  userId);
  setUser({ token, userId, loginId });
};
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginId");
    //setUser({ token: null, loginId: null });
    setUser({ token: null, userId: null ,loginId: null  });
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
