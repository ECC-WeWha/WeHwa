// client.js
import axios from "axios";

export const api = axios.create({
  baseURL:"http://localhost:5001", // http://wewha.ap-northeast-2.elasticbeanstalk.com
  //headers: { "Content-Type": "application/json", Accept: "application/json" },
  headers: { Accept: "application/json" },
  timeout: 15000,
  withCredentials: false,
});
/*
export const api = axios.create({
  baseURL: "http://localhost:8080",                      // 상대경로 → 프록시 사용
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
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
*/
api.interceptors.request.use((config) => {
  // 1) 로그인/회원가입에는 Authorization 제거
  const isAuthApi = (config.url || "").startsWith("/api/auth/");
  if (!isAuthApi) {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  // 2) 요청 로그(디버깅용)
  console.log("[REQ]", (config.baseURL || "") + config.url, {
    method: config.method,
    body: config.data,
  });
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
