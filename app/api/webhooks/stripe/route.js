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

  try {
    // ============================================================
    // MANEJAR CHECKOUT SESSION COMPLETED (Checkout Sessions)
    // ============================================================
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('💳 Session completada:', session.id);
      console.log('📦 Metadata:', session.metadata);

      // Parsear metadata
      const sender = JSON.parse(session.metadata.sender || '{}');
      const recipient = JSON.parse(session.metadata.recipient || '{}');
      const gift = JSON.parse(session.metadata.gift || '{}');

      // Obtener Payment Intent ID
      const paymentIntentId = session.payment_intent;

      await processCard({
        paymentIntentId,
        sender: {
          email: sender.email,
          name: sender.name,
          phone: sender.phone || null,
        },
        recipient: {
          name: recipient.name,
          email: recipient.email || null,
          phone: recipient.phone || null,
        },
        cardData: {
          slug: session.metadata.slug,
          message: session.metadata.message,
          type: session.metadata.anim,
          recipientName: recipient.name,
          senderName: sender.name,
        },
        amount: session.amount_total,
        giftAmount: gift.amount || 0,
      });

      console.log('✅ Tarjeta procesada desde Checkout Session');
    }

    // ============================================================
    // MANEJAR PAYMENT INTENT SUCCEEDED (Payment Intents directo)
    // ============================================================
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      console.log('💳 Payment Intent exitoso:', paymentIntent.id);
      console.log('📦 Metadata:', paymentIntent.metadata);

      const {
        sender_email,
        sender_name,
        sender_phone,
        recipient_name,
        recipient_email,
        recipient_phone,
        card_slug,
        message,
        gift_amount,
      } = paymentIntent.metadata;

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
          message: message,
          type: 'animated', // o el tipo que uses
          recipientName: recipient_name,
          senderName: sender_name,
        },
        amount: paymentIntent.amount,
        giftAmount: gift_amount || 0,
      });

      console.log('✅ Tarjeta procesada desde Payment Intent');
    }

    // ============================================================
    // MANEJAR PAGO FALLIDO
    // ============================================================
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.error('❌ Pago fallido:', paymentIntent.id);
      
      // Aquí podrías enviar un email al usuario notificando el fallo
    }

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    console.error('Stack:', error.stack);
    // No retornar error para que Stripe no reintente
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
