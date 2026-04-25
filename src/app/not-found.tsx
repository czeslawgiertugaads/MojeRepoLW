import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff' }} className="bg-dots">
      <Navigation />
      
      <div className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <div className="badge-accent" style={{ marginBottom: '24px', padding: '10px 24px' }}>
          AWARIA SYSTEMU 404
        </div>

        <h1 style={{ 
          fontSize: 'clamp(5rem, 15vw, 12rem)', 
          fontWeight: 950, 
          color: 'var(--secondary)', 
          lineHeight: 0.8,
          letterSpacing: '-6px',
          margin: '0 0 20px 0'
        }}>
          UPS<span style={{ color: 'var(--primary)' }}>!</span>
        </h1>

        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 3rem)', 
          fontWeight: 900, 
          textTransform: 'uppercase',
          maxWidth: '800px',
          lineHeight: 1.1,
          marginBottom: '30px'
        }}>
          TWOJA STRONA ZOSTAŁA <span style={{ color: 'var(--primary)' }}>ODHOLOWANA</span>
        </h2>

        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
          fontWeight: 600, 
          color: '#555', 
          maxWidth: '600px',
          marginBottom: '50px'
        }}>
          Wygląda na to, że pod tym adresem nie ma żadnego pojazdu. 
          Prawdopodobnie błędnie wpisałeś trasę lub strona zjechała na pobocze.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn-power" style={{ padding: '22px 48px', fontSize: '1.2rem' }}>
            WRÓĆ NA TRASĘ
          </Link>
          
          <a href="tel:572272930" className="btn-power" style={{ 
            background: 'var(--secondary)', 
            padding: '22px 48px', 
            fontSize: '1.2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2), 0 8px 0 #000'
          }}>
            ZADZWOŃ PO LAWETĘ
          </a>
        </div>
      </div>

      <Footer />
    </main>
  )
}
