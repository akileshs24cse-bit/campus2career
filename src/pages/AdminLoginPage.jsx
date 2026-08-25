import React, { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'

// Navigate helper
function navigate(to, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function AdminLoginPage() {
  const [form, setForm] = useState({ email: 'admin@campus2career.com', password: 'admin123' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in as admin
  useEffect(() => {
    if (adminService.isLoggedIn()) navigate('/admin/dashboard', true)
  }, [])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    const result = await adminService.login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error || 'Invalid admin credentials.')
    }
  }

  const S = styles
  return (
    <div style={S.page}>
      <div style={S.bgGrid} />
      <div style={S.glowOne} />
      <div style={S.glowTwo} />

      <div style={S.card} className="admin-login-card">
        <style>{`
          @media (max-width: 768px) {
            .admin-login-card {
              grid-template-columns: 1fr !important;
              max-width: 480px !important;
              margin: 16px !important;
            }
            .admin-info-pane {
              padding: 24px 20px !important;
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            }
            .admin-form-pane {
              padding: 24px 20px !important;
            }
          }
        `}</style>
        <div style={S.infoPane} className="admin-info-pane">
          <div style={S.badge}>Authorized Staff Only</div>
          <div style={S.brandRow}>
            <div style={S.shieldWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d7ff75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div style={S.brand}>
              Campus<span style={{ color: '#ff9d5c' }}>2</span>Career
            </div>
          </div>

          <h1 style={S.heroTitle}>Placement & Content Administration Portal.</h1>
          <p style={S.heroText}>
            Authorized administrators can manage recruiter skill matrices, 7-day preparation sprints, and student journeys.
          </p>


        </div>

        <div style={S.formPane} className="admin-form-pane">
          <div style={S.header}>
            <div>
              <div style={S.subtitle}>Institutional Console</div>
              <div style={S.title}>Admin Sign In</div>
            </div>
          </div>

          {error && (
            <div style={S.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={S.form}>
            <div style={S.formGroup}>
              <label style={S.label}>Admin Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@campus2career.com"
                style={S.input}
                autoComplete="username"
                required
              />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={S.input}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" style={S.submitBtn} disabled={loading}>
              {loading ? (
                <span style={S.spinner} />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div style={S.backLink}>
            <a href="/" style={{ color: '#8aada4', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Return to Student Website
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-login-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, rgba(146, 224, 181, 0.2), transparent 35%), #071915',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '28px 18px',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(215,255,117,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(215,255,117,0.06) 1px, transparent 1px)
    `,
    backgroundSize: '36px 36px',
    maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
    pointerEvents: 'none',
  },
  glowOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    left: '8%',
    top: '10%',
    background: 'rgba(215,255,117,0.08)',
    filter: 'blur(80px)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  glowTwo: {
    position: 'absolute',
    width: 360,
    height: 360,
    right: '8%',
    bottom: '8%',
    background: 'rgba(232,98,42,0.12)',
    filter: 'blur(100px)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 960,
    background: 'rgba(11, 24, 23, 0.92)',
    border: '1px solid rgba(215,255,117,0.18)',
    borderRadius: 28,
    boxShadow: '0 28px 90px rgba(0,0,0,0.46)',
    backdropFilter: 'blur(18px)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'hidden',
  },
  infoPane: {
    background: 'linear-gradient(180deg, rgba(16, 38, 35, 0.96) 0%, rgba(9, 20, 18, 0.9) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    padding: '38px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    background: 'rgba(215,255,117,0.12)',
    border: '1px solid rgba(215,255,117,0.25)',
    color: '#d7ff75',
    borderRadius: 999,
    padding: '7px 12px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  shieldWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: 'linear-gradient(135deg, rgba(215,255,117,0.18), rgba(215,255,117,0.08))',
    border: '1px solid rgba(215,255,117,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brand: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-1px',
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 1.15,
    letterSpacing: '-1px',
    color: '#fff',
    margin: '0 0 14px',
    fontWeight: 800,
  },
  heroText: {
    margin: 0,
    color: '#9bb4af',
    fontSize: 14,
    lineHeight: 1.7,
    maxWidth: 380,
  },
  defaultCredentialsBox: {
    marginTop: 26,
    background: 'rgba(215,255,117,0.06)',
    border: '1px solid rgba(215,255,117,0.2)',
    borderRadius: 16,
    padding: '14px 16px',
  },
  formPane: {
    padding: '38px 32px',
    background: 'rgba(10, 20, 18, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 11,
    color: '#8aada4',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#f8fbf8',
    letterSpacing: '-0.8px',
  },
  errorBox: {
    background: 'rgba(232,98,42,0.12)',
    border: '1px solid rgba(232,98,42,0.28)',
    borderRadius: 12,
    padding: '10px 12px',
    color: '#f7b299',
    fontSize: 13,
    marginBottom: 18,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  label: {
    color: '#b3cbc5',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  submitBtn: {
    marginTop: 6,
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #d7ff75 0%, #b8ed45 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#10251f',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'inherit',
    boxShadow: '0 18px 32px rgba(183, 237, 69, 0.2)',
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(16,37,31,0.2)',
    borderTop: '2px solid #10251f',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  backLink: {
    marginTop: 24,
    textAlign: 'center',
  },
}

export default AdminLoginPage
