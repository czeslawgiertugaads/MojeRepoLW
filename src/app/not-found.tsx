import Link from 'next/link'
import { Truck, Home, Phone } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Ikona Lawety z animacją */}
        <div style={{ marginBottom: '30px', display: 'inline-block', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-20px', background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
          <Truck size={80} color="#3b82f6" style={{ position: 'relative' }} />
        </div>

        <h1 style={{ 
          fontSize: '120px', 
          margin: 0, 
          fontWeight: 900, 
          lineHeight: 1,
          background: 'linear-gradient(to bottom, #ffffff, #64748b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-5px'
        }}>
          404
        </h1>

        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '20px 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Ups! Twoja strona została odholowana.
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
          Prawdopodobnie ten adres nie istnieje lub trasa, którą próbujesz jechać, jest obecnie w remoncie. 
          Nie martw się, pomożemy Ci wrócić na właściwy pas.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ 
            background: '#3b82f6', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '16px 32px', 
            borderRadius: '12px', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            transition: 'transform 0.2s',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
          }}>
            <Home size={20} /> WRÓĆ NA TRASĘ
          </Link>
          
          <a href="tel:572272930" style={{ 
            background: 'transparent', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '16px 32px', 
            borderRadius: '12px', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'background 0.2s'
          }}>
            <Phone size={20} /> ZADZWOŃ PO POMOC
          </a>
        </div>

        <div style={{ marginTop: '60px', opacity: 0.3, fontSize: '12px', fontWeight: 700, letterSpacing: '2px' }}>
          LAWECIARZ.PRO — POMOC DROGOWA 24/7
        </div>
      </div>
    </div>
  )
}
