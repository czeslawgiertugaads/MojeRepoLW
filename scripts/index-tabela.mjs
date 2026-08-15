import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDS_DIR = path.join(process.cwd(), 'google_api_index');
const CSV_FILE = path.join(process.cwd(), 'indeksowanie', 'Tabela.csv');
const INDEXED_FILE = path.join(process.cwd(), '.indexed_urls');

// Limit dzienny Google to 200 URL-i na konto
const ACCOUNT_LIMIT = 200;

async function indexTabela() {
  if (!fs.existsSync(CREDS_DIR)) {
    console.error('❌ Brak folderu google_api_index');
    return;
  }

  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ Brak pliku tabeli: ${CSV_FILE}`);
    return;
  }

  const credFiles = fs.readdirSync(CREDS_DIR).filter(f => f.endsWith('.json'));
  console.log(`🔍 Znaleziono ${credFiles.length} kont serwisowych.`);

  // Wczytaj już zaindeksowane URL-e
  const indexedUrls = new Set(
    fs.existsSync(INDEXED_FILE)
      ? fs.readFileSync(INDEXED_FILE, 'utf8').split('\n').map(l => l.trim()).filter(Boolean)
      : []
  );

  // Wczytaj URL-e z CSV
  const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length === 0) {
    console.log('❌ Plik CSV jest pusty.');
    return;
  }

  const header = lines[0]; // np. "URL,Ostatnie zindeksowanie"
  
  // Wczytaj rekordy, pomijając nagłówek
  let records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    const url = parts[0].trim();
    const date = parts[1] ? parts[1].trim() : '1970-01-01';
    if (url) {
      records.push({ url, date });
    }
  }

  console.log(`📊 Razem w pliku CSV: ${records.length} URL-i`);

  // Filtrujemy te, które są już w .indexed_urls
  const initialPending = [];
  const alreadyIndexedInDB = [];

  for (const record of records) {
    if (indexedUrls.has(record.url)) {
      alreadyIndexedInDB.push(record.url);
    } else {
      initialPending.push(record);
    }
  }

  console.log(`✅ Już zaindeksowano w bazie .indexed_urls: ${alreadyIndexedInDB.length}`);
  console.log(`🆕 Do zaindeksowania teraz: ${initialPending.length}`);

  // Funkcja pomocnicza do zapisu pozostałych URL-i do CSV
  function saveRemainingToCsv(remainingList) {
    const newContent = [header, ...remainingList.map(r => `${r.url},${r.date}`)].join('\n') + '\n';
    fs.writeFileSync(CSV_FILE, newContent, 'utf8');
  }

  // Jeśli niektóre URL-e były już zaindeksowane w .indexed_urls, od razu wykluczamy je z CSV
  if (alreadyIndexedInDB.length > 0) {
    console.log(`♻️ Usuwam z pliku CSV ${alreadyIndexedInDB.length} już zaindeksowanych URL-i...`);
    saveRemainingToCsv(initialPending);
  }

  if (initialPending.length === 0) {
    console.log('✨ Wszystkie URL-e zostały już przetworzone!');
    return;
  }

  const pendingUrls = [...initialPending];
  let totalSuccess = 0;

  for (const file of credFiles) {
    if (pendingUrls.length === 0) break;

    const filePath = path.join(CREDS_DIR, file);
    let creds;
    try {
      creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`⚠️ Błąd czytania pliku ${file}:`, e.message);
      continue;
    }

    console.log(`\n👤 Korzystam z konta: ${creds.client_email} (${file})`);

    const auth = new google.auth.GoogleAuth({
      keyFile: filePath,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    let authClient;
    try {
      authClient = await auth.getClient();
    } catch (e) {
      console.error(`⚠️ Nie można zautoryzować konta ${file}:`, e.message);
      continue;
    }

    const indexing = google.indexing({
      version: 'v3',
      auth: authClient,
    });

    let accountSuccess = 0;
    let accountErrors = 0;
    let i = 0;

    while (accountSuccess < ACCOUNT_LIMIT && i < pendingUrls.length) {
      const record = pendingUrls[i];
      const url = record.url;
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });

        // 1. Zapisz do bazy globalnej .indexed_urls
        fs.appendFileSync(INDEXED_FILE, `${url}\n`);
        
        accountSuccess++;
        totalSuccess++;
        
        // Usuń ten rekord z listy oczekujących i zapisz zaktualizowany plik CSV
        pendingUrls.splice(i, 1);
        saveRemainingToCsv(pendingUrls);

        // Nie zwiększamy i, bo następny element przesunął się na miejsce i
        if (accountSuccess % 10 === 0 || accountSuccess === 1) {
          console.log(`📈 Postęp konta: ${accountSuccess}/${ACCOUNT_LIMIT}... (Suma dzisiaj: ${totalSuccess})`);
        }
      } catch (error) {
        const msg = error.response?.data?.error?.message || error.message;
        if (msg.includes('Quota exceeded') || error.response?.data?.error?.code === 429) {
          console.log(`🛑 Konto ${file} wyczerpało limit dzienny.`);
          break;
        } else if (msg.includes('Permission denied')) {
          console.error(`⚠️ Brak uprawnień dla ${file}: ${msg}`);
          break; // Spróbujemy z następnym kontem dla tego samego URL
        } else if (msg.includes('invalid_grant') || msg.includes('account not found')) {
          console.error(`❌ Konto ${file} jest nieaktywne. Skipping.`);
          break; // Spróbujemy z następnym kontem dla tego samego URL
        } else {
          console.error(`❌ Błąd przy ${url}:`, msg);
          i++; // Pomijamy ten URL na tym koncie i przechodzimy do następnego URL-a
          accountErrors++;
          if (accountErrors > 10) {
            console.log(`🛑 Zbyt wiele błędów dla konta ${file}. Pomijam konto.`);
            break;
          }
        }
      }
    }
    console.log(`✅ Konto ${file} zakończyło pracę. Zaindeksowano: ${accountSuccess}`);
  }

  console.log(`\n✨ KONIEC. Łącznie zaindeksowano dzisiaj: ${totalSuccess} URL-i.`);
  console.log(`📋 Pozostało do kolejnej sesji w CSV: ${pendingUrls.length}`);
}

indexTabela().catch(console.error);
