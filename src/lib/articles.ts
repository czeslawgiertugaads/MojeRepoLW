export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  image: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export const articles: Article[] = [
  {
    slug: 'jak-bezpiecznie-holowac-auto',
    title: 'Jak bezpiecznie holować auto? Kompletny poradnik ekspertów',
    metaTitle: 'Jak bezpiecznie holować auto? Poradnik [2026] - LAWECIARZ.PRO',
    metaDescription: 'Dowiedz się, jak bezpiecznie holować samochód na lince i sztywnym drągu. Prawo, technika i najczęstsze błędy, które niszczą skrzynię biegów.',
    image: '/images/poradnik-holowanie.webp',
    excerpt: 'Holowanie to nie tylko połączenie dwóch aut linką. To skomplikowany manewr, który bez odpowiedniej wiedzy może skończyć się kosztowną awarią lub mandatem.',
    tags: ['TECHNIKA', 'BEZPIECZEŃSTWO', 'HOLOWANIE'],
    content: `
## Holowanie auta to odpowiedzialność
Zanim złapiesz za linkę i poprosisz sąsiada o pomoc, zadaj sobie pytanie: czy wiesz, jak nie uszkodzić samochodu? Nieprawidłowe holowanie to jeden z najczęstszych powodów awarii skrzyń biegów i układów napędowych, które trafiają do serwisów.

---

## Rodzaje holowania: Linka vs Drąg
W Polsce dopuszczalne są dwa główne systemy łączenia pojazdów. Każdy z nich ma swoje wady i zalety.

### 1. Linka holownicza (Giętkie połączenie)
Najpopularniejszy sposób, ale wymagający największej precyzji. Linka musi mieć długość **od 4 do 6 metrów** i być oznakowana biało-czerwonymi pasami.
- **Zalety:** Tania, mieści się w każdym bagażniku.
- **Wady:** Wymaga stałego napięcia przez kierowcę holowanego auta. Każde szarpnięcie to ryzyko zerwania uchwytu.

### 2. Sztywny drąg holowniczy
Rozwiązanie profesjonalne, znacznie bezpieczniejsze dla obu pojazdów. 
- **Zalety:** Eliminuje ryzyko najechania na tył pojazdu holującego. Ułatwia hamowanie.
- **Wady:** Trudniejszy w transporcie, wymaga precyzyjnych zaczepów.

---

## Najważniejsze zasady prawne (Prawo o Ruchu Drogowym)
Zapomnij o "ułańskiej fantazji". Prawo w Polsce jest restrykcyjne:
1. **Prędkość:** W terenie zabudowanym max **30 km/h**, poza nim **60 km/h**.
2. **Oświetlenie:** Holowane auto musi mieć włączone światła mijania (nie awaryjne!). Awaryjne są błędem, bo uniemożliwiają sygnalizowanie skrętu.
3. **Oznakowanie:** Trójkąt ostrzegawczy musi być umieszczony z tyłu pojazdu po lewej stronie.

> **UWAGA:** Holowanie na autostradzie jest surowo zabronione. W przypadku awarii na trasie szybkiego ruchu, jedyną legalną opcją jest profesjonalna laweta.

---

## Holowanie a "automat" i napęd 4x4
To tutaj najczęściej dochodzi do tragedii finansowych. 
- **Automatyczna skrzynia biegów:** Większość producentów dopuszcza holowanie tylko na krótkich dystansach (tzw. zasada 50/50 - 50 km z prędkością 50 km/h) w pozycji N. Dłuższe trasy spalają tarczki w skrzyni.
- **Auta elektryczne (EV):** Absolutnie zabronione! Silniki elektryczne generują napięcie nawet przy wyłączonym aucie, co może spalić falownik.
`
  },
  {
    slug: 'laweta-czy-holowanie-na-lince',
    title: 'Laweta czy linka? Kiedy oszczędność staje się błędem',
    metaTitle: 'Laweta czy holowanie na lince? Kiedy wybrać każdą z opcji - LAWECIARZ.PRO',
    metaDescription: 'Analizujemy koszty i ryzyko. Kiedy warto wezwać pomoc drogową, a kiedy można poradzić sobie samemu? Porównanie dla kierowców.',
    image: '/images/poradnik-laweta.webp',
    excerpt: 'Czy warto ryzykować uszkodzenie auta dla zaoszczędzenia kilkuset złotych? Sprawdź, kiedy laweta jest jedynym logicznym wyborem.',
    tags: ['KOSZTY', 'PORÓWNANIE', 'LAWETA'],
    content: `
## Dylemat kierowcy na poboczu
Stoisz na poboczu, silnik zgasł. Pierwsza myśl: "Zadzwoń do brata, ma linkę". Ale czy to na pewno dobra decyzja? Statystyki są nieubłagane – amatorskie holowanie kończy się kolizją lub awarią napędu w co czwartym przypadku.

---

## Kiedy Linka (Może) Wystarczyć?
Holowanie na lince jest dopuszczalne tylko w specyficznych warunkach:
- Masz auto z manualną skrzynią biegów.
- Silnik daje się uruchomić (działa wspomaganie hamulców i kierownicy).
- Masz do pokonania krótki dystans (kilka kilometrów) do warsztatu.
- Trasa nie prowadzi przez drogi ekspresowe ani autostrady.

### Ryzyko linki:
- **Brak wspomagania:** Bez pracującego silnika pedał hamulca jest twardy jak kamień. Droga hamowania wydłuża się trzykrotnie.
- **Zerwane haki:** Nowoczesne auta mają "wkręcane" uszy. Jeśli wkręcisz je krzywo – zniszczysz gwint w podłużnicy.

---

## Dlaczego Laweta to Standard Premium?
W profesjonalnej pomocy drogowej, jak **LAWECIARZ.PRO**, transport na lawecie to nie tylko wygoda, to przede wszystkim **bezpieczeństwo Twojego mienia**.

### Kluczowe zalety lawety:
- **Pełne ubezpieczenie OCP:** Twoje auto jest chronione finansowo od momentu wjazdu na najazdy.
- **Zero zużycia podzespołów:** Skrzynia biegów, opony i zawieszenie "odpoczywają".
- **Szybkość i komfort:** Ty siedzisz w klimatyzowanej kabinie z kierowcą, a auto jedzie bezpiecznie na platformie.

---

## Werdykt Eksperta
Jeśli auto jest nowe, ma automat, napęd 4x4 lub awaria dotyczy hamulców – **nie ryzykuj**. Koszt lawety to ułamek ceny naprawy zniszczonej skrzyni biegów czy wymiany zderzaka po najechaniu na tył holownika.
`
  },
  {
    slug: 'pomoc-drogowa-z-oc-sprawcy',
    title: 'Bezpłatna pomoc drogowa z OC sprawcy – Twoje prawa',
    metaTitle: 'Darmowa laweta i pomoc drogowa z OC sprawcy - Poradnik - LAWECIARZ.PRO',
    metaDescription: 'Miałeś stłuczkę? Należy Ci się darmowa pomoc drogowa i auto zastępcze z polisy OC sprawcy. Zobacz jak to załatwić w 3 prostych krokach.',
    image: '/images/poradnik-polska.png',
    excerpt: 'Ktoś wjechał w Twoje auto? Nie musisz płacić za lawetę z własnej kieszeni. Dowiedz się, jak skorzystać z bezkosztowej pomocy drogowej.',
    tags: ['UBEZPIECZENIE', 'PRAWO', 'OC'],
    content: `
## Kolizja to nie tylko stres, to procedury
Miałeś stłuczkę i Twoje auto nie nadaje się do jazdy? Większość kierowców popełnia ten sam błąd: dzwonią do swojego ubezpieczyciela i czekają godzinami na infolinii. Tymczasem jako poszkodowany masz prawo do **natychmiastowej, bezpłatnej pomocy wybranej przez Ciebie firmy**.

---

## Co Ci przysługuje z OC sprawcy?
Zgodnie z polskim prawem i wytycznymi KNF, ubezpieczyciel sprawcy musi pokryć WSZELKIE koszty związane z przywróceniem Twojej mobilności.

### Pakiet Poszkodowanego:
1. **Holowanie (bezkosztowe):** Transport auta z miejsca wypadku do wskazanego przez Ciebie warsztatu lub na parking.
2. **Samochód zastępczy:** Takiej samej klasy jak Twój, na cały okres naprawy (lub do wypłaty szkody całkowitej).
3. **Parking zabezpieczający:** Jeśli serwis jest zamknięty, ubezpieczyciel pokrywa koszt postoju auta na strzeżonym placu pomocy drogowej.

---

## Jak załatwić darmową lawetę w 3 krokach?
Zamiast panikować, postępuj według tego schematu:

### Krok 1: Oświadczenie
Spisz oświadczenie ze sprawcą lub wezwij policję. Upewnij się, że masz numer polisy ubezpieczeniowej sprawcy i nazwę jego firmy kurierskiej.

### Krok 2: Wybór Profesjonalisty
Zadzwoń bezpośrednio do nas. Poinformuj, że szkoda jest z OC sprawcy. **LAWECIARZ.PRO rozlicza się bezgotówkowo** – Ty podpisujesz cesję wierzytelności, a my odzyskujemy pieniądze bezpośrednio od firmy ubezpieczeniowej.

### Krok 3: Odbiór Auta Zastępczego
Często laweta przyjeżdża już z autem zastępczym na pokładzie. Możesz kontynuować podróż, podczas gdy my zajmujemy się Twoim rozbitym pojazdem.

---

> **Ważne:** Ubezpieczyciel może próbować narzucić swoją firmę holowniczą. Pamiętaj – **masz prawo wyboru**. Jeśli nasza stawka jest rynkowa (a jest!), ubezpieczyciel nie ma prawa odmówić zwrotu kosztów.
`
  }
];
