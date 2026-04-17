import { useState, useEffect } from 'react'
import PromptLibrary from './PromptLibrary'
import './App.css'

const THEMES = [
  { value: 'light', label: '낮', icon: '☀️' },
  { value: 'dark',  label: '밤', icon: '🌙' },
  { value: 'auto',  label: '자동', icon: '⚙️' },
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
          <span style={{ fontSize: '13px' }}>{t.icon}</span>
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
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* 헤더 */}
        <header style={{
          padding: '2.5rem 0 2rem',
          borderBottom: 'none',
          marginBottom: '0',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '8px',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 0 3px var(--color-accent-glow)',
                  display: 'inline-block',
                }} />
                300 Prompts
              </div>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                margin: '0 0 8px',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
                프롬프트<br />
                <span style={{ color: 'var(--color-accent)' }}>라이브러리</span>
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text-tertiary)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                카드를 클릭하면 바로 복사됩니다 · 생산성·코딩·AI 등 6개 카테고리
              </p>
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <PromptLibrary />
      </div>
    </div>
  )
}

export default App
