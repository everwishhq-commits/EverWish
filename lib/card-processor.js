/**
 * Card Processing Service
 * Maneja todo el flujo después de un pago exitoso:
 * 1. Genera el video con Creatomate
 * 2. Guarda en Google Drive
 * 3. Guarda en base de datos (Neon)
 * 4. Envía notificaciones (Email/SMS/WhatsApp)
 */

import { everwishDrive } from './everwish-drive';

/**
 * Genera un slug único para la tarjeta
 */
function generateCardSlug() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * Genera el video usando Creatomate
 */
async function generateVideo(cardData) {
  try {
    console.log('🎬 Generating video with Creatomate...');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardImage: cardData.videoSlug, // URL del video de fondo seleccionado
        message: cardData.message,
        userPhoto: cardData.userPhoto,
        recipientName: cardData.recipient.name,
        videoSlug: cardData.videoSlug,
        plan: cardData.plan,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start video generation');
    }

    const data = await response.json();
    console.log('✅ Video generation started:', data.renderId);

    // Esperar a que el video esté listo (polling)
    const videoUrl = await waitForVideo(data.renderId);
    
    return videoUrl;

  } catch (error) {
    console.error('❌ Error generating video:', error);
    throw error;
  }
}

/**
 * Espera a que el video esté listo (polling cada 5 segundos)
 */
async function waitForVideo(renderId, maxAttempts = 60) {
  console.log('⏳ Waiting for video to be ready...');

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-video?renderId=${renderId}`
      );

      if (!response.ok) {
        throw new Error('Failed to check video status');
      }

      const data = await response.json();

      console.log(`📊 Video status (${attempt + 1}/${maxAttempts}): ${data.status}`);

      if (data.status === 'succeeded' && data.url) {
        console.log('🎉 Video ready!', data.url);
        return data.url;
      }

      if (data.status === 'failed') {
        throw new Error('Video generation failed');
      }

      // Esperar 5 segundos antes de la siguiente verificación
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error('❌ Error checking video status:', error);
      throw error;
    }
  }

  throw new Error('Video generation timed out after 5 minutes');
}

/**
 * Guarda el video en Google Drive
 */
async function saveVideoToDrive(videoUrl, cardSlug) {
  try {
    console.log('💾 Saving video to Google Drive...');

    // Descargar el video
    const response = await fetch(videoUrl);
    const videoBuffer = await response.arrayBuffer();

    // Guardar en Drive
    const fileName = `${cardSlug}.mp4`;
    const driveUrl = await everwishDrive.uploadVideo(
      Buffer.from(videoBuffer),
      fileName
    );

    console.log('✅ Video saved to Drive:', driveUrl);
    return driveUrl;

  } catch (error) {
    console.error('❌ Error saving video to Drive:', error);
    // No fallar todo el proceso si Drive falla
    // Usar la URL de Creatomate como backup
    return videoUrl;
  }
}

/**
 * Guarda la tarjeta en la base de datos
 */
async function saveCardToDatabase(cardData, videoUrl, cardSlug) {
  try {
    console.log('💾 Saving card to database...');

    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Insertar en tabla cards
    const query = `
      INSERT INTO cards (
        unique_slug,
        video_slug,
        message,
        uploaded_photo_url,
        sender_name,
        sender_email,
        sender_phone,
        recipient_name,
        recipient_email,
        recipient_phone,
        status,
        plan_type,
        amount_paid,
        view_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;

    const values = [
      cardSlug,
      cardData.videoSlug,
      cardData.message,
      videoUrl,
      cardData.sender.name,
      cardData.sender.email,
      cardData.sender.phone || null,
      cardData.recipient.name,
      cardData.recipient.email,
      cardData.recipient.phone || null,
      'paid',
      cardData.plan,
      cardData.amount,
      `https://everwish.cards/view/${cardSlug}`
    ];

    const result = await pool.query(query, values);
    const cardId = result.rows[0].id;

    console.log('✅ Card saved to database:', cardId);

    // Registrar evento en card_events
    await pool.query(`
      INSERT INTO card_events (card_id, event_type, event_data)
      VALUES ($1, $2, $3)
    `, [
      cardId,
      'card_created',
      JSON.stringify({ timestamp: new Date().toISOString() })
    ]);

    await pool.end();

    return cardId;

  } catch (error) {
    console.error('❌ Error saving to database:', error);
    throw error;
  }
}

/**
 * Envía notificaciones (Email, SMS, WhatsApp)
 */
async function sendNotifications(cardData, cardSlug) {
  try {
    console.log('📧 Sending notifications...');

    const viewLink = `https://everwish.cards/view/${cardSlug}`;

    // EMAIL con Resend
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Everwish <cards@everwish.cards>',
        to: cardData.recipient.email,
        subject: `💌 ${cardData.sender.name} sent you a special Everwish card!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ec4899;">💌 You received an Everwish card!</h1>
            <p style="font-size: 18px;">Hi ${cardData.recipient.name},</p>
            <p style="font-size: 16px;">${cardData.sender.name} sent you a personalized video card!</p>
            <p style="font-size: 16px; font-style: italic; color: #666;">"${cardData.message}"</p>
            <a href="${viewLink}" style="display: inline-block; background: linear-gradient(to right, #ec4899, #a855f7); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0;">
              ✨ Open Your Card
            </a>
            <p style="font-size: 14px; color: #999;">Or copy this link: ${viewLink}</p>
          </div>
        `
      });

      console.log('✅ Email sent');
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }

    // SMS con Twilio (solo si hay teléfono)
    if (cardData.recipient.phone) {
      try {
        const twilio = require('twilio');
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: cardData.recipient.phone,
          body: `💌 ${cardData.sender.name} sent you an Everwish card! Open it here: ${viewLink}`
        });

        console.log('✅ SMS sent');
      } catch (error) {
        console.error('❌ Error sending SMS:', error);
      }
    }

    console.log('✅ Notifications sent successfully');

  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    // No fallar todo el proceso si las notificaciones fallan
  }
}

/**
 * FUNCIÓN PRINCIPAL: Procesa toda la tarjeta después del pago
 */
export async function processCardAfterPayment(cardData) {
  try {
    console.log('🚀 Starting card processing...');

    // 1. Generar slug único
    const cardSlug = generateCardSlug();
    console.log('✅ Card slug generated:', cardSlug);

    // 2. Generar video con Creatomate
    const videoUrl = await generateVideo(cardData);
    console.log('✅ Video generated:', videoUrl);

    // 3. Guardar video en Google Drive (opcional, usa Creatomate URL como backup)
    const finalVideoUrl = await saveVideoToDrive(videoUrl, cardSlug);
    console.log('✅ Video URL:', finalVideoUrl);

    // 4. Guardar en base de datos
    const cardId = await saveCardToDatabase(
      { ...cardData, videoUrl: finalVideoUrl },
      finalVideoUrl,
      cardSlug
    );
    console.log('✅ Card saved:', cardId);

    // 5. Enviar notificaciones
    await sendNotifications(cardData, cardSlug);
    console.log('✅ Notifications sent');

    console.log('🎉 Card processing completed successfully!');

    return {
      success: true,
      cardId,
      cardSlug,
      viewLink: `https://everwish.cards/view/${cardSlug}`,
      videoUrl: finalVideoUrl,
    };

  } catch (error) {
    console.error('❌ Error processing card:', error);
    throw error;
  }
}
