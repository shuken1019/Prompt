import { useState, useEffect } from 'react'
import PromptLibrary from './PromptLibrary'
import GuideModal from './GuideModal'
import './App.css'

const THEMES = [
  { value: 'light', label: 'Day' },
  { value: 'dark',  label: 'Night' },
  { value: 'auto',  label: 'Auto' },
]

const LANGUAGES = [
  { value: 'korean', label: 'Korean' },
  { value: 'english', label: 'English' },
]

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateSystemTheme)
      return () => mediaQuery.removeEventListener('change', updateSystemTheme)
    }

    mediaQuery.addListener(updateSystemTheme)
    return () => mediaQuery.removeListener(updateSystemTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const root = document.documentElement
    const resolvedTheme = theme === 'auto' ? systemTheme : theme

    root.setAttribute('data-theme', resolvedTheme)
    root.setAttribute('data-theme-mode', theme)
  }, [theme, systemTheme])

  return [theme, setTheme]
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      background: 'var(--color-border-tertiary)',
      borderRadius: '10px',
      padding: '3px',
    }}>
      {THEMES.map(t => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: theme === t.value ? 600 : 400,
            background: theme === t.value ? 'var(--color-background-primary)' : 'transparent',
            color: theme === t.value ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            boxShadow: theme === t.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function LanguageToggle({ languageView, setLanguageView }) {
  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      background: 'var(--color-border-tertiary)',
      borderRadius: '10px',
      padding: '3px',
    }}>
      {LANGUAGES.map(option => (
        <button
          key={option.value}
          onClick={() => setLanguageView(option.value)}
          title={option.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: languageView === option.value ? 600 : 400,
            background: languageView === option.value ? 'var(--color-background-primary)' : 'transparent',
            color: languageView === option.value ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            boxShadow: languageView === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function GuideButton({ isEn, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 28px',
        borderRadius: '16px',
        border: '1px solid var(--color-accent)',
        background: hov ? 'var(--color-accent)' : 'var(--color-accent-glow)',
        color: hov ? '#1F1408' : 'var(--color-accent)',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.18s',
        marginBottom: '1.75rem',
        boxShadow: hov
          ? '0 8px 28px rgba(185,133,52,0.38)'
          : '0 2px 12px rgba(185,133,52,0.14)',
        transform: hov ? 'translateY(-1px)' : 'none',
        letterSpacing: '-0.01em',
      }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '28px', height: '28px', borderRadius: '9px',
        background: hov ? 'rgba(31,20,8,0.12)' : 'var(--color-accent)',
        color: hov ? '#1F1408' : '#fff',
        fontSize: '14px',
        flexShrink: 0,
        transition: 'all 0.18s',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M6.5 6C6.5 5.17 7.17 4.5 8 4.5s1.5.67 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="0.8" fill="currentColor"/>
        </svg>
      </span>
      {isEn ? 'How to use this library' : '이용 가이드 보기'}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{
        opacity: 0.7,
        transform: hov ? 'translateX(2px)' : 'none',
        transition: 'transform 0.18s',
      }}>
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로"
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        border: '1px solid var(--color-border-secondary)',
        background: 'var(--color-background-primary)',
        color: 'var(--color-text-secondary)',
        boxShadow: '0 8px 24px rgba(33,24,14,0.14)',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.2s, transform 0.2s',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

function App() {
  const [theme, setTheme] = useTheme()
  const [languageView, setLanguageView] = useState(() => localStorage.getItem('languageView') || 'korean')
  const [guideOpen, setGuideOpen] = useState(false)
  const isEn = languageView === 'english'

  useEffect(() => {
    localStorage.setItem('languageView', languageView)
  }, [languageView])

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-bg-page)' }}>
      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} languageView={languageView} />}
      <ScrollTopButton />

      {/* ── Sticky Nav Bar ─────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        borderBottom: '1px solid var(--color-border-tertiary)',
        background: 'var(--color-bg-page)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.4 7.6L18 8.4L14 12.2L15 18L10 15.2L5 18L6 12.2L2 8.4L7.6 7.6L10 2Z"
                fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontSize: '15px',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Prompt Library
            </span>
          </div>

          {/* Controls */}
          <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageToggle languageView={languageView} setLanguageView={setLanguageView} />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, var(--color-accent-glow-strong) 0%, transparent 65%)',
          pointerEvents: 'none',
          opacity: 0.9,
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, var(--color-border-secondary) 20%, var(--color-border-secondary) 80%, transparent 100%)',
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem clamp(3rem, 6vw, 5rem)',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'var(--color-accent-glow)',
            border: '1px solid rgba(185,133,52,0.25)',
            color: 'var(--color-accent)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--color-accent)',
              boxShadow: '0 0 0 4px var(--color-accent-glow)',
              display: 'inline-block',
            }} />
            {isEn ? 'AI Prompt Library' : 'AI 프롬프트 라이브러리'}
          </div>

          {/* Main title */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.6rem)',
            fontWeight: 900,
            margin: '0 0 1.25rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}>
            {isEn ? (
              <>Better prompts,<br />
              <span style={{ color: 'var(--color-accent)' }}>better results.</span></>
            ) : (
              <>프롬프트를 찾고,<br />
              <span style={{ color: 'var(--color-accent)' }}>바로 써요.</span></>
            )}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'var(--color-text-secondary)',
            margin: '0 auto 2.25rem',
            lineHeight: 1.75,
            maxWidth: '50ch',
          }}>
            {isEn
              ? 'Curated prompts for every task. Click to copy, paste into any AI — Claude, ChatGPT, or Gemini.'
              : '카테고리별로 엄선한 프롬프트 모음. 카드를 클릭하면 바로 복사돼서 Claude·ChatGPT·Gemini에 바로 쓸 수 있어요.'}
          </p>

          {/* Stats chips */}
          <div className="hero-stats" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '2.25rem',
          }}>
            {[
              { num: '506', label: isEn ? 'prompts' : '개 프롬프트' },
              { num: '23', label: isEn ? 'categories' : '개 카테고리' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 16px',
                borderRadius: '999px',
                border: '1px solid var(--color-border-secondary)',
                background: 'var(--color-background-primary)',
                boxShadow: '0 2px 8px rgba(33,24,14,0.06)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
              }}>
                <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '14px' }}>
                  {s.num}
                </strong>
                {s.label}
              </div>
            ))}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1px solid var(--color-border-secondary)',
              background: 'var(--color-background-primary)',
              boxShadow: '0 2px 8px rgba(33,24,14,0.06)',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
            }}>
              <span style={{ fontWeight: 700, color: '#7C3AED', fontSize: '14px' }}>Claude</span>
              <span style={{ color: 'var(--color-border-primary)' }}>·</span>
              <span style={{ fontWeight: 700, color: '#10A37F', fontSize: '14px' }}>ChatGPT</span>
              <span style={{ color: 'var(--color-border-primary)' }}>·</span>
              <span style={{ fontWeight: 700, color: '#4285F4', fontSize: '14px' }}>Gemini</span>
            </div>
          </div>

          {/* Guide CTA */}
          <GuideButton isEn={isEn} onClick={() => setGuideOpen(true)} />

          {/* Notice bar */}
          <div className="hero-notice" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '14px',
            border: '1px solid var(--color-border-secondary)',
            background: 'var(--color-background-primary)',
            fontSize: '13.5px',
            color: 'var(--color-text-secondary)',
            boxShadow: '0 4px 16px rgba(33,24,14,0.07)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '22px', height: '22px', borderRadius: '8px',
              background: 'var(--color-accent-glow)',
              color: 'var(--color-accent)', fontWeight: 800, fontSize: '13px', flexShrink: 0,
            }}>
              ✦
            </span>
            <span style={{ lineHeight: 1.5 }}>
              {isEn
                ? <>Replace the <strong style={{ color: 'var(--color-accent)', fontWeight: 700 }}>[bracketed]</strong> parts with your own context before using.</>
                : <>카드 안의 <strong style={{ color: 'var(--color-accent)', fontWeight: 700 }}>[대괄호]</strong> 부분만 바꿔서 쓰면 돼요.</>}
            </span>
          </div>
        </div>
      </section>

      {/* ── Prompt Library ─────────────────────────────────────── */}
      <div className="app-container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem' }}>
        <PromptLibrary languageView={languageView} />
      </div>
    </div>
  )
}

export default App
