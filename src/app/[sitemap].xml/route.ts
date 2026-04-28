import { NextResponse } from 'next/server';
import { getCities, getServices, getHighways, buildCitySlug } from '@/lib/seo-utils';
import { articles } from '@/lib/articles';

const BASE_URL = 'https://laweciarz.pro';
const CHUNK_SIZE = 45000;

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  const resolvedParams = await params;
  const sitemapName = resolvedParams.sitemap; // To będzie "sitemap" lub "sitemap-X"

  const cities = getCities();
  const services = getServices();
  const highways = getHighways();
  const totalUrls = cities.length * services.length;
  const numSitemaps = Math.ceil(totalUrls / CHUNK_SIZE);

  // 1. Obsługa Głównego Indeksu (/sitemap.xml)
  if (sitemapName === 'sitemap') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (let i = 0; i < numSitemaps; i++) {
      xml += `  <sitemap>\n    <loc>https://laweciarz.pro/sitemap-${i}.xml</loc>\n  </sitemap>\n`;
    }
    xml += '</sitemapindex>';
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  }

  // 2. Obsługa Paczek (/sitemap-X.xml)
  const idMatch = sitemapName.match(/sitemap-(\d+)/);
  if (idMatch) {
    const id = parseInt(idMatch[1], 10);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    if (id === 0) {
      const staticPages = ['', '/pomoc-drogowa', '/holowanie', '/laweta', '/lokalizacje'];
      staticPages.forEach(page => {
        xml += `  <url>\n    <loc>${BASE_URL}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
      });
      articles.forEach(article => {
        xml += `  <url>\n    <loc>${BASE_URL}/poradnik/${article.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });
      highways.forEach(highway => {
        xml += `  <url>\n    <loc>${BASE_URL}/${highway.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      });
    }

    const start = id * CHUNK_SIZE;
    const startCityIdx = Math.floor(start / services.length);
    const startServiceIdx = start % services.length;

    let countAdded = 0;
    for (let i = startCityIdx; i < cities.length; i++) {
      const city = cities[i];
      const serviceStart = (i === startCityIdx) ? startServiceIdx : 0;
      for (let j = serviceStart; j < services.length; j++) {
        if (countAdded >= CHUNK_SIZE) break;
        const service = services[j];
        xml += `  <url>\n    <loc>${BASE_URL}/${buildCitySlug(service, city.slug)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        countAdded++;
      }
      if (countAdded >= CHUNK_SIZE) break;
    }

    xml += '</urlset>';
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  }

  // 3. Jeśli nie pasuje - 404
  return new NextResponse('Not Found', { status: 404 });
}
