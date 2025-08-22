// src/api/client.js
import axios from "axios";

//const BASE = (import.meta.env.VITE_REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

export const api = axios.create({
    baseURL: "",               // ← HTTPS 백엔드
    withCredentials: true,       // 쿠키 인증 쓰면 유지
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});
