import { sql } from '@vercel/postgres';
import { google } from 'googleapis';
import { sendEmail, sendSMS, sendWhatsApp } from './notifications';

// ============================================================
// CONFIGURACIÓN DE GOOGLE DRIVE
// ============================================================

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// ============================================================
// PROCESADOR PRINCIPAL
// ============================================================

export async function processCard({
  paymentIntentId,
  sender,
  recipient,
  cardData,
  amount,
  giftAmount = 0,
}) {
  console.log('🚀 Iniciando procesamiento de tarjeta...');
  
  const cardId = await createCardRecord({
    sender,
    recipient,
    cardData,
    paymentIntentId,
    amount,
    giftAmount,
  });

  try {
    // 1. Generar video
    console.log('🎬 Generando video...');
    const videoUrl = await generateVideo(cardData);

    // 2. Subir a Google Drive
    console.log('☁️ Subiendo a Google Drive...');
    const driveUrl = await uploadToDrive(videoUrl, cardId);

    // 3. Actualizar tarjeta con URLs
    await sql`
      UPDATE cards
      SET 
        video_url = ${videoUrl},
        drive_url = ${driveUrl},
        status = 'ready'
      WHERE id = ${cardId}
    `;

    // 4. Generar link único
    const uniqueLink = `https://www.everwish.cards/view/${cardId}`;

    // 5. Enviar notificaciones
    console.log('📧 Enviando notificaciones...');
    await sendNotifications({
      cardId,
      sender,
      recipient,
      uniqueLink,
    });

    // 6. Registrar evento
    await logEvent(cardId, 'card_completed', { videoUrl, driveUrl });

    console.log('✅ Tarjeta procesada exitosamente:', cardId);
    return { success: true, cardId, uniqueLink };

  } catch (error) {
    console.error('❌ Error procesando tarjeta:', error);

    await sql`
      UPDATE cards
      SET status = 'error', error_message = ${error.message}
      WHERE id = ${cardId}
    `;

    await logEvent(cardId, 'processing_error', { error: error.message });

    throw error;
  }
}

// ============================================================
// CREAR REGISTRO EN BASE DE DATOS
// ============================================================

async function createCardRecord({
  sender,
  recipient,
  cardData,
  paymentIntentId,
  amount,
  giftAmount,
}) {
  let user = await sql`
    SELECT * FROM users WHERE email = ${sender.email}
  `;

  if (user.rows.length === 0) {
    const everwishId = `EW${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    user = await sql`
      INSERT INTO users (email, phone, name, everwish_id)
      VALUES (${sender.email}, ${sender.phone || null}, ${sender.name}, ${everwishId})
      RETURNING *
    `;
  }

  const userId = user.rows[0].id;

  const card = await sql`
    INSERT INTO cards (
      user_id,
      sender_id,
      recipient_name,
      recipient_email,
      recipient_phone,
      card_type,
      message,
      status,
      can_resend_free,
      can_upgrade
    )
    VALUES (
      ${userId},
      ${userId},
      ${recipient.name},
      ${recipient.email || null},
      ${recipient.phone || null},
      ${cardData.type},
      ${cardData.message},
      'processing',
      true,
      true
    )
    RETURNING *
  `;

  const cardId = card.rows[0].id;

  await sql`
    INSERT INTO payments (
      card_id,
      stripe_payment_intent_id,
      amount,
      status,
      gift_card_amount
    )
    VALUES (
      ${cardId},
      ${paymentIntentId},
      ${amount},
      'succeeded',
      ${giftAmount}
    )
  `;

  await logEvent(cardId, 'card_created', { sender, recipient, cardData });

  return cardId;
}

// ============================================================
// GENERAR VIDEO CON CREATOMATE
// ============================================================

async function generateVideo(cardData) {
  const response = await fetch('https://api.creatomate.com/v1/renders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: process.env.CREATOMATE_TEMPLATE_ID,
      modifications: {
        'Text-Message': cardData.message,
        'Text-Recipient': cardData.recipientName,
        'Text-Sender': cardData.senderName,
        'Video-Background': `https://www.everwish.cards/videos/${cardData.slug}.mp4`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Error generando video con Creatomate');
  }

  const data = await response.json();
  const renderId = data[0].id;

  return await pollVideoStatus(renderId);
}

async function pollVideoStatus(renderId) {
  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `https://api.creatomate.com/v1/renders/${renderId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        },
      }
    );

    const statusData = await statusResponse.json();

    if (statusData.status === 'succeeded') {
      return statusData.url;
    }

    if (statusData.status === 'failed') {
      throw new Error('Video generation failed');
    }

    attempts++;
  }

  throw new Error('Video generation timeout');
}

// ============================================================
// SUBIR A GOOGLE DRIVE
// ============================================================

async function uploadToDrive(videoUrl, cardId) {
  const videoResponse = await fetch(videoUrl);
  const videoBuffer = await videoResponse.arrayBuffer();

  const fileMetadata = {
    name: `everwish-card-${cardId}.mp4`,
    parents: [process.env.EVERWISH_DRIVE_FOLDER_ID],
  };

  const media = {
    mimeType: 'video/mp4',
    body: Buffer.from(videoBuffer),
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return file.data.webContentLink;
}

// ============================================================
// ENVIAR NOTIFICACIONES
// ============================================================

async function sendNotifications({ cardId, sender, recipient, uniqueLink }) {
  const message = `🎉 ¡${sender.name} te envió una tarjeta especial!\n\nÁbrela aquí: ${uniqueLink}`;

  if (recipient.email) {
    await sendEmail({
      to: recipient.email,
      subject: `🎁 ${sender.name} te envió una tarjeta digital`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">¡Tienes una tarjeta especial! 💝</h1>
          <p style="font-size: 18px;"><strong>${sender.name}</strong> te envió una tarjeta personalizada.</p>
          <a href="${uniqueLink}" style="display: inline-block; background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; margin: 20px 0;">
            ✨ Ver mi tarjeta
          </a>
          <p style="color: #666;">Este es un momento especial solo para ti.</p>
        </div>
      `,
    });

    await sql`
      INSERT INTO notifications (card_id, notification_type, channel, status)
      VALUES (${cardId}, 'card_sent', 'email', 'sent')
    `;
  }

  if (recipient.phone && recipient.phone.startsWith('whatsapp:')) {
    await sendWhatsApp({ to: recipient.phone, message });

    await sql`
      INSERT INTO notifications (card_id, notification_type, channel, status)
      VALUES (${cardId}, 'card_sent', 'whatsapp', 'sent')
    `;
  }

  if (recipient.phone && !recipient.phone.startsWith('whatsapp:')) {
    await sendSMS({ to: recipient.phone, message });

    await sql`
      INSERT INTO notifications (card_id, notification_type, channel, status)
      VALUES (${cardId}, 'card_sent', 'sms', 'sent')
    `;
  }

  if (sender.email) {
    await sendEmail({
      to: sender.email,
      subject: '✅ Tu tarjeta fue enviada exitosamente',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">¡Tu tarjeta está en camino! 🚀</h1>
          <p>Tu tarjeta para <strong>${recipient.name}</strong> fue enviada exitosamente.</p>
          <p>Te notificaremos cuando la abran.</p>
          <a href="https://www.everwish.cards/my-cards" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Ver mis tarjetas
          </a>
        </div>
      `,
    });
  }
}

// ============================================================
// REGISTRAR EVENTOS
// ============================================================

async function logEvent(cardId, eventType, eventData) {
  await sql`
    INSERT INTO card_events (card_id, event_type, event_data)
    VALUES (${cardId}, ${eventType}, ${JSON.stringify(eventData)})
  `;
}
