import Stripe from "stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      slug,
      message,
      anim,
      sender,
      recipient,
      gift,
      cardPrice = 5,
    } = body || {};

    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Everwish Digital Card – ${slug}`,
            description: `Message: ${message || "-"} | Anim: ${anim || "-"}`,
          },
          unit_amount: Math.round(cardPrice * 100),
        },
        quantity: 1,
      },
    ];

    if (gift?.brand && gift?.amount) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Gift Card – ${gift.brand}` },
          unit_amount: Math.round(Number(gift.amount) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/share/${encodeURIComponent(slug)}?status=success`,
      cancel_url: `${origin}/edit/${encodeURIComponent(slug)}?status=cancel`,
      metadata: {
        slug,
        anim: anim || "",
        message: message || "",
        sender_name: sender?.name || "",
        sender_email: sender?.email || "",
        sender_phone: sender?.phone || "",
        recipient_name: recipient?.name || "",
        recipient_email: recipient?.email || "",
        recipient_phone: recipient?.phone || "",
        gift_brand: gift?.brand || "",
        gift_amount: gift?.amount?.toString() || "0",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    console.error("Stripe error:", err);
    return new Response(JSON.stringify({ error: "Stripe Checkout failed" }), { status: 500 });
  }
          }
