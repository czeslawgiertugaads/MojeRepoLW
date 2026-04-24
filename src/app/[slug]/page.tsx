export const revalidate = 63072000; // 2 years
import React from "react";
import { getCities, getServices, replaceSEOTemplate, getSEOContent, City, Service, slugify, declineCity } from "@/lib/seo-utils";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import AdvantagesSection from "@/components/AdvantagesSection";
import Footer from "@/components/Footer";
import CityCTA from "@/components/CityCTA";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Lucide-like SVG Icons with extra props support
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const PhoneIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const TruckIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><circle cx="7" cy="18" r="2" /><path d="M9 18h5" /><path d="M16 18h3a1 1 0 0 0 1-1v-3.05a1 1 0 0 0-.293-.707l-2.657-2.657A1 1 0 0 0 16.343 10H14" /><circle cx="18" cy="18" r="2" />
  </svg>
);

const WalletIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const ShieldIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const StarIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

async function getPageData(slug: string) {
  const cities = getCities();
  const services = getServices();

  // Sort services by length descending to match longest prefix first
  const sortedServices = [...services].sort((a, b) => b.slug.length - a.slug.length);

  let matchedService: Service | undefined;
  let matchedCity: City | undefined;

  for (const service of sortedServices) {
    const prefix = service.slug + '-';
    if (slug.startsWith(prefix)) {
      const citySlug = slug.slice(prefix.length);
      const city = cities.find(c => c.slug === citySlug);
      if (city) {
        matchedService = service;
        matchedCity = city;
        break;
      }
    }
  }

  if (!matchedCity || !matchedService) return null;

  const city = matchedCity;
  const service = matchedService;
  const serviceSlug = service.slug;

  let content = "";
  if (serviceSlug.includes('24h')) {
    content = getSEOContent('pomocdrogowa24h.md');
  } else if (serviceSlug.includes('tania-laweta')) {
    content = getSEOContent('tanialaweta.md');
  } else if (serviceSlug.includes('holowanie-samochodu')) {
    content = getSEOContent('holowaniesamochodumiasto.md');
  } else if (serviceSlug.includes('holowanie-auta') || serviceSlug.includes('holowanie-auto')) {
    content = getSEOContent('holowanieautamiasto.md');
  } else if (serviceSlug.includes('holowanie')) {
    content = getSEOContent('holowaniemiasto.md');
  } else if (serviceSlug.includes('pomoc-drogowa-cennik')) {
    content = getSEOContent('pomocdrogowacennik.md');
  } else if (serviceSlug.includes('laweta-cena-za-km')) {
    content = getSEOContent('lawetacenazakm.md');
  } else if (serviceSlug.includes('laweta-calodobowa')) {
    content = getSEOContent('lawetacalodobowamiasto.md');
  } else if (serviceSlug.includes('holowanie-z-oc-sprawcy')) {
    content = getSEOContent('holowaniezocsprawcymiasto.md');
  } else if (serviceSlug.includes('laweta')) {
    content = getSEOContent('lawetamiasto.md');
  } else if (serviceSlug.includes('szybka-pomoc-drogowa')) {
    content = getSEOContent('szybkapomocdrogowamiasto.md');
  } else if (serviceSlug.includes('transport-samochodow')) {
    content = getSEOContent('transportsamochodow.md');
  } else if (serviceSlug.includes('wyciaganie-z-rowu')) {
    content = getSEOContent('wyciaganiezrowu.md');
  } else if (serviceSlug.includes('mobilny-serwis-opon')) {
    content = getSEOContent('mobilnyserwisoponmiasto.md');
  } else if (serviceSlug.includes('awaryjne-odpalanie-auta')) {
    content = getSEOContent('awaryjneodpalenieautamiasto.md');
  } else if (serviceSlug.includes('tanie-holowanie')) {
    content = getSEOContent('tanieholowanie.md');
  } else if (serviceSlug.includes('polecana') || serviceSlug.includes('polecane')) {
    if (serviceSlug.includes('autoholowanie')) {
      content = getSEOContent('polecaneautoholowanie.md');
    } else if (serviceSlug.includes('holowanie')) {
      content = getSEOContent('polecaneholowanie.md');
    } else if (serviceSlug.includes('autolaweta')) {
      content = getSEOContent('polecanaautolaweta.md');
    } else if (serviceSlug.includes('laweta')) {
      content = getSEOContent('polecanalaweta.md');
    } else if (serviceSlug.includes('auto-pomoc')) {
      content = getSEOContent('polecanaautopomoc_v2.md');
    } else if (serviceSlug.includes('autopomoc')) {
      content = getSEOContent('polecanaautopomoc.md');
    } else {
      content = getSEOContent('polecanapomoc.md');
    }
  } else if (serviceSlug.includes('najtansza-pomoc-drogowa') || serviceSlug.includes('tania-pomoc-drogowa')) {
    content = getSEOContent('najtanszapomocdrogowa.md');
  } else {
    content = getSEOContent('pomocdrogowamiasto.md');
  }

  const serviceTitle = service.template.replace(/\[Miasto\]/g, city.name);
  let rawContent = content || "";
  
  // Fix H2 inflection: replace [Mieście] with [Miasto] in lines starting with ##
  rawContent = rawContent.split('\n').map(line => {
    if (line.trim().startsWith('##')) {
      return line.replace(/\[Mieście\]/g, '[Miasto]')
                 .replace(/\[Miasta\]/g, '[Miasto]')
                 .replace(/\[Miastu\]/g, '[Miasto]')
                 .replace(/\[Biernik\]/g, '[Miasto]')
                 .replace(/\[Narzędnik\]/g, '[Miasto]');
    }
    return line;
  }).join('\n');

  let seoContent = replaceSEOTemplate(rawContent, city, '572 272 930');

  seoContent = seoContent
    .replace(/\[H2\]\s?/g, '')
    .replace(/^# .*/gm, '')
    .replace(/---/g, '')
    .replace(/^## (.*)/gm, '<h2 class="seo-h2" style="font-size: 1.7rem; margin-top: 50px; margin-bottom: 20px; color: var(--secondary);">$1</h2>')
    .replace(/^- (.*)/gm, `<div style="display: flex; align-items: flex-start; margin-bottom: 12px; padding-left: 10px;">
      <span style="color: var(--primary); margin-right: 12px; margin-top: 4px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </span>
      <span style="font-weight: 600; font-size: 0.95rem;">$1</span>
    </div>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--primary); font-weight: 900;">$1</strong>')
    .replace(/\n\n/g, '</p><p class="seo-p" style="margin-bottom: 25px; font-size: 0.95rem; line-height: 1.8; color: #222; font-weight: 500;">')
    .replace(/572 272 930/g, '<span class="seo-phone" style="font-weight: 950; color: var(--primary); font-size: 1.1em; letter-spacing: -0.5px; white-space: nowrap;">572 272 930</span>')
    .replace(/laweciarz\.pro/gi, '<strong class="seo-brand" style="font-weight: 900; color: var(--secondary);">laweciarz.pro</strong>');

  seoContent = `<p class="seo-p" style="margin-bottom: 25px; font-size: 0.95rem; line-height: 1.8; color: #222; font-weight: 500;">${seoContent}</p>`;
  const contentChunks = seoContent.split('<h2');

  const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const serviceTitleCapitalized = capitalize(serviceTitle);

  let dynamicLawetaText = "Laweta";
  if (serviceTitleCapitalized.toLowerCase().includes('laweta')) {
    dynamicLawetaText = "Pomoc Drogowa";
  }

  const nearbyCities = cities
    .filter(c => c.district === city.district && c.slug !== city.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);

  return { city, service, serviceTitle: serviceTitleCapitalized, dynamicLawetaText, contentChunks, nearbyCities, services };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) return { title: "Nie znaleziono - laweciarz.pro" };

  const { miejscownik } = declineCity(data.city.name);

  return {
    title: `${data.serviceTitle} 24/7 - laweciarz.pro`.toUpperCase(),
    description: `${data.serviceTitle} ☎️ 572 272 930 ⭐⭐⭐⭐⭐ Ekspresowa ${data.dynamicLawetaText} i Holowanie 24h. Dojazd w 15 minut! LAWECIARZ.PRO – działamy natychmiast!`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) notFound();

  const { city, service, serviceTitle, dynamicLawetaText, contentChunks, nearbyCities, services } = data;
  const { miejscownik } = declineCity(city.name);

  // ─── City-tier logic for dynamic effects
  const MAJOR_CITIES = ['warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk', 'szczecin', 'bydgoszcz', 'lublin', 'katowice', 'rzeszow', 'bialystok'];
  const MEDIUM_CITIES = ['torun', 'gliwice', 'zabrze', 'bytom', 'chorzow', 'ruda-slaska', 'zielona-gora', 'opole', 'elblag', 'plock', 'walbrzych', 'radom', 'olsztyn', 'kielce'];
  const tier = MAJOR_CITIES.includes(city.slug) ? 'major' : MEDIUM_CITIES.includes(city.slug) ? 'medium' : 'small';
  const cityMeta = {
    major: { eta: '15', drivers: '12+', label: 'DUŻE MIASTO', etaLabel: 'błyskawiczny dojazd' },
    medium: { eta: '15', drivers: '6+', label: 'MIASTO', etaLabel: 'błyskawiczny dojazd' },
    small: { eta: '15', drivers: '3+', label: 'OBSZAR', etaLabel: 'błyskawiczny dojazd' },
  }[tier];

  const heroImages = [
    '/images/hero-main.webp', '/images/hero-1.webp', '/images/hero-2.webp',
    '/images/hero-4.webp', '/images/hero-5.webp', '/images/hero-6.webp'
  ];

  const descriptionTemplate = `${serviceTitle} ☎️ 572 272 930 ⭐⭐⭐⭐⭐ Ekspresowa ${dynamicLawetaText} i Holowanie 24h. Dojazd w 15 minut! LAWECIARZ.PRO – działamy natychmiast!`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${serviceTitle} - laweciarz.pro`,
    "image": `https://laweciarz.pro${heroImages[0]}`,
    "description": descriptionTemplate,
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

  const siteNameLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LAWECIARZ.PRO",
    "url": "https://laweciarz.pro.pl/"
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNameLd) }}
      />
      <Navigation locationText={city.name.toUpperCase()} />

      <section className="hero-section-slug bg-dots" style={{ position: 'relative' }}>
        <div className="hero-container-slug" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'stretch', gap: '50px', flexWrap: 'wrap' }}>
          <div className="anim-hero-entrance hero-content-slug" style={{ flex: '1.2', minWidth: '300px' }}>
            <div className="hero-badge-container" style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <div className="badge-live anim-bounce-in">DOSTĘPNI TERAZ · 24 / 7</div>
              <div className="badge-accent anim-bounce-in anim-delay-2 hidden-mobile">OBSZAR: {city.name.toUpperCase()}</div>
            </div>

            {(() => {
              const nameLen = city.name.length;
              let cityFontSize = 'clamp(3.2rem, 10vw, 7.8rem)';
              if (nameLen > 15) cityFontSize = 'clamp(2.2rem, 7vw, 4.8rem)';
              else if (nameLen > 10) cityFontSize = 'clamp(2.8rem, 8vw, 6.2rem)';
              
              return (
                <h1 style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: 'clamp(3.5rem, 10vw, 7.8rem)', fontWeight: 950, color: '#1a1a1a', letterSpacing: '-3px' }}>{service.template.replace(/\[Miasto\]/gi, '').trim().toUpperCase()}</span>
                  <span style={{ fontSize: cityFontSize, fontWeight: 950, color: 'var(--primary)', letterSpacing: '-3px' }}>{city.name.toUpperCase()}</span>
                </h1>
              );
            })()}

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#555', marginBottom: '40px', maxWidth: '650px', fontWeight: 600, lineHeight: 1.5 }}>
              Potrzebujesz pomocy? Przyjedziemy błyskawicznie w ciągu <strong style={{ color: 'var(--primary)' }}>{cityMeta.eta} minut</strong>. Zapewniamy profesjonalne holowanie, lawetę i pomoc drogową 24h.
            </p>

            <a href="tel:+48572272930" className="btn-power anim-slide-up anim-delay-4 hero-massive-btn" style={{ padding: '22px 48px', gap: '20px', display: 'flex', alignItems: 'center', width: 'fit-content' }}>
              <div className="animate-pulse"><PhoneIcon size={40} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1, textAlign: 'center' }}>
                <span style={{ fontWeight: 950, fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', letterSpacing: '-1px' }}>WEZWIJ POMOC</span>
                <span style={{ fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', opacity: 0.9 }}>572 272 930</span>
              </div>
            </a>
          </div>

          <div className="anim-slide-right hero-image-slug" style={{ flex: '1', minWidth: '300px' }}>
            <div className="hero-image-frame">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ticker — now including all requested types ─── */}
      <div className="ticker-wrap" style={{ background: 'var(--secondary)', color: 'white', padding: '15px 0', borderTop: '4px solid var(--primary)' }}>
        <div className="ticker-inner">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <span style={{ fontWeight: 950, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Pomoc Drogowa {city.name.toUpperCase()}</span>
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

      {/* ─── Premium Review Section (Maciej Jastrzębski) ─── */}
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

      <section style={{ background: 'var(--secondary)', color: 'white', borderTop: '8px solid var(--primary)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { num: '15', unit: 'MIN', label: `Dojazd w ${miejscownik}` },
            { num: '5.0', unit: '', label: 'Ocena Google' },
            { num: '24', unit: '/7', label: 'Dostępność' },
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
      {/* SEO Content Chunks */}
      <section style={{ background: 'white', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {contentChunks.map((chunk, index) => {
            const htmlContent = index === 0 ? chunk : `<h2${chunk}`;
            const isCTA = index % 3 === 1;
            return (
              <div key={index} style={{ marginBottom: '40px' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {isCTA && (
                  <CityCTA cityName={city.name} miejscownik={miejscownik} eta={cityMeta.eta} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ background: '#fcfcfc', padding: '60px 20px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            ZOBACZ TEŻ INNE USŁUGI W {city.name.toUpperCase()}:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {services
              .filter(s => s.slug !== service.slug)
              .sort(() => 0.5 - Math.random()) // Shuffle
              .slice(0, 8) // Limit to 8 to hide full strategy and keep it clean
              .map((s, idx) => (
              <Link 
                key={`${s.slug}-${idx}`} // Added index to ensure uniqueness if data has duplicates
                href={`/${s.slug}-${city.slug}`}
                style={{ 
                  padding: '16px 20px', 
                  background: 'white', 
                  borderRadius: '16px', 
                  color: 'black', 
                  textDecoration: 'none', 
                  fontSize: '0.85rem', 
                  fontWeight: 900,
                  transition: 'all 0.2s',
                  border: '2px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                className="service-link"
              >
                <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                {s.template.replace('[Miasto]', city.name)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {nearbyCities.length > 0 && (
        <section style={{ background: 'white', padding: '60px 20px', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              OBSŁUGUJEMY RÓWNIEŻ POBLISKIE MIEJSCOWOŚCI:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {nearbyCities.map((nc) => (
                <Link 
                  key={nc.slug} 
                  href={`/pomoc-drogowa-${nc.slug}`}
                  style={{ 
                    padding: '12px 16px', 
                    background: '#f8f8f8', 
                    borderRadius: '12px', 
                    color: '#444', 
                    textDecoration: 'none', 
                    fontSize: '0.9rem', 
                    fontWeight: 700,
                    transition: 'all 0.2s',
                    border: '1px solid #eee'
                  }}
                  className="nearby-link"
                >
                  {nc.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--primary)', color: 'white', padding: '100px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '8px solid var(--secondary)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '20px' }}>JESTEŚMY W {city.name.toUpperCase()}</div>
          <h2 style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', fontWeight: 950, marginBottom: '20px', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-2px' }}>AWARIA POJAZDU<br />W {city.name.toUpperCase()}?</h2>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 900, marginBottom: '44px', opacity: 0.88 }}>NIE CZEKAJ — DOJAZD W {cityMeta.eta} MINUT!</p>
          <a href="tel:+48572272930" className="btn-power hero-massive-btn" style={{ background: 'white', color: 'var(--primary)', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', padding: '28px 48px', boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 8px 0 rgba(0,0,0,0.2)', gap: '16px', maxWidth: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <div className="animate-pulse"><PhoneIcon size={42} /></div>
            <span className="cta-phone-number" style={{ fontWeight: 950 }}>572 272 930</span>
          </a>
        </div>
      </section>

      <section style={{ width: '100%', height: '450px', background: '#eee', borderTop: '4px solid var(--primary)' }}>
        <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(city.name + ' ' + city.province)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}></iframe>
      </section>

      <Footer currentCity={city} />
      <FloatingCTA />
    </main>
  );
}

export async function generateStaticParams() {
  const topCitySlugs = ['warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk'];
  const services = getServices();
  const params = [];
  for (const service of services.slice(0, 3)) {
    for (const citySlug of topCitySlugs) {
      params.push({ slug: `${service.slug}-${citySlug}` });
    }
  }
  return params;
}
