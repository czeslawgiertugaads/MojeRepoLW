import { getCities, slugify } from "@/lib/seo-utils";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lokalizacje Pomocy Drogowej - LAWECIARZ.PRO",
  description: "Wybierz województwo, aby znaleźć pomoc drogową w Twojej okolicy. Obsługujemy całą Polskę 24/7.",
  alternates: {
    canonical: "/lokalizacje",
  },
};

export default function LokalizacjePage() {
  const allCities = getCities();

  // Get unique provinces
  const provinces = Array.from(new Set(allCities.map(c => c.province || "Pozostałe"))).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Lokalizacje Pomocy Drogowej - LAWECIARZ.PRO",
    "image": "https://laweciarz.pro/images/hero-main.webp",
    "description": "Wybierz województwo, aby znaleźć pomoc drogową w Twojej okolicy. Obsługujemy całą Polskę 24/7. Profesjonalne usługi holowania.",
    "brand": {
      "@type": "Brand",
      "name": "LAWECIARZ.PRO"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "5364"
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://laweciarz.pro" },
      { "@type": "ListItem", "position": 2, "name": "Lokalizacje", "item": "https://laweciarz.pro/lokalizacje" }
    ]
  };

  return (
    <main style={{ padding: '80px 20px', background: '#f8fafc', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← POWRÓT DO STRONY GŁÓWNEJ</Link>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, color: 'var(--secondary)' }}>
            WYBIERZ <span style={{ color: 'var(--primary)' }}>WOJEWÓDZTWO</span>
          </h1>
          <p style={{ fontWeight: 600, opacity: 0.6, fontSize: '1.2rem', marginTop: '20px' }}>
            Nasza sieć obejmuje {allCities.length.toLocaleString()} miast. Wybierz region, aby zobaczyć szczegółową listę.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {provinces.map(province => (
            <Link 
              key={province} 
              href={`/lokalizacje/${slugify(province)}`}
              style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '24px', 
                border: '2px solid #eee', 
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Ensures button is at the bottom
                minHeight: '160px', // Uniform height
                gap: '15px'
              }}
              className="province-card"
            >
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 900, 
                color: 'var(--secondary)', 
                textTransform: 'uppercase',
                lineHeight: 1.2
              }}>
                {province.replace('województwo ', '')}
              </span>
              <div style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '10px 0', 
                borderRadius: '12px', 
                fontSize: '12px', 
                fontWeight: 950,
                textAlign: 'center',
                textTransform: 'uppercase'
              }}>
                ZOBACZ LOKALIZACJE →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
