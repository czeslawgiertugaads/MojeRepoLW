import json

cities_path = '/Users/dargrz/Projekty/Laweciarz.pro.pl/cities.json'
wikipedia_data = {
    'Radom': 'Radom', 'Siedlce': 'Siedlce', 'Ostrołęka': 'Ostrołęka', 'Płock': 'Płock', 
    'Pruszków': 'pruszkowski', 'Legionowo': 'legionowski', 'Piaseczno': 'piaseczyński', 
    'Ząbki': 'wołomiński', 'Marki': 'wołomiński', 'Otwock': 'otwocki', 
    'Ciechanów': 'ciechanowski', 'Mińsk Mazowiecki': 'miński', 'Żyrardów': 'żyrardowski', 
    'Wołomin': 'wołomiński', 'Grodzisk Mazowiecki': 'grodziski', 'Sochaczew': 'sochaczewski', 
    'Mława': 'mławski', 'Nowy Dwór Mazowiecki': 'nowodworski', 'Kobyłka': 'wołomiński', 
    'Wyszków': 'wyszkowski', 'Piastów': 'pruszkowski', 'Ostrów Mazowiecka': 'ostrowski', 
    'Płońsk': 'płoński', 'Sulejówek': 'miński', 'Józefów': 'otwocki', 'Pułtusk': 'pułtuski', 
    'Sokołów Podlaski': 'sokołowski', 'Łomianki': 'warszawski zachodni', 'Zielonka': 'wołomiński', 
    'Garwolin': 'garwoliński', 'Gostynin': 'gostyniński', 'Sierpc': 'sierpecki', 
    'Konstancin-Jeziorna': 'piaseczyński', 'Grójec': 'grójecki', 'Milanówek': 'grodziski', 
    'Przasnysz': 'przasnyski', 'Pionki': 'radomski', 'Ożarów Mazowiecki': 'warszawski zachodni', 
    'Kozienice': 'kozienicki', 'Radzymin': 'wołomiński', 'Brwinów': 'pruszkowski', 
    'Błonie': 'warszawski zachodni', 'Góra Kalwaria': 'piaseczyński', 'Warka': 'grójecki', 
    'Węgrów': 'węgrowski', 'Szydłowiec': 'szydłowiecki', 'Karczew': 'otwocki', 
    'Maków Mazowiecki': 'makowski', 'Żuromin': 'żuromiński', 'Tłuszcz': 'wołomiński', 
    'Nasielsk': 'nowodworski', 'Zwoleń': 'zwoleński', 'Łosice': 'łosicki', 
    'Łochów': 'węgrowski', 'Białobrzegi': 'białobrzeski', 'Mszczonów': 'żyrardowski', 
    'Przysucha': 'przysuski', 'Serock': 'legionowski', 'Lipsko': 'lipski', 
    'Łaskarzew': 'garwoliński', 'Skaryszew': 'radomski', 'Pilawa': 'garwoliński', 
    'Tarczyn': 'piaseczyński', 'Iłża': 'radomski', 'Gąbin': 'płocki', 'Raciąż': 'płoński', 
    'Jedlnia-Letnisko': 'radomski', 'Podkowa Leśna': 'grodziski', 'Halinów': 'miński', 
    'Żelechów': 'garwoliński', 'Mrozy': 'miński'
}

with open(cities_path, 'r', encoding='utf-8') as f:
    cities = json.load(f)

updated = 0
for c in cities:
    if c.get('province') == 'mazowieckie':
        name = c['name']
        if name in wikipedia_data:
            c['district'] = wikipedia_data[name]
            updated += 1

with open(cities_path, 'w', encoding='utf-8') as f:
    json.dump(cities, f, indent=2, ensure_ascii=False)

print(f"Polished {updated} city districts.")
