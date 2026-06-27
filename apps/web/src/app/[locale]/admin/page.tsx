'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'en'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push(`/${locale}/admin/dashboard`)
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 40, width: 360, boxShadow: '0 4px 24px #0001' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#1a2e1a' }}>HIRABAN</div>
          <div style={{ color: '#888', marginTop: 4, fontSize: 14 }}>Admin Panel</div>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#444' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
            placeholder="Enter admin password"
            style={{
              width: '100%', padding: '10px 14px', border: '1px solid #ddd',
              borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 8 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20, width: '100%', padding: '11px 0',
              background: '#2d5a27', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 24 }}>
          Default dev password: <code>hiraban2025</code>
        </p>
      </div>
    </div>
  )
}
