import React from "react";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Polityka Prywatności - laweciarz.pro',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/polityka-prywatnosci",
  },
};

export default function PolitykaPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc', color: '#111' }}>
      <Navigation locationText="POLITYKA" />
      
      <div className="container" style={{ padding: 'clamp(60px, 10vw, 120px) 15px', maxWidth: '900px' }}>
        <div style={{ marginBottom: '60px' }}>
          <div className="badge-accent" style={{ marginBottom: '16px' }}>DOKUMENT OFICJALNY</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            POLITYKA PRYWATNOŚCI <br/>
            <span style={{ color: 'var(--primary)' }}>I PLIKÓW COOKIE</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', fontWeight: 500, maxWidth: '600px' }}>
            Transparentne zasady przetwarzania danych osobowych oraz wykorzystywania technologii monitorujących w serwisie LAWECIARZ.PRO
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>01.</span> ADMINISTRATOR DANYCH OSOBOWYCH
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333' }}>
              Podmiotem odpowiedzialnym za przetwarzanie Twoich danych jest <strong>Dev Sp. z o.o.</strong> z siedzibą w Łodzi. Administrator zapewnia, że dane są przetwarzane w sposób bezpieczny i zgodny z Rozporządzeniem (UE) 2016/679 (RODO).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>02.</span> ZAKRES I CHARAKTER PRZETWARZANIA
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333', marginBottom: '20px' }}>
              Głównym celem gromadzenia danych jest umożliwienie sprawnej komunikacji w sytuacjach awaryjnych na drodze.
            </p>
            
            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #eee', background: 'white', padding: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', color: '#888' }}>Klasyfikacja</th>
                    <th style={{ padding: '16px', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', color: '#888' }}>Opis atrybutów</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.95rem' }}>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: 700 }}>Dane Kontaktowe</td>
                    <td style={{ padding: '16px', color: '#444' }}>Wyłącznie numer telefonu przekazany podczas połączenia lub zapytania (Priorytet operacyjny).</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: 700 }}>Identyfikacja sieciowa</td>
                    <td style={{ padding: '16px', color: '#444' }}>Adres IP przypisany do urządzenia.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontWeight: 700 }}>Środowisko</td>
                    <td style={{ padding: '16px', color: '#444' }}>System operacyjny, typ przeglądarki, rozdzielczość ekranu.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', fontWeight: 700 }}>Aktywność (Logs)</td>
                    <td style={{ padding: '16px', color: '#444' }}>Sekwencja zdarzeń na stronie, kliknięcia w przycisk „Zadzwoń”, czas interakcji.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>03.</span> CELE OPERACYJNE
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { title: "Bezpośredni kontakt (Kluczowy)", desc: "Wykorzystanie numeru telefonu w celu oddzwonienia do klienta i ustalenia szczegółów pomocy drogowej." },
                { title: "Logistyka i realizacja", desc: "Obsługa zleceń holowania oraz transportu pojazdów." },
                { title: "Cyberbezpieczeństwo", desc: "Ochrona serwisu przed botami i nadużyciami." },
                { title: "Analiza jakości", desc: "Doskonalenie interfejsu (UX) w celu szybszego dostępu do pomocy." }
              ].map((item, i) => (
                <li key={i} style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                  <h4 style={{ fontWeight: 900, marginBottom: '8px', color: 'var(--secondary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>{item.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>04.</span> PODSTAWA PRAWNA
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', borderLeft: '4px solid var(--primary)', background: '#fff', borderRadius: '0 12px 12px 0', border: '1px solid #eee', borderLeftWidth: '4px' }}>
                <strong>Art. 6 ust. 1 lit. b RODO:</strong> Przetwarzanie niezbędne do podjęcia działań na żądanie osoby, której dane dotyczą (np. wycena usługi, zamówienie lawety).
              </div>
              <div style={{ padding: '16px', borderLeft: '4px solid var(--secondary)', background: '#fff', borderRadius: '0 12px 12px 0', border: '1px solid #eee', borderLeftWidth: '4px' }}>
                <strong>Art. 6 ust. 1 lit. f RODO:</strong> Prawnie uzasadniony interes Administratora (marketing bezpośredni własnych usług oraz analityka).
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>05.</span> TRANSFER I UDOSTĘPNIANIE DANYCH
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333' }}>
              Dane mogą być przekazywane wyłącznie zaufanym partnerom technicznym: Infrastruktura serwerowa i Cloud oraz Narzędzia analityczne (np. Google Analytics).
            </p>
            <div style={{ marginTop: '16px', padding: '12px 20px', background: 'rgba(220, 38, 38, 0.05)', color: 'var(--primary)', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-block' }}>
              BRAK SPRZEDAŻY DANYCH: Twoje dane (w tym numer telefonu) nigdy nie są odsprzedawane podmiotom trzecim w celach marketingowych.
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>06.</span> TERMINY PRZECHOWYWANIA
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333' }}>
              Dane kontaktowe są przechowywane przez okres niezbędny do realizacji usługi, a następnie archiwizowane w celu ochrony przed roszczeniami lub zgodnie z przepisami podatkowo-księgowymi.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>07.</span> TWOJE UPRAWNIENIA
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333', marginBottom: '16px' }}>
              Zgodnie z RODO przysługuje Ci prawo do:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {["Dostępu do danych", "Sprostowania danych", "Usunięcia danych", "Ograniczenia przetwarzania", "Sprzeciwu", "Przenoszenia danych"].map((tag, i) => (
                <span key={i} className="badge" style={{ padding: '8px 16px', height: 'auto' }}>{tag}</span>
              ))}
            </div>
            <p style={{ marginTop: '20px', fontWeight: 800, color: 'var(--secondary)' }}>
              KOMUNIKACJA: Wszelkie wnioski dotyczące danych prosimy kierować na adres: <a href="mailto:kontakt@laweciarz.pro" style={{ color: 'var(--primary)', textDecoration: 'none' }}>kontakt@laweciarz.pro</a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>08.</span> PLIKI COOKIES I MONITORING
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333' }}>
              Serwis wykorzystuje pliki cookies w celu optymalizacji wydajności. Prowadzimy monitoring ruchu w celu zapobiegania aktywnościom niepożądanym (np. scraping danych). Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki.
            </p>
          </section>

          <section style={{ padding: '40px', background: 'var(--secondary)', borderRadius: '24px', color: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>09.</span> INSPEKTOR OCHRONY DANYCH
            </h2>
            <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#aaa', marginBottom: '0' }}>
              W firmie <strong>Dev Sp. z o.o.</strong> nadzór nad bezpieczeństwem informacji sprawuje wyznaczona osoba kontaktowa. W sprawach związanych z Twoją prywatnością oraz przetwarzaniem numeru telefonu, możesz skontaktować się z nami bezpośrednio pod adresem e-mail wskazanym w punkcie VII.
            </p>
          </section>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}


