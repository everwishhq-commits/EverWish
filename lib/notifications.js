/**
 * 🔔 Everwish - Notifications System (Placeholder)
 *
 * Estas funciones existen SOLO para evitar errores en Build.
 * Más adelante podemos conectarlas a:
 *  - Resend (email)
 *  - Twilio (SMS y WhatsApp)
 */

export async function sendEmail({ to, subject, message }) {
  console.log("📧 [sendEmail placeholder]", { to, subject, message });
  return { success: true };
}

export async function sendSMS({ to, message }) {
  console.log("📱 [sendSMS placeholder]", { to, message });
  return { success: true };
}

export async function sendWhatsApp({ to, message }) {
  console.log("💬 [sendWhatsApp placeholder]", { to, message });
  return { success: true };
}

export async function sendNotification(data) {
  console.log("🔔 [sendNotification placeholder]", data);
  return { success: true };
}
