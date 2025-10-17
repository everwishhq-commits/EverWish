// /lib/checkout.js
"use client";
import { useState } from "react";

export default function CheckoutModal({ onClose, giftCards = [], onConfirm }) {
  const [plan, setPlan] = useState("heartfelt");

  const plans = {
    heartfelt: {
      name: "Heartfelt",
      price: 3.99,
      desc: "A calm, elegant design for sending warm and meaningful wishes.",
      includes: "Static image, editable text, optional gift card.",
    },
    signature: {
      name: "Signature",
      price: 7.99,
      desc: "A dynamic animated experience with motion, photo, and effects that bring your message to life.",
      includes:
        "Animation, custom photo, editable text, optional gift card and download.",
    },
  };

  const total =
    plans[plan].price +
    giftCards.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-80 p-4 shadow-xl text-center">
        <h2 className="text-xl font-bold mb-3">💝 Checkout</h2>

        <div className="flex justify-around mb-3">
          {Object.keys(plans).map((key) => (
            <button
              key={key}
              onClick={() => setPlan(key)}
              className={`px-3 py-1 rounded-full font-medium ${
                plan === key ? "bg-pink-500 text-white" : "bg-gray-100"
              }`}
            >
              {plans[key].name} — ${plans[key].price.toFixed(2)}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-700 mb-2">{plans[plan].desc}</p>
        <p className="text-xs text-gray-500 mb-4">{plans[plan].includes}</p>

        {giftCards.length > 0 && (
          <div className="bg-pink-100 rounded-xl p-2 mb-3 text-sm text-left">
            {giftCards.map((g, i) => (
              <div
                key={i}
                className="flex justify-between items-center mb-1 last:mb-0"
              >
                <span>🎁 {g.name}</span>
                <span>${g.amount}</span>
              </div>
            ))}
          </div>
        )}

        <div className="font-semibold text-gray-800 mb-3">
          Total: <span className="text-pink-600">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => onConfirm(plan)}
          className="bg-purple-600 text-white w-full py-2 rounded-xl font-medium"
        >
          Confirm & Pay ${total.toFixed(2)}
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
                }
