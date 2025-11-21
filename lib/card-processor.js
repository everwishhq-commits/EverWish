import { sql } from '@vercel/postgres';
import { sendEmail, sendSMS, sendWhatsApp } from './notifications';

// ============================================================
// PROCESADOR PRINCIPAL (SIN GOOGLE DRIVE)
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
    // 1. Generar video con Creatomate
    console.log('🎬 Generando video...');
    const videoUrl = await generateVideo(cardData);
    console.log('✅ Video generado:', videoUrl);

    // 2. Actualizar tarjeta con URL del video
    await sql`
      UPDATE cards
      SET 
        video_url = ${videoUrl},
        status = 'ready'
      WHERE id = ${cardId}
    `;

    // 3. Generar link único
    const uniqueLink = `https://www.everwish.cards/view/${cardId}`;
    console.log('🔗 Link único:', uniqueLink);

    // 4. Enviar notificaciones
    console.log('📧 Enviando notificaciones...');
    await sendNotifications({
      cardId,
      sender,
      recipient,
      uniqueLink,
    });

    // 5. Registrar evento
    await logEvent(cardId, 'card_completed', { videoUrl });

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
  console.log('📝 Creando registro de tarjeta...');
  
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
    console.log('✅ Usuario creado:', everwishId);
  } else {
    console.log('✅ Usuario existente:', user.rows[0].everwish_id);
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
      ${cardData.type || 'animated'},
      ${cardData.message},
      'processing',
      true,
      true
    )
    RETURNING *
  `;

  const cardId = card.rows[0].id;
  console.log('✅ Tarjeta creada en DB:', cardId);

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
  try {
    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.CREATOMATE_TEMPLATE_ID,
        modifications: {
          'Text-Message': cardData.message || 'Happy celebration!',
          'Text-Recipient': cardData.recipientName || 'Friend',
          'Text-Sender': cardData.senderName || 'Someone special',
          'Video-Background': `https://www.everwish.cards/videos/${cardData.slug}.mp4`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Creatomate API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const renderId = data[0].id;

    console.log('⏳ Esperando generación de video, render ID:', renderId);
    return await pollVideoStatus(renderId);
    
  } catch (error) {
    console.error('❌ Error generando video:', error);
    throw error;
  }
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
    console.log(`📊 Estado del render (intento ${attempts + 1}):`, statusData.status);

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
// ENVIAR NOTIFICACIONES
// ============================================================

async function sendNotifications({ cardId, sender, recipient, uniqueLink }) {
  const message = `🎉 ¡${sender.name} te envió una tarjeta especial!\n\nÁbrela aquí: ${uniqueLink}`;

  console.log('📧 Preparando notificaciones para:', recipient.email, recipient.phone);

  // Email al destinatario
  if (recipient.email) {
    try {
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
      
      console.log('✅ Email enviado al destinatario');
    } catch (error) {
      console.error('❌ Error enviando email al destinatario:', error);
    }
  }

  // WhatsApp
  if (recipient.phone && recipient.phone.startsWith('whatsapp:')) {
    try {
      await sendWhatsApp({ to: recipient.phone, message });

      await sql`
        INSERT INTO notifications (card_id, notification_type, channel, status)
        VALUES (${cardId}, 'card_sent', 'whatsapp', 'sent')
      `;
      
      console.log('✅ WhatsApp enviado');
    } catch (error) {
      console.error('❌ Error enviando WhatsApp:', error);
    }
  }

  // SMS
  if (recipient.phone && !recipient.phone.startsWith('whatsapp:')) {
    try {
      await sendSMS({ to: recipient.phone, message });

      await sql`
        INSERT INTO notifications (card_id, notification_type, channel, status)
        VALUES (${cardId}, 'card_sent', 'sms', 'sent')
      `;
      
      console.log('✅ SMS enviado');
    } catch (error) {
      console.error('❌ Error enviando SMS:', error);
    }
  }

  // Email de confirmación al remitente
  if (sender.email) {
    try {
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
      
      console.log('✅ Email de confirmación enviado al remitente');
    } catch (error) {
      console.error('❌ Error enviando email al remitente:', error);
    }
  }
}

// ============================================================
// REGISTRAR EVENTOS
// ============================================================

async function logEvent(cardId, eventType, eventData) {
  try {
    await sql`
      INSERT INTO card_events (card_id, event_type, event_data)
      VALUES (${cardId}, ${eventType}, ${JSON.stringify(eventData)})
    `;
  } catch (error) {
    console.error('❌ Error registrando evento:', error);
  }
}
