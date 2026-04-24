import json

cities_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/cities.json'

with open(cities_path, 'r', encoding='utf-8') as f:
    cities = json.load(f)

unique_cities = []
seen_slugs = set()
duplicates_count = 0

for city in cities:
    slug = city['slug']
    if slug not in seen_slugs:
        unique_cities.append(city)
        seen_slugs.add(slug)
    else:
        duplicates_count += 1

with open(cities_path, 'w', encoding='utf-8') as f:
    json.dump(unique_cities, f, indent=2, ensure_ascii=False)

print(f"Removed {duplicates_count} duplicate cities.")
print(f"Total unique cities: {len(unique_cities)}")
