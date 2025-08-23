// src/api/client.js

import axios from "axios";

export const api = axios.create({
  baseURL: "",                      // 상대경로 → 프록시 사용
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

/*
import axios from "axios";
export const api = axios.create({
  baseURL: "/",            // 로컬에선 프록시를 태웁니다
  withCredentials: true,   // ★ 쿠키 주고받기
});

import axios from "axios";

export const api = axios.create({
  baseURL: "/.netlify/functions/api-proxy", // ✅ 프록시 함수 경로
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});
*/