import React from 'react';

interface IconProps { size?: number; }

const ClockIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TruckIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><path d="M16 18h3a1 1 0 0 0 1-1v-3.05a1 1 0 0 0-.293-.707l-2.657-2.657A1 1 0 0 0 16.343 10H14"/><circle cx="18" cy="18" r="2"/>
  </svg>
);

const WalletIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

export default function AdvantagesSection() {
  const advantages = [
    {
      title: 'TANIO',
      description: 'Gwarantujemy jedne z najniższych cen w regionie. Od razu poznasz koszt usługi – bez ukrytych opłat i doliczania na miejscu.',
      icon: <WalletIcon />
    },
    {
      title: 'SZYBKO',
      description: 'Nasi kierowcy stacjonują w wielu punktach miasta, dzięki czemu pomoc dociera na miejsce zazwyczaj w 15-20 minut.',
      icon: <TruckIcon />
    },
    {
      title: 'BEZPIECZNIE',
      description: 'Twoje auto jest w dobrych rękach. Mamy nowoczesne lawety i doświadczonych fachowców, którzy zadbają o każdy detal.',
      icon: <ShieldIcon />
    },
    {
      title: 'CAŁĄ DOBĘ',
      description: 'Działamy non-stop, w nocy, niedziele i święta. Dzwonisz i jedziemy – jesteśmy gotowi do pomocy o każdej porze.',
      icon: <ClockIcon />
    }
  ];

  return (
    <section className="advantages-section" style={{ padding: '100px 20px', background: '#f8fafc' }}>
      <div className="container">
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>DLACZEGO MY</div>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 950, textTransform: 'uppercase', lineHeight: 1 }}>
            Laweta i Pomoc Drogowa 24h <span style={{ color: 'var(--primary)' }}>laweciarz.pro</span>
          </h2>
        </div>
        
        <div className="advantages-grid">
          {advantages.map((adv, i) => (
            <div key={i} className={`motto-card anim-slide-up anim-delay-${i + 1}`}>
              {/* Background Icon Watermark - Hidden on mobile via CSS */}
              <div className="motto-card-watermark">
                {React.cloneElement(adv.icon as React.ReactElement<any>, { size: 140 })}
              </div>
              <div className="motto-card-icon">
                {React.cloneElement(adv.icon as React.ReactElement<any>, { size: 28 })}
              </div>
              <div className="motto-card-text">
                <h3>{adv.title}</h3>
                <p>{adv.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
