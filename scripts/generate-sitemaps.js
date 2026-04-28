const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://laweciarz.pro';
const CHUNK_SIZE = 10000;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function buildCitySlug(serviceTemplate, citySlug) {
  // Logic from src/lib/seo-utils.ts
  const parts = serviceTemplate.split(/\[Miasto\]|\[Mieście\]|\[Miasta\]/);
  const before = parts[0].replace(/\s+w\s*$/g, '').trim();
  const after = parts.length > 1 ? parts[1].trim() : '';
  
  const slugBefore = slugify(before);
  const slugAfter = after ? slugify(after) : '';

  if (slugAfter) {
    return `${slugBefore}-${citySlug}-${slugAfter}`;
  }
  return `${slugBefore}-${citySlug}`;
}

// Ensure scripts directory exists (it should, but just in case)
const scriptsDir = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
}

console.log('Loading data...');
const cities = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'cities.json'), 'utf8'));
const services = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'services.json'), 'utf8'));

// Highways and Articles
const highways = [
    { slug: "pomoc-drogowa-a2" },
    { slug: "pomoc-drogowa-a4" },
    { slug: "pomoc-drogowa-a1" },
    { slug: "pomoc-drogowa-s7" },
    { slug: "pomoc-drogowa-s8" },
    { slug: "pomoc-drogowa-s6" }
];

const articles = [
    { slug: 'jak-bezpiecznie-holowac-auto' },
    { slug: 'laweta-czy-holowanie-na-lince' },
    { slug: 'pomoc-drogowa-z-oc-sprawcy' }
];

const staticPages = ['', '/pomoc-drogowa', '/holowanie', '/laweta', '/lokalizacje', '/laweta-cennik', '/polityka-prywatnosci', '/poradnik'];

console.log('Generating URLs...');
let allUrls = [];

// 1. Static Pages
staticPages.forEach(p => allUrls.push({ loc: `${BASE_URL}${p}`, priority: '1.0', changefreq: 'weekly' }));

// 2. Articles
articles.forEach(a => allUrls.push({ loc: `${BASE_URL}/poradnik/${a.slug}`, priority: '0.7', changefreq: 'monthly' }));

// 3. Highways
highways.forEach(h => allUrls.push({ loc: `${BASE_URL}/${h.slug}`, priority: '0.8', changefreq: 'weekly' }));

// 4. City-Service combinations
// To avoid memory issues with 1.5M objects, we'll process in a way that writes chunks directly
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Clear old sitemaps if any (optional but recommended)
const files = fs.readdirSync(publicDir);
files.forEach(file => {
    if (file.startsWith('sitemap-') && file.endsWith('.xml')) {
        fs.unlinkSync(path.join(publicDir, file));
    }
});

let currentChunk = [...allUrls];
let chunkIndex = 0;

function writeChunk() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    currentChunk.forEach(url => {
        xml += `  <url>\n    <loc>${url.loc}</loc>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>\n`;
    });
    xml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, `sitemap-${chunkIndex}.xml`), xml);
    console.log(`Saved sitemap-${chunkIndex}.xml (${currentChunk.length} URLs)`);
    chunkIndex++;
    currentChunk = [];
}

console.log(`Starting generation for ${cities.length} cities and ${services.length} services...`);

for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    for (let j = 0; j < services.length; j++) {
        const service = services[j];
        currentChunk.push({ 
            loc: `${BASE_URL}/${buildCitySlug(service, city.slug)}`, 
            priority: '0.6', 
            changefreq: 'weekly' 
        });

        if (currentChunk.length >= CHUNK_SIZE) {
            writeChunk();
        }
    }
    if (i % 1000 === 0) {
        console.log(`Processed ${i} cities...`);
    }
}

// Write last chunk if not empty
if (currentChunk.length > 0) {
    writeChunk();
}

// Write index sitemap
console.log('Writing index sitemap...');
let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (let i = 0; i < chunkIndex; i++) {
    indexXml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${i}.xml</loc>\n  </sitemap>\n`;
}
indexXml += '</sitemapindex>';
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
console.log(`Finished! Total sitemaps: ${chunkIndex}`);
