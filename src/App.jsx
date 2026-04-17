import { useState, useEffect } from 'react'
import PromptLibrary from './PromptLibrary'
import './App.css'

const THEMES = [
  { value: 'light', label: 'Day' },
  { value: 'dark',  label: 'Night' },
  { value: 'auto',  label: 'Auto' },
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

function App() {
  const [theme, setTheme] = useTheme()

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-bg-page)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* 헤더 */}
        <header style={{
          padding: '2rem 0 2.4rem',
          marginBottom: '0.5rem',
        }}>
          <div style={{
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

            <div style={{
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

                <div style={{
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
                  <span style={{
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

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.8rem',
                minWidth: 'fit-content',
              }}>
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.35rem 0.2rem',
                  borderRadius: '999px',
                  color: 'var(--color-text-tertiary)',
                  fontSize: '12px',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    display: 'inline-block',
                  }} />
                  클릭하면 즉시 복사
                </div>
              </div>
            </div>
          </div>
        </header>

        <PromptLibrary />
      </div>
    </div>
  )
}

export default App
