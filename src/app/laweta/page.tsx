import { getCities, getSEOContent } from "@/lib/seo-utils";
import FloatingCTA from "@/components/FloatingCTA";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CoverageSection from "@/components/CoverageSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import Image from "next/image";
import { Metadata } from "next";

const StarIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const metadata: Metadata = {
  title: "Laweta i Transport Pojazdów 24/7 - LAWECIARZ.PRO",
  description: `Laweta 24/7 ☎️ 572 272 930 | Bezpieczny transport aut osobowych, elektrycznych i dostawczych. Całodobowa laweta i holowanie 24h. LAWECIARZ.PRO 5.0`,
  alternates: {
    canonical: "/laweta",
  },
};

const PhoneIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function LawetaPage() {
  const allCities = getCities();

  const prioritySlugs = [
    'warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk', 'szczecin', 'bydgoszcz',
    'lublin', 'bialystok', 'katowice', 'gdynia', 'czestochowa', 'radom', 'torun', 'sosnowiec',
    'rzeszow', 'kielce', 'gliwice', 'olsztyn', 'zabrze', 'bielsko-biala', 'bytom', 'zielona-gora',
    'rybnik', 'ruda-slaska', 'tychy', 'gorzow-wielkopolski', 'elblag', 'plock', 'dabrowa-gornicza', 'walbrzych'
  ];

  const topCities = [
    ...allCities.filter(c => prioritySlugs.includes(c.slug)),
    ...allCities.filter(c => !prioritySlugs.includes(c.slug))
  ].slice(0, 24);

  let content = getSEOContent('laweta_single.md');

  // Reuse same processing logic as in pomoc-drogowa/page.tsx
  content = content
    .replace(/\[H2\]\s?/g, '')
    .replace(/^# .*/gm, '')
    .replace(/---/g, '')
    .replace(/^## (.*)/gm, (match, p1) => {
      const cleanTitle = p1
        .replace(/\[Miasto\]|\[Miasta\]|\[Miastu\]|\[Mieście\]/gi, '')
        .trim();
      return `<h2 class="seo-h2" style="font-size: 1.7rem; margin-top: 50px; margin-bottom: 20px; color: var(--secondary);">${cleanTitle}</h2>`;
    })
    .replace(/^- (.*)/gm, `<div style="display: flex; align-items: flex-start; margin-bottom: 12px; padding-left: 10px;">
      <span style="color: var(--primary); margin-right: 12px; margin-top: 4px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </span>
      <span style="font-weight: 600; font-size: 0.95rem;">$1</span>
    </div>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--primary); font-weight: 900;">$1</strong>')
    .replace(/\n\n/g, '</p><p class="seo-p" style="margin-bottom: 25px; font-size: 0.95rem; line-height: 1.8; color: #222; font-weight: 500;">')
    .replace(/\[Miasto\]/gi, 'naszą firmę')
    .replace(/w \[Mieście\]/gi, '24h')
    .replace(/na terenie \[Miasta\]/gi, 'w całej Polsce')
    .replace(/\[Mieście\]/gi, 'okolicy')
    .replace(/\[Miasta\]/gi, 'całego regionu')
    .replace(/\[Biernik\]/gi, 'Twój pojazd')
    .replace(/\[TWÓJ NUMER TELEFONU\]/g, '<span class="seo-phone" style="font-weight: 900; color: var(--primary);">572 272 930</span>')
    .replace(/laweciarz\.pro/gi, '<strong class="seo-brand" style="font-weight: 950; color: var(--secondary);">laweciarz.pro</strong>');

  content = `<p class="seo-p" style="margin-bottom: 25px; font-size: 0.95rem; line-height: 1.8; color: #222; font-weight: 500;">${content}</p>`;
  const contentChunks = content.split('<h2');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Laweta i Transport Pojazdów 24/7 - LAWECIARZ.PRO",
    "image": "https://laweciarz.pro/images/hero-main.webp",
    "description": `Laweta 24/7 ☎️ 572 272 930 | Bezpieczny transport aut osobowych, elektrycznych i dostawczych. Całodobowa laweta i holowanie 24h. LAWECIARZ.PRO - dzia`,
    "telephone": "572 272 930",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Polska",
      "addressCountry": "PL"
    },
    "brand": {
      "@type": "Brand",
      "name": "LAWECIARZ.PRO"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "5364"
    }
  };

  const siteNameLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LAWECIARZ.PRO",
    "url": "https://laweciarz.pro/"
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Ile kosztuje transport lawetą?",
        "acceptedAnswer": { "@type": "Answer", "text": "Cena transportu lawetą zależy od trasy i rodzaju pojazdu. Zadzwoń na 572 272 930, aby otrzymać bezpłatną wycenę." }
      },
      {
        "@type": "Question",
        "name": "Jak szybko przyjedzie laweta?",
        "acceptedAnswer": { "@type": "Answer", "text": "Nasz średni czas dojazdu wynosi 15 minut. Laweta dostępna jest całą dobę, 7 dni w tygodniu." }
      },
      {
        "@type": "Question",
        "name": "Jakie pojazdy może transportować laweta?",
        "acceptedAnswer": { "@type": "Answer", "text": "Transportujemy wszystkie typy pojazdów: osobowe, elektryczne, hybrydowe, dostawcze, motocykle oraz auta powypadkowe i uszkodzone." }
      },
      {
        "@type": "Question",
        "name": "Czy laweta działa całą dobę?",
        "acceptedAnswer": { "@type": "Answer", "text": "Tak, LAWECIARZ.PRO świadczy usługi lawety 24 godziny na dobę, 7 dni w tygodniu, przez cały rok – również w święta." }
      }
    ]
  };

  return (
    <main style={{ minHeight: '100vh', background: 'white', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNameLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Navigation locationText="TWOJA OKOLICA" />

      {/* ═══════════════════════════════════════
          HERO — matching slug style
          ═══════════════════════════════════════ */}
      <section className="hero-section-slug bg-dots" style={{ position: 'relative' }}>
        <div className="hero-container-slug" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px', flexWrap: 'wrap' }}>

          <div className="anim-slide-left hero-content-slug" style={{ flex: '1.2', minWidth: '300px' }}>
            <div className="hero-badge-container">
              <div className="badge-live anim-bounce-in">DOSTĘPNI TERAZ · 24 / 7</div>
              <div className="badge-accent anim-bounce-in anim-delay-2">TWOJA OKOLICA</div>
            </div>

            <h1 className="anim-slide-left anim-delay-1" style={{
              fontSize: 'clamp(2.4rem, 7vw, 6rem)',
              fontWeight: 950,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              marginBottom: '28px'
            }}>
              <span style={{ fontSize: '0.4em', display: 'block', letterSpacing: '4px', color: '#666', marginBottom: '8px' }}>PROFESJONALNA</span>
              LAWETA <span style={{ color: 'var(--primary)' }}>24/7</span>
            </h1>

            <p className="anim-slide-left anim-delay-2" style={{
              fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 600,
              marginBottom: '36px', lineHeight: 1.55, maxWidth: '600px', color: '#444'
            }}>
              Bezpieczny transport pojazdów na pełnej platformie hydraulicznej. Holujemy auta osobowe, sportowe i elektryczne. Szybki dojazd tam, gdzie nas potrzebujesz.
            </p>

            <a href="tel:+48572272930" className="btn-power anim-slide-up anim-delay-3 hero-massive-btn" style={{ fontSize: '1.8rem', padding: '24px 40px', width: '100%', maxWidth: '540px', gap: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="animate-pulse"><PhoneIcon size={36} /></div>
              <span style={{ fontWeight: 950 }}>572 272 930</span>
            </a>
          </div>

          <div className="anim-slide-right hero-image-slug" style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <div className="hero-image-frame">
              <Image
                src="/images/hero-main.webp"
                alt="laweciarz.pro Laweta 24h"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)' }} />
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
          STATS BAR
          ═══════════════════════════════════════ */}
      <section style={{ background: 'var(--secondary)', color: 'white', borderTop: '8px solid var(--primary)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { num: '24', unit: '/7', label: 'Dostępność usług' },
            { num: '5.0', unit: '', label: 'Ocena Google Maps' },
            { num: '100', unit: '%', label: 'Pełna Platforma' },
          ].map((s, i) => (
            <div key={i} className={`stat-block anim-count anim-delay-${i + 1}`} style={{
              padding: '36px 20px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textAlign: 'center'
            }}>
              <div className="stat-number">{s.num}<span style={{ fontSize: '55%', color: 'white', opacity: 0.5 }}>{s.unit}</span></div>
              <div className="stat-label" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEO CONTENT
          ═══════════════════════════════════════ */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {contentChunks.map((chunk, index) => {
            const htmlContent = index === 0 ? chunk : `<h2${chunk} `;
            const isCTA = index % 3 === 1;
            return (
              <div key={index} style={{ marginBottom: '40px' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {isCTA && (
                  <div className="cta-strip" style={{ margin: '40px 0' }}>
                    <div>
                      <div style={{ fontWeight: 950, fontSize: '1.1rem', marginBottom: '4px' }}>
                        ZABLOKOWANE KOŁA? AUTOMAT?
                      </div>
                      <div style={{ fontSize: '13px', opacity: 0.6, fontWeight: 600 }}>
                        Nasza laweta z pełną platformą to jedyny bezpieczny wybór.
                      </div>
                    </div>
                    <a href="tel:+48572272930" className="btn-power" style={{ padding: '14px 28px', fontSize: '1rem', flexShrink: 0 }}>
                      ZADZWOŃ TERAZ
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <CoverageSection cities={topCities} />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
