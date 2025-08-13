import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GREEN = "#66A395";

const LANGUAGES = [
  "Arabic","Bengali","Bulgarian","Burmese","Catalan","Chinese","Croatian","Czech",
  "Danish","Dutch","English","Estonian","Filipino","Finnish","French","German",
  "Greek","Gujarati","Hebrew","Hindi","Hungarian","Indonesian","Italian","Japanese",
  "Kannada","Korean","Lao","Latvian","Lithuanian","Malay","Malayalam","Marathi",
  "Nepali","Norwegian","Persian","Polish","Portuguese","Punjabi","Romanian","Russian",
  "Serbian","Sinhala","Slovak","Slovenian","Spanish","Swahili","Swedish","Tagalog",
  "Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Vietnamese"
];

function FindFriendSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const baseItems = useMemo(
    () => ["All", "Korean", "English", "Thai", "Japanese", "Spanish", "French", "Chinese", "Russian"],
    []
  );

  const [customLangs, setCustomLangs] = useState(() => {
    try {
      const raw = localStorage.getItem("customFriendFindLangs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("customFriendFindLangs", JSON.stringify(customLangs));
  }, [customLangs]);

  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLang, setSelectedLang] = useState(null); 
  const [errorText, setErrorText] = useState("");         

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const isActive = (path) => {
    try {
      const current = new URL(location.pathname + location.search, window.location.origin);
      const link = new URL(path, window.location.origin);
      return current.pathname === link.pathname && current.search === link.search;
    } catch {
      return location.pathname + location.search === path;
    }
  };

  const menuItems = [
    ...baseItems.map((label) => ({ label, path: `/friendfind?lang=${encodeURIComponent(label)}` })),
    ...customLangs.map((label) => ({ label, path: `/friendfind?lang=${encodeURIComponent(label)}` })),
  ];

  const openAdd = () => {
    setQuery("");
    setOpenList(true);
    setActiveIndex(0);
    setSelectedLang(null);
    setErrorText("");
    setShowAdd(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const closeAdd = () => setShowAdd(false);

  const toTitle = (s) =>
    s
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^.|(\s)./g, (m) => m.toUpperCase());

  const allExisting = useMemo(() => [...baseItems, ...customLangs], [baseItems, customLangs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter((l) => l.toLowerCase().includes(q));
  }, [query]);

  const pickLanguage = (lang) => {
    const normalized = toTitle(lang);
    const exists = allExisting.some((l) => l.toLowerCase() === normalized.toLowerCase());
    if (!exists) {
      setCustomLangs((prev) => [...prev, normalized]);
    }
    setShowAdd(false);
    navigate(`/friendfind?lang=${encodeURIComponent(normalized)}`);
  };
  const handleConfirmAdd = () => {
    setErrorText("");

    const exactMatch = LANGUAGES.find(
      (l) => l.toLowerCase() === query.trim().toLowerCase()
    );

    if (selectedLang) {
      pickLanguage(selectedLang);
      return;
    }

    if (exactMatch) {
      pickLanguage(exactMatch);
      return;
    }

    setErrorText("목록에서 언어를 선택해 주세요 (또는 정확히 일치하도록 입력).");
  };

  const handleKeyDown = (e) => {
    if (!openList) {
      if (e.key === "ArrowDown") {
        setOpenList(true);
        e.preventDefault();
      }
      if (e.key === "Escape") {
        closeAdd();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      const item = listRef.current?.children?.[Math.min(activeIndex + 1, filtered.length - 1)];
      item?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      const item = listRef.current?.children?.[Math.max(activeIndex - 1, 0)];
      item?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeAdd();
    }
    // Enter is intentionally ignored to prevent accidental mismatched additions
  };

  const removeCustom = (label) => {
    setCustomLangs((prev) => prev.filter((l) => l !== label));
  };

  return (
    <>
      <aside
        style={{
          width: "220px",
          paddingRight: "20px",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minHeight: "100vh",
          alignSelf: "stretch",
        }}
      >
        {menuItems.map(({ label, path }) => (
          <Link
            key={label}
            to={path}
            aria-current={isActive(path) ? "page" : undefined}
            style={{
              display: "block",
              textDecoration: "none",
              textAlign: "center",
              padding: "15px",
              fontSize: "20px",
              borderRadius: "20px",
              border: isActive(path) ? "none" : `1px solid ${GREEN}`,
              backgroundColor: isActive(path) ? GREEN : "#fff",
              color: isActive(path) ? "#fff" : "#1a1a1a",
              transition: "0.2s",
            }}
          >
            {label}
          </Link>
        ))}

        <button
          type="button"
          onClick={openAdd}
          style={{
            display: "block",
            textAlign: "center",
            padding: "15px",
            fontSize: "20px",
            borderRadius: "20px",
            border: `1px solid ${GREEN}`,
            backgroundColor: "#fff",
            color: "#1a1a1a",
            transition: "0.2s",
            cursor: "pointer",
          }}
          aria-label="Add new language"
        >
          +
        </button>
      </aside>

      {/* Modal */}
      {showAdd && (
        <div
          onClick={closeAdd}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              width: 480,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
              padding: 20,
              border: "1px solid #eee",
              display: "grid",
              gap: 14,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 25, color: "#1a1a1a" }}>언어 추가</h3>
            <p style={{ margin: 0, fontSize: 16, color: "#666" }}>
              언어를 검색해서 목록에서 선택하세요.
            </p>

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenList(true);
                    setActiveIndex(0);
                    setSelectedLang(null);
                    setErrorText("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="예: German, Vietnamese, Arabic"
                  style={{
                    flex: 1,
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: 16,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setOpenList((v) => !v)}
                  aria-label="Toggle language list"
                  style={{
                    padding: "0 14px",
                    borderRadius: 12,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  ▾
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  style={{
                    padding: "0 16px",
                    borderRadius: 12,
                    border: "none",
                    background: GREEN,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  추가
                </button>
              </div>

              {errorText && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#c0392b" }}>
                  {errorText}
                </div>
              )}

              {openList && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    maxHeight: 260,
                    overflowY: "auto",
                    zIndex: 5,
                  }}
                >
                  <ul
                    ref={listRef}
                    role="listbox"
                    aria-label="언어 목록"
                    style={{ listStyle: "none", margin: 0, padding: 8 }}
                  >
                    {filtered.length === 0 ? (
                      <li style={{ padding: "10px 12px", color: "#777" }}>
                        결과가 없습니다. 정확히 입력하거나 다른 언어를 검색해 보세요.
                      </li>
                    ) : (
                      filtered.map((l, i) => {
                        const isActive = activeIndex === i;
                        const isSelected = selectedLang === l;
                        return (
                          <li
                            key={l}
                            role="option"
                            aria-selected={isActive || isSelected}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => {
                              setSelectedLang(l); 
                              setQuery(l);        
                              setErrorText("");
                            }}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              background: isSelected
                                ? "rgba(102,163,149,0.25)"
                                : isActive
                                ? "rgba(102,163,149,0.12)"
                                : "transparent",
                              fontWeight: isSelected ? 700 : 500,
                            }}
                          >
                            {l}
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: 12,
                display: "grid",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 14, color: "#444", fontWeight: 600 }}>
                나의 언어 목록
              </div>

              {customLangs.length === 0 ? (
                <div style={{ fontSize: 14, color: "#777" }}>
                  아직 추가한 언어가 없습니다.
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {customLangs.map((label) => (
                    <span
                      key={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: `1px solid ${GREEN}`,
                        background: "#fff",
                        fontSize: 13,
                      }}
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeCustom(label)}
                        aria-label={`${label} 삭제`}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: 16,
                          lineHeight: 1,
                          color: "#888",
                        }}
                        title="삭제"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={closeAdd}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FindFriendSidebar;
