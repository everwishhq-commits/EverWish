import { sql } from '@vercel/postgres';

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    const card = await sql`
      SELECT 
        c.*,
        u.name as sender_name,
        u.email as sender_email
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

    return new Response(
      JSON.stringify({ card: card.rows[0] }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);

    return new Response(
      JSON.stringify({ error: 'Error cargando tarjeta' }),
      { status: 500 }
    );
  }
}
