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

    // Actualizar estado a error
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
  // 1. Crear/buscar usuario
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

  // 2. Crear tarjeta
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

  // 3. Registrar pago
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

  // 4. Registrar evento inicial
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
      Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
      'Content-Type': 'application/json',
