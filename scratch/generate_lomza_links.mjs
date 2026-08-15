import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('cities.json', 'utf8'));

// ======================================================
// STREFA 1 – okolice Łomży (cel ~50 linków)
// Miasto Łomża + powiat łomżyński
// ======================================================
const lomzaCore = data.filter(c =>
  c.province === 'podlaskie' &&
  (c.district === 'Łomża' || c.district === 'łomżyński')
);

// ======================================================
// STREFA 2 – trasa S8 / Via Baltica (główna masa ~750)
// powiat zambrowski, kolneński, wysokomazowiecki, moniecki (podlaskie)
// + powiat ostrowski mazowieckie (Ostrów Mazowiecka)
// ======================================================
const s8corridor = data.filter(c =>
  (c.province === 'podlaskie' && ['zambrowski', 'kolneński', 'wysokomazowiecki', 'moniecki'].includes(c.district)) ||
  (c.province === 'mazowieckie' && c.district === 'ostrowski')
);

// ======================================================
// Deduplikacja i budowanie finalnej listy
// ======================================================

// Mapa slug → city, żeby uniknąć duplikatów
const seen = new Set();
const result = [];

// Najpierw dodaj miejscowości z Łomży (~50)
const lomzaSorted = lomzaCore.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
for (const city of lomzaSorted) {
  if (!seen.has(city.slug)) {
    seen.add(city.slug);
    result.push({ ...city, zona: 'lomza' });
  }
}

// Potem dodaj korytarz S8
const s8Sorted = s8corridor.sort((a, b) => {
  // sortuj: zambrowski → kolneński → ostrowski → wysokomazowiecki → moniecki
  const order = ['zambrowski', 'kolneński', 'ostrowski', 'wysokomazowiecki', 'moniecki'];
  const ai = order.indexOf(a.district);
  const bi = order.indexOf(b.district);
  if (ai !== bi) return ai - bi;
  return a.name.localeCompare(b.name, 'pl');
});

for (const city of s8Sorted) {
  if (!seen.has(city.slug)) {
    seen.add(city.slug);
    result.push({ ...city, zona: 's8' });
  }
}

// ======================================================
// Statystyki przed przycięciem
// ======================================================
console.log(`\n=== STATYSTYKI ===`);
console.log(`Łomża (core):      ${result.filter(c => c.zona === 'lomza').length}`);
console.log(`S8 korytarz:       ${result.filter(c => c.zona === 's8').length}`);
console.log(`ŁĄCZNIE:           ${result.length}`);

// Jeśli mamy za dużo, przycinamy do 800 (priorytet: Łomża zachowana w całości)
const lomzaCount = result.filter(c => c.zona === 'lomza').length;
const s8Count = result.filter(c => c.zona === 's8').length;
const maxS8 = 800 - lomzaCount;
const lomzaLinks = result.filter(c => c.zona === 'lomza');
const s8Links = result.filter(c => c.zona === 's8').slice(0, maxS8);
const final = [...lomzaLinks, ...s8Links];

console.log(`\n=== PO PRZYCIĘCIU DO 800 ===`);
console.log(`Łomża:      ${lomzaLinks.length}`);
console.log(`S8:         ${s8Links.length}`);
console.log(`ŁĄCZNIE:    ${final.length}`);

// Statystyki per powiat
const byDistrict = {};
for (const c of final) {
  const key = c.district + ' (' + c.province + ')';
  byDistrict[key] = (byDistrict[key] || 0) + 1;
}
console.log(`\nPer powiat:`);
for (const [k, v] of Object.entries(byDistrict).sort()) {
  console.log(`  ${k}: ${v}`);
}

// ======================================================
// Generuj linki
// ======================================================
const BASE = 'https://laweciarz.pro';
const PREFIX = 'pomoc-drogowa';

const links = final.map(c => `${BASE}/${PREFIX}-${c.slug}`);

// Zapisz CSV
const csvContent = links.join('\n');
writeFileSync('links_lomza_s8.csv', csvContent, 'utf8');
console.log(`\n✅ Zapisano ${links.length} linków do links_lomza_s8.csv`);

// Podgląd pierwszych i ostatnich
console.log('\n--- Pierwsze 10 (Łomża) ---');
links.slice(0, 10).forEach(l => console.log(l));
console.log('\n--- Przykłady S8 (zambrowski) ---');
links.filter((_, i) => final[i].district === 'zambrowski').slice(0, 5).forEach(l => console.log(l));
console.log('\n--- Przykłady S8 (ostrowski) ---');
links.filter((_, i) => final[i].district === 'ostrowski').slice(0, 5).forEach(l => console.log(l));
