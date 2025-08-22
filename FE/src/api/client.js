// src/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: "",                      // 상대경로 → 프록시 사용
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
