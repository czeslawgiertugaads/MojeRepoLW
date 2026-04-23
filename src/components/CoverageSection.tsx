import Link from "next/link";
import Image from "next/image";
import { City } from "@/lib/seo-utils";

interface CoverageSectionProps {
  cities: City[];
  showAll?: boolean;
  showMap?: boolean;
}

export default function CoverageSection({ cities, showAll = false, showMap = true }: CoverageSectionProps) {
  return (
    <section id="coverage" style={{ 
      padding: 'clamp(60px, 10vw, 120px) clamp(12px, 3vw, 20px)', 
      background: '#fff', 
      textAlign: 'center',
      borderTop: '2px solid rgba(0,0,0,0.02)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {showMap && (
          <>
            <div className="badge" style={{ marginBottom: '20px' }}>GIGANTYCZNY ZASIĘG</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 950, textTransform: 'uppercase', lineHeight: 1 }}>
              DOSTĘPNI W <span style={{ color: 'var(--primary)' }}>KAŻDYM MIEŚCIE</span> Z <span style={{ color: 'var(--primary)' }}>LAWECIARZ.PRO</span>
            </h2>
          </>
        )}
        
        {showMap && (
          <div style={{ 
            position: 'relative', 
            borderRadius: '40px', 
            overflow: 'hidden', 
            border: '10px solid var(--secondary)',
            boxShadow: '30px 30px 0 rgba(0,0,0,0.05)',
            background: '#f8fafc',
            marginBottom: '80px'
          }}>
            <Image 
              src="/images/Mapa_Polski.jpeg" 
              alt="Mapa zasięgu laweciarz.pro" 
              width={1200} 
              height={800} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        <div className="cities-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {cities.map(city => (
            <Link key={city.slug} href={`/pomoc-drogowa/${city.slug}`} className="card" style={{ padding: '15px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: 'black', textDecoration: 'none' }}>
              {city.name}
            </Link>
          ))}
          {!showAll && (
            <Link href="/lokalizacje" className="card" style={{ 
              padding: '15px', 
              fontWeight: 950, 
              background: 'var(--secondary)', 
              color: 'white', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '2px solid black',
              boxShadow: '6px 6px 0 var(--primary)'
            }}>
              PEŁNA LISTA MIAST
              <span style={{ color: 'var(--primary)' }}>+</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
