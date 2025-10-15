"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/* ========= Stripe config ========= */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

/* ========= Formulario de pago ========= */
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
      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) throw new Error(error || "Missing client secret");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) alert(result.error.message);
      else if (result.paymentIntent?.status === "succeeded") {
        alert("🎉 Payment successful!");
        onSuccess?.();
      }
    } catch {
      alert("Payment failed.");
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
export function GiftCardPopup({ onSelect, onClose, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [activeTab, setActiveTab] = useState("Popular");
  const [expanded, setExpanded] = useState({});
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  const cards = {
    Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
    Lifestyle: { featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
    Digital: { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
  };

  const quick = [5, 10, 25, 50, 100];

  const done = () => {
    if (!brand || !Number(amount)) return alert("Please select a brand and amount.");
    onSelect({ brand, amount: Number(amount) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>

        <div className="flex justify-center gap-6 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-1 ${activeTab === t ? "text-pink-500 border-b-2 border-pink-500 font-semibold" : "text-gray-400"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {cards[activeTab].featured.map((b) => (
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

        {expanded[activeTab] && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {cards[activeTab].more.map((b) => (
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
        )}

        <button onClick={() => setExpanded((p) => ({ ...p, [activeTab]: !p[activeTab] }))} className="text-sm text-gray-600 hover:text-pink-500 mb-3">
          {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
        </button>

        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">Amount (USD)</h4>
        <div className="flex gap-2 justify-center mb-4">
          {quick.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border transition ${
                Number(amount) === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"
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
export function CheckoutPopup({ total, onClose, plan, setPlan }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">Secure Checkout 💳</h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          Both include your personalized message and instant delivery 💖
        </p>

        <div className="rounded-2xl border p-3 mb-4 bg-gray-50">
          <label className="flex items-start gap-3 cursor-pointer mb-2">
            <input
              type="radio"
              name="plan"
              className="mt-1"
              checked={plan === "signature"}
              onChange={() => setPlan("signature")}
            />
            <div>
              <p className="font-semibold">💎 Signature — $7.99</p>
              <p className="text-sm text-gray-600">
                Dynamic animated experience with photo & motion effects that bring your message to life.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="plan"
              className="mt-1"
              checked={plan === "heartfelt"}
              onChange={() => setPlan("heartfelt")}
            />
            <div>
              <p className="font-semibold">💌 Heartfelt — $3.99</p>
              <p className="text-sm text-gray-600">
                Calm and elegant design for sending warm and meaningful wishes.
              </p>
            </div>
          </label>
        </div>

        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </motion.div>
    </div>
  );
    }
