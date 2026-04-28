import { MetadataRoute } from 'next';
import { getCities, getServices, getHighways, slugify, buildCitySlug } from '@/lib/seo-utils';
import { articles } from '@/lib/articles';

const BASE_URL = 'https://laweciarz.pro';
const CHUNK_SIZE = 45000;

export async function generateSitemaps() {
  const allCities = getCities();
  const cities = allCities.filter(c => c.province === 'mazowieckie');
  const services = getServices();
  const totalUrls = cities.length * services.length;
  const numSitemaps = Math.ceil(totalUrls / CHUNK_SIZE);

  return Array.from({ length: Math.max(1, numSitemaps) }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const allCities = getCities();
  const cities = allCities.filter(c => c.province === 'mazowieckie');
  const services = getServices();
  const highways = getHighways();
  
  const allCombinations: { url: string; lastModified: Date }[] = [];

  // Jeśli to pierwsza sitemap, dodaj strony statyczne i bazę wiedzy
  if (id === 0) {
    const staticPages = [
      '',
      '/pomoc-drogowa',
      '/holowanie',
      '/laweta',
      '/lokalizacje',
    ];

    staticPages.forEach(page => {
      allCombinations.push({
        url: `${BASE_URL}${page}`,
        lastModified: new Date(),
      });
    });

    // Artykuły z poradnika
    articles.forEach(article => {
      allCombinations.push({
        url: `${BASE_URL}/poradnik/${article.slug}`,
        lastModified: new Date(),
      });
    });

    // Autostrady
    highways.forEach(highway => {
      allCombinations.push({
        url: `${BASE_URL}/${highway.slug}`,
        lastModified: new Date(),
      });
    });
  }

  // Obliczamy zakres dla danej sitemapy
  // Przechodzimy przez kombinacje miast i usług
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  
  let currentCount = 0;
  
  // Optymalizacja: Generujemy adresy tylko dla wyznaczonego zakresu ID
  for (const city of cities) {
    for (const service of services) {
      if (currentCount >= start && currentCount < end) {
        allCombinations.push({
          url: `${BASE_URL}/${buildCitySlug(service, city.slug)}`,
          lastModified: new Date(), // W produkcji można tu użyć daty z pliku miasta lub stałej
        });
      }
      currentCount++;
      if (currentCount >= end) break;
    }
    if (currentCount >= end) break;
  }

  return allCombinations.map(item => ({
    url: item.url,
    lastModified: item.lastModified,
    changeFrequency: 'weekly',
    priority: id === 0 ? 0.8 : 0.6,
  }));
}
