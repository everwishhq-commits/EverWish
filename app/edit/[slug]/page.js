"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/* ========= Stripe ========= */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/* ========= Mensaje automático ========= */
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/christmas|navidad/.test(s))
    return "May your days be merry, bright, and filled with love. 🎄✨";
  if (/halloween/.test(s) && /love/.test(s))
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s) && /birthday|cumple/.test(s))
    return "Wishing you laughs, scares and sweet cake! 🎃🎂";
  if (/halloween/.test(s))
    return "Wishing you a spook-tacular night full of magic and candy! 👻🍬";
  if (/thanksgiving/.test(s))
    return "Grateful for every blessing and every smile. 🦃🍁";
  if (/birthday|cumple/.test(s))
    return "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂";
  if (/love|valentine/.test(s))
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/condolence|loss|memory|funeral/.test(s))
    return "May peace and love comfort your heart today and always. 🕊️🤍";
  if (/independence|july|usa/.test(s))
    return "Celebrate freedom and unity. Happy Independence Day! 🇺🇸🎆";
  if (/easter|bunny/.test(s))
    return "Let joy and renewal bloom within you. 🐰🌸";
  if (/newyear|year/.test(s))
    return "A fresh start, new dreams, and endless joy. ✨🎆";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

/* ========= Animaciones ========= */
const ANIMS = {
  love: ["💖 Hearts", "💘 Cupid Spark", "🌹 Rose Fall", "✨ Soft Sparkle"],
  easter: ["🌸 Flower Bloom", "🌷 Spring Glow", "✨ Gentle Sparkle", "🐰 Hop Trail"],
  halloween: ["🎃 Pumpkin Glow", "👻 Ghost Drift", "🕸️ Web Fall", "🪄 Spark Potion"],
  birthday: ["🎉 Confetti Burst", "🎂 Cake Spark", "🎈 Balloon Rise", "🎁 Gift Slide"],
};

function parseCategories(slug) {
  const s = (slug || "").toLowerCase();
  const cats = [];
  if (/love|valentine/.test(s)) cats.push("love");
  if (/easter|bunny/.test(s)) cats.push("easter");
  if (/halloween/.test(s)) cats.push("halloween");
  if (/birthday|cumple/.test(s)) cats.push("birthday");
  return Array.from(new Set(cats));
}

function getAnimationsForSlug(slug) {
  const cats = parseCategories(slug);
  if (!cats.length) return ["✨ Sparkles", "🎉 Confetti", "💖 Hearts", "❌ None"];
  const set = [];
  cats.forEach((c) => set.push(...(ANIMS[c] || [])));
  return Array.from(new Set(set)).slice(0, 10);
}

/* ========= Stripe form ========= */
function InlineStripeForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) alert(result.error.message);
      else if (result.paymentIntent?.status === "succeeded") {
        alert("🎉 Payment successful!");
        onSuccess?.();
      }
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="border rounded-2xl p-4 bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 w-full rounded-full py-3 font-semibold text-white transition ${
          loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {loading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)} 💜`}
      </button>
    </form>
  );
}

/* ========= Popup Gift Card ========= */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [active, setActive] = useState("Popular");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const cards = {
    Popular: ["Amazon", "Walmart", "Target"],
    Lifestyle: ["Nike", "H&M", "Zara"],
    Digital: ["Google Play", "Spotify", "Netflix"],
  };
  const done = () => {
    if (!brand || !amount) return alert("Select a brand and amount");
    onSelect({ brand, amount });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400">
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
          Choose a Gift Card 🎁
        </h3>

        <div className="flex justify-center gap-6 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`pb-1 ${
                active === t
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {cards[active].map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 text-sm ${
                brand === b
                  ? "bg-pink-100 border-pink-400 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">
          Amount (USD)
        </h4>
        <div className="flex gap-2 justify-center mb-4">
          {[10, 25, 50, 100].map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border ${
                amount === a
                  ? "bg-pink-100 border-pink-500 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        <button
          onClick={done}
          className="w-full rounded-full py-3 bg-pink-500 text-white font-semibold"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

/* ========= Checkout Popup ========= */
function CheckoutPopup({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400">
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-pink-600 mb-1">
          Checkout seguro con Stripe 💜
        </h3>
        <p className="text-center text-xs text-gray-500 mb-4">
          Tus datos se procesan de forma segura por Stripe.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Sender <span className="text-pink-500">*</span>
            </p>
            <input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" />
            <input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" />
            <input placeholder="Phone" className="w-full rounded-xl border p-3" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Recipient <span className="text-pink-500">*</span>
            </p>
            <input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" />
            <input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" />
            <input placeholder="Phone" className="w-full rounded-xl border p-3" />
          </div>
        </div>

        <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
          <p className="font-semibold mb-1">Order summary</p>
          <div className="flex justify-between">
            <span>Everwish Card</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>
              Gift Card{" "}
              {gift?.brand ? `(${gift.brand} $${gift.amount})` : "(none)"}
            </span>
            <div className="flex gap-2">
              <button onClick={onGiftChange} className="text-pink-600 hover:underline">
                {gift?.brand ? "Change" : "Add"}
              </button>
              {gift?.brand && (
                <button onClick={onGiftRemove} className="text-gray-400 hover:text-red-500">
                  🗑️
                </button>
              )}
            </div>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </motion.div>
    </div>
  );
}

/* ========= Página principal ========= */
export default function EditPage() {
  const { slug } = useParams();
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const CARD_PRICE = 5;
  const total = CARD_PRICE + (gift.amount || 0);

  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    setAnimOptions(getAnimationsForSlug(slug));
  }, [slug]);

  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 12 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.9, 0],
          y: [0, -100],
          x: [0, Math.random() * 100 - 50],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {emoji}
      </motion.span>
    ));
  };

  // Editor principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animación de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderEffect()}
      </div>

      {/* Contenedor principal */}
      <div className="relative z-[30] bg-white rounded-3xl shadow-md p-6 w-full max-w-[700px] mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">
          Customize your message ✨
        </h2>

        {/* Campo de mensaje */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
        />

        {/* Selector de animación */}
        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
        >
          {animOptions.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
          <option>❌ None</option>
        </select>

        {/* Botones principales */}
        <div className="flex justify-between mt-4 flex-wrap gap-3">
          <button
            onClick={() => setShowGiftPopup(true)}
            className="flex-1 bg-yellow-300 text-[#3b2b1f] font-semibold py-3 rounded-full hover:bg-yellow-400 transition"
          >
            🎁 Choose Gift Card
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="flex-1 bg-pink-500 text-white font-semibold py-3 rounded-full hover:bg-pink-600 transition"
          >
            Checkout 💳
          </button>
        </div>

        {/* Info de la gift card seleccionada */}
        {gift.brand && (
          <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
            <span>
              Selected: <strong>{gift.brand}</strong> — ${gift.amount}
            </span>
            <button
              onClick={() => setGift({ brand: "", amount: 0 })}
              className="text-pink-400 hover:text-pink-600 transition"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Popup de selección de GiftCard */}
      {showGiftPopup && (
        <GiftCardPopup
          initial={gift}
          onSelect={(g) => {
            setGift(g);
            setShowGiftPopup(false);
          }}
          onClose={() => setShowGiftPopup(false)}
        />
      )}

      {/* Popup de Checkout */}
      {showCheckout && (
        <CheckoutPopup
          total={total}
          gift={gift}
          onGiftChange={() => {
            setShowCheckout(false);
            setShowGiftPopup(true);
          }}
          onGiftRemove={() => setGift({ brand: "", amount: 0 })}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
}
