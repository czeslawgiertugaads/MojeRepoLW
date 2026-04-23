import Link from "next/link";
import { City, getCities, slugify } from "@/lib/seo-utils";

interface FooterProps {
  currentCity?: City;
}

export default function Footer({ currentCity }: FooterProps) {
  const allCities = getCities();

  // Largest cities list for default view
  const largestCitySlugs = [
    'warszawa', 'krakow', 'lodz', 'wroclaw', 'poznan', 'gdansk',
    'szczecin', 'bydgoszcz', 'lublin', 'bialystok', 'katowice', 'gdynia',
    'czestochowa', 'radom', 'sosnowiec', 'torun', 'kielce', 'rzeszow',
    'gliwice', 'zabrze', 'olsztyn', 'bielsko-biala', 'bytom', 'zielona-gora'
  ];

  let displayCities: City[] = [];
  let sectionTitle = "Główne Miasta";

  if (currentCity) {
    const provinceCities = allCities.filter(c => c.province === currentCity.province && c.slug !== currentCity.slug);
    displayCities = [...provinceCities].sort(() => 0.5 - Math.random()).slice(0, 16);
    sectionTitle = `Obszar woj. ${currentCity.province}`;
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

          {/* Column 2 & 3: Grouped Cities 
          <div>
            <div style={{ fontWeight: 950, marginBottom: '35px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: 'var(--primary)' }}>{sectionTitle}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <ul style={{ listStyle: 'none', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', padding: 0 }}>
                {displayCities.slice(0, 8).map((city, i) => (
                  <li key={i}>
                    <Link href={`/pomoc-drogowa/${city.slug}`} style={{ opacity: 0.5, color: 'white', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: 'none', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', padding: 0 }}>
                {displayCities.slice(8, 16).map((city, i) => (
                  <li key={i}>
                    <Link href={`/pomoc-drogowa/${city.slug}`} style={{ opacity: 0.5, color: 'white', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          */}

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
                <p style={{ fontSize: '14px', fontWeight: 600, opacity: 0.5, lineHeight: 1.6 }}>
                  Średni czas dojazdu w Twojej okolicy:<br/>
                  <strong style={{ color: 'white', opacity: 1 }}>15-30 minut</strong>. Zadzwoń teraz.
                </p>
              </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: '100px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', fontWeight: 800, opacity: 0.3, textAlign: 'center', letterSpacing: '1px' }}>
        © 2026 LAWECIARZ.PRO – LOKALNY SYSTEM POMOCY DROGOWEJ. WSZYSTKIE PRAWA ZASTRZEŻONE.
      </div>
    </footer>
  );
}
