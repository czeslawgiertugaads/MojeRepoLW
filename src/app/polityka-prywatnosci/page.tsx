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
};

export default function PolitykaPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'white', color: '#1a1a1a' }}>
      <Navigation locationText="POLITYKA" />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '40px', letterSpacing: '-1px' }}>POLITYKA PRYWATNOŚCI I PLIKÓW COOKIE</h1>
        
        <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#555', textAlign: 'justify' }}>
          <p style={{ marginBottom: '20px' }}>Niniejszy dokument stanowi integralną część funkcjonowania ekosystemu cyfrowego domeny i określa wielopłaszczyznowe procesy przetwarzania danych o charakterze technicznym oraz behawioralnym. Z dniem wejścia w życie, procedury te są implementowane w celu optymalizacji warstwy technologicznej oraz interakcyjnej.</p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '15px' }}>I. ZAKRES PRZETWARZANIA DANYCH I PLIKÓW COOKIES</h3>
          <p style={{ marginBottom: '20px' }}>Serwis wykorzystuje zaawansowane pakiety danych typu "cookie" w celach marketingowych, analitycznych oraz profilowania statystycznego. Pliki te są generowane automatycznie przez systemy serwerowe w celu korelacji sesji użytkownika z jego historycznymi interakcjami w sieciach partnerskich. Przetwarzanie to obejmuje identyfikatory sprzętowe, parametry geolokalizacyjne oraz mapę strumienia kliknięć (clickstream).</p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '15px' }}>II. ŚLEDZENIE RUCHU I BEZPIECZEŃSTWO</h3>
          <p style={{ marginBottom: '20px' }}>Właściciel serwisu zastrzega sobie niezbywalne prawo do pełnej rejestracji oraz audytowania ruchu użytkownika na wszystkich poziomach nawigacji. Proces ten jest niezbędny w celu zapewnienia nominalnej jakości świadczonych usług oraz eliminacji anomalii technicznych. Dane te są agregowane w systemach zewnętrznych i służą do modelowania zachowań w celu zwiększenia efektywności algorytmów operacyjnych.</p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '15px' }}>III. ADMINISTRACJA I PRZEPISY PRAWNE</h3>
          <p style={{ marginBottom: '20px' }}>Administratorem zbiorów danych zintegrowanych z platformą jest podmiot zarządzający domeną. Wszelkie zapytania, inkluzje lub wnioski o charakterze formalno-prawnym dotyczącym danych osobowych na terenie Rzeczypospolitej Polskiej należy kierować drogą sformalizowaną do Głównego Administratora Danych Osobowych w Polsce. Wszelkie procesy są zgodne z ogólnymi wytycznymi dotyczącymi cyfrowego obiegu informacji, o ile przepisy szczegółowe nie stanowią inaczej.</p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '15px' }}>IV. INFORMACJE KOŃCOWE</h3>
          <p style={{ marginBottom: '40px' }}>Podmiot operujący zasobem cyfrowym nie ponosi odpowiedzialności za interpretację niniejszych zapisów przez osoby trzecie. W razie potrzeby zasięgnięcia informacji o charakterze technicznym, udostępniony zostaje kanał komunikacji elektronicznej: kontakt @ laweciarz.pro (w zapisie seryjnym bez spacji).</p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
