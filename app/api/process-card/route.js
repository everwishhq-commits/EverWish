import { processCard } from '@/lib/card-processor';

export async function POST(req) {
  try {
    const {
      paymentIntentId,
      sender,
      recipient,
      cardData,
      amount,
      giftAmount,
    } = await req.json();

    // Validaciones
    if (!paymentIntentId || !sender || !recipient || !cardData) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos' }),
        { status: 400 }
      );
    }

    // Procesar tarjeta
    const result = await processCard({
      paymentIntentId,
      sender,
      recipient,
      cardData,
      amount,
      giftAmount,
    });

    return new Response(
      JSON.stringify(result),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en process-card:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Error procesando tarjeta',
        details: error.message 
      }),
      { status: 500 }
    );
  }
}
