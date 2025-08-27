import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- 1. useNavigate 훅 가져오기
import { api } from "../api/client"; // <-- 2. axios 인스턴스 가져오기 (경로는 실제 파일 위치에 맞게 수정)
import { useAuth } from "../components/layout/AuthContext.jsx";


import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const withPreviewUrl = (file) => {
  const previewUrl = URL.createObjectURL(file);
  return Object.assign(file, { previewUrl });
};

function ImageAdder({
  value = [],
  onChange,
  maxFiles = 10,
  maxSizeMb = 5,
  accept = "image/*",
  green = "#00664F",
}) {
  const [files, setFiles] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => setFiles(value), [value]);

  useEffect(() => {
    return () => files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
  }, []);

  const pushFiles = (incomingList) => {
    setError("");
    const incoming = Array.from(incomingList);
    const remainingSlots = Math.max(0, maxFiles - files.length);
    const slice = incoming.slice(0, remainingSlots);
    const tooMany = incoming.length > remainingSlots;
    const filtered = slice.filter(
      (f) => f.type.startsWith("image/") && f.size <= maxSizeMb * 1024 * 1024
    );
    const next = [...files, ...filtered.map(withPreviewUrl)];
    setFiles(next);
    onChange?.(next);
    if (tooMany) setError(`최대 ${maxFiles}장의 이미지만 업로드할 수 있어요.`);
    if (slice.length !== filtered.length) {
      setError((prev) =>
        prev
          ? prev + " 일부 파일이 용량 초과/이미지 아님으로 제외되었어요."
          : "일부 파일이 용량 초과/이미지 아님으로 제외되었어요."
      );
    }
  };

  const handleInputChange = (e) => {
    if (!e.target.files?.length) return;
    pushFiles(e.target.files);
    e.target.value = "";
  };

  const removeAt = (idx) => {
    const next = files.slice();
    const [removed] = next.splice(idx, 1);
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon sx={{ fontSize: 24 }} />}
          sx={{
            backgroundColor: green,
            "&:hover": { backgroundColor: "#005443" },
            padding: "14px 28px",
            fontSize: "18px",
            borderRadius: "16px",
            textTransform: "none",
          }}
        >
          이미지 업로드
          <VisuallyHiddenInput type="file" accept={accept} multiple onChange={handleInputChange} />
        </Button>
        <Chip label={`${files.length}/${maxFiles}`} size="small" />
      </Box>

      {error && <Chip color="error" label={error} />}

      {!!files.length && (
        <ImageList cols={4} gap={8} sx={{ m: 0 }}>
          {files.map((file, idx) => (
            <ImageListItem key={`${file.name}-${idx}`} sx={{ position: "relative" }}>
              <img
                src={file.previewUrl}
                alt={file.name}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Tooltip title="제거">
                <IconButton
                  size="small"
                  aria-label="remove"
                  onClick={() => removeAt(idx)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

function RadioOption({ id, label, value, checked, onChange, color = "#00664F", name, required }) {
  const size = 26;
  const borderWidth = 2;
  const innerSize = size / 2;

  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${borderWidth}px solid ${color}`,
          background: checked ? color : "transparent",
          transition: "background 150ms ease, box-shadow 150ms ease",
        }}
      >
        {checked && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: innerSize,
              height: innerSize,
              background: "#fff",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </span>
      <span style={{ fontSize: 18 }}>{label}</span>
    </label>
  );
}

const COUNTRIES_KO_EN = [
  // Asia
  { ko: "대한민국", en: "South Korea" }, { ko: "일본", en: "Japan" }, { ko: "중국", en: "China" },
  { ko: "대만", en: "Taiwan" }, { ko: "홍콩", en: "Hong Kong" }, { ko: "마카오", en: "Macau" },
  { ko: "몽골", en: "Mongolia" }, { ko: "태국", en: "Thailand" }, { ko: "베트남", en: "Vietnam" },
  { ko: "필리핀", en: "Philippines" }, { ko: "말레이시아", en: "Malaysia" }, { ko: "싱가포르", en: "Singapore" },
  { ko: "인도네시아", en: "Indonesia" }, { ko: "브루나이", en: "Brunei" }, { ko: "캄보디아", en: "Cambodia" },
  { ko: "라오스", en: "Laos" }, { ko: "미얀마", en: "Myanmar" }, { ko: "인도", en: "India" },
  { ko: "네팔", en: "Nepal" }, { ko: "방글라데시", en: "Bangladesh" }, { ko: "스리랑카", en: "Sri Lanka" },
  { ko: "파키스탄", en: "Pakistan" }, { ko: "부탄", en: "Bhutan" }, { ko: "몰디브", en: "Maldives" },
  { ko: "카자흐스탄", en: "Kazakhstan" }, { ko: "우즈베키스탄", en: "Uzbekistan" },
  { ko: "키르기스스탄", en: "Kyrgyzstan" }, { ko: "타지키스탄", en: "Tajikistan" },
  { ko: "투르크메니스탄", en: "Turkmenistan" }, { ko: "사우디아라비아", en: "Saudi Arabia" },
  { ko: "아랍에미리트", en: "United Arab Emirates" }, { ko: "카타르", en: "Qatar" },
  { ko: "바레인", en: "Bahrain" }, { ko: "쿠웨이트", en: "Kuwait" }, { ko: "오만", en: "Oman" },
  { ko: "요르단", en: "Jordan" }, { ko: "레바논", en: "Lebanon" }, { ko: "이라크", en: "Iraq" },
  { ko: "이란", en: "Iran" }, { ko: "이스라엘", en: "Israel" }, { ko: "팔레스타인", en: "Palestine" },
  { ko: "터키", en: "Turkey" }, { ko: "키프로스", en: "Cyprus" }, { ko: "조지아", en: "Georgia" },
  { ko: "아르메니아", en: "Armenia" }, { ko: "아제르바이잔", en: "Azerbaijan" },
  // Americas
  { ko: "미국", en: "United States" }, { ko: "캐나다", en: "Canada" }, { ko: "멕시코", en: "Mexico" },
  { ko: "과테말라", en: "Guatemala" }, { ko: "엘살바도르", en: "El Salvador" }, { ko: "온두라스", en: "Honduras" },
  { ko: "니카라과", en: "Nicaragua" }, { ko: "코스타리카", en: "Costa Rica" }, { ko: "파나마", en: "Panama" },
  { ko: "쿠바", en: "Cuba" }, { ko: "자메이카", en: "Jamaica" }, { ko: "아이티", en: "Haiti" },
  { ko: "도미니카공화국", en: "Dominican Republic" }, { ko: "트리니다드토바고", en: "Trinidad and Tobago" },
  { ko: "바하마", en: "Bahamas" }, { ko: "브라질", en: "Brazil" }, { ko: "아르헨티나", en: "Argentina" },
  { ko: "칠레", en: "Chile" }, { ko: "페루", en: "Peru" }, { ko: "콜롬비아", en: "Colombia" },
  { ko: "우루과이", en: "Uruguay" }, { ko: "파라과이", en: "Paraguay" }, { ko: "에콰도르", en: "Ecuador" },
  { ko: "볼리비아", en: "Bolivia" }, { ko: "베네수엘라", en: "Venezuela" }, { ko: "가이아나", en: "Guyana" },
  { ko: "수리남", en: "Suriname" },
  // Europe
  { ko: "영국", en: "United Kingdom" }, { ko: "아일랜드", en: "Ireland" }, { ko: "프랑스", en: "France" },
  { ko: "독일", en: "Germany" }, { ko: "이탈리아", en: "Italy" }, { ko: "스페인", en: "Spain" },
  { ko: "포르투갈", en: "Portugal" }, { ko: "네덜란드", en: "Netherlands" }, { ko: "벨기에", en: "Belgium" },
  { ko: "룩셈부르크", en: "Luxembourg" }, { ko: "스위스", en: "Switzerland" }, { ko: "오스트리아", en: "Austria" },
  { ko: "체코", en: "Czechia" }, { ko: "슬로바키아", en: "Slovakia" }, { ko: "폴란드", en: "Poland" },
  { ko: "헝가리", en: "Hungary" }, { ko: "덴마크", en: "Denmark" }, { ko: "노르웨이", en: "Norway" },
  { ko: "스웨덴", en: "Sweden" }, { ko: "핀란드", en: "Finland" }, { ko: "아이슬란드", en: "Iceland" },
  { ko: "에스토니아", en: "Estonia" }, { ko: "라트비아", en: "Latvia" }, { ko: "리투아니아", en: "Lithuania" },
  { ko: "우크라이나", en: "Ukraine" }, { ko: "몰도바", en: "Moldova" }, { ko: "벨라루스", en: "Belarus" },
  { ko: "러시아", en: "Russia" }, { ko: "루마니아", en: "Romania" }, { ko: "불가리아", en: "Bulgaria" },
  { ko: "그리스", en: "Greece" }, { ko: "크로아티아", en: "Croatia" }, { ko: "슬로베니아", en: "Slovenia" },
  { ko: "세르비아", en: "Serbia" }, { ko: "보스니아헤르체고비나", en: "Bosnia and Herzegovina" },
  { ko: "북마케도니아", en: "North Macedonia" }, { ko: "알바니아", en: "Albania" }, { ko: "코소보", en: "Kosovo" },
  { ko: "몬테네그로", en: "Montenegro" },
  // Oceania
  { ko: "호주", en: "Australia" }, { ko: "뉴질랜드", en: "New Zealand" }, { ko: "피지", en: "Fiji" },
  { ko: "파푸아뉴기니", en: "Papua New Guinea" }, { ko: "사모아", en: "Samoa" }, { ko: "통가", en: "Tonga" },
  { ko: "바누아투", en: "Vanuatu" },
  // Africa
  { ko: "알제리", en: "Algeria" }, { ko: "모로코", en: "Morocco" }, { ko: "튀니지", en: "Tunisia" },
  { ko: "리비아", en: "Libya" }, { ko: "이집트", en: "Egypt" }, { ko: "수단", en: "Sudan" },
  { ko: "남수단", en: "South Sudan" }, { ko: "에티오피아", en: "Ethiopia" }, { ko: "에리트레아", en: "Eritrea" },
  { ko: "지부티", en: "Djibouti" }, { ko: "소말리아", en: "Somalia" }, { ko: "케냐", en: "Kenya" },
  { ko: "우간다", en: "Uganda" }, { ko: "탄자니아", en: "Tanzania" }, { ko: "르완다", en: "Rwanda" },
  { ko: "부룬디", en: "Burundi" }, { ko: "콩고민주공화국", en: "Democratic Republic of the Congo" },
  { ko: "콩고공화국", en: "Republic of the Congo" }, { ko: "가봉", en: "Gabon" },
  { ko: "적도기니", en: "Equatorial Guinea" }, { ko: "카메룬", en: "Cameroon" },
  { ko: "중앙아프리카공화국", en: "Central African Republic" }, { ko: "차드", en: "Chad" },
  { ko: "나이지리아", en: "Nigeria" }, { ko: "니제르", en: "Niger" }, { ko: "베냉", en: "Benin" },
  { ko: "토고", en: "Togo" }, { ko: "가나", en: "Ghana" }, { ko: "코트디부아르", en: "Côte d'Ivoire" },
  { ko: "라이베리아", en: "Liberia" }, { ko: "시에라리온", en: "Sierra Leone" }, { ko: "기니", en: "Guinea" },
  { ko: "기니비사우", en: "Guinea-Bissau" }, { ko: "감비아", en: "Gambia" }, { ko: "세네갈", en: "Senegal" },
  { ko: "부르키나파소", en: "Burkina Faso" }, { ko: "말리", en: "Mali" }, { ko: "모리타니", en: "Mauritania" },
  { ko: "마다가스카르", en: "Madagascar" }, { ko: "모잠비크", en: "Mozambique" }, { ko: "짐바브웨", en: "Zimbabwe" },
  { ko: "잠비아", en: "Zambia" }, { ko: "앙골라", en: "Angola" }, { ko: "나미비아", en: "Namibia" },
  { ko: "보츠와나", en: "Botswana" }, { ko: "레소토", en: "Lesotho" }, { ko: "에스와티니", en: "Eswatini" },
  { ko: "말라위", en: "Malawi" }, { ko: "세이셸", en: "Seychelles" }, { ko: "모리셔스", en: "Mauritius" },
  { ko: "카보베르데", en: "Cabo Verde" }, { ko: "상투메프린시페", en: "São Tomé and Príncipe" },
];

function BoardCategorySelect({ options = [], value, onChange, disabled }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="board-category-label"
          id="board-category"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
          inputProps={{ name: "boardCategory" }}
          displayEmpty
          style={{ fontFamily: "'IBM Plex Sans KR', sans-serif", fontSize: "18px" }}
        >
          <MenuItem value="" disabled>카테고리를 선택하세요</MenuItem>
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{ fontFamily: "'IBM Plex Sans KR', sans-serif", fontSize: "18px" }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function BoardWrite() {
  const navigate = useNavigate(); // <-- 3. navigate 함수 사용 준비
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorType, setAuthorType] = useState("id"); // "id" | "anon"
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState(["일본 유학생", "일식 맛집"]);
  const [images, setImages] = useState([]);

  const [categoryType, setCategoryType] = useState(""); // "multi" | "national" | ""
  const [category, setCategory] = useState("");

  const green = "#00664F";

  const multiOptions = [
    { value: "홍보", label: "홍보 게시판" },
    { value: "자유", label: "자유 게시판" },
    { value: "여행", label: "여행 게시판" },
    { value: "맛집", label: "맛집 게시판" },
  ];
  const nationalOptions = COUNTRIES_KO_EN.map(({ ko, en }) => ({
    value: ko,
    label: `${ko} (${en})`,
  }));
  const optionsMap = { multi: multiOptions, national: nationalOptions };

  const currentOptions =
    categoryType === "multi" ? optionsMap.multi :
    categoryType === "national" ? optionsMap.national : [];

  const handleCategoryType = (type) => {
    setCategoryType(type);
    setCategory("");
  };

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (!k) return;
    if (!keywords.includes(k)) setKeywords((prev) => [...prev, k]);
    setKeywordInput("");
  };
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };
  const removeKeyword = (k) => setKeywords((prev) => prev.filter((x) => x !== k));

  // ===================================================================
  // 4. handleSubmit 함수를 API 연동 로직으로 전면 수정
  // ===================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Checking state values before creating payload:", {
      title,
      content,
      category,
      keywords,
      authorType,
    });
  
    // --- Validation checks ---
    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and content.");
      return;
    }

    // --- 유효성 검사 ---
    if (!title.trim() || !content.trim()) {
      alert("제목과 본문을 모두 입력해 주세요.");
      return;
    }
    if (!categoryType || !category) {
      alert("게시판 유형과 상세 게시판을 모두 선택해 주세요.");
      return;
    }

    // --- 데이터 준비 (FormData) ---
    const formData = new FormData();

    // 1. JSON 데이터 (payload) 생성
    // 백엔드의 PostCreateRequest DTO와 필드가 일치해야 합니다.
    const payload = {
      title: title.trim(),
      content: content.trim(),
      category,
      keywords,
      anonymous: authorType === "anon",
    };

    formData.append(
      "postData",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    // 2. 이미지 파일 추가
    images.forEach((imageFile) => {
      formData.append("images", imageFile);
    });
    
    // 3. API 엔드포인트 선택
    const endpoint = categoryType === "national"
      ? "/api/national-posts"
      // TODO: 백엔드에 맞게 수정 필요
      : "/api/posts";

    try {
      // --- API 호출 ---
      // headers 부분은 interceptor가 자동으로 처리하므로 삭제합니다.
      const response = await api.post(endpoint, formData);

      console.log("게시글 생성 성공:", response.data);
      alert("게시글이 성공적으로 등록되었습니다.");

      // 성공 후 상세 페이지로 이동 (응답 데이터 구조에 맞게 postId를 추출)
      const newPostId = response.data?.data?.postId;
      if (newPostId) {
          navigate(`/board/${newPostId}`);
      } else {
          navigate("/board");
      }
    } catch (error) {
      console.error("게시글 생성 실패:", error.response);
      alert(error.response?.data?.message || "게시글 등록 중 오류가 발생했습니다.");
    }
  }
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <BoardNav active="board" />
      <div style={{ display: "flex", maxWidth: "1440px", margin: "0 auto", padding: "40px 20px" }}>
        <BoardSidebar />
        <main style={{ flex: 1, padding: "0 20px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", color: green, textAlign: "center" }}>
            글쓰기
          </h2>

          {/* form 태그에 onSubmit 연결 */}
          <form onSubmit={handleSubmit}>
            {/* ... (폼 내부는 기존 코드와 동일) ... */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: "30px",
                alignItems: "center",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {/* 글제목 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>
                글제목 <span style={{ color: "red", fontSize: "10px", verticalAlign: "middle" }}>●</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "20px 16px",
                  border: `1.5px solid ${green}`,
                  borderRadius: "20px",
                  outline: "none",
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                  fontSize: "18px",
                }}
              />

              {/* 본문 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>
                본문 <span style={{ color: "red", fontSize: "10px", verticalAlign: "middle" }}>●</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                style={{
                  width: "100%",
                  padding: "20px",
                  border: `1.5px solid ${green}`,
                  borderRadius: "20px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                  fontSize: "18px",
                }}
              />

              {/* 작성자 표기 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>
                작성자 표기 <span style={{ color: "red", fontSize: "10px", verticalAlign: "middle" }}>●</span>
              </label>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <RadioOption
                  id="author-id"
                  label="아이디"
                  value="id"
                  checked={authorType === "id"}
                  onChange={() => setAuthorType("id")}
                  color={green}
                  name="authorType"
                  required
                />
                <RadioOption
                  id="author-anon"
                  label="익명"
                  value="anon"
                  checked={authorType === "anon"}
                  onChange={() => setAuthorType("anon")}
                  color={green}
                  name="authorType"
                />
              </div>

              {/* 사진 업로드*/}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>사진 첨부</label>
              <ImageAdder value={images} onChange={setImages} maxFiles={6} maxSizeMb={5} green={green} />

              {/* 게시판 유형 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>
                게시판 유형 <span style={{ color: "red", fontSize: "10px", verticalAlign: "middle" }}>●</span>
              </label>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <RadioOption
                  id="type-multi"
                  label="다목적"
                  value="multi"
                  checked={categoryType === "multi"}
                  onChange={() => handleCategoryType("multi")}
                  color={green}
                  name="boardCategoryType"
                  required
                />
                <RadioOption
                  id="type-national"
                  label="다국적"
                  value="national"
                  checked={categoryType === "national"}
                  onChange={() => handleCategoryType("national")}
                  color={green}
                  name="boardCategoryType"
                />
              </div>

              {/* 게시판 선택 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px", fontFamily: "'IBM Plex Sans KR', sans-serif"}}>
                게시판 <span style={{ color: "red", fontSize: "10px", verticalAlign: "middle" }}>●</span>
              </label>
              <BoardCategorySelect
                options={
                  categoryType === "multi"
                    ? multiOptions
                    : categoryType === "national"
                    ? nationalOptions
                    : []
                }
                value={category}
                onChange={setCategory}
                disabled={!categoryType}
              />

              {/* 키워드 */}
              <label style={{ fontWeight: 600, color: green, fontSize: "20px" }}>키워드</label>
              <div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {keywords.map((k) => (
                    <span
                      key={k}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "7px 16px",
                        borderRadius: "999px",
                        border: `1px solid ${green}`,
                        color: green,
                        fontSize: "18px",
                      }}
                    >
                      {k}
                      <button
                        type="button"
                        onClick={() => removeKeyword(k)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "20px",
                          lineHeight: 1,
                          color: green,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="키워드를 입력 후 Enter"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: "20px 20px",
                      border: `1.5px solid ${green}`,
                      borderRadius: "20px",
                      outline: "none",
                      fontSize: "18px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    style={{
                      padding: "20px 30px",
                      borderRadius: "16px",
                      border: `1px solid ${green}`,
                      backgroundColor: green,
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "20px",
                    }}
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
              <button
                type="submit"
                style={{
                  padding: "15px 40px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: "#00664F",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                게시
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default BoardWrite;