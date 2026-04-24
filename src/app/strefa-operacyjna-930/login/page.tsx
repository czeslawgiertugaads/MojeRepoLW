'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/strefa-operacyjna-930')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '8px', textAlign: 'center' }}>PANEL ADMINA</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>Zaloguj się, aby zarządzać statystykami</p>

        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#444' }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#444' }}>HASŁO</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-power"
            style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 950, fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? 'LOGOWANIE...' : 'ZALOGUJ SIĘ'}
          </button>
        </form>
      </div>
    </div>
  )
}
