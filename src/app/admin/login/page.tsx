'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
      window.location.href = '/admin'

    } else {
      setError('Username atau password salah')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray50)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 600, color: 'var(--gray900)', marginBottom: '0.25rem' }}>
            Rika<span style={{ color: 'var(--p2)' }}>Negari</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--gray500)' }}>Admin Panel</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray700)' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              style={{ padding: '0.7rem 0.9rem', fontSize: '0.88rem', fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 10, color: 'var(--gray900)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray700)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              style={{ padding: '0.7rem 0.9rem', fontSize: '0.88rem', fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 10, color: 'var(--gray900)', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.85rem', background: loading ? 'var(--gray200)' : 'var(--p)', color: 'var(--gray900)', border: 'none', borderRadius: 100, fontSize: '0.88rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}