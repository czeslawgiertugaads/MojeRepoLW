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
  LogOut,
  Mail,
  Copy,
  LayoutDashboard
} from 'lucide-react'

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [copyEvents, setCopyEvents] = useState<any[]>([])
  const [phoneClicks, setPhoneClicks] = useState<any[]>([])
  const [securityEvents, setSecurityEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('visits') // visits, suspicious, messages, copy, phone, security
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Basic protection against context menu
    const handleContext = (e: any) => e.preventDefault();
    document.addEventListener('contextmenu', handleContext);
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/strefa-operacyjna-930/login')
      } else {
        setUser(user)
        fetchAllData()
      }
    }
    checkUser()
    return () => document.removeEventListener('contextmenu', handleContext);
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    
    // Fetch Visitors
    const { data: vData } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(200)
    setVisitors(vData || [])
    
    // Fetch Messages
    const { data: mData } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(mData || [])
    
    // Fetch Copy Events
    const { data: cData } = await supabase.from('copy_events').select('*').order('created_at', { ascending: false })
    setCopyEvents(cData || [])

    // Fetch Phone Clicks
    const { data: pData } = await supabase.from('phone_clicks').select('*').order('created_at', { ascending: false })
    setPhoneClicks(pData || [])

    // Fetch Security Events
    const { data: sData } = await supabase.from('security_events').select('*').order('created_at', { ascending: false })
    setSecurityEvents(sData || [])
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/strefa-operacyjna-930/login')
  }

  // Calculate Suspicious IPs (visited > 3 times)
  const ipCounts = visitors.reduce((acc: any, v) => {
    if (v.ip) acc[v.ip] = (acc[v.ip] || 0) + 1;
    return acc;
  }, {});
  
  const suspiciousIPs = Object.keys(ipCounts)
    .filter(ip => ipCounts[ip] > 3)
    .map(ip => ({ ip, count: ipCounts[ip], lastVisit: visitors.find(v => v.ip === ip)?.created_at }));

  if (!user && !loading) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b', paddingBottom: '100px', userSelect: 'none' }}>
      <style>{`
        @media (max-width: 768px) {
          .dash-main { padding: 12px 8px !important; }
          .dash-header { padding: 10px 15px !important; }
          .dash-logo { font-size: 14px !important; }
          .dash-grid { gap: 12px !important; margin-bottom: 20px !important; }
          .stat-card { padding: 15px !important; }
          .stat-value { font-size: 20px !important; }
          .stat-title { font-size: 10px !important; }
          .tab-btn { padding: 6px 10px !important; font-size: 10px !important; }
          .data-table th, .data-table td { padding: 8px 6px !important; font-size: 11px !important; }
          .time-cell { font-size: 10px !important; }
          .tag-pill { padding: 2px 5px !important; font-size: 9px !important; }
          .dash-tabs { gap: 4px !important; margin-bottom: 12px !important; }
        }
      `}</style>
      
      {/* Header */}
      <header className="dash-header" style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="dash-logo" style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: 950, fontSize: '18px' }}>LW.PRO</div>
          <h1 className="dash-title" style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>PANEL</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{user?.email?.split('@')[0]}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '11px' }}>
            <LogOut size={14} /> WYJŚCIE
          </button>
        </div>
      </header>

      <main className="dash-main" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Grid */}
        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="WIZYTY" value={visitors.length.toString()} icon={<RefreshCcw size={20} />} color="blue" />
          <StatCard title="TEL." value={phoneClicks.length.toString()} icon={<MousePointer2 size={20} />} color="green" />
          <StatCard title="ALERTY" value={securityEvents.length.toString()} icon={<ShieldAlert size={20} />} color="orange" />
          <StatCard title="KOPIE" value={copyEvents.length.toString()} icon={<Copy size={20} />} color="red" />
        </div>

        {/* Tabs Navigation */}
        <div className="dash-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <TabButton active={activeTab === 'visits'} onClick={() => setActiveTab('visits')} label="WIZYTY" icon={<LayoutDashboard size={14} />} />
          <TabButton active={activeTab === 'phone'} onClick={() => setActiveTab('phone')} label="TEL." icon={<MousePointer2 size={14} />} />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="ALERTY" icon={<ShieldAlert size={14} />} />
          <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} label="MAILE" icon={<Mail size={14} />} />
          <TabButton active={activeTab === 'suspicious'} onClick={() => setActiveTab('suspicious')} label="IP" icon={<ShieldAlert size={14} />} />
          <TabButton active={activeTab === 'copy'} onClick={() => setActiveTab('copy')} label="COPY" icon={<Copy size={14} />} />
        </div>

        {/* Content Section */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900 }}>
              {activeTab === 'visits' && 'WIZYTY'}
              {activeTab === 'phone' && 'TELEFONY'}
              {activeTab === 'security' && 'ALERTY'}
              {activeTab === 'messages' && 'MAILE'}
              {activeTab === 'suspicious' && 'IP (>3)'}
              {activeTab === 'copy' && 'KOPIE'}
            </h3>
            <button onClick={fetchAllData} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> ODŚWIEŻ
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {activeTab === 'security' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#fff1f2' }}>
                    <TableHeader label="DATA" />
                    <TableHeader label="TYP ZAGROŻENIA" />
                    <TableHeader label="STRONA" />
                    <TableHeader label="FINGERPRINT" />
                  </tr>
                </thead>
                <tbody>
                  {securityEvents.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell><TimeCell date={s.created_at} /></TableCell>
                      <TableCell>
                        <span style={{ 
                          background: s.type === 'devtools_opened' ? '#fb7185' : '#fb923c', 
                          color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 
                        }}>
                          {s.type === 'devtools_opened' ? 'OTWARTO DEVTOOLS' : 'SKRÓT INSPEKCJI KODU'}
                        </span>
                      </TableCell>
                      <TableCell style={{ fontWeight: 700 }}>{s.path}</TableCell>
                      <TableCell style={{ fontSize: '11px', opacity: 0.5 }}>{s.fingerprint}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'phone' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <TableHeader label="DATA" />
                    <TableHeader label="STRONA (SKĄD KLIKNĄŁ)" />
                    <TableHeader label="FINGERPRINT" />
                    <TableHeader label="NUMER" />
                  </tr>
                </thead>
                <tbody>
                  {phoneClicks.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell><TimeCell date={p.created_at} /></TableCell>
                      <TableCell style={{ fontWeight: 800 }}>{p.path}</TableCell>
                      <TableCell style={{ fontSize: '11px', opacity: 0.5 }}>{p.fingerprint}</TableCell>
                      <TableCell style={{ fontWeight: 900, color: 'var(--primary)' }}>{p.phone}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'visits' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <TableHeader label="DATA" />
                    <TableHeader label="MIEJSCOWOŚĆ" />
                    <TableHeader label="STRONA / IP" />
                    <TableHeader label="URZĄDZENIE" />
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell><TimeCell date={v.created_at} /></TableCell>
                      <TableCell>
                        <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '13px' }}>{v.city || 'Nieznane'}</div>
                      </TableCell>
                      <TableCell>
                         <div style={{ fontWeight: 700 }}>{v.path}</div>
                         <div style={{ fontSize: '11px', opacity: 0.5 }}>IP: {v.ip}</div>
                      </TableCell>
                      <TableCell style={{ fontSize: '11px' }}>{v.user_agent?.substring(0, 50)}...</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'messages' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <TableHeader label="DATA" />
                    <TableHeader label="KLIENT" />
                    <TableHeader label="TELEFON" />
                    <TableHeader label="WIADOMOŚĆ" />
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell><TimeCell date={m.created_at} /></TableCell>
                      <TableCell style={{ fontWeight: 800 }}>{m.name}</TableCell>
                      <TableCell>
                        <a href={`tel:${m.phone}`} style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>{m.phone}</a>
                      </TableCell>
                      <TableCell style={{ fontSize: '13px' }}>{m.message}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'suspicious' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <TableHeader label="ADRES IP" />
                    <TableHeader label="LICZBA WIZYT" />
                    <TableHeader label="OSTATNIO" />
                    <TableHeader label="AKCJA" />
                  </tr>
                </thead>
                <tbody>
                  {suspiciousIPs.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell style={{ fontWeight: 900, color: '#e11d48' }}>{s.ip}</TableCell>
                      <TableCell>
                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '50px', fontWeight: 900 }}>{s.count} RAZY</span>
                      </TableCell>
                      <TableCell><TimeCell date={s.lastVisit} /></TableCell>
                      <TableCell>
                         <button style={{ background: '#1e293b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>BLOKUJ</button>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'copy' && (
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <TableHeader label="DATA" />
                    <TableHeader label="STRONA" />
                    <TableHeader label="SKOPIOWANA TREŚĆ" />
                  </tr>
                </thead>
                <tbody>
                  {copyEvents.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell><TimeCell date={c.created_at} /></TableCell>
                      <TableCell style={{ fontWeight: 700 }}>{c.path}</TableCell>
                      <TableCell style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b' }}>
                        "{c.content_preview?.substring(0, 100)}..."
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {loading && <div style={{ padding: '60px', textAlign: 'center' }}>Ładowanie danych...</div>}
            {!loading && visitors.length === 0 && <div style={{ padding: '60px', textAlign: 'center' }}>Brak danych w tej kategorii.</div>}
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
    red: { bg: '#fef2f2', icon: '#ef4444' }
  }
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0 shadow-sm' }}>
      <div style={{ background: colors[color].bg, color: colors[color].icon, padding: '12px', borderRadius: '12px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: 950 }}>{value}</div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button onClick={onClick} style={{ 
      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: active ? '#1e293b' : 'transparent', color: active ? 'white' : '#64748b', fontWeight: 800, fontSize: '12px', transition: 'all 0.2s'
    }}>
      {icon} {label}
    </button>
  )
}

function TimeCell({ date }: { date: string }) {
  if (!date) return null;
  const d = new Date(date);
  return (
    <div style={{ minWidth: '100px' }}>
      <div style={{ fontWeight: 600, fontSize: '13px' }}>{d.toLocaleDateString()}</div>
      <div style={{ opacity: 0.5, fontSize: '11px' }}>{d.toLocaleTimeString()}</div>
    </div>
  )
}

function TableHeader({ label }: any) {
  return <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 950, color: '#64748b', letterSpacing: '1px' }}>{label}</th>
}

function TableCell({ children, style }: any) {
  return <td style={{ padding: '16px 24px', fontSize: '14px', ...style }}>{children}</td>
}
