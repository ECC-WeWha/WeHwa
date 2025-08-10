// src/pages/board-write.jsx
import React, { useState } from "react";
import BoardNav from "../components/top-nav/top-nav.jsx";
import BoardSidebar from "../components/sidebar/sidebar.jsx";

function RadioOption({ id, label, value, checked, onChange, color = "#00664F" }) {
  const size = 26;
  const borderWidth = 2;
  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${borderWidth}px solid ${color}`,
          background: checked ? color : "transparent",
          transition: "background 150ms ease, box-shadow 150ms ease",
        }}
      />
      <span style={{ fontSize: 18 }}>{label}</span>
    </label>
  );
}

function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorType, setAuthorType] = useState("id"); // 'id' | 'anon'
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState(["일본 유학생", "일식 맛집"]);

  // ✅ NEW: image state
  const [image, setImage] = useState(null);

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

  // ✅ NEW: image handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, content, authorType, keywords, image });
    alert("게시글이 임시로 콘솔에 출력되었습니다. (API 연동 필요)");
  };

  const green = "#00664F";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <BoardNav active="board" />

      <div
        style={{
          display: "flex",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar */}
        <BoardSidebar />

        {/* Main */}
        <main style={{ flex: 1, padding: "0 20px" }}>
          {/* Page title */}
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: green,
              textAlign: "center",
              margin: "0 0 24px 0",
            }}
          >
            글쓰기
          </h2>

          {/* Form container */}
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
              <label style={{ fontWeight: "600", color: green, fontSize: "20px" }}>글제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                style={{
                  width: "100%",
                  padding: "20px 16px",
                  border: `1.5px solid ${green}`,
                  borderRadius: "20px",
                  outline: "none",
                }}
              />

              {/* 본문 */}
              <label style={{ fontWeight: "600", color: green, fontSize: "20px" }}>본문</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                style={{
                  width: "100%",
                  padding: "20px",
                  border: `1.5px solid ${green}`,
                  borderRadius: "20px",
                  outline: "none",
                  resize: "vertical",
                }}
              />

              {/* 작성자 표기 */}
              <label style={{ fontWeight: "600", color: green, fontSize: "20px" }}>작성자 표기</label>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <RadioOption
                  id="author-id"
                  label="아이디"
                  value="id"
                  checked={authorType === "id"}
                  onChange={() => setAuthorType("id")}
                  color={green}
                />
                <RadioOption
                  id="author-anon"
                  label="익명"
                  value="anon"
                  checked={authorType === "anon"}
                  onChange={() => setAuthorType("anon")}
                  color={green}
                />
              </div>

              {/* 키워드 */}
              <label style={{ fontWeight: "600", color: green, fontSize: "20px" }}>키워드</label>
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
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
                        aria-label={`remove ${k}`}
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
                  {/* your button CSS preserved */}
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

              {/* 사진 업로드 */}
              <label style={{ fontWeight: "600", color: green, fontSize: "20px" }}>사진 첨부</label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "block", marginBottom: "12px" }}
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="미리보기"
                    style={{
                      maxWidth: "300px",
                      borderRadius: "12px",
                      border: `1px solid ${green}`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "28px",
              }}
            >
              <button
                type="button"
                onClick={() => window.history.back()}
                style={{
                  padding: "15px 40px",
                  borderRadius: "16px",
                  border: "1px solid #B4B4B4",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{
                  padding: "15px 40px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: green,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                등록
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default BoardWrite;
