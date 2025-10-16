// 📄 lib/checkout.js
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// =========================
// 🔹 Inline Stripe Form
// =========================
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
      console.error(err);
      alert("Payment failed. Please try again.");
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

// =========================
// 🔹 Checkout Modal
// =========================
export default function CheckoutPopup({
  totalBase = 7.99,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });
  const [plan, setPlan] = useState("Signature");
  const [price, setPrice] = useState(totalBase);

  const handlePlan = (type) => {
    setPlan(type);
    setPrice(type === "Heartfelt" ? 3.99 : 7.99);
  };

  const total = price + (gift?.amount || 0);

  return (
    <div className="fixed inset-0 bg-black/70 z-[9997] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative overflow-y-auto max-h-[90vh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close checkout"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">
          Secure Checkout 💜
        </h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          Your information is encrypted and processed safely.
        </p>

        {/* Sender & Recipient */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Sender <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.name}
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.email}
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={sender.phone}
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Recipient <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.email}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={recipient.phone}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4" />

        {/* Plan Selection */}
        <h4 className="text-center font-semibold text-gray-700 mb-3">
          Choose your Card Edition 💫
        </h4>
        <div className="flex gap-3 justify-center mb-4">
          <button
            onClick={() => handlePlan("Heartfelt")}
            className={`px-4 py-2 rounded-full border font-medium transition ${
              plan === "Heartfelt"
                ? "bg-pink-100 border-pink-500 text-pink-600"
                : "border-gray-300 hover:bg-gray-100 text-gray-600"
            }`}
          >
            💗 Heartfelt — $3.99
          </button>
          <button
            onClick={() => handlePlan("Signature")}
            className={`px-4 py-2 rounded-full border font-medium transition ${
              plan === "Signature"
                ? "bg-purple-100 border-purple-500 text-purple-600"
                : "border-gray-300 hover:bg-gray-100 text-gray-600"
            }`}
          >
            ✨ Signature — $7.99
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 border-t pt-3 text-gray-700 text-sm">
          <p className="font-semibold mb-1">Order summary</p>

          <div className="flex justify-between">
            <span>{plan} Edition Card</span>
            <span>${price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span>
              Gift Card{" "}
              {gift?.brand ? `(${gift.brand} $${Number(gift.amount || 0)})` : "(none)"}
            </span>
            <div className="flex items-center gap-3">
              {gift?.brand ? (
                <>
                  <button onClick={onGiftChange} className="text-pink-600 hover:underline">
                    Change
                  </button>
                  <button
                    onClick={onGiftRemove}
                    className="text-gray-500 hover:text-red-500"
                    title="Remove gift card"
                  >
                    🗑️
                  </button>
                </>
              ) : (
                <button onClick={onGiftChange} className="text-pink-600 hover:underline">
                  Add
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

        {/* Stripe */}
        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </motion.div>
    </div>
  );
}
