import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Endpoint para crear un PaymentIntent.
 * Recibe el monto en centavos (USD) desde el cliente.
 */
export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid amount." }),
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: "Everwish Digital Card Payment",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
