// lib/giftcard.js
"use client";
import { useState } from "react";

const CATEGORIES = ["Popular", "Lifestyle", "Digital"];
const OPTIONS = {
  Popular: ["Amazon", "Starbucks", "Target", "Walmart"],
  Lifestyle: ["Uber", "DoorDash", "Nike", "Adidas"],
  Digital: ["Google Play", "Spotify", "Netflix", "Xbox"],
};
const AMOUNTS = [10, 25, 50, 100];

export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [tab, setTab] = useState("Digital");
  const [brand, setBrand] = useState(initial?.brand || null);
  const [amount, setAmount] = useState(initial?.amount || null);

  const canDone = brand && amount;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Choose a Gift Card</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="flex gap-6 border-b mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`py-2 ${tab === c ? "text-pink-600 border-b-2 border-pink-500" : "text-gray-500"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {OPTIONS[tab].map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`rounded-xl border px-4 py-3 ${brand === b ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}
            >
              {b}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-2">Amount (USD)</p>
        <div className="flex flex-wrap gap-3 mb-5">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl border px-4 py-2 ${amount === a ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}
            >
              ${a}
            </button>
          ))}
        </div>

        <button
          disabled={!canDone}
          onClick={() => onSelect({ brand, amount })}
          className={`w-full rounded-full px-5 py-3 font-semibold text-white ${canDone ? "bg-pink-500" : "bg-gray-300"}`}
        >
          Done
        </button>
      </div>
    </div>
  );
                }
