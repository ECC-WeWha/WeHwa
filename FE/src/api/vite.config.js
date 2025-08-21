import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://wewha.ap-northeast-2.elasticbeanstalk.com", // 백엔드 주소
        changeOrigin: true, // Origin 헤더를 target에 맞춰줌
        secure: false,      // https 인증서 검사 스킵 (http라면 필요없음)
      },
    },
  },
});
//뭔가 이상해서 한번 해보자
//로컬 전용으로 한거 