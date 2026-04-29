import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const KEY_FILE = path.join(process.cwd(), 'service-account.json');

async function testIndex() {
  console.log('🧪 Testowanie Google Indexing API...');
  
  if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ Brak pliku service-account.json');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({
    version: 'v3',
    auth: authClient,
  });

  const url = 'https://laweciarz.pro/'; // Testujemy stronę główną

  try {
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });
    console.log('✅ Sukces! Odpowiedź Google:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error('❌ Błąd testu:', error.response?.data?.error?.message || error.message);
  }
}

testIndex().catch(console.error);
