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

import { defaultMessageFromSlug } from "../../lib/messages";
import { getAnimationsForSlug } from "../../lib/animations";
import CropperModal from "../../lib/croppermodal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/* ========= Helper ========= */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
};

/* ========= Stripe Form ========= */
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
          loading ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)} 💜`}
      </button>
    </form>
  );
}

/* ========= Gift Card ========= */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [active, setActive] = useState("Popular");
  const cards = {
    Popular: ["Amazon", "Walmart", "Target"],
    Lifestyle: ["Nike", "H&M", "Zara"],
    Digital: ["Google Play", "Spotify", "Netflix"],
  };
  const quick = [5, 10, 25, 50, 100];

  const done = () => {
    if (!brand || !amount) return alert("Select brand and amount");
    onSelect({ brand, amount });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
          Choose a Gift Card 🎁
        </h3>

        <div className="flex justify-center gap-4 mb-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`pb-1 ${
                active === t ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"
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
              className={`border rounded-xl py-2 px-3 text-sm ${
                brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"
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
          {quick.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border ${
                amount === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <button onClick={done} className="w-full rounded-full py-3 font-semibold text-white bg-pink-500 hover:bg-pink-600 transition">
          Done
        </button>
      </motion.div>
    </div>
  );
}

/* ========= Checkout ========= */
function CheckoutPopup({ onClose, gift }) {
  const [plan, setPlan] = useState("signature");
  const [giftData, setGiftData] = useState(gift);
  const CARD_PLANS = [
    {
      id: "heartfelt",
      label: "💌 Heartfelt",
      price: 3.99,
      description: "A calm, elegant design for sending warm and meaningful wishes.",
    },
    {
      id: "signature",
      label: "💎 Signature",
      price: 7.99,
      description: "A dynamic animated experience with motion, photo, and effects that bring your message to life.",
    },
  ];
  const total =
    CARD_PLANS.find((p) => p.id === plan).price +
    (giftData?.amount ? giftData.amount : 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">✕</button>

        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">
          Secure Checkout 💜
        </h3>

        <p className="text-center text-sm text-gray-500 mb-4">
          Both include your personalized message and instant delivery.
        </p>

        <div className="bg-purple-50 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold mb-2 text-purple-700">
            Choose your Everwish style ✨
          </p>
          {CARD_PLANS.map((p) => (
            <label
              key={p.id}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition border mb-2 ${
                plan === p.id
                  ? "border-purple-400 bg-white shadow-sm"
                  : "border-transparent hover:bg-purple-50"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={plan === p.id}
                onChange={() => setPlan(p.id)}
              />
              <div>
                <p className="font-semibold text-gray-700">
                  {p.label} — ${p.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{p.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-2 border-t pt-3">
          <div className="flex justify-between font-semibold text-gray-700">
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

/* ========= Página Principal ========= */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [gift, setGift] = useState(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found);
      setMessage(defaultMessageFromSlug(slug));
      setAnimOptions(getAnimationsForSlug(slug));
      setAnim(getAnimationsForSlug(slug)[0]);
    })();
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    let timer;
    const duration = 3000;
    const start = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    timer = setTimeout(() => setShowEdit(true), duration);
    return () => clearTimeout(timer);
  }, [item]);

  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 15 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -100],
          x: [0, Math.random() * 100 - 50],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.2,
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

  if (!item) return null;

  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
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
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  const mediaHeight = isMobile ? 360 : 440;

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
              style={{ height: mediaHeight }}
              className="w-full object-contain"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              style={{ height: mediaHeight }}
              className="w-full object-contain"
            />
          )}
        </div>

        <section className="mt-4 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-3">
            ✨ Customize your message ✨
          </h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={isMobile ? 3 : 2}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
          />

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

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowGiftPopup(true)}
              className="flex-1 rounded-full py-3 font-semibold bg-pink-100 hover:bg-pink-200 text-pink-700 transition"
            >
              🎁 Gift Card
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="flex-1 rounded-full py-3 font-semibold bg-purple-100 hover:bg-purple-200 text-purple-700 transition"
            >
              💳 Checkout
            </button>
          </div>
        </section>
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
        <CheckoutPopup onClose={() => setShowCheckout(false)} gift={gift} />
      )}
    </main>
  );
        }
