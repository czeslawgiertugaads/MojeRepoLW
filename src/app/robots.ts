import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/strefa-operacyjna-930/', // Blokujemy panel admina
          '/api/',                    // Blokujemy endpointy API
        ],
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: 'https://laweciarz.pro/sitemap.xml',
  };
}
