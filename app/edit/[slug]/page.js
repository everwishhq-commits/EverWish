"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/* ---------- Mensaje automático ---------- */
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/christmas|navidad/.test(s)) return "May your days be merry, bright, and filled with love. 🎄✨";
  if (/halloween/.test(s) && /love/.test(s)) return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s) && /birthday|cumple/.test(s)) return "Wishing you laughs, scares and sweet cake! 🎃🎂";
  if (/halloween/.test(s)) return "Wishing you a spook-tacular night full of magic and candy! 👻🍬";
  if (/thanksgiving/.test(s)) return "Grateful for every blessing and every smile. 🦃🍁";
  if (/birthday|cumple/.test(s)) return "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂";
  if (/love|valentine/.test(s)) return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/condolence|loss|memory|funeral/.test(s)) return "May peace and love comfort your heart today and always. 🕊️🤍";
  if (/independence|july|usa/.test(s)) return "Celebrate freedom and unity. Happy Independence Day! 🇺🇸🎆";
  if (/easter|bunny/.test(s)) return "Let joy and renewal bloom within you. 🐰🌸";
  if (/newyear|year/.test(s)) return "A fresh start, new dreams, and endless joy. ✨🎆";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

/* ---------- Catálogo de animaciones ---------- */
const ANIMS = {
  christmas: ["🎄 Snow Glow", "🎁 Santa Spark", "✨ Twinkle Lights"],
  halloween: ["🎃 Pumpkin Glow", "👻 Ghost Drift", "🕸️ Web Fall"],
  birthday: ["🎉 Confetti Burst", "🎂 Cake Spark", "🎈 Balloon Rise"],
  love: ["💖 Floating Hearts", "💘 Cupid Spark", "🌹 Rose Fall"],
  condolence: ["🕊️ Dove Flight", "🌿 Leaf Drift", "🌧️ Soft Rain"],
  independence: ["🇺🇸 Flag Wave", "🎆 Firework Burst", "🗽 Liberty Glow"],
  easter: ["🐰 Hop Trail", "🌸 Flower Bloom", "🌼 Petal Pop"],
  newyear: ["🎆 Fireworks", "✨ Glitter Burst", "🎇 Star Rain"],
};

function parseCategories(slug) {
  const s = (slug || "").toLowerCase();
  const cats = [];
  if (/christmas|navidad/.test(s)) cats.push("christmas");
  if (/halloween/.test(s)) cats.push("halloween");
  if (/birthday|cumple/.test(s)) cats.push("birthday");
  if (/love|valentine/.test(s)) cats.push("love");
  if (/condolence|funeral/.test(s)) cats.push("condolence");
  if (/independence|usa/.test(s)) cats.push("independence");
  if (/easter|bunny/.test(s)) cats.push("easter");
  if (/newyear|year/.test(s)) cats.push("newyear");
  return cats;
}

function getAnimationsForSlug(slug) {
  const cats = parseCategories(slug);
  if (cats.length === 0) return ["✨ Sparkles", "🎉 Confetti", "❌ None"];
  const bag = [];
  for (const c of cats) bag.push(...(ANIMS[c] || []));
  return Array.from(new Set(bag));
}

/* ---------- Formulario de pago ---------- */
function PaymentForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) alert(result.error.message);
      else if (result.paymentIntent.status === "succeeded") {
        alert("✅ Payment successful!");
        onSuccess();
      }
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
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
        {loading ? "Processing..." : `Pay $${total.toFixed(2)} 💜`}
      </button>
    </form>
  );
}

/* ---------- Popup de Checkout ---------- */
const CheckoutPopup = ({ giftSelection, setShowCheckout, CARD_PRICE }) => {
  const [sender, setSender] = useState({ name: "", email: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "" });
  const total = CARD_PRICE + (giftSelection.amount || 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
      >
        <button
          onClick={() => setShowCheckout(false)}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
          Checkout 💜
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Sender</p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.name}
              onChange={(e) =>
                setSender({ ...sender, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.email}
              onChange={(e) =>
                setSender({ ...sender, email: e.target.value })
              }
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Recipient</p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.name}
              onChange={(e) =>
                setRecipient({ ...recipient, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.email}
              onChange={(e) =>
                setRecipient({ ...recipient, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
          <div className="flex justify-between mb-2">
            <span>Everwish Card</span>
            <span>${CARD_PRICE.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>
              Gift Card{" "}
              {giftSelection.brand
                ? `(${giftSelection.brand})`
                : "(none)"}
            </span>
            <span>${(giftSelection.amount || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm total={total} onSuccess={() => setShowCheckout(false)} />
        </Elements>
      </motion.div>
    </div>
  );
};

/* ---------- Página principal ---------- */
export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [giftSelection, setGiftSelection] = useState({
    brand: "",
    amount: 0,
  });
  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found || null);
      setMessage(defaultMessageFromSlug(slug));
      setAnimOptions(getAnimationsForSlug(slug));
    })();
  }, [slug]);

  if (!item) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 bg-[#fff8f5] min-h-screen relative overflow-hidden">
      <div className="relative rounded-3xl shadow-md overflow-hidden bg-white">
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

      <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Customize your message ✨
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
        />

        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
        >
          {animOptions.map((a, i) => (
            <option key={i} value={a}>
              {a}
            </option>
          ))}
        </select>

        <div className="flex justify-between mt-4">
          <button
            onClick={() =>
              setGiftSelection({
                brand: "Amazon",
                amount: 10,
              })
            }
            className="w-[48%] bg-yellow-300 text-[#3b2b1f] font-semibold rounded-full py-3 hover:bg-yellow-400 transition"
          >
            🎁 Choose Gift Card
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition"
          >
            Checkout 💜
          </button>
        </div>
      </section>

      {showCheckout && (
        <CheckoutPopup
          giftSelection={giftSelection}
          setShowCheckout={setShowCheckout}
          CARD_PRICE={CARD_PRICE}
        />
      )}
    </main>
  );
          }
