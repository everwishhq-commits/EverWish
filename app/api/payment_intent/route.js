import Stripe from "stripe";

export async function POST(req) {
  try {
    const { amount } = await req.json();
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

    const pi = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(JSON.stringify({ clientSecret: pi.client_secret }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PI error:", e);
    return new Response(JSON.stringify({ error: "Stripe PI error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
