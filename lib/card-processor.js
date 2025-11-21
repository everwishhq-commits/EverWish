import twilio from 'twilio';
import { Resend } from 'resend';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================
// WHATSAPP
// ============================================================

export async function sendWhatsApp({ to, message }) {
  try {
    const result = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body: message,
    });

    console.log('✅ WhatsApp enviado:', result.sid);
    return { success: true, id: result.sid };
  } catch (error) {
    console.error('❌ Error enviando WhatsApp:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// SMS
// ============================================================

export async function sendSMS({ to, message }) {
  try {
    const result = await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });

    console.log('✅ SMS enviado:', result.sid);
    return { success: true, id: result.sid };
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// EMAIL
// ============================================================

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: 'Everwish <noreply@everwish.cards>',
      to,
      subject,
      html,
    });

    console.log('✅ Email enviado:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// NOTIFICACIÓN GENÉRICA (para compatibilidad)
// ============================================================

export async function sendNotification(data) {
  console.log('🔔 [sendNotification]', data);
  return { success: true };
}
