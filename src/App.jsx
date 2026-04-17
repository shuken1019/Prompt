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

  useEffect(() => {
    localStorage.setItem('languageView', languageView)
  }, [languageView])

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-bg-page)' }}>
      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
      <ScrollTopButton />
      <div className="app-container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* 헤더 */}
        <header style={{
          padding: '2rem 0 2.4rem',
          marginBottom: '0.5rem',
        }}>
          <div className="hero-card" style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            borderRadius: '28px',
            border: '1px solid var(--color-border-secondary)',
            background: 'linear-gradient(135deg, var(--color-hero-surface) 0%, var(--color-hero-surface-strong) 100%)',
            boxShadow: '0 24px 60px rgba(61, 43, 20, 0.08)',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-30% auto auto -10%',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--color-accent-glow-strong) 0%, rgba(0,0,0,0) 72%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            }} />

            <div className="hero-inner" style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ maxWidth: '720px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.74)',
                  border: '1px solid rgba(191, 149, 73, 0.28)',
                  color: 'var(--color-accent)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 0 5px var(--color-accent-glow)',
                    display: 'inline-block',
                  }} />
                  Prompt Library
                </div>

                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5.6vw, 4.2rem)',
                  fontWeight: 800,
                  margin: '0 0 1rem',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1.02,
                }}>
                  Prompt <span style={{ color: 'var(--color-accent)' }}>Library</span>
                </h1>

                <p style={{
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.75,
                  maxWidth: '56ch',
                }}>
                  카테고리별로 엄선한 프롬프트 모음입니다. 카드를 클릭하면 바로 복사되고,
                  Claude·ChatGPT·Gemini 어디에나 바로 붙여 넣어 쓸 수 있어요.
                </p>

                <div className="hero-notice" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginTop: '1.4rem',
                  padding: '0.9rem 1.1rem',
                  borderRadius: '18px',
                  background: 'rgba(33, 24, 14, 0.92)',
                  color: '#F8F1E6',
                  boxShadow: '0 18px 36px rgba(33, 24, 14, 0.18)',
                }}>
                  <span className="hero-notice-icon" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '12px',
                    background: 'var(--color-accent)',
                    color: '#1F1408',
                    fontWeight: 800,
                    fontSize: '15px',
                  }}>
                    !
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.5 }}>
                    사용 전 체크: 카드 안의 <strong style={{ color: '#F5CD73' }}>[...]</strong> 부분만
                    본인 상황에 맞게 바꿔서 쓰면 됩니다.
                  </span>
                </div>
              </div>

              <div className="hero-controls" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.8rem',
                minWidth: 'fit-content',
              }}>
                <LanguageToggle languageView={languageView} setLanguageView={setLanguageView} />
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <button
                  onClick={() => setGuideOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--color-border-secondary)',
                    background: 'rgba(255,255,255,0.6)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6.5 6C6.5 5.17 7.17 4.5 8 4.5s1.5.67 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
                  </svg>
                  이용 가이드
                </button>
              </div>
            </div>
          </div>
        </header>

        <PromptLibrary languageView={languageView} />
      </div>
    </div>
  )
}

export default App
