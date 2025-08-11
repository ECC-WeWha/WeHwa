// src/pages/Redirection.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function KakaoRedirection() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    axios
      .post(`${BACKEND_URL}kakaoLogin`,{
        authorizationCode: code,
        redirectUri: import.meta.env.VITE_REACT_APP_REDIRECT_URI
        }) // ← 백엔드에 인가 코드 보내기  //이떄 kakaologin이 실제 api위치와 같아야 한다
      .then((res) => {
        const { token, userId } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        navigate("/"); //main으로 가게 수정-> 바로 로그인 가능하게
      })
      .catch((err) => {
        console.error("카카오 로그인 실패", err);
        alert("카카오 로그인 중 오류가 발생했습니다."); //없으니 로그인 페이지로
        navigate("/login");
      });
  }, []);

  return <div>로그인 중입니다</div>;  //gpt의 도움을 받아 이모티콘이 많다
}

export default KakaoRedirection;
