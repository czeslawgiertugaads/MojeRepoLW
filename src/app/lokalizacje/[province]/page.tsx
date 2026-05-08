import { getCities, slugify } from "@/lib/seo-utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const allCities = getCities();
  const provinces = Array.from(new Set(allCities.map(c => c.province || "Pozostałe")));
  return provinces.map(p => ({
    province: slugify(p)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ province: string }> }): Promise<Metadata> {
  const { province: provinceSlug } = await params;
  const allCities = getCities();
  const provinceName = allCities.find(c => slugify(c.province || "Pozostałe") === provinceSlug)?.province || "Pozostałe";

  return {
    title: `Pomoc Drogowa Województwo ${provinceName} - LAWECIARZ.PRO`,
    description: `Spis wszystkich miejscowości w województwie ${provinceName}. Najszybsza laweta i pomoc drogowa 24/7. Dojazd w 15 minut.`,
    alternates: {
      canonical: `/lokalizacje/${provinceSlug}`,
    },
  };
}

export default async function ProvincePage({ params }: { params: Promise<{ province: string }> }) {
  const { province: provinceSlug } = await params;
  const allCities = getCities();

  // Find the actual name for this slug
  const provinceName = allCities.find(c => slugify(c.province || "Pozostałe") === provinceSlug)?.province || (provinceSlug === 'pozostale' ? 'Pozostałe' : null);

  if (!provinceName) {
    notFound();
  }

  // Filter and group by district
  const provinceCities = allCities.filter(c => slugify(c.province || "Pozostałe") === provinceSlug);
  const groupedByDistrict: Record<string, typeof allCities> = provinceCities.reduce((acc, city) => {
    const district = city.district || "Inne";
    if (!acc[district]) acc[district] = [];
    acc[district].push(city);
    return acc;
  }, {} as Record<string, typeof allCities>);

  const districts = Object.keys(groupedByDistrict).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Pomoc Drogowa Województwo ${provinceName} - LAWECIARZ.PRO`,
    "image": "https://laweciarz.pro/images/hero-main.webp",
    "description": `Spis wszystkich miejscowości w województwie ${provinceName}. Najszybsza laweta i pomoc drogowa 24/7. Profesjonalne usługi holowania. Dojazd w 15 minut.`,
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
      { "@type": "ListItem", "position": 2, "name": "Lokalizacje", "item": "https://laweciarz.pro/lokalizacje" },
      { "@type": "ListItem", "position": 3, "name": `Województwo ${provinceName}`, "item": `https://laweciarz.pro/lokalizacje/${provinceSlug}` }
    ]
  };

  return (
    <main style={{ padding: '60px 20px', background: '#f8fafc', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Link href="/lokalizacje" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← WRÓĆ DO WYBORU WOJEWÓDZTWA</Link>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--secondary)', textTransform: 'uppercase' }}>
            WOJEWÓDZTWO <span style={{ color: 'var(--primary)' }}>{provinceName}</span>
          </h1>
          <p style={{ fontWeight: 600, opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>
            Lista {provinceCities.length.toLocaleString()} miejscowości podzielona na powiaty.
          </p>
        </div>

        {districts.map(district => (
          <section key={district} style={{ marginBottom: '60px', background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #eee' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--secondary)',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
              Powiat {district}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {groupedByDistrict[district].map(city => (
                <Link
                  key={city.slug}
                  href={`/pomoc-drogowa-${city.slug}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
