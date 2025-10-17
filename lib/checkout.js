// lib/checkout.js
"use client";
import { useMemo, useState } from "react";

const PLANS = {
  heartfelt: {
    key: "heartfelt",
    price: 3.99,
    title: "💖 Heartfelt — $3.99",
    description:
      "Heartfelt Photo Card — A static image version filled with warmth and positive energy.",
    allows: { animation: false, photo: false, giftcard: true },
  },
  signature: {
    key: "signature",
    price: 7.99,
    title: "💎 Signature — $7.99",
    description:
      "A dynamic animated experience with motion, photo, and effects that bring your message to life.",
    allows: { animation: true, photo: true, giftcard: true },
  },
};

export default function CheckoutModal({
  total,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [plan, setPlan] = useState("signature");

  const subtotal = useMemo(() => {
    const base = PLANS[plan].price;
    const giftAmt = gift?.amount || 0;
    return (base + giftAmt).toFixed(2);
  }, [plan, gift]);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">💜 Checkout</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Plan selector */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setPlan("signature")}
            className={`flex-1 rounded-full px-4 py-3 font-semibold ${plan === "signature" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Animated — $7.99
          </button>
          <button
            onClick={() => setPlan("heartfelt")}
            className={`flex-1 rounded-full px-4 py-3 font-semibold ${plan === "heartfelt" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Heartfelt — $3.99
          </button>
        </div>

        <p className="text-gray-700 mb-4">{PLANS[plan].description}</p>

        {/* Gift card summary */}
        {gift ? (
          <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 mb-4">
            <div>🎁 {gift.brand} — ${gift.amount}</div>
            <button onClick={onGiftRemove} className="text-pink-600 underline">Remove</button>
          </div>
        ) : (
          <button onClick={onGiftChange} className="underline text-pink-600 mb-4">
            + Add Gift Card
          </button>
        )}

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>${subtotal}</span>
        </div>

        <button className="mt-5 w-full rounded-full bg-purple-600 px-5 py-3 font-semibold text-white">
          Confirm & Pay ${subtotal}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Payments are secure and encrypted.
        </p>
      </div>
    </div>
  );
              }
