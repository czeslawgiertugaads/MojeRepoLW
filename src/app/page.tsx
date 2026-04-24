export const revalidate = 86400; // 24 hours
import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import Footer from '@/components/Footer';
import CoverageSection from '@/components/CoverageSection';
import AdvantagesSection from '@/components/AdvantagesSection';
import FloatingCTA from '@/components/FloatingCTA';
import Image from 'next/image';
import { getCities, slugify } from "@/lib/seo-utils";
import { articles } from '@/lib/articles';

interface IconProps { size?: number; }
// Optimized Raw SVG Icons
const PhoneIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ClockIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const TruckIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><path d="M16 18h3a1 1 0 0 0 1-1v-3.05a1 1 0 0 0-.293-.707l-2.657-2.657A1 1 0 0 0 16.343 10H14"/><circle cx="18" cy="18" r="2"/>
  </svg>
);

const WalletIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const CheckIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

async function getGoogleNews() {
  try {
    const res = await fetch('https://news.google.com/rss/search?q=wypadek+drogowy+polska+OR+utrudnienia+ruchu+OR+transport+drogowy&hl=pl&gl=PL&ceid=PL:pl', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const xml = await res.text();
    
    // Simple RSS parsing via regex (safe for server-side trusted feed)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
      const content = match[1];
      const title = content.match(/<title>(.*?)<\/title>/)?.[1] || "Wiadomość drogowa";
      const link = content.match(/<link>(.*?)<\/link>/)?.[1] || "#";
      const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      
      // Clean title from source
      const cleanTitle = title.split(' - ')[0];
      const source = title.split(' - ')[1] || "Google News";
      
      const dateObj = new Date(pubDate);
      const formattedDate = !isNaN(dateObj.getTime()) 
        ? `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`
        : "Dzisiaj";

      items.push({
        title: cleanTitle,
        url: link,
        date: formattedDate,
        source: source
      });
    }
    return items;
  } catch (err) {
    console.error("RSS Fetch error:", err);
    return [];
  }
}

export default async function HomePage() {
  const roadNews = await getGoogleNews();
  const allCities = getCities();
  const largestCitySlugs = ['warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk'];
  const topCities = allCities
    .filter(c => largestCitySlugs.includes(c.slug))
    .slice(0, 10);

  // Static road news - updated periodically

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Pomoc Drogowa i Holowanie 24/7 - laweciarz.pro",
    "image": "https://laweciarz.pro/images/hero-main.webp",
    "description": `Pomoc Drogowa i Holowanie ⭐⭐⭐⭐⭐ 📞 572 272 930. Najszybsza pomoc drogowa, laweta i holowanie 24/7 w Twojej okolicy. Mocny sprzęt, profesjonalna obsługa, dojazd 15 minut!`,
    "brand": {
      "@type": "Brand",
      "name": "laweciarz.pro"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "5364"
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      {/* ═══════════════════════════════════════
          HERO — Playful + Business
          ═══════════════════════════════════════ */}
      <section className="hero-section-home bg-dots" style={{ position: 'relative', background: '#fff' }}>
        <div className="hero-container-home" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'stretch', gap: '60px', flexWrap: 'wrap' }}>

          {/* Left — copy */}
          <div className="anim-hero-entrance hero-content-home" style={{ flex: '1.2', minWidth: '300px' }}>
            <div className="hero-badge-container">
              <div className="badge-live anim-bounce-in">DOSTĘPNI TERAZ · 24 / 7</div>
              <div className="badge-accent anim-bounce-in anim-delay-2 hidden-mobile">TWOJA OKOLICA: MAZOWIECKIE</div>
            </div>

            <h1 style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              marginBottom: '32px'
            }}>
              <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#666', letterSpacing: '6px', fontWeight: 800, marginBottom: '8px' }}>PROFESJONALNA</span>
              <span style={{ fontSize: 'clamp(3.5rem, 10vw, 7.8rem)', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-3px' }}>POMOC</span>
              <span style={{ fontSize: 'clamp(3.5rem, 10vw, 7.8rem)', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-3px', marginTop: '-10px' }}>DROGOWA</span>
              <span style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-1px', marginTop: '12px' }}>LAWETA I HOLOWANIE</span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#555', marginBottom: '40px', maxWidth: '650px', fontWeight: 600, lineHeight: 1.5 }}>
              Najszybsza laweta w Twojej okolicy. Holujemy auta osobowe, busy i ciężarowe. Dojazd <strong style={{ color: 'var(--primary)' }}>w 15 minut</strong>. Gwarantujemy profesjonalną obsługę i bezpieczeństwo.
            </p>

            <a href="tel:+48572272930" className="btn-power anim-slide-up anim-delay-4 hero-massive-btn" style={{ padding: '22px 48px', gap: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content' }}>
              <div className="animate-pulse"><PhoneIcon size={40} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1, textAlign: 'center' }}>
                <span style={{ fontWeight: 950, fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', letterSpacing: '-1px' }}>WEZWIJ POMOC</span>
                <span style={{ fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', opacity: 0.9 }}>572 272 930</span>
              </div>
            </a>
          </div>

          {/* Right — image frame with slider */}
          <div className="anim-slide-right hero-image-home" style={{ flex: '1', minWidth: '300px' }}>
            <div className="hero-image-frame">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEPARATOR — Trust Ticker
          ═══════════════════════════════════════ */}
      <div className="ticker-wrap" style={{ background: 'var(--secondary)', color: 'white', padding: '15px 0', borderTop: '4px solid var(--primary)' }}>
        <div className="ticker-inner">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Pomoc Drogowa 24/7</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>OSOBOWE</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>BUS</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>TIR</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>CIĘŻAROWE</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>MASZYNY ROLNICZE</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>GABARYTY</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px' }}>★</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CLEAN REVIEW — Right under Separator
          ═══════════════════════════════════════ */}
      <section style={{ padding: '60px 20px', background: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px' }}>
          <div className="badge-accent" style={{ background: 'var(--primary)', color: '#fff', marginBottom: '16px', fontWeight: 950, padding: '8px 20px', borderRadius: '50px' }}>
            ŚREDNIA 5.0 (5364 OPINIE)
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', color: '#fbbf24', marginBottom: '32px' }}>
            {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} size={64} />)}
          </div>

          <p style={{
            fontStyle: 'italic',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            marginBottom: '30px',
            lineHeight: 1.1,
            color: '#000'
          }}>
            „Pełen profesjonalizm i błyskawiczna pomoc. Panowie praktycznie uratowali mi życie
            na trasie, gdy auto stanęło w nocy. Zdecydowanie polecam każdemu!”
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eee', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '14px' }}>MJ</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Maciej Jastrzębski</div>
              <div style={{ fontWeight: 700, fontSize: '11px', opacity: 0.5, letterSpacing: '1px', color: '#666' }}>GOOGLE MAPS</div>
            </div>
          </div>
        </div>
      </section>

      <AdvantagesSection />

      {/* ═══════════════════════════════════════
          STATS BAR — bold numbers
          ═══════════════════════════════════════ */}
      <section style={{ background: 'var(--secondary)', color: 'white', padding: '0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', borderTop: '8px solid var(--primary)' }}>
          {[
            { num: '15', unit: 'MIN', label: 'Dojazd w' },
            { num: '5.0', unit: '', label: 'Ocena w Google' },
            { num: '24', unit: '/7', label: 'Dostępność' },
          ].map((s, i) => (
            <div key={i} className={`stat-block anim-count anim-delay-${i + 1}`} style={{
              padding: '40px 20px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              textAlign: 'center'
            }}>
              <div className="stat-number">{s.num}<span style={{ fontSize: '60%', color: 'white', opacity: 0.6 }}>{s.unit}</span></div>
              <div className="stat-label" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════
          NEWS — Dynamic Google News RSS
          ═══════════════════════════════════════ */}
      <section style={{ padding: '100px clamp(12px, 3vw, 20px)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-label">AKTUALNOŚCI</div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, textTransform: 'uppercase' }}>
                INFO <span style={{ color: 'var(--primary)' }}>DROGOWE</span>
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '32px' }}>
            {roadNews.map((news, idx) => (
              <a key={idx} href={news.url} target="_blank" rel="noopener noreferrer" className={`card card-lift anim-slide-up anim-delay-${idx + 1}`}
                style={{ padding: 'clamp(24px, 5vw, 42px)', border: '1px solid #eee', borderRadius: '32px', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span className="badge-accent" style={{ fontSize: '10px', padding: '6px 12px' }}>{news.source}</span>
                  <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 800 }}>{news.date}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '20px', lineHeight: 1.25 }}>{news.title}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 950, fontSize: '13px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  CZYTAJ WIĘCEJ <ChevronRightIcon size={20} />
                </div>
              </a>
            ))}
            {roadNews.length === 0 && (
              <p style={{ opacity: 0.5, fontWeight: 600 }}>Ładowanie najnowszych wiadomości drogowych...</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MASSIVE CTA
          ═══════════════════════════════════════ */}
      <section style={{
        background: 'var(--primary)', color: 'white',
        padding: '120px clamp(12px, 3vw, 20px)', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(0,0,0,0.12)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '24px' }}>AWARIA? DZIAŁAMY JUŻ</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 950, marginBottom: '24px', lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-2px' }}>
            POTRZEBUJESZ<br />POMOCY TERAZ?
          </h2>
          <p style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '50px', opacity: 0.88 }}>
            Dostępni 24h / 7 dni w tygodniu · Dojazd w 15 minut
          </p>
          <a href="tel:+48572272930" className="btn-power hero-massive-btn" style={{
            background: 'white', color: 'var(--primary)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', padding: '28px 64px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 8px 0 rgba(0,0,0,0.25)',
            gap: '20px'
          }}>
            <div className="animate-pulse"><PhoneIcon size={40} /></div>
            <span className="cta-phone-number" style={{ fontWeight: 950 }}>572 272 930</span>
          </a>
        </div>
      </section>

      <CoverageSection cities={topCities} showAll={false} />

      {/* Baza Wiedzy */}
      <section style={{ padding: '100px clamp(12px, 3vw, 20px)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 950 }}>BAZA WIEDZY</h2>
            <p style={{ fontWeight: 600, opacity: 0.6 }}>Poradniki dla kierowców i ekspertyzy drogowe.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {articles.slice(0, 3).map((art, i) => (
              <Link key={i} href={`/poradnik/${art.slug}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 15px 45px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative', height: '240px', background: '#eee' }}>
                  <Image 
                    src={art.image} 
                    alt={art.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    {art.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary)', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '15px', lineHeight: 1.3 }}>{art.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 950, fontSize: '0.9rem', gap: '5px' }}>
                    CZYTAJ ARTYKUŁ <ChevronRightIcon size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />

    </main>
  );
}

const ChevronRightIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
