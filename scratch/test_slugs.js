
const { getServices, slugify } = require('./src/lib/seo-utils');
const fs = require('fs');
const path = require('path');

// Mocking some stuff if needed, but let's try direct require if it works
// Since it's TS, it might not work directly with node. 
// Let's just use manual reproduction of slugify.

function slugifyManual(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const servicesJson = JSON.parse(fs.readFileSync('./services.json', 'utf8'));
const services = servicesJson.map(template => ({
    template,
    slug: slugifyManual(template.replace(/\[Miasto\]/g, '').trim())
}));

const sortedServices = [...services].sort((a, b) => b.slug.length - a.slug.length);

console.log("Full list of slugs:");
sortedServices.forEach(s => console.log(`- ${s.slug} (${s.template})`));

const fullSlug = "holowanie-auta-krakow";
let matchingService = null;
let citySlug = '';

for (const s of sortedServices) {
    if (fullSlug.startsWith(s.slug + '-')) {
        matchingService = s;
        citySlug = fullSlug.replace(s.slug + '-', '');
        break;
    }
}

console.log("\nMatch for 'holowanie-auta-krakow':");
console.log("Service Slug:", matchingService ? matchingService.slug : "None");
console.log("City Slug:", citySlug);
