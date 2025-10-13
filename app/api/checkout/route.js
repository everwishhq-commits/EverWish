import Stripe from "stripe";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      slug,
      message,
      anim,
      sender = {},
      recipient = {},
      gift = { brand: "", amount: 0 },
      cardPrice = 5,
    } = body || {};

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(secret, { apiVersion: "2022-11-15" });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://everwish.app";

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Everwish Card – ${slug}`,
            description: message?.slice(0, 140) || "Personalized digital card",
            metadata: { slug, anim },
          },
          unit_amount: Math.round(cardPrice * 100),
        },
        quantity: 1,
      },
    ];

    if (gift?.brand && Number(gift?.amount) > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Gift Card – ${gift.brand}`,
          },
          unit_amount: Math.round(Number(gift.amount) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${siteUrl}/share/${encodeURIComponent(slug)}?success=1`,
      cancel_url: `${siteUrl}/edit/${encodeURIComponent(slug)}?canceled=1`,
      metadata: {
        slug,
        anim,
        message: message || "",
        sender: JSON.stringify(sender || {}),
        recipient: JSON.stringify(recipient || {}),
        gift: JSON.stringify(gift || {}),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Stripe error:", e);
    return new Response(JSON.stringify({ error: "Stripe error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
      }
