import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDS_DIR = path.join(process.cwd(), 'google_api_index');
const URL_TO_TEST = 'https://laweciarz.pro/';

async function testAllCreds() {
  const files = fs.readdirSync(CREDS_DIR).filter(f => f.endsWith('.json'));
  console.log(`🔍 Znaleziono ${files.length} plików uwierzytelniających.`);

  for (const file of files) {
    const filePath = path.join(CREDS_DIR, file);
    const creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const email = creds.client_email;

    console.log(`\n🧪 Testowanie: ${file} (${email})`);

    const auth = new google.auth.GoogleAuth({
      keyFile: filePath,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    try {
      const authClient = await auth.getClient();
      const indexing = google.indexing({
        version: 'v3',
        auth: authClient,
      });

      const result = await indexing.urlNotifications.publish({
        requestBody: {
          url: URL_TO_TEST,
          type: 'URL_UPDATED',
        },
      });
      console.log(`✅ SUKCES! Plik ${file} działa.`);
      console.log('Odpowiedź Google:', JSON.stringify(result.data, null, 2));
      
      // Jeśli zadziałało, skopiuj go jako główny service-account.json
      fs.copyFileSync(filePath, path.join(process.cwd(), 'service-account.json'));
      console.log(`📌 Ustawiono ${file} jako główny klucz.`);
      return; // Kończymy po znalezieniu działającego
    } catch (error) {
      console.error(`❌ Błąd: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

testAllCreds().catch(console.error);
