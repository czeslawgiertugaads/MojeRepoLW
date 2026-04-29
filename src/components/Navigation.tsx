import Link from "next/link";

import Image from "next/image";

interface NavigationProps {
  locationText?: string;
}

const PhoneIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function Navigation({ locationText = "TWOJA OKOLICA" }: NavigationProps) {
  return (
    <nav className="nav-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderBottom: '6px solid var(--secondary)',
    }}>
        <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{ position: 'relative', width: '45px', height: '45px' }}>
                <Image 
                  src="/images/logo-sm.png" 
                  alt="LAWECIARZ.PRO Logo" 
                  fill 
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-0.5px', color: 'var(--secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', marginRight: '4px', fontSize: '26px', lineHeight: 1 }}>LAWECIARZ</span><span style={{ color: 'black', fontSize: '0.75em' }}>.PRO</span>
              </div>
          </Link>
          <div className="nav-location" style={{ display: 'flex', flexDirection: 'column', fontWeight: 900, textTransform: 'uppercase', width: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontSize: '15.5px', lineHeight: 1.1 }}>
              {"AUTOPOMOC".split('').map((char, i) => <span key={i}>{char}</span>)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '10px', lineHeight: 1, opacity: 0.8, marginTop: '2px' }}>
              {"BLISKO CIEBIE".split('').map((char, i) => <span key={i === 6 ? 'space' : i}>{char === ' ' ? '\u00A0' : char}</span>)}
            </div>
          </div>
        </div>

        <a href="tel:+48572272930" className="btn-power btn-mobile-icon-only" style={{
          gap: '12px',
          fontSize: '1.2rem',
          justifyContent: 'center'
        }}>
          <div className="animate-pulse" style={{ display: 'flex' }}>
            <PhoneIcon size={24} />
          </div>
          <span className="nav-phone-label">572 272 930</span>
        </a>
      </div>
    </nav>
  );
}
