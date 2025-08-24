// src/api/client.js
/*
import axios from "axios";

export const api = axios.create({
  baseURL: "",                      // 상대경로 → 프록시 사용
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


*/
// client.js
import axios from "axios";

export const api = axios.create({
  baseURL: "", // 상대경로 → Netlify redirects로 프록시
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  timeout: 15000,
   withCredentials: false, // 쿠키 인증 안 쓰면 false로 단순화 (CORS 이슈 줄이기)
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 디버깅에 도움: 500/401 원인 바로 확인
    console.error("[API ERROR]", {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers,
    });
    return Promise.reject(err);
  }
);
