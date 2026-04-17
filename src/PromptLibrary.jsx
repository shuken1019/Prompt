import { useMemo, useRef, useState } from "react";
import { PROMPTS } from "./data/prompts";

const CATEGORIES = ["전체", "생산성", "리서치", "콘텐츠", "AI 워크플로우", "자동화", "코딩", "범용", "마케팅", "세일즈", "고객관리", "제품", "엔지니어링", "글쓰기", "콘텐츠 전략", "SEO", "SaaS", "성장마케팅", "코드 작업", "생산성·시스템", "디버깅", "랜딩페이지", "수익화"];

const CATEGORY_GROUPS = [
  {
    title: "Core",
    categories: ["전체", "생산성", "리서치", "콘텐츠", "AI 워크플로우", "자동화", "코딩"],
  },
  {
    title: "Business",
    categories: ["마케팅", "세일즈", "고객관리", "제품", "엔지니어링"],
  },
  {
    title: "Specialized",
    categories: ["범용", "글쓰기", "콘텐츠 전략", "SEO", "SaaS", "성장마케팅", "코드 작업", "생산성·시스템", "디버깅", "랜딩페이지", "수익화"],
  },
];

function CopyIcon({ copied }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function AIButton({ label, url, bg, color, hoverBg, icon, onOpen, provider }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => onOpen(e, url, provider)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        fontSize: "11px", fontWeight: 600,
        padding: "4px 9px", borderRadius: "8px",
        background: hov ? hoverBg : bg,
        color: color,
        textDecoration: "none",
        transition: "background 0.12s",
        userSelect: "none",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

async function copyPromptText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function getPromptBody(prompt, languageView) {
  if (languageView === "english") {
    return prompt.bodyEn || prompt.body;
  }

  return prompt.bodyKo || prompt.body;
}

function PromptCard({ prompt, languageView }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hint, setHint] = useState("");
  const hintTimerRef = useRef(null);
  const displayBody = getPromptBody(prompt, languageView);
  const bodyIsKorean = /[가-힣]/.test(displayBody);
  const displayTitle = languageView === "english" ? prompt.en : prompt.title;
  const displaySubtitle = languageView === "english" ? prompt.title : prompt.en;
  const fallbackNotice =
    languageView === "english"
      ? (!prompt.bodyEn && prompt.body ? "English translation coming soon" : "")
      : (!prompt.bodyKo && prompt.body ? "한국어 번역 준비 중" : "");

  const showHint = (message) => {
    setHint(message);
    window.clearTimeout(hintTimerRef.current);
    hintTimerRef.current = window.setTimeout(() => setHint(""), 2400);
  };

  const showCopiedState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopy = async () => {
    const didCopy = await copyPromptText(displayBody);
    if (didCopy) {
      showCopiedState();
      showHint("복사 완료. 원하는 AI에 바로 붙여 넣어 사용하세요.");
    }
  };

  const openAI = async (e, url, provider) => {
    e.stopPropagation();
    const didCopy = await copyPromptText(displayBody);
    if (didCopy) {
      showCopiedState();
      showHint("프롬프트를 복사하고 새 창을 열었어요.");
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const encoded = encodeURIComponent(displayBody);

  const catStyle = {
    "생산성":     { badge: "#FEF3C7", badgeText: "#92400E", accent: "#F59E0B" },
    "리서치":     { badge: "#DBEAFE", badgeText: "#1E40AF", accent: "#3B82F6" },
    "콘텐츠":     { badge: "#FCE7F3", badgeText: "#9D174D", accent: "#EC4899" },
    "AI 워크플로우": { badge: "#D1FAE5", badgeText: "#065F46", accent: "#10B981" },
    "자동화":     { badge: "#EDE9FE", badgeText: "#5B21B6", accent: "#8B5CF6" },
    "코딩":       { badge: "#FFEDD5", badgeText: "#9A3412", accent: "#F97316" },
    "범용":       { badge: "#F0FDF4", badgeText: "#166534", accent: "#22C55E" },
    "마케팅":     { badge: "#FFF1F2", badgeText: "#9F1239", accent: "#F43F5E" },
    "세일즈":     { badge: "#ECFEFF", badgeText: "#164E63", accent: "#06B6D4" },
    "고객관리":   { badge: "#FFF7ED", badgeText: "#7C2D12", accent: "#EA580C" },
    "제품":       { badge: "#F5F3FF", badgeText: "#4C1D95", accent: "#7C3AED" },
    "엔지니어링": { badge: "#F0F9FF", badgeText: "#0C4A6E", accent: "#0EA5E9" },
    "글쓰기":     { badge: "#FDF4FF", badgeText: "#701A75", accent: "#D946EF" },
    "콘텐츠 전략": { badge: "#FFF8F0", badgeText: "#7C3D12", accent: "#F97316" },
    "SEO":        { badge: "#F0FDF4", badgeText: "#14532D", accent: "#16A34A" },
    "SaaS":       { badge: "#EFF6FF", badgeText: "#1E3A5F", accent: "#2563EB" },
    "성장마케팅":  { badge: "#FFF0F6", badgeText: "#831843", accent: "#EC4899" },
    "코드 작업":  { badge: "#F8F5FF", badgeText: "#3B0764", accent: "#7C3AED" },
    "생산성·시스템": { badge: "#FEFCE8", badgeText: "#713F12", accent: "#CA8A04" },
    "디버깅":     { badge: "#FFF1F2", badgeText: "#881337", accent: "#E11D48" },
    "랜딩페이지": { badge: "#F0FDFA", badgeText: "#134E4A", accent: "#0D9488" },
    "수익화":     { badge: "#FFFBEB", badgeText: "#78350F", accent: "#D97706" },
  }[prompt.category] || { badge: "#F3F4F6", badgeText: "#374151", accent: "#9CA3AF" };

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--color-background-primary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem 1.3rem",
        cursor: "pointer",
        transition: "box-shadow 0.15s, transform 0.1s",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: hovered ? `0 6px 24px rgba(0,0,0,0.1)` : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {/* 상단: 배지 + 카피 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px",
            background: catStyle.badge, color: catStyle.badgeText, whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}>
            {prompt.category}
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
            #{prompt.id}
          </span>
        </div>
        <span style={{
          fontSize: "12px", display: "flex", alignItems: "center", gap: "4px",
          color: copied ? "#16A34A" : "var(--color-text-tertiary)",
          whiteSpace: "nowrap", flexShrink: 0,
          fontWeight: copied ? 600 : 400,
          transition: "color 0.15s",
        }}>
          <CopyIcon copied={copied} />
          {copied ? "복사됨" : "복사"}
        </span>
      </div>

      {/* 제목 */}
      <div>
        <p style={{
          fontWeight: 700, fontSize: "17px", margin: "0 0 3px",
          color: "var(--color-text-primary)", lineHeight: 1.3, letterSpacing: "-0.01em",
        }}>
          {displayTitle}
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", margin: 0, letterSpacing: "0.01em" }}>
          {displaySubtitle}
        </p>
      </div>

      {/* 본문 미리보기 */}
      <div>
        <p style={{
          fontSize: "13px", color: "var(--color-text-secondary)", margin: 0,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", lineHeight: 1.65,
          paddingTop: "4px",
        }}>
          {displayBody}
        </p>
        {fallbackNotice ? (
          <p style={{
            margin: "0.45rem 0 0",
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.02em",
          }}>
            {fallbackNotice}
          </p>
        ) : null}
      </div>

      {/* AI 연동 버튼 */}
      <div
        style={{ display: "flex", gap: "6px", paddingTop: "2px" }}
        onClick={e => e.stopPropagation()}
      >
        {[
          {
            label: "Claude",
            url: `https://claude.ai/new?q=${encoded}`,
            bg: "rgba(124,58,237,0.08)",
            color: "var(--color-accent)",
            hoverBg: "rgba(124,58,237,0.16)",
            provider: "claude",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
          },
          {
            label: "ChatGPT",
            url: `https://chatgpt.com/?q=${encoded}`,
            bg: "rgba(16,163,127,0.08)",
            color: "#10A37F",
            hoverBg: "rgba(16,163,127,0.16)",
            provider: "chatgpt",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            ),
          },
          {
            label: "Gemini",
            url: `https://gemini.google.com/app#prompt=${encoded}`,
            bg: "rgba(66,133,244,0.08)",
            color: "#4285F4",
            hoverBg: "rgba(66,133,244,0.16)",
            provider: "gemini",
            icon: (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ),
          },
        ].map(({ label, url, bg, color, hoverBg, icon, provider }) => (
          <AIButton
            key={label}
            label={label}
            url={url}
            bg={bg}
            color={color}
            hoverBg={hoverBg}
            icon={icon}
            onOpen={openAI}
            provider={provider}
          />
        ))}
      </div>

      <div style={{
        minHeight: "18px",
        fontSize: "11px",
        color: hint ? "var(--color-text-secondary)" : "transparent",
        lineHeight: 1.5,
        transition: "color 0.15s ease",
      }}>
        {hint || "."}
      </div>
    </div>
  );
}


export default function PromptLibrary({ languageView }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = useMemo(() => {
    return PROMPTS.filter(p => {
      const matchCat = activeCategory === "전체" || p.category === activeCategory;
      const q = query.toLowerCase();
      const searchText = [
        p.title,
        p.en,
        p.body,
        p.bodyKo,
        p.bodyEn,
        p.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQ = !q || searchText.includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  const counts = useMemo(() => {
    const map = { "전체": PROMPTS.length };
    PROMPTS.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);

  const groupedFiltered = useMemo(() => {
    const categoryOrder = CATEGORIES.filter(category => category !== "전체");
    const groups = categoryOrder
      .map(category => ({
        category,
        items: filtered.filter(prompt => prompt.category === category),
      }))
      .filter(group => group.items.length > 0);

    if (activeCategory !== "전체") {
      return groups.filter(group => group.category === activeCategory);
    }

    return groups;
  }, [activeCategory, filtered]);

  return (
    <div style={{ padding: "1.75rem 0 3rem", fontFamily: "var(--font-sans)" }}>
      <h2 style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>프롬프트 라이브러리</h2>

      {/* 검색바 */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative" }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{
            position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)", pointerEvents: "none",
          }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="프롬프트 검색 — 키워드, 카테고리, ID"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              paddingLeft: "46px", paddingRight: "16px",
              height: "48px", width: "100%", boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        </div>
      </div>


      <div style={{
        fontSize: "12px",
        color: "var(--color-text-tertiary)",
        lineHeight: 1.5,
        marginBottom: "1.15rem",
      }}>
        현재는 선택한 언어 기준으로 제목이 바뀌고, 번역 데이터가 없는 상세 내용은 원문으로 표시됩니다.
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: "grid", gap: "0.95rem", marginBottom: "1.5rem" }}>
        {CATEGORY_GROUPS.map(group => (
          <div key={group.title}>
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
              marginBottom: "0.55rem",
            }}>
              {group.title}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {group.categories.map(cat => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      border: active ? "1px solid transparent" : "1px solid var(--color-border-secondary)",
                      background: active ? "var(--color-text-primary)" : "var(--color-background-primary)",
                      color: active ? "var(--color-background-primary)" : "var(--color-text-secondary)",
                      transition: "all 0.15s",
                      lineHeight: 1,
                      boxShadow: active ? "0 12px 24px rgba(33, 24, 14, 0.12)" : "none",
                    }}
                  >
                    {cat}
                    <span style={{
                      marginLeft: "5px",
                      fontSize: "11px",
                      opacity: active ? 0.7 : 0.55,
                      fontWeight: 400,
                    }}>
                      {counts[cat] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 결과 수 */}
      <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)", marginBottom: "1.25rem" }}>
        <strong style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>{filtered.length}</strong>개 표시 중 · 전체 {PROMPTS.length}개
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-secondary)", fontSize: "15px" }}>
          검색 결과가 없어요. 다른 키워드로 시도해 보세요.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.6rem" }}>
          {groupedFiltered.map(group => (
            <section key={group.category}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "0.9rem",
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "18px",
                    lineHeight: 1.2,
                    color: "var(--color-text-primary)",
                  }}>
                    {group.category}
                  </h3>
                  <p style={{
                    margin: "0.2rem 0 0",
                    fontSize: "12px",
                    color: "var(--color-text-tertiary)",
                  }}>
                    {group.items.length} prompts
                  </p>
                </div>
                <div style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--color-border-tertiary)",
                  minWidth: "40px",
                }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "14px",
              }}>
                {group.items.map(prompt => <PromptCard key={prompt.id} prompt={prompt} languageView={languageView} />)}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
