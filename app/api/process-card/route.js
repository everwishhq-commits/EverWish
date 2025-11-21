/**
 * API Endpoint: Process Card After Payment
 * Se llama desde el checkout después de un pago exitoso
 */

import { processCardAfterPayment } from '@/lib/card-processor';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('💳 Processing card after payment:', body);

    // Validar datos requeridos
    const { sender, recipient, cardData, amount, paymentIntentId } = body;

    if (!sender || !recipient || !cardData || !amount) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Procesar la tarjeta completa
    const result = await processCardAfterPayment({
      sender: {
        name: sender.name,
        email: sender.email,
        phone: sender.phone || null,
      },
      recipient: {
        name: recipient.name,
        email: recipient.email,
        phone: recipient.phone || null,
      },
      message: cardData.message || '',
      videoSlug: cardData.videoSlug || 'default',
      userPhoto: cardData.userPhoto || null,
      plan: cardData.plan || 'snapwish',
      amount: amount,
      paymentIntentId: paymentIntentId,
    });

    console.log('✅ Card processed successfully:', result);

    return Response.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('❌ Error processing card:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to process card',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
