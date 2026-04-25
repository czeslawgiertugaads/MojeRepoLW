'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  ChevronLeft, 
  Phone, 
  MapPin, 
  Truck, 
  DollarSign, 
  Calendar,
  Clock,
  User,
  Car,
  Disc
} from 'lucide-react'

export default function SubcontractorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [subcontractor, setSubcontractor] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/strefa-operacyjna-930/login')
      } else {
        setUser(user)
        fetchSubData()
      }
    }
    checkUser()
  }, [id])

  const fetchSubData = async () => {
    setLoading(true)
    
    // Fetch Subcontractor Details
    const { data: sub } = await supabase
      .from('subcontractors')
      .select('*, subcontractor_regions(city_name)')
      .eq('id', id)
      .single()
    setSubcontractor(sub)

    // Fetch Jobs for this Subcontractor
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('subcontractor_id', id)
      .order('created_at', { ascending: false })
    setJobs(jobsData || [])

    setLoading(false)
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Ładowanie profilu partnera...</div>
  if (!subcontractor) return <div style={{ padding: '40px', textAlign: 'center' }}>Nie znaleziono partnera.</div>

  const totalCommission = jobs.reduce((acc, curr) => acc + (Number(curr.commission) || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <header style={{ background: '#1e293b', color: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => router.push('/strefa-operacyjna-930/crm')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
          <ChevronLeft size={20} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>PROFIL PARTNERA: {subcontractor.name}</h1>
        <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
            {subcontractor.service_osobowe && <div style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}><Car size={14} /> OSOBOWE</div>}
            {subcontractor.service_bus && <div style={{ background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={14} /> BUS</div>}
            {subcontractor.service_tir && <div style={{ background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={14} /> TIR</div>}
            {subcontractor.service_wulkanizacja && <div style={{ background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}><Disc size={14} /> WULKANIZACJA</div>}
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
           <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '12px' }}><Phone size={20} /></div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>TELEFON</div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{subcontractor.phone}</div>
              </div>
           </div>
           <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '12px' }}><Truck size={20} /></div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>ZLECENIA</div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{jobs.length} REALIZACJI</div>
              </div>
           </div>
           <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '12px' }}><DollarSign size={20} /></div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>TWÓJ ZYSK</div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{totalCommission.toFixed(2)} PLN</div>
              </div>
           </div>
        </div>

        {/* Detailed Info */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '30px', marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 950 }}>INFORMACJE DODATKOWE</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', display: 'block', marginBottom: '8px' }}>OBSŁUGIWANE REGIONY</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {subcontractor.subcontractor_regions?.map((r: any, i: number) => (
                            <span key={i} style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>{r.city_name}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', display: 'block', marginBottom: '8px' }}>NOTATKI STAŁE</label>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        {subcontractor.notes || 'Brak stałych notatek o partnerze.'}
                    </div>
                </div>
            </div>
        </div>

        {/* Individual Job History */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 950 }}>PEŁNA HISTORIA ZLECEŃ ({subcontractor.name})</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '16px 30px', fontSize: '11px', color: '#64748b', fontWeight: 900 }}>DATA</th>
                        <th style={{ padding: '16px 30px', fontSize: '11px', color: '#64748b', fontWeight: 900 }}>TRASA / KLIENT</th>
                        <th style={{ padding: '16px 30px', fontSize: '11px', color: '#64748b', fontWeight: 900 }}>ZYSK</th>
                        <th style={{ padding: '16px 30px', fontSize: '11px', color: '#64748b', fontWeight: 900 }}>NOTATKI</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((j, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700 }}>{new Date(j.created_at).toLocaleDateString()}</div>
                                <div style={{ fontSize: '11px', opacity: 0.5 }}>{new Date(j.created_at).toLocaleTimeString().substring(0, 5)}</div>
                            </td>
                            <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: 800 }}>{j.pickup_location} → {j.delivery_location}</div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>{j.customer_name} ({j.customer_phone})</div>
                            </td>
                            <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: 900, color: '#16a34a' }}>+ {j.commission} PLN</div>
                            </td>
                            <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>{j.notes || '-'}</div>
                            </td>
                        </tr>
                    ))}
                    {jobs.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Ten partner nie zrealizował jeszcze żadnego zlecenia.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  )
}
