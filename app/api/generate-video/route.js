/**
 * API Endpoint: Generate Video with Creatomate
 * Genera videos MP4 usando el template configurado en Creatomate
 */

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      cardImage,
      message,
      userPhoto,
      recipientName,
      videoSlug,
      plan
    } = body;

    // Validar campos requeridos
    if (!message || !recipientName) {
      return Response.json(
        { error: 'Missing required fields: message and recipientName' },
        { status: 400 }
      );
    }

    // Credenciales de Creatomate
    const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;
    const CREATOMATE_TEMPLATE_ID = process.env.CREATOMATE_TEMPLATE_ID;

    if (!CREATOMATE_API_KEY || !CREATOMATE_TEMPLATE_ID) {
      return Response.json(
        { error: 'Creatomate credentials not configured' },
        { status: 500 }
      );
    }

    // Preparar modificaciones para el template
    const modifications = {
      'cardImage': cardImage || 'https://placeholder.com/card.jpg',
      'message': message,
      'userPhoto': userPhoto || 'https://placeholder.com/user.jpg',
    };

    // Request para Creatomate
    const renderRequest = {
      template_id: CREATOMATE_TEMPLATE_ID,
      modifications: modifications,
      output: {
        format: 'mp4',
        width: 720,
        height: 1280,
        frame_rate: 60,
        duration: 50, // 5 ciclos de 10 segundos
      },
    };

    console.log('🎬 Sending request to Creatomate:', {
      template: CREATOMATE_TEMPLATE_ID,
      modifications
    });

    // Llamar a Creatomate API
    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(renderRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Creatomate API error:', errorText);
      return Response.json(
        { error: 'Failed to create video render', details: errorText },
        { status: response.status }
      );
    }

    const renderData = await response.json();

    console.log('✅ Creatomate render created:', renderData);

    return Response.json({
      success: true,
      renderId: renderData.id,
      status: renderData.status,
      message: 'Video render started. Check status endpoint for completion.',
    });

  } catch (error) {
    console.error('❌ Error generating video:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para verificar el estado del render
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');

    if (!renderId) {
      return Response.json(
        { error: 'Missing renderId parameter' },
        { status: 400 }
      );
    }

    const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;

    if (!CREATOMATE_API_KEY) {
      return Response.json(
        { error: 'Creatomate API key not configured' },
        { status: 500 }
      );
    }

    // Verificar estado del render
    const response = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CREATOMATE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error checking render status:', errorText);
      return Response.json(
        { error: 'Failed to check render status', details: errorText },
        { status: response.status }
      );
    }

    const renderData = await response.json();

    return Response.json({
      success: true,
      renderId: renderData.id,
      status: renderData.status,
      url: renderData.url, // Disponible cuando status es 'succeeded'
    });

  } catch (error) {
    console.error('❌ Error checking render status:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
