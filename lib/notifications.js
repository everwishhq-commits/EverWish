/**
 * 🔔 Everwish - Notifications Placeholder
 * 
 * Este archivo evita errores en compilación y permite
 * que la API track de /api/cards/[slug]/track siga funcionando.
 * 
 * Luego podremos reemplazar esta función por:
 *  - Email de agradecimiento
 *  - Notificación al creador
 *  - Alertas de apertura de tarjeta
 *  - Push notifications, etc.
 */

export async function sendNotification({ type = "view", slug, data = {} }) {
  try {
    console.log("🔔 Notification placeholder:", {
      type,
      slug,
      data,
      timestamp: new Date().toISOString(),
    });

    // No hace nada todavía; solamente evita fallo 
    return { success: true };
  } catch (err) {
    console.error("❌ Error inside sendNotification placeholder:", err);
    return { success: false, error: err.message };
  }
}
