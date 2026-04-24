import sys
import os
import zipfile
import re
import html
import json

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

xlsx_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/miejscowosci_mazowieckie.xlsx'
cities_json_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/cities.json'

# 1. Unzip sheet1.xml
with zipfile.ZipFile(xlsx_path, 'r') as zip_ref:
    sheet_content = zip_ref.read('xl/worksheets/sheet1.xml').decode('utf-8')

# 2. Extract rows and cells
# Simple parser for <row>...<c>...<is><t>...</t></is></c></row>
# We expect inlineStr since that's what we saw in the head
rows = re.findall(r'<row r="\d+"[^>]*>(.*?)</row>', sheet_content, re.DOTALL)

data_rows = []
for row in rows:
    # Extract all <t> content in this row
    cells = re.findall(r'<t>(.*?)</t>', row)
    if cells:
        decoded_cells = [html.unescape(c) for c in cells]
        data_rows.append(decoded_cells)

# 3. Clean up and identify data
# The first few rows are titles/headers
# Row 4 is likely the header: ['Lp.', 'Nazwa miejscowości', 'Rodzaj', 'Populacja', 'Szerokość geogr.', 'Długość geogr.']
header_index = -1
for i, row in enumerate(data_rows):
    if 'Nazwa miejscowości' in row:
        header_index = i
        break

if header_index == -1:
    print("Could not find header")
    sys.exit(1)

# Extract cities (start from header_index + 1)
new_cities = []
for row in data_rows[header_index + 1:]:
    if len(row) >= 2:
        name = row[1]
        slug = slugify(name)
        
        # Determine kind/district from 'Rodzaj' if possible, or just use it as metadata
        kind = row[2] if len(row) > 2 else "Miejscowość"
        population = row[3] if len(row) > 3 else ""
        lat = row[4] if len(row) > 4 else ""
        lng = row[5] if len(row) > 5 else ""
        
        new_cities.append({
            "name": name,
            "slug": slug,
            "province": "mazowieckie",
            "district": "Pozostałe", # Default, can be improved
            "commune": "Pozostałe",
            "metadata": {
                "kind": kind,
                "population": population,
                "lat": lat,
                "lng": lng
            }
        })

# 4. Merge with existing cities.json
with open(cities_json_path, 'r', encoding='utf-8') as f:
    existing_cities = json.load(f)

# Avoid duplicates by slug in Mazowieckie
existing_slugs = {c['slug'] for c in existing_cities if c.get('province') == 'mazowieckie'}

added_count = 0
for nc in new_cities:
    if nc['slug'] not in existing_slugs:
        existing_cities.append(nc)
        existing_slugs.add(nc['slug'])
        added_count += 1

# 5. Save updated cities.json
with open(cities_json_path, 'w', encoding='utf-8') as f:
    json.dump(existing_cities, f, indent=2, ensure_ascii=False)

print(f"Successfully processed {len(new_cities)} cities from XLSX.")
print(f"Added {added_count} new cities to cities.json.")
print(f"Total cities: {len(existing_cities)}")
