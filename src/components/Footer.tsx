import Link from "next/link";
import { City, getCities } from "@/lib/seo-utils";
import ContactForm from "./ContactForm";

interface FooterProps {
  currentCity?: City;
}

export default function Footer({ currentCity }: FooterProps) {
  const allCities = getCities();

  const largestCitySlugs = [
    'warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk',
    'szczecin', 'bydgoszcz', 'lublin', 'bialystok', 'katowice', 'gdynia',
    'czestochowa', 'radom', 'sosnowiec', 'torun', 'kielce', 'rzeszow',
    'gliwice', 'zabrze', 'olsztyn', 'bielsko-biala', 'bytom', 'zielona-gora'
  ];

  let displayCities: City[] = [];
  let sectionTitle = "Główne Miasta";

  if (currentCity) {
    const district = currentCity.district || "Pozostałe";
    let distCities = allCities.filter(c => c.district === district && c.slug !== currentCity.slug);
    
    if (distCities.length < 16) {
      const provinceCities = allCities.filter(c => 
        c.province === currentCity.province && 
        c.district !== district && 
        c.slug !== currentCity.slug
      );
      distCities = [...distCities, ...provinceCities].slice(0, 100);
    }

    displayCities = [...distCities].sort(() => 0.5 - Math.random()).slice(0, 16);
    sectionTitle = district !== "Pozostałe" ? `Obszar powiat ${district}` : `Obszar woj. ${currentCity.province}`;
  } else {
    displayCities = allCities
      .filter(c => largestCitySlugs.includes(c.slug))
      .sort(() => 0.5 - Math.random())
      .slice(0, 16);
  }

  return (
    <footer style={{ padding: '100px 20px 40px', background: 'var(--secondary)', color: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', width: '100%' }}>
          {/* Column 1: Brand & About */}
          <div>
            <div style={{ fontSize: '28px', fontWeight: 950, marginBottom: '30px', letterSpacing: '-0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', marginRight: '4px', fontSize: '26px', lineHeight: 1 }}>LAWECIARZ</span><span style={{ color: 'white', fontSize: '0.75em' }}>.PRO</span>
            </div>
            <p style={{ fontWeight: 600, opacity: 0.6, lineHeight: 1.7, marginBottom: '35px', fontSize: '1rem' }}>
              Twój niezawodny partner w sytuacjach drogowych. Dysponujemy nowoczesną flotą autoholowników gotowych do akcji w Twojej okolicy. Bezpieczeństwo i szybkość to nasz priorytet.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
               <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px' }}>PRZYJMUJEMY ZLECENIA</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 950, marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: 'var(--primary)' }}>{sectionTitle}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <ul style={{ listStyle: 'none', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', padding: 0 }}>
                {displayCities.slice(0, 8).map((city, i) => (
                  <li key={i}>
                    <Link href={`/pomoc-drogowa-${city.slug}`} style={{ opacity: 0.5, color: 'white', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: 'none', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', padding: 0 }}>
                {displayCities.slice(8, 16).map((city, i) => (
                  <li key={i}>
                    <Link href={`/pomoc-drogowa-${city.slug}`} style={{ opacity: 0.5, color: 'white', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Contact & Conversion */}
          <div>
              <div style={{ fontWeight: 950, marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: 'var(--primary)' }}>SZYBKI KONTAKT</div>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '35px', 
                borderRadius: '32px', 
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <a href="tel:+48572272930" style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 950, 
                  color: 'white', 
                  display: 'block', 
                  marginBottom: '15px',
                  textDecoration: 'none',
                  letterSpacing: '-1px'
                }}>
                  572 272 930
                </a>
                
                {/* Zintegrowany minimalistyczny formularz */}
                <ContactForm />

                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <a href="mailto:kontakt@laweciarz.pro" style={{ color: 'white', textDecoration: 'none', fontWeight: 750, fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    kontakt@laweciarz.pro
                  </a>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '80px', paddingTop: '30px', maxWidth: '1400px', margin: '80px auto 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', fontSize: '11px', fontWeight: 800, color: '#444', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#333', color: '#666', padding: '4px 8px', borderRadius: '4px', fontWeight: 950, fontSize: '12px' }}>LAWECIARZ.PRO</div>
            <span>© 2026 WSZELKIE PRAWA ZASTRZEŻONE.</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Linki ukryte zgodnie z instrukcją */}
          </div>
        </div>
      </div>
    </footer>
  );
}
