import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDS_DIR = path.join(process.cwd(), 'google_api_index');
const CSV_FILE = path.join(process.cwd(), 'links_lomza_s8.csv');
const INDEXED_FILE = path.join(process.cwd(), '.indexed_urls');

// Limit dzienny Google to 200 URL-i na konto
const ACCOUNT_LIMIT = 200;

async function indexUrls() {
  if (!fs.existsSync(CREDS_DIR)) {
    console.error('❌ Brak folderu google_api_index');
    return;
  }

  const credFiles = fs.readdirSync(CREDS_DIR).filter(f => f.endsWith('.json'));
  console.log(`🔍 Znaleziono ${credFiles.length} kont serwisowych.`);

  // Wczytaj już zaindeksowane URL-e
  const indexedUrls = new Set(
    fs.existsSync(INDEXED_FILE)
      ? fs.readFileSync(INDEXED_FILE, 'utf8').split('\n').filter(Boolean)
      : []
  );

  // Wczytaj URL-e z CSV
  const allUrls = fs.readFileSync(CSV_FILE, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // URL-e do zaindeksowania (pomijamy już zaindeksowane)
  const remainingUrls = allUrls.filter(url => !indexedUrls.has(url));

  console.log(`📊 Razem w pliku CSV: ${allUrls.length}`);
  console.log(`✅ Już zaindeksowano (w .indexed_urls): ${indexedUrls.size}`);
  console.log(`🆕 Do zaindeksowania teraz: ${remainingUrls.length}`);

  if (remainingUrls.length === 0) {
    console.log('✨ Wszystkie URL-e zostały już przetworzone!');
    return;
  }

  let urlPointer = 0;
  let totalSuccess = 0;

  for (const file of credFiles) {
    if (urlPointer >= remainingUrls.length) break;

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

    while (accountSuccess < ACCOUNT_LIMIT && urlPointer < remainingUrls.length) {
      const url = remainingUrls[urlPointer];
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });

        fs.appendFileSync(INDEXED_FILE, `${url}\n`);
        accountSuccess++;
        totalSuccess++;
        urlPointer++;

        if (accountSuccess % 20 === 0) {
          console.log(`📈 Postęp konta: ${accountSuccess}/${ACCOUNT_LIMIT}... (Suma: ${totalSuccess})`);
        }
      } catch (error) {
        const msg = error.response?.data?.error?.message || error.message;
        if (msg.includes('Quota exceeded') || error.response?.data?.error?.code === 429) {
          console.log(`🛑 Konto ${file} wyczerpało limit dzienny.`);
          break;
        } else if (msg.includes('Permission denied')) {
          console.error(`⚠️ Brak uprawnień dla ${file}.`);
          break;
        } else if (msg.includes('invalid_grant') || msg.includes('account not found')) {
          console.error(`❌ Konto ${file} jest nieaktywne. Skipping.`);
          break;
        } else {
          console.error(`❌ Błąd przy ${url}:`, msg);
          urlPointer++;
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
  console.log(`📋 Pozostało do kolejnej sesji: ${remainingUrls.length - urlPointer}`);
}

indexUrls().catch(console.error);
