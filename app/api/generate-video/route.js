export async function POST(req) {
  try {
    const { cardSlug, message, recipientName, senderName, photoUrl } = await req.json();

    // Llamar a Creatomate
    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.CREATOMATE_TEMPLATE_ID,
        modifications: {
          'Text-Message': message,
          'Text-Recipient': recipientName,
          'Text-Sender': senderName,
          'Video-Background': `https://everwish.cards/videos/${cardSlug}.mp4`,
          ...(photoUrl && { 'Image-Photo': photoUrl }),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Error en Creatomate API');
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        renderId: data[0].id 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error generando video:', error);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { status: 500 }
    );
  }
}
