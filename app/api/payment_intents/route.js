// ✅ /app/api/payment_intents/route.js
import Stripe from "stripe";

export async function POST(req) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;

    // Validación
    if (!secret) throw new Error("STRIPE_SECRET_KEY is missing.");
    if (secret.startsWith("pk_"))
      throw new Error("Invalid key: STRIPE_SECRET_KEY must start with sk_.");

    // Inicializa Stripe con la clave secreta
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    const { amount } = await req.json();
    if (!amount || isNaN(amount) || amount < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing amount." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crea el PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(JSON.stringify({ clientSecret: intent.client_secret }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Stripe API error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
