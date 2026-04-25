import React from 'react';
import { Phone, Truck, ShieldCheck, Clock, MapPin, AlertTriangle, CheckCircle2, Info, Star, ShieldAlert, Award, MessageSquare, Wrench, Zap } from 'lucide-react';

interface HighwayProps {
  highwayName: string;
  phone: string;
  serviceName: string;
}

export default function HighwayService({ highwayName, phone, serviceName }: HighwayProps) {
  return (
    <div className="seo-premium-container">
      <div className="container">
        {/* ─── HERO SECTION ─── */}
        <section className="seo-card primary-card anim-slide-up">
          <div className="card-badge">POMOC DROGOWA 24H - AUTOSTRADY</div>
          <h1 className="section-title-premium">
            Pomoc drogowa {highwayName} – laweta, holowanie i autopomoc 24h
          </h1>
          
          <div className="seo-text-block mt-8">
            <p className="lead">
              Pomoc drogowa na {highwayName} to usługa kluczowa dla bezpieczeństwa na jednej z najważniejszych tras w Polsce. {highwayName} to kręgosłup komunikacyjny, który każdego dnia obsługuje tysiące pojazdów osobowych i ciężarowych. Każda awaria lub kolizja w tym miejscu wymaga błyskawicznej reakcji i profesjonalnego sprzętu.
            </p>
            <p>
              <strong>laweciarz.pro</strong> świadczy kompleksową pomoc drogową na całej długości {highwayName} przez 365 dni w roku. Laweta, holowanie, wyciąganie z rowu czy drobne naprawy na miejscu – jesteśmy gotowi do działania o każdej porze dnia i nocy. Nasze pojazdy są strategicznie rozmieszczone przy węzłach, co gwarantuje najkrótszy czas dojazdu.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hero-massive-btn anim-pulse">
                <Phone size={32} />
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-70">ZADZWOŃ TERAZ 24H</span>
                  <span className="cta-phone-number">{phone}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ─── PROCEDURA BEZPIECZEŃSTWA ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          <div className="seo-text-block">
            <h2 className="section-title-premium">Co zrobić przy awarii na {highwayName}?</h2>
            <p>Awaria na autostradzie to sytuacja ekstremalnie niebezpieczna. Duże prędkości i natężenie ruchu sprawiają, że każda sekunda na pasie awaryjnym musi być przemyślana. Postępuj zgodnie z poniższą procedurą:</p>
            
            <div className="space-y-6 mt-8">
              {[
                { step: "Krok 1", title: "Zjedź na pas awaryjny", desc: "Zasygnalizuj manewr i zatrzymaj się jak najbliżej prawej bariery." },
                { step: "Krok 2", title: "Włącz światła i załóż kamizelkę", desc: "Zanim opuścisz pojazd, załóż kamizelkę odblaskową. Wychodź prawymi drzwiami." },
                { step: "Krok 3", title: "Trójkąt i bariera", desc: "Ustaw trójkąt min. 100 metrów za autem i przejdź za barierę energochłonną." },
                { step: "Krok 4", title: "Zadzwoń po pomoc", desc: "Podaj nam numer słupa kilometrowego i kierunek jazdy." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="bg-red-600 text-white font-black px-3 py-1 rounded-lg text-sm">{item.step}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="seo-card bg-slate-900 text-white border-none">
            <div className="card-badge bg-red-600 text-white">WAŻNA ZASADA</div>
            <h3 className="text-2xl font-black mb-6 uppercase italic">Zakaz holowania na lince</h3>
            <p className="text-slate-300 leading-relaxed mb-8">
              Pamiętaj, że na autostradach takich jak {highwayName} obowiązuje <strong>bezwzględny zakaz holowania</strong> pojazdu przez inny pojazd cywilny (na lince lub sztywnym holu).
            </p>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm italic text-slate-400">
                Jedyną legalną i bezpieczną metodą ewakuacji pojazdu z autostrady jest wezwanie profesjonalnej pomocy drogowej i transport na pełnej platformie lawety.
              </p>
            </div>
            <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-4">
              <div className="stat-number">20-40</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">minut średniego czasu dojazdu</div>
            </div>
          </div>
        </div>

        {/* ─── USŁUGI ─── */}
        <h2 className="section-title-premium text-center mt-32 mb-16">Nasze usługi na {highwayName}</h2>
        <div className="advantages-grid">
          {[
            { icon: <Truck />, title: "Laweta 24h", desc: "Transport pojazdów osobowych, dostawczych i motocykli na pełnej platformie." },
            { icon: <ShieldCheck />, title: "Bezpieczne Holowanie", desc: "Ewakuacja pojazdów powypadkowych z kompletną dokumentacją dla ubezpieczyciela." },
            { icon: <Zap />, title: "Autopomoc", desc: "Dowóz paliwa, wymiana koła lub awaryjne odpalanie (booster) na trasie." },
            { icon: <Clock />, title: "Szybki Dojazd", desc: "Dzięki bazom przy węzłach docieramy do klienta w ekspresowym tempie." }
          ].map((adv, idx) => (
            <div key={idx} className="motto-card">
              <div className="motto-card-icon">{adv.icon}</div>
              <div className="motto-card-text">
                <h3>{adv.title}</h3>
                <p>{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-box-inline anim-slide-up">
          <div className="cta-box-text">
            <h4>Potrzebujesz pomocy na {highwayName}?</h4>
            <p>Jesteśmy dostępni 24/7. Dzwoń o każdej porze.</p>
          </div>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="cta-box-btn">
            {phone}
          </a>
        </div>

        {/* ─── FAQ ─── */}
        <div className="seo-card mt-20">
          <h2 className="section-title-premium text-2xl">FAQ – Najczęstsze pytania</h2>
          <div className="seo-text-block space-y-8 mt-10">
            <div>
              <h3 className="text-lg font-bold">Czy obsługujecie całą trasę {highwayName}?</h3>
              <p>Tak, nasze lawety operują na całej długości {highwayName}. Mamy bazy w kluczowych punktach, co pozwala nam na szybką interwencję niezależnie od odcinka.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Ile kosztuje laweta na {highwayName}?</h3>
              <p>Koszt ustalamy indywidualnie podczas rozmowy telefonicznej. Zależy on od rodzaju pojazdu, stopnia uszkodzenia oraz odległości transportu. Cenę podajemy przed wyjazdem.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Czy wystawiacie faktury VAT?</h3>
              <p>Oczywiście. Wystawiamy pełną dokumentację niezbędną do rozliczenia z ubezpieczycielem (OC sprawcy lub Assistance).</p>
            </div>
          </div>
        </div>

        {/* ─── SUMMARY ─── */}
        <section className="mt-20 text-center max-width-800 mx-auto">
          <p className="text-slate-400 text-sm italic">
            laweciarz.pro – Twój zaufany partner na {highwayName}. Profesjonalne usługi pomocy drogowej, holowanie i autopomoc 24h. Bezpieczeństwo i szybkość działania to nasze priorytety.
          </p>
        </section>
      </div>
    </div>
  );
}
