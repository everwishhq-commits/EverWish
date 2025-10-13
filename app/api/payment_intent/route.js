import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid amount provided." }),
        { status: 400 }
      );
    }

    // Crea el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      description: "Everwish Card Purchase",
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Stripe Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
