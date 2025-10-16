// /lib/giftcard.js
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Props:
 * - open (bool)
 * - initial {brand, amount}
 * - onClose()
 * - onSelect({brand, amount})
 */
export default function GiftCardPopup({ open, initial, onClose, onSelect }) {
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

  if (!open) return null;

  const done = () => {
    if (!brand || !Number(amount)) return alert("Please select a brand and amount.");
    onSelect?.({ brand, amount: Number(amount) });
  };

  return (
    <div className="fixed inset-0 z-[115] bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600" aria-label="Close gift cards">✕</button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>

        {/* Tabs */}
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

        {/* Featured */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {cards[activeTab].featured.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 px-3 text-sm ${brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* More */}
        {expanded[activeTab] && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {cards[activeTab].more.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`border rounded-xl py-2 px-3 text-sm ${brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded((p) => ({ ...p, [activeTab]: !p[activeTab] }))}
          className="text-sm text-gray-600 hover:text-pink-500 mb-3"
        >
          {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
        </button>

        {/* Amount */}
        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">Amount (USD)</h4>
        <div className="flex gap-2 justify-center mb-4">
          {quick.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border transition ${Number(amount) === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"}`}
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
