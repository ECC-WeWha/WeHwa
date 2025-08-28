import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
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

const COUNTRIES_KO_EN = [];

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
  const navigate = useNavigate();
  const { user } = useAuth?.() || {};

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorType, setAuthorType] = useState("id"); // "id" | "anon"
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [images, setImages] = useState([]);

  const [categoryType, setCategoryType] = useState(""); 
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 본문을 모두 입력해 주세요.");
      return;
    }
    if (!categoryType || !category) {
      alert("게시판 유형과 상세 게시판을 모두 선택해 주세요.");
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category,
      keywords,
      anonymous: authorType === "anon",
    };

    const formData = new FormData();
    formData.append("postData", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    images.forEach((imageFile) => formData.append("Images", imageFile));

    const endpoint = categoryType === "national" ? "/api/national-posts" : "/api/posts";

    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await api.post(endpoint, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      const created = data?.data || data;

      if (!created?.createdAt) {
        created.createdAt = new Date().toISOString();
      }
      try {
        localStorage.setItem(`post:${created.postId}`, JSON.stringify(created));
      } catch {}

      navigate("/board", { state: { newPost: created } });

    } catch (error) {
      console.error("게시글 생성 실패:", error?.response || error);
      alert(error?.response?.data?.message || "게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <BoardNav active="board" />
      <div style={{ display: "flex", maxWidth: "1440px", margin: "0 auto", padding: "40px 20px" }}>
        <BoardSidebar />
        <main style={{ flex: 1, padding: "0 20px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", color: green, textAlign: "center" }}>
            글쓰기
          </h2>

          <form onSubmit={handleSubmit}>
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
                options={categoryType === "multi" ? multiOptions : categoryType === "national" ? nationalOptions : []}
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
