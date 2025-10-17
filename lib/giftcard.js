"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [tab, setTab] = useState("Digital");
  const [brand, setBrand] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  const tabs = ["Popular", "Lifestyle", "Digital"];

  const options = {
    Popular: ["Amazon", "Target", "Walmart", "Visa"],
    Lifestyle: ["Starbucks", "Sephora", "Nike", "Uber"],
    Digital: ["Google Play", "Spotify", "Netflix", "Xbox"],
  };

  const amounts = [10, 25, 50, 100];

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-[90%] max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Choose a Gift Card
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 🔹 Tabs */}
        <div className="flex justify-around border-b mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 🔹 Brand Options */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {options[tab].map((name) => (
            <button
              key={name}
              onClick={() => setBrand(name)}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                brand === name
                  ? "border-pink-500 bg-pink-50 text-pink-600"
                  : "border-gray-200 hover:border-pink-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* 🔹 Amounts */}
        <p className="text-sm font-medium text-gray-700 mb-2">
          Amount (USD)
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
                amount === a
                  ? "border-pink-500 bg-pink-50 text-pink-600"
                  : "border-gray-200 hover:border-pink-200"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        {/* 🔹 Confirm Button */}
        <button
          onClick={() => onSelect({ name: brand, amount })}
          disabled={!brand || !amount}
          className={`w-full rounded-full py-3 font-semibold text-white transition ${
            brand && amount
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
          }
