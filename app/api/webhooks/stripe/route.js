import Stripe from 'stripe';
import { processCard } from '@/lib/card-processor';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('✅ Webhook recibido:', event.type);

  // Manejar pago exitoso
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      const {
        sender_email,
        sender_name,
        sender_phone,
        recipient_name,
        recipient_email,
        recipient_phone,
        card_slug,
        card_message,
        card_type,
        gift_amount,
      } = paymentIntent.metadata;

      console.log('💳 Procesando pago para:', sender_email);

      // Procesar tarjeta automáticamente
      await processCard({
        paymentIntentId: paymentIntent.id,
        sender: {
          email: sender_email,
          name: sender_name,
          phone: sender_phone || null,
        },
        recipient: {
          name: recipient_name,
          email: recipient_email || null,
          phone: recipient_phone || null,
        },
        cardData: {
          slug: card_slug,
          message: card_message,
          type: card_type,
          recipientName: recipient_name,
          senderName: sender_name,
        },
        amount: paymentIntent.amount,
        giftAmount: gift_amount || 0,
      });

      console.log('✅ Tarjeta procesada exitosamente');

    } catch (error) {
      console.error('❌ Error procesando tarjeta:', error);
      // No retornar error para que Stripe no reintente
    }
  }

  // Manejar pago fallido
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.error('❌ Pago fallido:', paymentIntent.id);
    
    // Aquí podrías enviar un email al usuario notificando el fallo
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
