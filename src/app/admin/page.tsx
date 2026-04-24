'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Users, 
  MousePointer2, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  RefreshCcw,
  LogOut
} from 'lucide-react'

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
        fetchVisitors()
      }
    }
    checkUser()
  }, [])

  const fetchVisitors = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (!error) setVisitors(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (!user && !loading) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: 950, fontSize: '18px' }}>LAWECIARZ.PRO</div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>PANEL ANALITYCZNY</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
            <LogOut size={16} /> WYLOGUJ
          </button>
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="WSZYSTKIE WIZYTY" value={visitors.length.toString()} icon={<RefreshCcw size={24} />} color="blue" />
          <StatCard title="UNIKALNI UŻYTKOWNICY" value={new Set(visitors.map(v => v.fingerprint)).size.toString()} icon={<Users size={24} />} color="green" />
          <StatCard title="PODEJRZANE (KLIKI)" value="0" icon={<ShieldAlert size={24} />} color="orange" />
        </div>

        {/* Visitors Table */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900 }}>OSTATNI ODWIEDZAJĄCY</h3>
            <button onClick={fetchVisitors} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> ODŚWIEŻ
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <TableHeader label="DATA" />
                  <TableHeader label="FINGERPRINT / IP" />
                  <TableHeader label="LOKALIZACJA (STRONA)" />
                  <TableHeader label="URZĄDZENIE" />
                  <TableHeader label="KAMPANIA" />
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <TableCell>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{new Date(v.created_at).toLocaleDateString()}</div>
                      <div style={{ opacity: 0.5, fontSize: '11px' }}>{new Date(v.created_at).toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', width: 'fit-content', marginBottom: '4px' }}>{v.fingerprint}</code>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{v.ip || 'UKRYTE'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{v.path}</div>
                      <div style={{ fontSize: '11px', opacity: 0.5, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>REF: {v.referrer}</div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
                        {v.screen_resolution} <br />
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>{v.user_agent?.split(')')[0]})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {v.campaign_id ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 900 }}>
                          ID: {v.campaign_id}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>BEZ KAMPANII</span>
                      )}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
            {visitors.length === 0 && !loading && (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                Brak zarejestrowanych wizyt.
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: { bg: '#eff6ff', icon: '#3b82f6' },
    green: { bg: '#f0fdf4', icon: '#22c55e' },
    orange: { bg: '#fff7ed', icon: '#f97316' },
  }
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0' }}>
      <div style={{ background: colors[color].bg, color: colors[color].icon, padding: '12px', borderRadius: '12px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: 950 }}>{value}</div>
      </div>
    </div>
  )
}

function TableHeader({ label }: any) {
  return <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 900, color: '#64748b', letterSpacing: '1px' }}>{label}</th>
}

function TableCell({ children }: any) {
  return <td style={{ padding: '16px 24px', fontSize: '14px' }}>{children}</td>
}
