'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Users, 
  Truck, 
  History, 
  Plus, 
  Search, 
  Building2, 
  ChevronLeft,
  RefreshCcw,
  LogOut,
  Phone,
  MapPin,
  FileText,
  Car,
  Disc
} from 'lucide-react'

export default function CRMPage() {
  const [subcontractors, setSubcontractors] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('subcontractors') // subcontractors, jobs
  const [searchRegion, setSearchRegion] = useState('')
  const [showAddSubModal, setShowAddSubModal] = useState(false)
  const [showAddJobModal, setShowAddJobModal] = useState(false)
  const [editingSub, setEditingSub] = useState<any>(null)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [preselectedSubId, setPreselectedSubId] = useState<string>('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
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
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    const { data: subData } = await supabase.from('subcontractors').select('*, subcontractor_regions(city_name)').order('name')
    setSubcontractors(subData || [])
    const { data: jobData } = await supabase.from('jobs').select('*, subcontractors(name)').order('created_at', { ascending: false })
    setJobs(jobData || [])
    setLoading(false)
  }

  const handleAddSubcontractor = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const base_city = formData.get('base_city') as string
    const notes = formData.get('notes') as string
    const regions = (formData.get('regions') as string).split(',').map(r => r.trim())
    
    const service_osobowe = formData.get('service_osobowe') === 'on'
    const service_bus = formData.get('service_bus') === 'on'
    const service_tir = formData.get('service_tir') === 'on'
    const service_wulkanizacja = formData.get('service_wulkanizacja') === 'on'

    const { data: sub } = await supabase.from('subcontractors').insert([{ 
      name, phone, base_city, notes, 
      service_osobowe, service_bus, service_tir, service_wulkanizacja 
    }]).select().single()
    if (sub) {
      if (regions.length > 0 && regions[0] !== '') {
        const regionInserts = regions.map(city => ({ subcontractor_id: sub.id, city_name: city }))
        await supabase.from('subcontractor_regions').insert(regionInserts)
      }
      setShowAddSubModal(false)
      fetchAllData()
    }
  }

  const handleUpdateSubcontractor = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const service_osobowe = formData.get('service_osobowe') === 'on'
    const service_bus = formData.get('service_bus') === 'on'
    const service_tir = formData.get('service_tir') === 'on'
    const service_wulkanizacja = formData.get('service_wulkanizacja') === 'on'

    const { error } = await supabase.from('subcontractors').update({ 
      name: formData.get('name'), 
      phone: formData.get('phone'), 
      base_city: formData.get('base_city'),
      notes: formData.get('notes'),
      service_osobowe, service_bus, service_tir, service_wulkanizacja
    }).eq('id', editingSub.id)
    
    if (error) {
       console.error('BŁĄD AKTUALIZACJI:', error)
       alert('Błąd: ' + error.message)
       return
    }
    
    const regions = (formData.get('regions') as string).split(',').map(r => r.trim())
    await supabase.from('subcontractor_regions').delete().eq('subcontractor_id', editingSub.id)
    if (regions.length > 0 && regions[0] !== '') {
      const regionInserts = regions.map(city => ({ subcontractor_id: editingSub.id, city_name: city }))
      await supabase.from('subcontractor_regions').insert(regionInserts)
    }
    setEditingSub(null)
    fetchAllData()
  }

  const handleAddJob = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const price_total = parseFloat(formData.get('price_total') as string)
    const price_sub = parseFloat(formData.get('price_sub') as string)

    const { error } = await supabase.from('jobs').insert([{
      subcontractor_id: formData.get('subcontractor_id'),
      customer_name: formData.get('customer'),
      customer_phone: formData.get('customer_phone'),
      pickup_location: formData.get('pickup'),
      delivery_location: formData.get('delivery'),
      price_total,
      price_subcontractor: price_sub,
      commission: price_total - price_sub,
      notes: formData.get('notes'),
      status: 'completed'
    }])

    if (!error) {
      setShowAddJobModal(false)
      setPreselectedSubId('')
      fetchAllData()
    }
  }

  const handleUpdateJob = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const price_total = parseFloat(formData.get('price_total') as string)
    const price_sub = parseFloat(formData.get('price_sub') as string)

    const { error } = await supabase.from('jobs').update({
      customer_name: formData.get('customer'),
      customer_phone: formData.get('customer_phone'),
      pickup_location: formData.get('pickup'),
      delivery_location: formData.get('delivery'),
      price_total,
      price_subcontractor: price_sub,
      commission: price_total - price_sub,
      status: formData.get('status'),
      notes: formData.get('notes')
    }).eq('id', editingJob.id)

    if (!error) {
      setEditingJob(null)
      fetchAllData()
    }
  }

  if (!user && !loading) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <header style={{ background: '#1e293b', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => router.push('/strefa-operacyjna-930')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '1px' }}>CRM LAWECIARZ.PRO</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', opacity: 0.7 }}>{user?.email}</span>
          <button onClick={() => { supabase.auth.signOut(); router.push('/strefa-operacyjna-930/login') }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>WYLOGUJ</button>
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>AKTYWNI PARTNERZY</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#1e293b' }}>{subcontractors.length}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>WSZYSTKIE ZLECENIA</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#1e293b' }}>{jobs.length}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#16a34a', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>ŁĄCZNY ZYSK (PROWIZJA)</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#16a34a' }}>
              {jobs.reduce((acc, curr) => acc + (Number(curr.commission) || 0), 0).toFixed(2)} PLN
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button onClick={() => setActiveTab('subcontractors')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px', background: activeTab === 'subcontractors' ? '#1e293b' : 'transparent', color: activeTab === 'subcontractors' ? 'white' : '#64748b' }}>PARTNERZY</button>
            <button onClick={() => setActiveTab('jobs')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px', background: activeTab === 'jobs' ? '#1e293b' : 'transparent', color: activeTab === 'jobs' ? 'white' : '#64748b' }}>HISTORIA ZLECEŃ</button>
          </div>
          <button 
             onClick={() => activeTab === 'subcontractors' ? setShowAddSubModal(true) : setShowAddJobModal(true)}
             style={{ background: '#1e293b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px shadow-lg' }}
          >
            <Plus size={18} /> DODAJ {activeTab === 'subcontractors' ? 'PARTNERA' : 'ZLECENIE'}
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {activeTab === 'subcontractors' && (
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
                <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Gdzie szukasz lawety? (Wpisz miasto...)" 
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' }}
                />
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>FIRMA / BAZA</th>
                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>REGIONY</th>
                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>KONTAKT</th>
                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>AKCJE</th>
                  </tr>
                </thead>
                <tbody>
                  {subcontractors.filter(s => 
                    !searchRegion || 
                    s.subcontractor_regions?.some((r: any) => r.city_name.toLowerCase().includes(searchRegion.toLowerCase())) ||
                    s.base_city?.toLowerCase().includes(searchRegion.toLowerCase())
                  ).map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div 
                          onClick={() => router.push(`/strefa-operacyjna-930/crm/${s.id}`)}
                          style={{ fontWeight: 950, fontSize: '16px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {s.name}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                           {s.service_osobowe && <span title="Osobowe"><Car size={14} color="#3b82f6" /></span>}
                           {s.service_bus && <span title="Bus"><Truck size={14} color="#16a34a" /></span>}
                           {s.service_tir && <span title="TIR"><Truck size={14} color="#ef4444" strokeWidth={3} /></span>}
                           {s.service_wulkanizacja && <span title="Wulkanizacja"><Disc size={14} color="#f59e0b" /></span>}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><MapPin size={12} /> {s.base_city}</div>
                        {s.notes && <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '6px' }}>📝 {s.notes}</div>}
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {s.subcontractor_regions?.map((r: any, idx: number) => (
                            <span key={idx} style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>{r.city_name}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <a href={`tel:${s.phone}`} style={{ fontWeight: 900, color: '#2563eb', textDecoration: 'none', fontSize: '15px' }}>{s.phone}</a>
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>{s.email}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => { setPreselectedSubId(s.id); setShowAddJobModal(true) }} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '12px' }}>ZLECENIE</button>
                          <button onClick={() => setEditingSub(s)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '12px' }}>EDYTUJ</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'jobs' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>DATA / FIRMA</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>TRASA / KLIENT</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>FINANSE</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: 900, color: '#64748b' }}>STATUS / AKCJA</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{new Date(j.created_at).toLocaleDateString()}</div>
                      <div style={{ fontWeight: 950, color: '#2563eb' }}>{j.subcontractors?.name}</div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px' }}>{j.pickup_location} → {j.delivery_location}</div>
                      <div style={{ fontSize: '13px', opacity: 0.8 }}>
                         {j.customer_name} 
                         {j.customer_phone && <a href={`tel:${j.customer_phone}`} style={{ marginLeft: '8px', fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>({j.customer_phone})</a>}
                      </div>
                      {j.notes && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px' }}>{j.notes}</div>}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontWeight: 950, fontSize: '16px' }}>{j.price_total} PLN</div>
                      <div style={{ color: '#16a34a', fontWeight: 900, fontSize: '11px' }}>ZYSK: {j.commission} PLN</div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ background: j.status === 'completed' ? '#dcfce7' : '#fef9c3', color: j.status === 'completed' ? '#166534' : '#854d0e', padding: '4px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>{j.status?.toUpperCase()}</span>
                        <button onClick={() => setEditingJob(j)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>EDYTUJ</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modals reuse logic from the same page for speed */}
      {showAddSubModal && (
        <Modal title="Nowy Podwykonawca" onClose={() => setShowAddSubModal(false)}>
           <form onSubmit={handleAddSubcontractor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Nazwa Firmy" name="name" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Telefon" name="phone" required />
                <Input label="Email" name="email" type="email" />
              </div>
              <Input label="Miasto Bazowe" name="base_city" />
              <Input label="Notatki" name="notes" placeholder="Stałe ustalenia..." />
              <div style={{ display: 'flex', gap: '20px', padding: '10px 0' }}>
                 <Checkbox label="OSOBOWE" name="service_osobowe" defaultChecked />
                 <Checkbox label="BUS" name="service_bus" />
                 <Checkbox label="TIR" name="service_tir" />
                 <Checkbox label="WULKAN" name="service_wulkanizacja" />
              </div>
              <Input label="Regiony (po przecinku)" name="regions" placeholder="Poznań, Swarzędz" />
              <button type="submit" style={{ background: '#1e293b', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>DODAJ PARTNERA</button>
           </form>
        </Modal>
      )}

      {editingSub && (
        <Modal title="Edytuj Partnera" onClose={() => setEditingSub(null)}>
           <form onSubmit={handleUpdateSubcontractor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Nazwa Firmy" name="name" defaultValue={editingSub.name} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Telefon" name="phone" defaultValue={editingSub.phone} required />
                <Input label="Email" name="email" defaultValue={editingSub.email} type="email" />
              </div>
              <Input label="Miasto Bazowe" name="base_city" defaultValue={editingSub.base_city} />
              <Input label="Notatki" name="notes" defaultValue={editingSub.notes} />
              <div style={{ display: 'flex', gap: '20px', padding: '10px 0' }}>
                 <Checkbox label="OSOBOWE" name="service_osobowe" defaultChecked={editingSub.service_osobowe} />
                 <Checkbox label="BUS" name="service_bus" defaultChecked={editingSub.service_bus} />
                 <Checkbox label="TIR" name="service_tir" defaultChecked={editingSub.service_tir} />
                 <Checkbox label="WULKAN" name="service_wulkanizacja" defaultChecked={editingSub.service_wulkanizacja} />
              </div>
              <Input label="Regiony" name="regions" defaultValue={editingSub.subcontractor_regions?.map((r: any) => r.city_name).join(', ')} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#1e293b', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>ZAPISZ</button>
                <button type="button" onClick={async () => { if(confirm('Usunąć?')) { await supabase.from('subcontractors').delete().eq('id', editingSub.id); setEditingSub(null); fetchAllData() } }} style={{ background: '#fee2e2', color: '#991b1b', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>USUŃ</button>
              </div>
           </form>
        </Modal>
      )}

      {showAddJobModal && (
        <Modal title="Nowe Zlecenie" onClose={() => { setShowAddJobModal(false); setPreselectedSubId('') }}>
           <form onSubmit={handleAddJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select name="subcontractor_id" defaultValue={preselectedSubId} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <option value="">-- Wybierz Wykonawcę --</option>
                {subcontractors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Input label="Klient / Auto" name="customer" placeholder="Imię + Marka" />
              <Input label="Numer Klienta" name="customer_phone" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Odbiór" name="pickup" />
                <Input label="Dostawa" name="delivery" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Kwota Całkowita" name="price_total" type="number" />
                <Input label="Koszt Lawety" name="price_sub" type="number" />
              </div>
              <Input label="Notatki do kursu" name="notes" />
              <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>ZAPISZ ZLECENIE</button>
           </form>
        </Modal>
      )}

      {editingJob && (
        <Modal title="Edytuj Zlecenie" onClose={() => setEditingJob(null)}>
           <form onSubmit={handleUpdateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Klient / Auto" name="customer" defaultValue={editingJob.customer_name} />
              <Input label="Numer Klienta" name="customer_phone" defaultValue={editingJob.customer_phone} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Odbiór" name="pickup" defaultValue={editingJob.pickup_location} />
                <Input label="Dostawa" name="delivery" defaultValue={editingJob.delivery_location} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Kwota Całkowita" name="price_total" defaultValue={editingJob.price_total} />
                <Input label="Koszt Lawety" name="price_sub" defaultValue={editingJob.price_subcontractor} />
              </div>
              <select name="status" defaultValue={editingJob.status} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <option value="completed">Zakończone</option>
                <option value="pending">W trakcie</option>
                <option value="cancelled">Anulowane</option>
              </select>
              <Input label="Notatki" name="notes" defaultValue={editingJob.notes} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#1e293b', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>ZAPISZ</button>
                <button type="button" onClick={async () => { if(confirm('Usunąć?')) { await supabase.from('jobs').delete().eq('id', editingJob.id); setEditingJob(null); fetchAllData() } }} style={{ background: '#fee2e2', color: '#991b1b', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>USUŃ</button>
              </div>
           </form>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, children, onClose }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '30px', width: '100%', maxWidth: '550px', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '24px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 950, color: '#1e293b' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>
        <div style={{ padding: '30px' }}>{children}</div>
      </div>
    </div>
  )
}

function Input({ label, ...props }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <input {...props} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
    </div>
  )
}

function Checkbox({ label, ...props }: any) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <input type="checkbox" {...props} style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} />
      <span style={{ fontSize: '10px', fontWeight: 900, color: '#475569' }}>{label}</span>
    </label>
  )
}
