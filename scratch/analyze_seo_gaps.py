import json
import os

def slugify(text):
    text = text.lower().strip()
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    import re
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w-]+', '', text)
    text = re.sub(r'--+', '-', text)
    return text

services_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/services.json'
seotxt_dir = '/Users/dargrz/Projekty/Laweciarz.pro.pl/seotxt'

with open(services_path, 'r', encoding='utf-8') as f:
    services = json.load(f)

available_files = os.listdir(seotxt_dir)

missing = []
mappings = []

for template in services:
    service_slug = slugify(template.replace('[Miasto]', '').strip())
    
    # Logic matching [slug]/page.tsx
    file_match = "pomocdrogowamiasto.md" # Default
    
    if '24h' in service_slug:
        file_match = 'pomocdrogowa24h.md'
    elif 'tania-laweta' in service_slug:
        file_match = 'tanialaweta.md'
    elif 'holowanie-samochodu' in service_slug:
        file_match = 'holowaniesamochodumiasto.md'
    elif 'holowanie-auta' in service_slug or 'holowanie-auto' in service_slug:
        file_match = 'holowanieautamiasto.md'
    elif 'holowanie' in service_slug:
        file_match = 'holowaniemiasto.md'
    elif 'pomoc-drogowa-cennik' in service_slug:
        file_match = 'pomocdrogowacennik.md'
    elif 'laweta-cena-za-km' in service_slug:
        file_match = 'lawetacenazakm.md'
    elif 'laweta-calodobowa' in service_slug:
        file_match = 'lawetacalodobowamiasto.md'
    elif 'holowanie-z-oc-sprawcy' in service_slug:
        file_match = 'holowaniezocsprawcymiasto.md'
    elif 'laweta' in service_slug:
        file_match = 'lawetamiasto.md'
    elif 'szybka-pomoc-drogowa' in service_slug:
        file_match = 'szybkapomocdrogowamiasto.md'
    elif 'transport-samochodow' in service_slug:
        file_match = 'transportsamochodow.md'
    elif 'wyciaganie-z-rowu' in service_slug:
        file_match = 'wyciaganiezrowu.md'
    elif 'mobilny-serwis-opon' in service_slug:
        file_match = 'mobilnyserwisoponmiasto.md'
    elif 'awaryjne-odpalanie-auta' in service_slug:
        file_match = 'awaryjneodpalenieautamiasto.md'
    elif 'tanie-holowanie' in service_slug:
        file_match = 'tanieholowanie.md'
    elif 'polecana' in service_slug or 'polecane' in service_slug:
        if 'autoholowanie' in service_slug: file_match = 'polecaneautoholowanie.md'
        elif 'holowanie' in service_slug: file_match = 'polecaneholowanie.md'
        elif 'autolaweta' in service_slug: file_match = 'polecanaautolaweta.md'
        elif 'laweta' in service_slug: file_match = 'polecanalaweta.md'
        elif 'auto-pomoc' in service_slug: file_match = 'polecanaautopomoc_v2.md'
        elif 'autopomoc' in service_slug: file_match = 'polecanaautopomoc.md'
        else: file_match = 'polecanapomoc.md'
    elif 'najtansza-pomoc-drogowa' in service_slug or 'tania-pomoc-drogowa' in service_slug:
        file_match = 'najtanszapomocdrogowa.md'

    # Check if specific file exists, or if it falls into generic "pomocdrogowamiasto.md"
    # Actually, many specific services like "Transport pojazdów" or "Transport maszyn"
    # don't have a specific check, so they fall into the default "pomocdrogowamiasto.md"
    
    # I'll check if the name of the service suggests a missing specialized file.
    specialized_keywords = ['pojazdów', 'pojazdow', 'rolniczych', 'paliwa', 'elektrycznych', 'motocykli', 'kontakt', 'cena', 'ceny', 'cennik']
    is_missing_specialized = any(kw in template.lower() for kw in specialized_keywords)
    
    # Also check if the determined file actually exists
    exists = file_match in available_files
    
    mappings.append({
        "template": template,
        "slug": service_slug,
        "file": file_match,
        "exists": exists,
        "is_generic": file_match == "pomocdrogowamiasto.md"
    })

print(json.dumps(mappings, indent=2, ensure_ascii=False))
