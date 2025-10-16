// /lib/checkout.js
"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

/**
 * PLANES:
 * - Heartfelt — $3.99 (estático)
 * - Signature — $7.99 (animaciones + motion + foto)
 */
export const PLANS = [
  {
    id: "heartfelt",
    name: "Heartfelt",
    price: 3.99,
    blurb: "A classic greeting — still beautiful.",
    includes: ["Animated media preview (MP4 still)", "Custom text"],
    excludes: ["Floating animations", "User photo overlay motion"],
  },
  {
    id: "signature",
    name: "Signature",
    price: 7.99,
    blurb: "Our premium, full-motion experience.",
    includes: ["Floating animations", "Custom text", "Optional user photo"],
    excludes: [],
  },
];

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

      if (result.error) {
        alert(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("🎉 Payment successful!");
        onSuccess?.();
      }
    } catch (err) {
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

/**
 * Props:
 * - open
 * - planId ('heartfelt' | 'signature')
 * - setPlanId(fn)
 * - gift {brand, amount}
 * - onGiftChange()
 * - onGiftRemove()
 * - onClose()
 */
export default function CheckoutPopup({
  open,
  planId,
  setPlanId,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });

  if (!open) return null;

  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];
  const cardPrice = plan.price;
  const total = cardPrice + Number(gift?.amount || 0);

  return (
    <div className="fixed inset-0 z-[115] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600" aria-label="Close checkout">
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">Secure Checkout 💜</h3>
        <p className="text-center text-sm text-gray-500 mb-4">Your information is encrypted and processed safely.</p>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlanId(p.id)}
              className={`rounded-2xl border p-3 text-left ${planId === p.id ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{p.name}</span>
                <span className="text-pink-600 font-semibold">${p.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{p.blurb}</p>
            </button>
          ))}
        </div>

        {/* Sender / Recipient */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Sender <span className="text-pink-500">*</span></p>
            <input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" value={sender.name} onChange={(e) => setSender({ ...sender, name: e.target.value })} />
            <input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" value={sender.email} onChange={(e) => setSender({ ...sender, email: e.target.value })} />
            <input placeholder="Phone" className="w-full rounded-xl border p-3" value={sender.phone} onChange={(e) => setSender({ ...sender, phone: e.target.value })} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Recipient <span className="text-pink-500">*</span></p>
            <input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" value={recipient.name} onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} />
            <input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" value={recipient.email} onChange={(e) => setRecipient({ ...recipient, email: e.target.value })} />
            <input placeholder="Phone" className="w-full rounded-xl border p-3" value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} />
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
          <p className="font-semibold mb-2">Order summary</p>

          <div className="flex justify-between">
            <span>Everwish Card — {PLANS.find(p=>p.id===planId)?.name || "Signature"}</span>
            <span>${cardPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span>
              Gift Card {gift?.brand ? `(${gift.brand} $${Number(gift.amount || 0)})` : "(none)"}
            </span>
            <div className="flex items-center gap-3">
              {gift?.brand ? (
                <>
                  <button onClick={onGiftChange} className="text-pink-600 hover:underline">Change</button>
                  <button onClick={onGiftRemove} className="text-gray-500 hover:text-red-500" title="Remove gift card">🗑️</button>
                </>
              ) : (
                <button onClick={onGiftChange} className="text-pink-600 hover:underline">Add</button>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe */}
        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </div>
    </div>
  );
    }
