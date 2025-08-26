// vite.config.js

/*
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",//"http://wewha.ap-northeast-2.elasticbeanstalk.com", // ← http
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("[proxyReq]", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("[proxyRes]", req.method, req.url, proxyRes.statusCode);
          });
        },
      },
    },
  },
});


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",//"https://wewha.ap-northeast-2.elasticbeanstalk.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
/*/

