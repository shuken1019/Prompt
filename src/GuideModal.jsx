import { useEffect } from 'react'

const STEPS = [
  {
    num: '01',
    title: '카테고리 선택',
    desc: '상단 탭에서 원하는 카테고리를 골라요. 생산성·리서치·마케팅·자동화 등 23개 카테고리로 정리되어 있어요.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: '프롬프트 카드 클릭 → 복사',
    desc: '마음에 드는 카드를 클릭하면 텍스트가 클립보드에 바로 복사됩니다. 별도 버튼을 누를 필요가 없어요.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="8" y="8" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: '[  ] 안을 내 상황으로 바꾸기',
    desc: '프롬프트 안의 [대괄호] 부분이 바꿔야 할 자리예요. 예: [팀을 설명] → "5명의 스타트업 마케팅 팀"',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L13 14l-4 1 1-4 8.5-8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'AI에 바로 열기',
    desc: '카드 하단의 Claude·ChatGPT·Gemini 버튼을 누르면 복사된 프롬프트를 들고 해당 AI 창이 바로 열려요.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M15 3h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const TIPS = [
  { label: '검색', text: '검색창에 키워드를 입력하면 제목·본문에서 동시에 찾아줘요.' },
  { label: '언어 전환', text: '우측 상단 Korean / English 버튼으로 한국어·영어 프롬프트를 전환할 수 있어요.' },
  { label: '테마', text: 'Day / Night / Auto로 다크모드를 설정할 수 있어요. Auto는 시스템 설정을 따라가요.' },
]

export default function GuideModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 10, 4, 0.62)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '88svh',
          overflowY: 'auto',
          borderRadius: '28px',
          background: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-secondary)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
          padding: 'clamp(1.5rem, 4vw, 2.4rem)',
        }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              background: 'var(--color-accent-glow)',
              color: 'var(--color-accent)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
              How to use
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>
              이용 가이드
            </h2>
            <p style={{ margin: '0.5rem 0 0', fontSize: '14px', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
              4단계로 끝나는 프롬프트 활용법
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--color-border-secondary)',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 스텝 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1.1rem 1.2rem',
                borderRadius: '18px',
                border: '1px solid var(--color-border-secondary)',
                background: 'var(--color-hero-surface)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--color-accent-glow)',
                color: 'var(--color-accent)',
              }}>
                {step.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.12em' }}>
                    STEP {step.num}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {step.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* [  ] 예시 박스 */}
        <div style={{
          padding: '1rem 1.2rem',
          borderRadius: '16px',
          background: 'rgba(33, 24, 14, 0.88)',
          marginBottom: '1.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '11px', fontWeight: 700, color: 'rgba(248, 241, 230, 0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            예시
          </p>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#F8F1E6', lineHeight: 1.7 }}>
            <span style={{ color: 'rgba(248,241,230,0.45)' }}>"[팀을 설명]에 맞는 성과 관리 시스템을 설계해줘."</span>
            <br />
            <span style={{ color: '#F5CD73', fontWeight: 600 }}>↓ 이렇게 바꾸세요</span>
            <br />
            <span style={{ color: '#fff' }}>"</span>
            <span style={{ color: '#F5CD73', fontWeight: 600 }}>마케팅 5명·개발 3명의 초기 스타트업 팀</span>
            <span style={{ color: '#fff' }}>에 맞는 성과 관리 시스템을 설계해줘."</span>
          </p>
        </div>

        {/* Gemini 연결 안될 때 */}
        <div style={{
          padding: '1.2rem',
          borderRadius: '18px',
          border: '1px solid var(--color-border-secondary)',
          background: 'var(--color-hero-surface)',
          marginBottom: '1.8rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Gemini 버튼을 눌렀는데 입력창이 안 채워져요
            </span>
          </div>
          <p style={{ margin: '0 0 0.9rem', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
            Gemini는 보안 정책상 외부에서 입력창을 바로 채울 수 없어요.
            크롬 확장을 한 번만 로드해 두면 이후엔 버튼 클릭만으로 자동 입력됩니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              '크롬 주소창에 chrome://extensions 를 열고 개발자 모드를 켭니다.',
              '「압축해제된 확장 프로그램 로드」를 누르고 extensions/gemini-autofill 폴더를 선택합니다.',
              '이제 Gemini 버튼을 누르면 입력창이 자동으로 채워집니다.',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  color: '#1F1408',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginTop: '1px',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.65 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '0.9rem',
            padding: '0.6rem 0.9rem',
            borderRadius: '10px',
            background: 'rgba(185, 133, 52, 0.1)',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}>
            확장 경로: <strong style={{ color: 'var(--color-text-primary)' }}>extensions/gemini-autofill</strong>
          </div>
        </div>

        {/* 추가 팁 */}
        <div>
          <p style={{ margin: '0 0 0.8rem', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            추가 팁
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13.5px', lineHeight: 1.6 }}>
                <span style={{
                  flexShrink: 0,
                  padding: '1px 8px',
                  borderRadius: '6px',
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '2px',
                }}>
                  {tip.label}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '2rem',
            padding: '0.85rem',
            borderRadius: '14px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#1F1408',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
