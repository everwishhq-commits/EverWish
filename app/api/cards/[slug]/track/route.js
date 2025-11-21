import { sql } from '@vercel/postgres';
import { sendEmail } from '@/lib/notifications';

export async function POST(req, { params }) {
  const { slug } = params;
  const { event } = await req.json();

  try {
    // Buscar tarjeta
    const card = await sql`
      SELECT c.*, u.email as sender_email, u.name as sender_name
      FROM cards c
      JOIN users u ON c.sender_id = u.id
      WHERE c.id = ${slug}
    `;

    if (card.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Tarjeta no encontrada' }),
        { status: 404 }
      );
    }

    const cardData = card.rows[0];

    // Registrar vista
    if (event === 'view') {
      // Primera vista
      if (!cardData.first_opened_at) {
        await sql`
          UPDATE cards
          SET 
            first_opened_at = NOW(),
            times_opened = 1,
            can_upgrade = false,
            can_resend_free = false
          WHERE id = ${slug}
        `;

        // Registrar evento
        await sql`
          INSERT INTO card_events (card_id, event_type, event_data)
          VALUES (${slug}, 'card_opened', ${JSON.stringify({ timestamp: new Date() })})
        `;

        // Notificar al remitente
        await sendEmail({
          to: cardData.sender_email,
          subject: `🎉 ${cardData.recipient_name} abrió tu tarjeta`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #10B981;">¡Tu tarjeta fue abierta! 🎊</h1>
              <p><strong>${cardData.recipient_name}</strong> acaba de abrir la tarjeta que les enviaste.</p>
              <p style="color: #666;">Tu mensaje ya llegó a su corazón ❤️</p>
            </div>
          `,
        });

      } else {
        // Vistas adicionales
        await sql`
          UPDATE cards
          SET times_opened = times_opened + 1
          WHERE id = ${slug}
        `;

        await sql`
          INSERT INTO card_events (card_id, event_type, event_data)
          VALUES (${slug}, 'card_viewed_again', ${JSON.stringify({ timestamp: new Date() })})
        `;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error tracking:', error);

    return new Response(
      JSON.stringify({ error: 'Error registrando vista' }),
      { status: 500 }
    );
  }
}
