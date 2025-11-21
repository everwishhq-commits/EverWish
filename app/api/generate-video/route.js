import { NextRequest, NextResponse } from 'next/server';

/**
 * API Endpoint: Generate Video with Creatomate
 * 
 * Generates an MP4 video using Creatomate template with:
 * - Background video loop
 * - User's personalized message
 * - User's uploaded photo
 * - Card image
 * 
 * The video consists of a 10-second cycle that repeats 5 times (50 seconds total)
 */

interface GenerateVideoRequest {
  cardImage: string;        // URL to the card/background image
  message: string;          // Personalized message from sender
  userPhoto: string;        // URL to user's uploaded photo
  recipientName: string;    // Recipient's name
  videoSlug: string;        // Selected video background slug
  plan: 'snapwish' | 'wonderdream'; // Plan type
}

interface CreatomateResponse {
  id: string;
  status: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json();
    
    const {
      cardImage,
      message,
      userPhoto,
      recipientName,
      videoSlug,
      plan
    } = body;

    // Validate required fields
    if (!message || !recipientName) {
      return NextResponse.json(
        { error: 'Missing required fields: message and recipientName' },
        { status: 400 }
      );
    }

    // Creatomate API credentials
    const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;
    const CREATOMATE_TEMPLATE_ID = process.env.CREATOMATE_TEMPLATE_ID;

    if (!CREATOMATE_API_KEY || !CREATOMATE_TEMPLATE_ID) {
      return NextResponse.json(
        { error: 'Creatomate credentials not configured' },
        { status: 500 }
      );
    }

    // Prepare modifications for the template
    // These will replace the dynamic variables in Creatomate
    const modifications = {
      'cardImage': cardImage || 'https://placeholder.com/card.jpg',
      'message': message,
      'userPhoto': userPhoto || 'https://placeholder.com/user.jpg',
    };

    // Create video render request
    const renderRequest = {
      template_id: CREATOMATE_TEMPLATE_ID,
      modifications: modifications,
      // Output settings
      output: {
        format: 'mp4',
        width: 720,
        height: 1280,
        frame_rate: 60,
        duration: 50, // 5 cycles of 10 seconds each
      },
    };

    console.log('🎬 Sending request to Creatomate:', {
      template: CREATOMATE_TEMPLATE_ID,
      modifications
    });

    // Call Creatomate API to create the render
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
      return NextResponse.json(
        { error: 'Failed to create video render', details: errorText },
        { status: response.status }
      );
    }

    const renderData: CreatomateResponse = await response.json();

    console.log('✅ Creatomate render created:', renderData);

    // Return render ID and status
    // The video URL will be available after processing completes
    return NextResponse.json({
      success: true,
      renderId: renderData.id,
      status: renderData.status,
      message: 'Video render started. Check status endpoint for completion.',
    });

  } catch (error) {
    console.error('❌ Error generating video:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check render status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');

    if (!renderId) {
      return NextResponse.json(
        { error: 'Missing renderId parameter' },
        { status: 400 }
      );
    }

    const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;

    if (!CREATOMATE_API_KEY) {
      return NextResponse.json(
        { error: 'Creatomate API key not configured' },
        { status: 500 }
      );
    }

    // Check render status
    const response = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CREATOMATE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error checking render status:', errorText);
      return NextResponse.json(
        { error: 'Failed to check render status', details: errorText },
        { status: response.status }
      );
    }

    const renderData: CreatomateResponse = await response.json();

    return NextResponse.json({
      success: true,
      renderId: renderData.id,
      status: renderData.status,
      url: renderData.url, // Available when status is 'succeeded'
    });

  } catch (error) {
    console.error('❌ Error checking render status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
