import Stripe from "stripe";

export async function POST(req) {
  try {
    const { amount } = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe payment error:", error);
    return new Response(
      JSON.stringify({ error: "Error creating payment intent" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
