import json
import os

base_url = "https://laweciarz.pro"
cities_path = "/Users/dargrz/Projekty/Laweciarz.pro.pl/cities.json"
output_path = "/Users/dargrz/Projekty/Laweciarz.pro.pl/public/sitemap-1.xml"

# Ensure public directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(cities_path, 'r', encoding='utf-8') as f:
    cities = json.load(f)

# Filter for Mazowieckie
maz_cities = [c for c in cities if c.get('province') == 'mazowieckie']

# Top 3 services for sitemap (to avoid hitting 50k limit too easily)
services = ["pomoc-drogowa", "laweta", "holowanie"]

xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

# Homepage
xml_content += f'  <url>\n    <loc>{base_url}/</loc>\n    <priority>1.0</priority>\n  </url>\n'

# Province page
xml_content += f'  <url>\n    <loc>{base_url}/lokalizacje/mazowieckie</loc>\n    <priority>0.8</priority>\n  </url>\n'

# City pages
for city in maz_cities:
    slug = city['slug']
    # Main page for city
    # In this app, many pages seem to use pomoc-drogowa-[slug]
    # But let's check if the generic [slug] is also used.
    # The [slug] route in Next.js will handle anything.
    
    for s in services:
        url_slug = f"{s}-{slug}"
        xml_content += f'  <url>\n    <loc>{base_url}/{url_slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n'

xml_content += '</urlset>'

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(xml_content)

print(f"Generated {output_path} with {len(maz_cities) * len(services) + 2} URLs.")
