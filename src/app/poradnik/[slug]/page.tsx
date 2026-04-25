import { articles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FloatingCTA from "@/components/FloatingCTA";
import { Metadata } from "next";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/poradnik/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${article.title} - laweciarz.pro`,
    "image": `https://laweciarz.pro${article.image}`,
    "description": article.metaDescription,
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
    <main style={{ background: '#fff', minHeight: '100vh', paddingBottom: '120px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNameLd) }}
      />
      {/* Navigation */}
      <nav style={{ background: 'white', padding: '20px 40px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 950, textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'flex-end' }}>
            <span style={{ color: 'var(--primary)' }}>LAWECIARZ</span><span style={{ color: 'black', fontSize: '0.75em' }}>.PRO</span>
          </Link>
          <Link href="/" style={{ color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', textDecoration: 'none', letterSpacing: '1px' }}>← POWRÓT DO BAZY</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px', padding: '60px 20px' }}>
        
        {/* Main Content */}
        <article style={{ flex: '2', minWidth: '320px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {article.tags.map(tag => (
                <span key={tag} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 900 }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 950, lineHeight: 1, marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '-2px' }}>
              {article.title}
            </h1>
            <p style={{ fontSize: '1.35rem', fontWeight: 600, color: '#666', lineHeight: 1.6, marginBottom: '50px', borderLeft: '6px solid var(--primary)', paddingLeft: '30px' }}>
              {article.excerpt}
            </p>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '32px', overflow: 'hidden', marginBottom: '60px', boxShadow: '20px 20px 0 #f8fafc' }}>
             <Image 
               src={article.image} 
               alt={article.title} 
               fill 
               style={{ objectFit: 'cover' }} 
               sizes="(max-width: 1200px) 100vw, 800px"
               priority 
             />
          </div>

          <div className="article-body" style={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#1a1a1a', fontWeight: 500 }}>
             <div dangerouslySetInnerHTML={{ 
               __html: article.content
                 .replace(/\n\n/g, '<br/><br/>')
                 .replace(/## (.*?)\n/g, '<h2 style="font-size: 2.2rem; font-weight: 950; margin-top: 60px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: -1px; border-bottom: 4px solid var(--primary); display: inline-block;">$1</h2>')
                 .replace(/### (.*?)\n/g, '<h3 style="font-size: 1.6rem; font-weight: 900; margin-top: 40px; margin-bottom: 16px; color: var(--primary);">$1</h3>')
                 .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 900; color: #000;">$1</strong>')
                 .replace(/> (.*?)\n/g, '<blockquote style="background: #fdf2f2; border-radius: 16px; padding: 30px; margin: 40px 0; border-left: 8px solid var(--primary); font-style: italic; font-weight: 700;">$1</blockquote>')
             }} />
          </div>

          {/* Bottom Card */}
          <div style={{ marginTop: '80px', padding: '60px', background: 'var(--secondary)', color: 'white', borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
            <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '20px', textTransform: 'uppercase' }}>Potrzebujesz natychmiastowej pomocy?</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '40px', fontWeight: 500 }}>Nasi kierowcy są rozstawieni w strategicznych punktach Polski. Dojazd w 15-20 minut gwarantowany.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <a href="tel:+48572272930" className="btn-power" style={{ background: 'var(--primary)', padding: '20px 40px', fontSize: '1.4rem' }}>
                   ZADZWOŃ TERAZ
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ flex: '0.8', minWidth: '300px' }}>
          <div style={{ position: 'sticky', top: '140px' }}>
            <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '32px', border: '1px solid #eee' }}>
              <h4 style={{ fontWeight: 950, fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Dlaczego my?</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { t: 'CZAS DOJAZDU', d: 'Średnio 15 minut' },
                  { t: 'DOSTĘPNOŚĆ', d: '24/7/365' },
                  { t: 'SPRZĘT', d: 'Najnowsze lawety 2026' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ color: 'var(--primary)', fontWeight: 950, fontSize: '10px', letterSpacing: '1px' }}>{stat.t}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{stat.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '30px', background: 'var(--primary)', padding: '30px', borderRadius: '32px', color: 'white' }}>
              <div style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '10px' }}>OC SPRAWCY?</div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '20px', opacity: 0.9 }}>Możesz mieć lawetę zupełnie ZA DARMO. Zadzwoń, pomożemy Ci to załatwić.</p>
              <a href="tel:+48572272930" style={{ color: 'white', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                DOWIEDZ SIĘ WIĘCEJ →
              </a>
            </div>
          </div>
        </aside>

      </div>

      <FloatingCTA />
    </main>
  );
}
