const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testDrive() {
  try {
    console.log('🧪 Testing Google Drive connection...\n');
    
    // Verificar variables de entorno
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing GOOGLE_PRIVATE_KEY');
    }
    if (!process.env.EVERWISH_DRIVE_FOLDER_ID) {
      throw new Error('Missing EVERWISH_DRIVE_FOLDER_ID');
    }
    
    console.log('✅ All credentials found\n');
    
    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    console.log('📝 Creating test file...');
    
    // Crear archivo de prueba
    const fileMetadata = {
      name: 'test-everwish.txt',
      parents: [process.env.EVERWISH_DRIVE_FOLDER_ID],
    };
    
    const media = {
      mimeType: 'text/plain',
      body: 'Hello from Everwish! Connection successful! 🎉',
    };
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });
    
    console.log('\n✅ SUCCESS! Google Drive is working!');
    console.log('   File created:', file.data.name);
    console.log('   View it here:', file.data.webViewLink);
    console.log('\n🎉 Go check your "Everwish Data" folder in Google Drive!');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testDrive();
