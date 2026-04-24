const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getCities() {
  const filePath = path.join(process.cwd(), 'cities.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getServices() {
  const filePath = path.join(process.cwd(), 'services.json');
  const templates = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return templates.map(template => ({
    template,
    slug: slugify(template.replace(/\[Miasto\]/g, '').trim())
  }));
}

function getPageData(slug) {
  const cities = getCities();
  const services = getServices();
  const sortedServices = [...services].sort((a, b) => b.slug.length - a.slug.length);
  
  let matchedCity = null;
  let matchedService = null;

  for (const service of sortedServices) {
    const prefix = service.slug + '-';
    if (slug.startsWith(prefix)) {
      const citySlug = slug.slice(prefix.length);
      const city = cities.find(c => c.slug === citySlug);
      if (city) {
        matchedService = service;
        matchedCity = city;
        break;
      }
    }
  }
  
  return { matchedCity, matchedService };
}

const testSlug = 'pomoc-drogowa-warszawa';
console.log('Testing slug:', testSlug);
console.log(getPageData(testSlug));
