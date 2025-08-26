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
  baseURL: "", // ✅ 상대경로(빈 문자열)
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15000,
  withCredentials: false,
});


api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");
  
    console.log("토큰 확인:", token); // 추가

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
