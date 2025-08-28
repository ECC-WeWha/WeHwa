
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import flagthi from "../assets/images/flagthi.png";
import flagcn from "../assets/images/flagcn.png";
import flagin from "../assets/images/flagin.png";
import flagjp from "../assets/images/flagjp.png";
import flaggm from "../assets/images/flaggm.png";
import { api } from "../api/client";
import { useAuth } from "../components/layout/AuthContext.jsx";
const green = "#00664F";
const softGreen = "#66A395";
const gray ="#B4B4B4";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await api.get("/api/users/me"); // 서버에서 내 정보 가져오기
        if (!ignore) {
          setProfile(res?.data?.data ?? res?.data ?? null); // 응답 스키마에 따라 보정
        }
      } catch (e) {
        console.error("프로필 불러오기 실패:", e);
      }
    })();
  
    return () => { ignore = true; }; // 컴포넌트 언마운트 시 안전 가드
  }, []);



  const flag = {
    width:"30px",
    height:"30px",
    verticalAlign: "middle",
    marginLeft:"80px"
  }
  /*
  const goFriendFind = () => {
    navigate("/friendfind");
  };*/
  const isEmpty = (v) => !v || (typeof v === "string" && v.trim() === "");
  const goFriendFind = () => {
    console.log(profile)
    const incomplete =
      !profile ||
      isEmpty(profile.language) ||
      isEmpty(profile.studyLanguage) ||
      isEmpty(profile.introduction);

    if (incomplete) {
      alert("모국어, 학습언어, 목적, 자기소개를 모두 입력해주세요.")
      navigate("/profilesetup");
    } else {
      navigate("/friendfind");
    }
  };


  const smallBoxStyle = {
    background: "#BCC9241A",
    border: "none",
    padding:"20px",
    borderRadius: 20,
    cursor: "pointer",
    width:"240px",
    height:"243px",
  };
  const smallContry ={
    background: "#BCC9241A",
    border: "none",
    padding:"10px",
    borderRadius: 20,
    cursor: "pointer",
    width:"240px",
    height:"60px",
  }
  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#00664F", 
    marginBottom: "20px",
  };
  const bodyStyle = {
    fontSize: "14px",
    fontWeight: "normal",
    color: "black",
    marginBottom: "20px", 
  };
  return (
    <div style={{display:"flex",width:"1300px",flexDirection: "column",gap:"49px",marginLeft:"67px",marginRight:"67px"}}>
      <div style={{height:"113px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button
          type="button"
          onClick={goFriendFind}
          style={{
            width:"191px",
            height:"70px",
            background: "#F27367CC", //색 수정
            border:"none",
            color: "#ffffff",
            borderRadius: 20,
            fontSize: "20px",
            fontWeight: "bold"}}>
        친구 만들기
        </button>
        <input
          type="text"
          placeholder="검색"
          style={{ padding: "15px 20px", border: `1px solid ${softGreen}`, borderRadius: 20, width: 240, fontSize: 20, fontFamily: "inherit", outline: "none" }}
        />
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap: "100px"}}>
        <div style={{width:"598px",height:"666px",border: `1px solid ${gray}`,borderRadius:20,padding: "20px"}}>
        <h2
          style={{
            margin: 0,
            cursor: "pointer",
            color:`${green}`,
            fontSize:"20px",
            fontWeight: "bold"}}
            onClick={() => navigate("/board")}>
            다목적 게시판
        </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            marginTop: "30px",
            gap:"40px",
          }}>
            <div style={smallBoxStyle}>
              <div style={titleStyle} onClick={() => navigate("/board")}>맛집 게시판</div>
              <div style={bodyStyle}>생방송투데이 강서구 MZ맛집 야장 6900 </div>
              <div style={bodyStyle}>A Taste of Thailand in the Heart</div>
            </div>
            <div style={smallBoxStyle}>
              <div style={titleStyle}>맛집 게시판</div>
              <div style={bodyStyle}>생방송투데이 강서구 MZ맛집 야장 6900 </div>
              <div style={bodyStyle}>A Taste of Thailand in the Heart</div>
            </div>
            <div style={smallBoxStyle}>
              <div style={titleStyle}>맛집 게시판</div>
              <div style={bodyStyle}>생방송투데이 강서구 MZ맛집 야장 6900 </div>
              <div style={bodyStyle}>A Taste of Thailand in the Heart</div>
            </div>
            <div style={smallBoxStyle}>
              <div style={titleStyle}>맛집 게시판</div>
              <div style={bodyStyle}>생방송투데이 강서구 MZ맛집 야장 6900 </div>
              <div style={bodyStyle}>A Taste of Thailand in the Heart</div>
            </div>
          </div>
        </div>
        <div style={{width:"598px",height:"666px",border: `1px solid ${gray}`,borderRadius:20,padding: "20px"}}>
        <h2
          style={{
            margin: 0,
            cursor: "pointer",
            color:`${green}`,
            fontSize:"20px",
            fontWeight: "bold"}}
            onClick={() => navigate("/board")}>
            국적 게시판
        </h2>
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 6fr",
            marginTop: "30px",
            gap:"20px",
          }}>
            <div style={smallContry}>
              <div style={{fontSize: "18px",marginTop:"19px",marginLeft:"27px",alignItems: "center"}} onClick={() => navigate("/board")}>태국 게시판
                <img src={flagthi} alt="로고" style={flag}></img>
              </div>
            </div>
            <div style={smallContry}>
              <div style={{fontSize: "18px",marginTop:"19px",marginLeft:"27px",alignItems: "center"}} onClick={() => navigate("/board")}>독일 게시판
                <img src={flaggm} alt="로고" style={flag}></img>
              </div>
            </div>
            <div style={smallContry}>
              <div style={{fontSize: "18px",marginTop:"19px",marginLeft:"27px",alignItems: "center"}} onClick={() => navigate("/board")}>일본 게시판
                <img src={flagjp} alt="로고" style={flag}></img>
              </div>
            </div>
            <div style={smallContry}>
              <div style={{fontSize: "18px",marginTop:"19px",marginLeft:"27px",alignItems: "center"}} onClick={() => navigate("/board")}>인도 게시판
                <img src={flagin} alt="로고" style={flag}></img>
              </div>
            </div>
            <div style={smallContry}>
              <div style={{fontSize: "18px",marginTop:"19px",marginLeft:"27px",alignItems: "center"}} onClick={() => navigate("/board")}>중국 게시판
                <img src={flagcn} alt="로고" style={flag}></img>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default HomePage;
