import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar que las variables existan
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      return NextResponse.json({ 
        error: 'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL' 
      }, { status: 500 });
    }
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ 
        error: 'Missing GOOGLE_PRIVATE_KEY' 
      }, { status: 500 });
    }
    
    if (!process.env.EVERWISH_DRIVE_FOLDER_ID) {
      return NextResponse.json({ 
        error: 'Missing EVERWISH_DRIVE_FOLDER_ID' 
      }, { status: 500 });
    }

    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Crear archivo de prueba
    const fileMetadata = {
      name: `test-everwish-${Date.now()}.txt`,
      parents: [process.env.EVERWISH_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: 'text/plain',
      body: `✅ Google Drive connection successful!\n\nTest created at: ${new Date().toISOString()}`,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    return NextResponse.json({
      success: true,
      message: '✅ Google Drive is working!',
      file: {
        id: file.data.id,
        name: file.data.name,
        link: file.data.webViewLink,
      },
    });

  } catch (error) {
    console.error('Drive test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

### **3. Commit el archivo:**
- Scroll hacia abajo
- En "Commit message" escribe: `Add Google Drive test endpoint`
- Haz clic en **"Commit changes"**

---

## **⏱️ PASO 2: Esperar el deploy**

Vercel detectará automáticamente el cambio y hará un nuevo deploy (toma 1-2 minutos).

---

## **🎯 PASO 3: Probar el endpoint**

Cuando termine el deploy, abre esta URL en tu navegador:
```
https://tu-proyecto.vercel.app/api/test-drive
