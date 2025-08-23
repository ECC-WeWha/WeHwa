// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => ({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  }));
  /*
  const login = (token, userId) => {
    if (token) localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    setUser({ token, userId });
  };
*/
const login = (token, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  setUser({ token, userId }); // ✅ 이게 있어야 상태가 반영됨
};
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser({ token: null, userId: null });
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
