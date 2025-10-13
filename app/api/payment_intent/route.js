import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Endpoint to create Stripe Payment Intent
 */
export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing amount" }),
        { status: 400 }
      );
    }

    // Create the payment intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Stripe error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Stripe PaymentIntent creation failed",
      }),
      { status: 500 }
    );
  }
}
