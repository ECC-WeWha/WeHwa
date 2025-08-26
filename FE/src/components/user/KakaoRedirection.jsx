// src/pages/Redirection.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
//import { api } from "../api/client.js";
import { useAuth } from "../../components/layout/AuthContext";

function KakaoRedirection() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathname = url.pathname;

    //const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI;


/*
    axios
    .post("/kakaoLogin", {
      authorizationCode: code,
      redirectUri: REDIRECT_URI,
    })

      
      .post(`${BACKEND_URL}kakaoLogin`,{
        authorizationCode: code,
        redirectUri: import.meta.env.VITE_REACT_APP_REDIRECT_URI
        }) // ← 백엔드에 인가 코드 보내기  //이떄 kakaologin이 실제 api위치와 같아야 한다
      .then((res) => {
        const { accessToken, userId } = res.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", userId);
        navigate("/"); //main으로 가게 수정-> 바로 로그인 가능하게
      })
      .catch((err) => {
        console.error("카카오 로그인 실패", err);
        alert("카카오 로그인 중 오류가 발생했습니다."); //없으니 로그인 페이지로
        navigate("/login");
      });
  }, []);*/
  if (pathname === "/oauth-success") {
    const token = url.searchParams.get("token");
    if (!token) {
      alert("토큰이 없습니다.");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;

      login(token, userId); // ✅ AuthContext로 로그인 처리
      navigate("/", { replace: true });
    } catch (e) {
      console.error("토큰 파싱 오류", e);
      alert("로그인 토큰 처리 중 오류가 발생했습니다.");
      navigate("/login");
    }
  }

  if (pathname === "/oauth-fail") {
    alert("카카오 로그인에 실패했습니다.");
    navigate("/login", { replace: true });
  }
}, [navigate, login]);

  return <div>로그인 중입니다</div>;  //gpt의 도움을 받아 이모티콘이 많다
}

export default KakaoRedirection;
