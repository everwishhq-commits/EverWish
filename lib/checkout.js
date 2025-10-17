// /lib/checkout.js
"use client";
import { useState } from "react";

export default function CheckoutModal({ onClose, giftCards = [], onConfirm }) {
  const [plan, setPlan] = useState("heartfelt");

  const plans = {
    heartfelt: {
      name: "Heartfelt",
      price: 3.99,
      desc: "A calm, elegant card with a static image and personalized text.",
      includes: "Static image + text + optional gift card.",
    },
    signature: {
      name: "Signature",
      price: 7.99,
      desc: "A premium animated experience that brings your message to life.",
      includes:
        "Animation + custom photo + text + gift card + download option.",
    },
  };

  const total =
    plans[plan].price +
    giftCards.reduce((sum, g) => sum + parseFloat(g.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-4 w-80 shadow-lg text-center">
        <h2 className="font-bold text-xl mb-3">💝 Checkout</h2>

        <div className="flex justify-around mb-3">
          {Object.keys(plans).map((key) => (
            <button
              key={key}
              onClick={() => setPlan(key)}
              className={`px-3 py-1 rounded-full ${
                plan === key ? "bg-purple-500 text-white" : "bg-gray-200"
              }`}
            >
              {plans[key].name} – ${plans[key].price.toFixed(2)}
            </button>
          ))}
        </div>

        <p className="text-gray-700 text-sm mb-1">{plans[plan].desc}</p>
        <p className="text-gray-500 text-xs mb-3">{plans[plan].includes}</p>

        {giftCards.length > 0 && (
          <div className="bg-pink-100 p-2 rounded-xl text-left text-sm mb-3">
            {giftCards.map((g, i) => (
              <div key={i} className="flex justify-between">
                <span>🎁 {g.name}</span>
                <span>${g.amount}</span>
              </div>
            ))}
          </div>
        )}

        <p className="font-semibold mb-3">
          Total: <span className="text-pink-600">${total.toFixed(2)}</span>
        </p>

        <button
          onClick={() => onConfirm(plan)}
          className="w-full bg-purple-600 text-white py-2 rounded-xl font-medium"
        >
          Pay ${total.toFixed(2)}
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
