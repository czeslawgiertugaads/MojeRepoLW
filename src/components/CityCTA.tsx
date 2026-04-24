import React from "react";

const PhoneIcon = ({ size = 24, className = "", ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

interface CityCTAProps {
  cityName: string;
  miejscownik: string;
  eta: string;
}

export default function CityCTA({ cityName, miejscownik, eta }: CityCTAProps) {
  return (
    <div className="cta-strip" style={{ margin: '60px 0', flexDirection: 'column', textAlign: 'center', padding: '40px 30px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '8px', lineHeight: 1.2 }}>
          WEZWIJ AUTO POMOC
        </div>
        <div style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 900, letterSpacing: '1px' }}>
          NIE CZEKAJ — DOJAZD W {eta} MINUT!
        </div>
      </div>
      <a href="tel:+48572272930" className="btn-power hero-massive-btn" style={{ padding: '20px 40px', fontSize: '2rem', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <PhoneIcon size={32} />
        <span className="cta-phone-number" style={{ fontWeight: 950 }}>572 272 930</span>
      </a>
    </div>
  );
}
