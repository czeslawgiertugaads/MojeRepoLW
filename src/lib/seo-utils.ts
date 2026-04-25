import 'server-only';
import fs from 'fs';
import path from 'path';

export interface City {
  name: string;
  slug: string;
  province?: string;
  district?: string;
  commune?: string;
  miejscownik?: string;
  dopelniacz?: string;
}

export interface Service {
  template: string;
  slug: string;
}

export interface Highway {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
}

let cachedCities: City[] | null = null;
export function getCities(): City[] {
  if (cachedCities) return cachedCities;
  const filePath = path.join(process.cwd(), 'cities.json');
  cachedCities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return cachedCities!;
}

export function getSEOContent(fileName: string): string {
  const filePath = path.join(process.cwd(), 'seotxt', fileName);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return "";
}

let cachedServices: Service[] | null = null;
export function getServices(): Service[] {
  if (cachedServices) return cachedServices;
  const filePath = path.join(process.cwd(), 'services.json');
  const templates: string[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  cachedServices = templates.map(template => ({
    template,
    slug: slugify(template.replace(/\[Miasto\]/g, '').trim())
  }));
  return cachedServices;
}

export function getHighways(): Highway[] {
  // Use the data from the highways.ts file
  const { highways } = require('./highways');
  return highways;
}

export function declineCity(name: string, city?: City): { mianownik: string; dopelniacz: string; celownik: string; biernik: string; narzednik: string; miejscownik: string } {
  // Jeśli mamy obiekt miasta z gotowymi odmianami, używamy ich
  if (city && city.miejscownik && city.dopelniacz) {
    return {
      mianownik: city.name,
      dopelniacz: city.dopelniacz,
      celownik: name, // Fallback dla celownika
      biernik: name,
      narzednik: name,
      miejscownik: city.miejscownik
    };
  }

  let mianownik = name;
  let dopelniacz = name;
  let celownik = name;
  let biernik = name;
  let narzednik = name;
  let miejscownik = name;

  const nameLower = name.toLowerCase();

  // Special cases for major cities or specific structures
  if (nameLower === 'nowy sącz' || nameLower === 'nowy sacz') {
    return { 
      mianownik: 'Nowy Sącz', 
      dopelniacz: 'Nowego Sącza', 
      celownik: 'Nowemu Sączowi', 
      biernik: 'Nowy Sącz',
      narzednik: 'Nowym Sączem',
      miejscownik: 'Nowym Sączu' 
    };
  }
  if (nameLower === 'stary sącz' || nameLower === 'stary sacz') {
    return { 
      mianownik: 'Stary Sącz', 
      dopelniacz: 'Starego Sącza', 
      celownik: 'Staremu Sączowi', 
      biernik: 'Stary Sącz',
      narzednik: 'Starym Sączem',
      miejscownik: 'Starym Sączu' 
    };
  }

  // Heuristics for Polish city names declension
  if (nameLower.endsWith('ów')) {
    dopelniacz = name.slice(0, -2) + 'owa';
    celownik = name.slice(0, -2) + 'owowi';
    biernik = name;
    narzednik = name.slice(0, -2) + 'owem';
    miejscownik = name.slice(0, -2) + 'owie';
  } else if (nameLower.endsWith('ice')) {
    dopelniacz = name.slice(0, -1);
    celownik = name.slice(0, -1) + 'om';
    biernik = name;
    narzednik = name.slice(0, -1) + 'ami';
    miejscownik = name.slice(0, -1) + 'ach';
  } else if (nameLower.endsWith('awa')) {
    dopelniacz = name.slice(0, -1) + 'y';
    celownik = name.slice(0, -1) + 'ie';
    biernik = name.slice(0, -1) + 'ę';
    narzednik = name.slice(0, -1) + 'ą';
    miejscownik = name.slice(0, -1) + 'ie';
  } else if (nameLower.endsWith('a') && !nameLower.endsWith('ia')) {
    dopelniacz = name.slice(0, -1) + 'y';
    biernik = name.slice(0, -1) + 'ę';
    narzednik = name.slice(0, -1) + 'ą';
    
    // Specjalna obsługa spółgłosek przed 'a'
    if (nameLower.endsWith('ga')) {
      celownik = name.slice(0, -2) + 'dze';
      miejscownik = name.slice(0, -2) + 'dze';
    } else if (nameLower.endsWith('ka')) {
      celownik = name.slice(0, -2) + 'ce';
      miejscownik = name.slice(0, -2) + 'ce';
    } else {
      celownik = name.slice(0, -1) + 'ie';
      miejscownik = name.slice(0, -1) + 'ie';
    }
  } else if (nameLower.endsWith('in') || nameLower.endsWith('yn')) {
    dopelniacz = name + 'a';
    celownik = name + 'owi';
    biernik = name;
    narzednik = name + 'em';
    miejscownik = name + 'ie';
  } else if (nameLower.endsWith('o') && !nameLower.endsWith('no') && !nameLower.endsWith('ko')) {
    dopelniacz = name.slice(0, -1) + 'a';
    celownik = name.slice(0, -1) + 'u';
    biernik = name;
    narzednik = name.slice(0, -1) + 'em';
    miejscownik = name.slice(0, -1) + 'ie';
  } else if (nameLower.endsWith('no')) {
    dopelniacz = name.slice(0, -1) + 'a';
    celownik = name.slice(0, -1) + 'u';
    biernik = name;
    narzednik = name.slice(0, -1) + 'em';
    miejscownik = name.slice(0, -2) + 'nie';
  } else if (nameLower.endsWith('sko') || nameLower.endsWith('cko')) {
    dopelniacz = name.slice(0, -1) + 'a';
    celownik = name.slice(0, -1) + 'u';
    biernik = name;
    narzednik = name.slice(0, -1) + 'em';
    miejscownik = name.slice(0, -1) + 'u';
  } else if (nameLower.endsWith('ia')) {
    dopelniacz = name.slice(0, -1) + 'i';
    celownik = name.slice(0, -1) + 'i';
    biernik = name.slice(0, -1) + 'ę';
    narzednik = name.slice(0, -1) + 'ią';
    miejscownik = name.slice(0, -1) + 'i';
  } else if (nameLower.endsWith('a')) {
    dopelniacz = name.slice(0, -1) + 'y';
    celownik = name.slice(0, -1) + 'ie';
    biernik = name.slice(0, -1) + 'ę';
    narzednik = name.slice(0, -1) + 'ą';
    miejscownik = name.slice(0, -1) + 'ie';
  } else if (nameLower.endsWith('uń')) {
    dopelniacz = name.slice(0, -1) + 'unia';
    celownik = name.slice(0, -1) + 'uniowi';
    biernik = name;
    narzednik = name.slice(0, -1) + 'uniem';
    miejscownik = name.slice(0, -1) + 'uniu';
  } else if (nameLower.endsWith('el')) {
    dopelniacz = name + 'i';
    celownik = name + 'i';
    biernik = name;
    narzednik = name + 'ą';
    miejscownik = name + 'i';
  } else if (nameLower.endsWith('e')) {
    celownik = name + 'u';
    miejscownik = name + 'u';
  } else if (nameLower.endsWith('y')) {
    celownik = name.slice(0, -1) + 'ym';
    narzednik = name.slice(0, -1) + 'ym';
    miejscownik = name.slice(0, -1) + 'ych';
  } else if (nameLower.endsWith('aw')) {
    dopelniacz = name + 'ia';
    celownik = name + 'iowi';
    biernik = name;
    narzednik = name + 'iem';
    miejscownik = name + 'iu';
  } else if (nameLower.endsWith('ń')) {
    dopelniacz = name.slice(0, -1) + 'nia';
    celownik = name.slice(0, -1) + 'niowi';
    biernik = name;
    narzednik = name.slice(0, -1) + 'niem';
    miejscownik = name.slice(0, -1) + 'niu';
  } else if (nameLower.endsWith('dź')) {
    dopelniacz = name.slice(0, -1) + 'zi';
    celownik = name.slice(0, -1) + 'zi';
    biernik = name;
    narzednik = name.slice(0, -1) + 'zią';
    miejscownik = name.slice(0, -1) + 'zi';
  } else if (nameLower.endsWith('al')) {
    dopelniacz = name + 'a';
    celownik = name + 'owi';
    biernik = name;
    narzednik = name + 'em';
    miejscownik = name + 'u';
  }

  return { mianownik, dopelniacz, celownik, biernik, narzednik, miejscownik };
}

export function replaceSEOTemplate(text: string, city: City, phone: string = '572 272 930'): string {
  const { mianownik, dopelniacz, celownik, biernik, narzednik, miejscownik } = declineCity(city.name);

  return text
    .replace(/\[Miasto\]/g, mianownik)
    .replace(/\[Miasta\]/g, dopelniacz)
    .replace(/\[Miastu\]/g, celownik)
    .replace(/\[Biernik\]/g, biernik)
    .replace(/\[Narzędnik\]/g, narzednik)
    .replace(/\[Mieście\]/g, miejscownik)
    .replace(/\[TWÓJ NUMER TELEFONU\]/g, phone); 
}

export function slugify(text: string) {
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

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
