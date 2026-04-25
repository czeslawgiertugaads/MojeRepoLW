import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laweta Cennik - Pomoc Drogowa Cena | LAWECIARZ.PRO',
  description: 'Sprawdź aktualny cennik usług lawetą, pomocy drogowej i holowania. Laweta cena. Usługi lawetą 24h na dobę. Zadzwoń: 572 272 930.',
  alternates: {
    canonical: "/laweta-cennik",
  },
};

const PhoneIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PriceTable = ({ title, rows }: { title: string, rows: { service: string, price: string }[] }) => (
  <div style={{
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '30px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ padding: '15px 25px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'black', textTransform: 'uppercase' }}>{title}</h3>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{
              borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #f1f5f9'
            }}>
              <td style={{ padding: '15px 25px', fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{row.service}</td>
              <td style={{ padding: '15px 25px', fontWeight: 900, color: 'black', fontSize: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--primary)' }}>{row.price}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function PricingPage() {
  const tables = [
    {
      title: "Holowanie i Transport",
      info: "Szybki przewóz aut osobowych, dostawczych oraz motocykli.",
      rows: [
        { service: "Holowanie w mieście (samochód do 1,5t)", price: "od 165 zł" },
        { service: "Holowanie na trasie (powyżej 100 km)", price: "od 2,75 zł / km" },
        { service: "Transport busów i vanów (powyżej 2t)", price: "od 198 zł" },
        { service: "Transport busów na trasie (powyżej 100 km)", price: "od 3,30 zł / km" },
        { service: "Transport motocykla: w mieście / na trasie", price: "od 165 zł / od 2,20 zł/km" },
        { service: "Dodatkowi pasażerowie (powyżej 2 osób lawetą 7-os)", price: "od 55 zł" },
      ]
    },
    {
      title: "Trudne Warunki i Załadunek",
      info: "Wsparcie w sytuacjach, gdy auto nie chce współpracować.",
      rows: [
        { service: "Wciągnięcie na lawetę (sprawne auto)", price: "od 66 zł" },
        { service: "Załadunek przy uszkodzeniach (blokada kół, wahacz itp.)", price: "110 zł - 495 zł" },
        { service: "Wyciąganie auta (rów, błoto, zaspy, barierki)", price: "od 110 zł" },
        { service: "Wjazd do garażu podziemnego / parkingi niskie", price: "od 110 zł" },
      ]
    },
    {
      title: "Naprawy na Miejscu (Mobilna Pomoc)",
      info: "Interwencje techniczne, które pozwalają uniknąć holowania.",
      rows: [
        { service: "Awaryjne odpalanie (Jump Start 12V/24V)", price: "od 132 zł" },
        { service: "Wymiana koła na drodze (zapas lub uszczelnienie)", price: "od 132 zł" },
        { service: "Dowiezienie paliwa (plus koszt paliwa)", price: "od 132 zł" },
        { service: "Diagnostyka OBD (sprawdzenie i kasowanie błędów)", price: "od 88 zł" },
      ]
    },
    {
      title: "Szkody z OC Sprawcy",
      info: "Bezpłatna pomoc dla osób poszkodowanych w kolizjach.",
      rows: [
        { service: "Holowanie powypadkowe (z OC sprawcy)", price: "0 zł" },
        { service: "Auto zastępcze na czas naprawy", price: "0 zł" },
        { service: "Dokumentacja dla ubezpieczalni (foto i opis)", price: "W CENIE" },
      ]
    },
    {
      title: "Dopłaty i Koszty Dodatkowe",
      rows: [
        { service: "Wyjazd ekspresowy – reakcja i dojazd do 15 minut", price: "+ 55 zł" },
        { service: "Praca w nocy (godz. 21:00 – 07:00)", price: "+ 50% stawki" },
        { service: "Niedziele i święta (dni wolne od pracy)", price: "+ 50% stawki" },
        { service: "Postój lawety (z przyczyn niezależnych)", price: "132 zł / h" },
        { service: "Rezygnacja z usługi po wyjeździe lawety (miasto)", price: "110 zł" },
        { service: "Rezygnacja z usługi po wyjeździe lawety (trasa)", price: "110 zł + 4,40 zł/km" },
      ]
    }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 640px) {
          .cennik-container { padding: 0 10px !important; }
          .hero-cennik { padding: 60px 20px 40px !important; }
          .table-section { padding: 20px 10px !important; }
        }
      `}} />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-cennik" style={{
        background: 'var(--secondary)',
        color: 'white',
        padding: '100px 20px 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 950,
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            CENNIK <span style={{ color: 'var(--primary)' }}>USŁUG</span>
          </h1>
          <p style={{ opacity: 0.8, fontWeight: 600 }}>Profesjonalna pomoc drogowa 24/7</p>
        </div>
      </section>

      {/* Main Content - Price Tables */}
      <section className="table-section" style={{ padding: '60px 20px 60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {tables.map((table, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              {table.info && (
                <div style={{ marginBottom: '15px', padding: '0 10px' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{table.info}</p>
                </div>
              )}
              <PriceTable title={table.title} rows={table.rows} />
            </div>
          ))}

          {/* Contact CTA */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="tel:+48572272930" className="btn-power" style={{ padding: '20px 40px', fontSize: '1.4rem', gap: '15px' }}>
              <PhoneIcon size={32} />
              572 272 930
            </a>
          </div>
        </div>
      </section>

      {/* SEO Descriptions Section */}
      <section style={{ padding: '0 20px 80px', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '30px', textTransform: 'uppercase' }}>Szczegóły <span style={{ color: 'var(--primary)' }}>usług</span></h2>

            <div style={{ display: 'grid', gap: '30px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Holowanie i transport pojazdów</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }}>Realizujemy transport aut osobowych, dostawczych oraz motocykli na lawecie. Nasza flota lawet jest przystosowana do przewozu aut o różnej masie i gabarytach. Działamy na terenie miast oraz na drogach ekspresowych i autostradach.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Interwencje w trudnych warunkach</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }}>Pomagamy wyciągać auta z rowów, błota, zasp oraz garaży podziemnych. Posiadamy specjalistyczny sprzęt (rolki, wciągarki) do załadunku aut z uszkodzonym układem jezdnym, zablokowaną skrzynią biegów lub zerwanym wahaczem.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Mobilna pomoc techniczna</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }}>Nie każda awaria wymaga holowania. Oferujemy awaryjne odpalanie (jump start), wymianę koła, dowóz paliwa oraz diagnostykę OBD na miejscu. Jeśli sytuacja na to pozwala, naprawiamy usterkę od ręki, oszczędzając Twój czas.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Obsługa po kolizjach i wypadkach</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }}>Zapewniamy pełne wsparcie powypadkowe, w tym pomoc i auto zastępcze rozliczane z OC sprawcy. Przygotowujemy kompletną dokumentację fotograficzną oraz pisma niezbędne do likwidacji szkody w Towarzystwie Ubezpieczeniowym.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  );
}
