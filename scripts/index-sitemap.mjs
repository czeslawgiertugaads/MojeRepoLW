import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDS_DIR = path.join(process.cwd(), 'google_api_index');
const SITEMAP_FILE = path.join(process.cwd(), 'public', 'sitemap-10.xml');
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

  // Wczytaj sitemapę
  const sitemapContent = fs.readFileSync(SITEMAP_FILE, 'utf8');
  const allUrls = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  
  // URL-e do zaindeksowania
  const remainingUrls = allUrls.filter(url => !indexedUrls.has(url));

  console.log(`📊 Razem w sitemapie: ${allUrls.length}`);
  console.log(`✅ Już zaindeksowano: ${indexedUrls.size}`);
  console.log(`🆕 Do zaindeksowania: ${remainingUrls.length}`);

  if (remainingUrls.length === 0) {
    console.log('✨ Wszystkie URL-e z tej sitemapy zostały już przetworzone!');
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
      continue; // Skip invalid account
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
          console.log(`🛑 Konto ${file} wyczerpało limit.`);
          break; 
        } else if (msg.includes('Permission denied')) {
          console.error(`⚠️ Brak uprawnień dla ${file}.`);
          break; 
        } else if (msg.includes('invalid_grant') || msg.includes('account not found')) {
          console.error(`❌ Konto ${file} jest nieaktywne (invalid_grant). Skipping.`);
          break; 
        } else {
          console.error(`❌ Błąd przy ${url}:`, msg);
          urlPointer++; 
          accountErrors++;
          if (accountErrors > 10) {
            console.log(`🛑 Zbyt wiele błędów dla konta ${file}. Skipping account.`);
            break;
          }
        }
      }
    }
    console.log(`✅ Konto ${file} zakończyło pracę. Zaindeksowano: ${accountSuccess}`);
  }

  console.log(`\n✨ KONIEC. Łącznie zaindeksowano dzisiaj: ${totalSuccess} URL-i.`);
}

indexUrls().catch(console.error);
