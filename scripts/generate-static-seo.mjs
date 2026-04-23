import fs from 'fs';
import path from 'path';

// 1. Konfiguracja
const CITIES_FILE = './cities.json';
const OUTPUT_DIR = './dist-seo'; // Tu wpadną gotowe pliki
const SERVICES = [
  { slug: 'pomoc-drogowa', name: 'Pomoc Drogowa' },
  { slug: 'laweta', name: 'Laweta' },
  { slug: 'holowanie', name: 'Holowanie' },
  { slug: 'auto-pomoc', name: 'Auto Pomoc' },
  { slug: 'autolaweta', name: 'Autolaweta' }
];

const PHONE = "789 832 551";

// 2. Wczytanie danych
if (!fs.existsSync(CITIES_FILE)) {
    console.error("Błąd: Nie znaleziono pliku cities.json");
    process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));

// 3. Prosty szablon HTML (bazujący na Twoim designie)
const getTemplate = (city, service) => `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${service.name} ${city.name} 24h – Ekspresowe Holowanie i Laweta</title>
    <meta name="description" content="🆘 ${service.name} ${city.name} 24h ⭐ Tanie holowanie i profesjonalna pomoc drogowa. Najniższe ceny w regionie! Tel: 📞 ${PHONE}">
    <style>
        :root { --blue: #002D62; --orange: #FF8C00; }
        body { font-family: sans-serif; margin: 0; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(to right, var(--blue), #044c9e); color: white; padding: 40px 20px; text-align: center; border-bottom: 8px solid var(--orange); }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .h1 { font-size: 2.5rem; margin: 0; text-transform: uppercase; }
        .city-tag { background: var(--orange); color: white; padding: 5px 20px; border-radius: 50px; display: inline-block; transform: rotate(-1deg); margin-top: 10px; font-weight: bold; }
        .cta-box { background: #f8f9fa; border: 4px solid var(--blue); padding: 30px; border-radius: 20px; text-align: center; margin: 40px 0; }
        .phone { font-size: 2.5rem; font-weight: 900; color: var(--blue); text-decoration: none; display: block; margin: 15px 0; }
        .footer { background: var(--blue); color: white; padding: 40px 20px; text-align: center; margin-top: 50px; }
        .btn { background: var(--orange); color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1.2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Holovanie.pl</h1>
        <div class="h1">${service.name}</div>
        <div class="city-tag">${city.name}</div>
    </div>
    
    <div class="container">
        <div class="cta-box">
            <h2>Potrzebna pomoc? Zadzwoń teraz! 🆘</h2>
            <a href="tel:${PHONE.replace(/\s/g, '')}" class="phone">${PHONE}</a>
            <p>Dojazd w ${city.name} i okolicach nawet w 15 minut!</p>
        </div>

        <article>
            <h2>Profesjonalna pomoc drogowa w miejscowości ${city.name}</h2>
            <p>Świadczymy kompleksowe usługi z zakresu <strong>${service.name.toLowerCase()}</strong> na terenie miejscowości ${city.name} oraz całego powiatu ${city.district || ''}. Nasza flota lawet jest dostępna 24 godziny na dobę, 7 dni w tygodniu.</p>
            <ul>
                <li>Szybki dojazd do klienta</li>
                <li>Konkurencyjne ceny</li>
                <li>Nowoczesny sprzęt</li>
                <li>Holowanie z OC sprawcy</li>
            </ul>
        </article>
    </div>

    <div class="footer">
        <p>&copy; 2026 Holovanie.pl - ${service.name} ${city.name}</p>
        <p>Zadzwoń: ${PHONE}</p>
    </div>
</body>
</html>
`;

// 4. Proces generowania
async function generate() {
    console.log(`Rozpoczynam generowanie dla ${cities.length} miast...`);
    
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    let count = 0;
    const limit = 100; // Na próbę generujemy tylko 100

    for (const city of cities) {
        for (const service of SERVICES) {
            const slug = `${service.slug}-${city.slug}`;
            const dir = path.join(OUTPUT_DIR, slug);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            const html = getTemplate(city, service);
            fs.writeFileSync(path.join(dir, 'index.html'), html);
            
            count++;
            if (count >= limit) break;
        }
        if (count >= limit) break;
    }

    console.log(`✅ Sukces! Wygenerowano ${count} stron w katalogu ${OUTPUT_DIR}`);
    console.log(`Przykładowa ścieżka: ${path.join(OUTPUT_DIR, `${SERVICES[0].slug}-${cities[0].slug}/index.html`)}`);
}

generate();
