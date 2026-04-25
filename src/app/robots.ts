import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/strefa-operacyjna-930/', // Blokujemy panel admina
          '/api/',                    // Blokujemy endpointy API
        ],
      },
    ],
    sitemap: 'https://laweciarz.pro.pl/sitemap.xml',
  };
}
