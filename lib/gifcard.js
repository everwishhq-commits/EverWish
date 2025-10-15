"use client";

import { useState } from "react";

/**
 * GiftCardPopup
 * - Aparece SOBRE TODO (z-[80]) para que nunca quede detrás del media.
 * - Devuelve { brand, amount } en onSelect()
 * - Botón “Change / 🗑️” lo manejas desde Checkout usando el mismo objeto.
 */
export default function GiftCardPopup({ onClose, onSelect, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [active, setActive] = useState("Popular");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  const CARDS = {
    Popular: {
      featured: ["Amazon", "Walmart", "Target", "Starbucks"],
      more: ["Apple", "Best Buy", "Disney+", "Home Depot"],
    },
    Lifestyle: {
      featured: ["Nike", "H&M", "Zara", "Sephora"],
      more: ["Etsy", "Bath & Body Works", "Ulta", "Adidas"],
    },
    Digital: {
      featured: ["Google Play", "Spotify", "Netflix", "Xbox"],
      more: ["PlayStation", "Steam", "Roblox", "Disney+"],
    },
  };

  const AMOUNTS = [10, 25, 50, 100];

  const done = () => {
    if (!brand || !amount) {
      alert("Choose a brand and an amount.");
      return;
    }
    onSelect({ brand, amount: Number(amount) });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-[92%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          aria-label="Close gift card"
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
          Choose a Gift Card 🎁
        </h3>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`pb-1 ${
                active === t
                  ? "text-pink-500 border-b-2 border-pink-500 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Brands */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {CARDS[active].featured.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 px-3 text-sm transition ${
                brand === b
                  ? "bg-pink-100 border-pink-400 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {CARDS[active].more.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 px-3 text-sm transition ${
                brand === b
                  ? "bg-pink-100 border-pink-400 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Amounts */}
        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">
          Amount (USD)
        </h4>
        <div className="flex gap-2 justify-center mb-5">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border transition ${
                Number(amount) === a
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
          className="w-full rounded-full py-3 font-semibold text-white bg-pink-500 hover:bg-pink-600 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
