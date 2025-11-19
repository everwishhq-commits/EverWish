// app/api/payment_intents/route.js
import Stripe from "stripe";

export async function POST(req) {
  try {
    // ✅ Validar clave DENTRO de la función POST
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error("❌ ERROR: STRIPE_SECRET_KEY no está configurada");
      return new Response(
        JSON.stringify({ 
          error: "Stripe no está configurado. Contacta al administrador." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // Inicializar Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    });

    const body = await req.json();

    // --- Datos que llegan del checkout ---
    const amount = Number(body.amount);
    const sender = body.sender || {};
    const recipient = body.recipient || {};
    const message = body.message || "";
    const gift = body.gift || {};
    const cardSlug = body.cardSlug || "";

    // --- Validaciones ---
    if (!amount || Number.isNaN(amount) || amount < 50) {
      return new Response(
        JSON.stringify({ 
          error: "El monto debe ser al menos $0.50 USD" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    if (!sender.name || !sender.email) {
      return new Response(
        JSON.stringify({ 
          error: "Falta información del remitente (nombre y email)" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    if (!recipient.name || !recipient.email) {
      return new Response(
        JSON.stringify({ 
          error: "Falta información del destinatario (nombre y email)" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // --- Crear PaymentIntent ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: "usd",
      automatic_payment_methods: { 
        enabled: true 
      },
      metadata: {
        // Información del remitente
        sender_name: sender.name,
        sender_email: sender.email,
        sender_phone: sender.phone || "",
        
        // Información del destinatario
        recipient_name: recipient.name,
        recipient_email: recipient.email,
        recipient_phone: recipient.phone || "",
        
        // Detalles de la tarjeta
        card_slug: cardSlug,
        message: message.substring(0, 500),
        
        // Gift card (opcional)
        gift_brand: gift.brand || "",
        gift_amount: String(gift.amount || 0),
        
        // Total
        total_usd: String(amount / 100),
        
        // Timestamp
        created_at: new Date().toISOString(),
      },
      description: `Everwish Card: ${cardSlug || 'Custom Card'}`,
    });

    console.log("✅ PaymentIntent creado:", paymentIntent.id);

    // --- Responder con el client_secret ---
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (err) {
    console.error("❌ Error en Stripe PaymentIntent:", err);

    return new Response(
      JSON.stringify({
        error: err.message || "Error al procesar el pago",
        type: err.type || "api_error",
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
