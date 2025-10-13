// /app/api/payment_intents/route.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const body = await req.json();

    // --- Datos que llegan del checkout ---
    const amount = Number(body.amount);
    const sender = body.sender || {};
    const recipient = body.recipient || {};
    const message = body.message || "";
    const gift = body.gift || {};

    // --- Validaciones ---
    if (!amount || isNaN(amount) || amount < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!sender.name || !sender.email || !recipient.name || !recipient.email) {
      return new Response(
        JSON.stringify({ error: "Missing sender or recipient fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Crear PaymentIntent y guardar datos en metadata ---
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        sender_name: sender.name,
        sender_email: sender.email,
        sender_phone: sender.phone || "",
        recipient_name: recipient.name,
        recipient_email: recipient.email,
        recipient_phone: recipient.phone || "",
        message,
        gift_brand: gift.brand || "",
        gift_amount: String(gift.amount || 0),
        total_usd: String(amount / 100),
      },
    });

    // --- Responder con el client_secret ---
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Stripe error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Stripe PaymentIntent creation failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
                                 }
