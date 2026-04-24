import json
import re

def slugify(text):
    text = text.lower().strip()
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a',
        'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
        'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
        'ò': 'o', 'ö': 'o', 'ô': 'o',
        'ú': 'u', 'ü': 'u', 'û': 'u'
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w-]+', '', text)
    text = re.sub(r'--+', '-', text)
    return text

# Load existing cities
cities_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/cities.json'
with open(cities_path, 'r', encoding='utf-8') as f:
    cities = json.load(f)

# Identify current Mazowieckie slugs to avoid duplicates
existing_maz_slugs = {c['slug'] for c in cities if c.get('province') == 'mazowieckie'}

# Copy input_list from compare_cities.py (simulated here for brevity, but I will read it from the file)
# To be safe, I'll read the input_list from the script itself to avoid missing any.
import sys
sys.path.append('/Users/dargrz/Projekty/Laweciarz.pro.pl/scratch')
from compare_cities import input_list

new_entries = []
added_count = 0

for name in input_list:
    slug = slugify(name)
    if slug not in existing_maz_slugs:
        # Create a new entry for Mazowieckie
        new_entry = {
            "name": name,
            "slug": slug,
            "province": "mazowieckie",
            "district": "Pozostałe",
            "commune": "Pozostałe"
        }
        new_entries.append(new_entry)
        existing_maz_slugs.add(slug)
        added_count += 1

# Combine and save
updated_cities = cities + new_entries

with open(cities_path, 'w', encoding='utf-8') as f:
    json.dump(updated_cities, f, indent=2, ensure_ascii=False)

print(f"Successfully added {added_count} new locations to {cities_path}")
print(f"Total cities now: {len(updated_cities)}")
