// ✅ /app/api/payment_intents/route.js
import Stripe from "stripe";

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // importante: define versión estable
});

export async function POST(req) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    // Validación estricta
    if (!amount || isNaN(amount) || amount < 50) {
      // Stripe exige mínimo $0.50 USD
      return new Response(
        JSON.stringify({ error: "Invalid or missing amount" }),
        { status: 400 }
      );
    }

    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Stripe error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Stripe PaymentIntent creation failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
