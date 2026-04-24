const fs = require('fs');

const cities = JSON.parse(fs.readFileSync('cities.json', 'utf8'));

const targetDistricts = [
    'garwoliński',
    'miński',
    'otwocki',
    'siedlecki',
    'rycki',
    'kozienicki',
    'łukowski',
    'piaseczyński'
];

const nearbyCities = cities.filter(c => targetDistricts.includes(c.district));

// Display unique names from these districts
const names = Array.from(new Set(nearbyCities.map(c => c.name))).sort();

console.log(JSON.stringify(names, null, 2));
