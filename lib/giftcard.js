// lib/giftcard.js
// Modal de Gift Card con 3 pestañas (Popular / Lifestyle / Digital)

import { useState } from "react";
import { motion } from "framer-motion";

const CARDS = {
  Popular: {
    featured: ["Amazon", "Walmart", "Target"],
    more: ["Apple", "Best Buy", "Starbucks"],
  },
  Lifestyle: {
    featured: ["Nike", "H&M", "Zara"],
    more: ["Shein", "Etsy", "Bath & Body Works"],
  },
  Digital: {
    featured: ["Google Play", "Spotify", "Netflix"],
    more: ["Xbox", "PlayStation", "Disney+"],
  },
};

const QUICK = [10, 25, 50, 100];

export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [active, setActive] = useState("Popular");
  const [expand, setExpand] = useState(false);
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  const done = () => {
    if (!brand || !Number(amount)) {
      alert("Please select a brand and amount.");
      return;
    }
    onSelect?.({ brand, amount: Number(amount) });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-11/12 max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close gift cards"
        >
          ✕
        </button>

        <h3 className="mb-4 text-center text-xl font-bold text-pink-600">
          Choose a Gift Card 🎁
        </h3>

        {/* Tabs */}
        <div className="mb-4 flex justify-center gap-6">
          {Object.keys(CARDS).map((t) => (
            <button
              key={t}
              onClick={() => {
                setActive(t);
                setExpand(false);
              }}
              className={`pb-1 ${
                active === t
                  ? "border-b-2 border-pink-500 font-semibold text-pink-500"
                  : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div className="mb-3 grid grid-cols-2 gap-3">
          {CARDS[active].featured.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`rounded-xl border px-3 py-2 text-sm ${
                brand === b
                  ? "border-pink-400 bg-pink-100 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* More */}
        {expand && (
          <div className="mb-3 grid grid-cols-2 gap-3">
            {CARDS[active].more.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  brand === b
                    ? "border-pink-400 bg-pink-100 text-pink-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpand((v) => !v)}
          className="mb-3 text-sm text-gray-600 hover:text-pink-500"
        >
          {expand ? "Hide more ▲" : "More gift cards ▼"}
        </button>

        {/* Amount */}
        <h4 className="mb-2 text-center text-sm font-semibold text-gray-600">
          Amount (USD)
        </h4>
        <div className="mb-4 flex justify-center gap-2">
          {QUICK.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-lg border px-3 py-1 transition ${
                Number(amount) === a
                  ? "border-pink-500 bg-pink-100 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        <button
          onClick={done}
          className="w-full rounded-full bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
          }
