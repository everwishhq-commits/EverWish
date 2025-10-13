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

/* ---------- Stripe ---------- */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/* ---------- Mensaje automático ---------- */
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

/* ---------- Animaciones ---------- */
const ANIMS = {
  halloween: [
    "🎃 Pumpkin Glow",
    "👻 Ghost Drift",
    "🕸️ Web Fall",
    "🧙‍♀️ Witch Dust",
    "🦇 Bat Flight",
    "💀 Skull Flicker",
    "🕯️ Candle Mist",
    "🌕 Moonlight Fade",
    "🍬 Candy Rain",
    "✨ Magic Dust",
  ],
  christmas: [
    "🎄 Snow Glow",
    "🎁 Santa Spark",
    "❄️ Snowfall",
    "🕯️ Candle Light",
    "🌟 Star Shine",
    "💫 Magic Dust",
    "🔔 Jingle Bells",
    "🧦 Cozy Socks",
    "🌠 Bright Spark",
    "🎅 Cheer Glow",
  ],
  love: [
    "💖 Floating Hearts",
    "💞 Pink Glow",
    "🌹 Rose Fall",
    "💋 Kiss Burst",
    "✨ Soft Sparkle",
    "🌸 Bloom Fade",
    "💕 Heart Trail",
    "💫 Romantic Dust",
    "🕯️ Candle Flicker",
    "🌷 Petal Flow",
  ],
};

function parseCategories(slug) {
  const s = (slug || "").toLowerCase();
  if (/halloween/.test(s)) return "halloween";
  if (/christmas|navidad/.test(s)) return "christmas";
  if (/love|valentine/.test(s)) return "love";
  return "love";
}

/* ---------- Stripe Inline Form ---------- */
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
    <form onSubmit={submit} className="mt-3">
      <div className="border rounded-2xl p-4 bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 w-full rounded-full py-3 font-semibold text-white transition ${
          loading ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)} 💜`}
      </button>
    </form>
  );
}

/* ---------- Gift Card Popup ---------- */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const brands = ["Amazon", "Target", "Walmart", "Spotify", "Netflix"];
  const quick = [5, 10, 25, 50, 100];
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-11/12 max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-center text-pink-600 mb-4">
          Choose Gift Card 🎁
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 ${
                brand === b ? "border-pink-500 bg-pink-50" : "border-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {quick.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border ${
                amount === a ? "border-pink-500 bg-pink-50" : "border-gray-300"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect({ brand, amount })}
          disabled={!brand || !amount}
          className="w-full py-3 rounded-full text-white font-semibold bg-pink-500 hover:bg-pink-600"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

/* ---------- Checkout Popup ---------- */
function CheckoutPopup({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [sender, setSender] = useState({ name: "", email: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "" });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-11/12 max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
          Checkout 💜
        </h3>

        <input
          placeholder="Your name"
          className="w-full border rounded-xl p-3 mb-2"
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
        />
        <input
          placeholder="Your email"
          className="w-full border rounded-xl p-3 mb-4"
          value={sender.email}
          onChange={(e) => setSender({ ...sender, email: e.target.value })}
        />
        <input
          placeholder="Recipient name"
          className="w-full border rounded-xl p-3 mb-2"
          value={recipient.name}
          onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
        />
        <input
          placeholder="Recipient email"
          className="w-full border rounded-xl p-3 mb-4"
          value={recipient.email}
          onChange={(e) =>
            setRecipient({ ...recipient, email: e.target.value })
          }
        />

        <div className="border-t pt-3 text-sm text-gray-700 mb-2">
          <p className="flex justify-between">
            <span>Everwish Card</span>
            <span>$5.00</span>
          </p>
          <p className="flex justify-between items-center mt-2">
            <span>
              Gift Card{" "}
              {gift?.brand ? `(${gift.brand} $${gift.amount})` : "(none)"}
            </span>
            {gift?.brand ? (
              <div className="flex gap-2">
                <button
                  onClick={onGiftChange}
                  className="text-pink-600 text-xs"
                >
                  Change
                </button>
                <button
                  onClick={onGiftRemove}
                  className="text-gray-400 hover:text-red-500 text-xs"
                >
                  🗑️
                </button>
              </div>
            ) : (
              <button
                onClick={onGiftChange}
                className="text-pink-600 text-xs"
              >
                Add
              </button>
            )}
          </p>
          <p className="flex justify-between font-semibold mt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </motion.div>
    </div>
  );
}

/* ---------- Página Principal ---------- */
export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found || null);
      setMessage(defaultMessageFromSlug(slug));
      const cat = parseCategories(slug);
      setAnimOptions(ANIMS[cat]);
      setAnim(ANIMS[cat][0]);
    })();
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      timer = setTimeout(() => setShowEdit(true), 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.85, 0],
          y: [0, -90],
          x: [0, Math.random() * 100 - 50],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4.8 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.22,
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

  if (!item || !showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item?.src?.endsWith(".mp4") ? (
          <>
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <img
            src={item?.src}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  const total = CARD_PRICE + (Number(gift.amount) || 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-[420px] object-contain"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              className="w-full h-[420px] object-contain"
            />
          )}
        </div>

        <div className="mt-4 text-center">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border rounded-2xl p-3 text-center text-gray-700 resize-none"
          />

          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
          >
            {animOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <button
            onClick={() => setShowCheckout(true)}
            className="mt-5 w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
          >
            Checkout 💳
          </button>
        </div>
      </div>

      {showGiftPopup && (
        <GiftCardPopup
          onSelect={(g) => {
            setGift(g);
            setShowGiftPopup(false);
          }}
          onClose={() => setShowGiftPopup(false)}
          initial={gift}
        />
      )}

      {showCheckout && (
        <CheckoutPopup
          total={total}
          gift={gift}
          onGiftChange={() => setShowGiftPopup(true)}
          onGiftRemove={() => setGift({ brand: "", amount: 0 })}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
    }
