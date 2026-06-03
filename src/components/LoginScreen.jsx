import { useState } from 'react'
import { signIn, signUp } from '../hooks/useAuth'

export default function LoginScreen({ onGuest }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const errMsg = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)
    if (errMsg) {
      setError(errMsg)
    } else if (mode === 'signup') {
      setSuccess('Check your email to confirm your account, then sign in.')
      setMode('signin')
    }
    // on successful sign-in, useAuth will update and App will re-render
  }

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: '1rem',
    fontFamily: 'var(--font-ui)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(2rem + env(safe-area-inset-top)) 1.25rem calc(2rem + env(safe-area-inset-bottom))',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <img src="/logo.svg" alt="" style={{ width: 44, height: 44 }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--blue)',
          fontSize: '1.8rem',
          letterSpacing: '5px',
          textShadow: '0 0 30px var(--blue-glow)',
        }}>
          MATHCRACK
        </span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '2px', fontFamily: 'var(--font-mono)', marginBottom: '2.5rem' }}>
        PRE-ALGEBRA &amp; ALGEBRA 1
      </p>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.75rem 1.5rem',
      }}>
        {/* Tab switch */}
        <div style={{
          display: 'flex', gap: '0.25rem',
          background: 'var(--bg-elevated)', borderRadius: 10,
          padding: '0.25rem', marginBottom: '1.5rem',
        }}>
          {['signin', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setSuccess(null) }}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--bg-mid)' : 'transparent',
                color: mode === m ? 'var(--text)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                letterSpacing: '1px',
                boxShadow: mode === m ? '0 1px 4px var(--shadow)' : 'none',
                transition: 'background 0.15s',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'SIGN UP'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
              EMAIL
            </label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
              PASSWORD
            </label>
            <input
              type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.7rem 0.9rem', borderRadius: 8,
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)', fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.7rem 0.9rem', borderRadius: 8,
              background: 'var(--correct-dim)',
              border: '1px solid var(--correct)',
              color: 'var(--correct)', fontSize: '0.82rem',
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              background: loading ? 'var(--bg-elevated)' : 'var(--blue)',
              border: 'none', borderRadius: 10,
              color: '#fff', cursor: loading ? 'default' : 'pointer',
              fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
              fontWeight: 'bold', letterSpacing: '1px',
              boxShadow: loading ? 'none' : '0 0 20px var(--blue-glow)',
              transition: 'background 0.2s',
              marginTop: '0.25rem',
            }}
          >
            {loading ? '...' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>
      </div>

      {/* Guest option */}
      <button
        onClick={onGuest}
        style={{
          marginTop: '1.25rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.78rem',
          fontFamily: 'var(--font-ui)', textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        Continue without account (device only)
      </button>

      <p style={{
        marginTop: '2rem',
        color: 'var(--text-muted)', fontSize: '0.62rem',
        letterSpacing: '0.5px', textAlign: 'center', maxWidth: 280,
        fontFamily: 'var(--font-ui)', lineHeight: 1.6,
      }}>
        An account lets you track progress across all your devices.
      </p>
    </div>
  )
}
