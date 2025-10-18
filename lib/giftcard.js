"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GiftCardModal({ onclose, onselect, initial }) {
  const [category, setCategory] = useState("Popular");
  const [selected, setSelected] = useState(initial || null);
  const [customOption, setCustomOption] = useState("");
  const [showMore, setShowMore] = useState(false);

  // 💳 Tarjetas por categoría
  const categories = {
    Popular: [
      { name: "Amazon", emoji: "🛒", amount: 25 },
      { name: "Starbucks", emoji: "☕", amount: 15 },
      { name: "Target", emoji: "🎯", amount: 20 },
      { name: "Apple", emoji: "🍎", amount: 25 },
    ],
    Lifestyle: [
      { name: "Sephora", emoji: "💄", amount: 30 },
      { name: "Nike", emoji: "👟", amount: 50 },
      { name: "Uber Eats", emoji: "🍔", amount: 25 },
      { name: "Netflix", emoji: "🎬", amount: 30 },
    ],
    Digital: [
      { name: "Google Play", emoji: "▶️", amount: 20 },
      { name: "Spotify", emoji: "🎵", amount: 15 },
      { name: "Steam", emoji: "🎮", amount: 25 },
      { name: "Xbox", emoji: "🎮", amount: 30 },
    ],
  };

  // 🔍 Manejo de búsqueda y opciones adicionales
  const moreOptions = [
    "Walmart",
    "PlayStation",
    "Etsy",
    "DoorDash",
    "Disney+",
    "Best Buy",
    "AMC Theatres",
    "Shell Gas",
  ];

  const handleSelect = (card) => {
    setSelected(card);
  };

  const handleConfirm = () => {
    if (!selected) return onclose();
    onselect(selected);
  };

  const handleAddCustom = () => {
    if (!customOption.trim()) return;
    const newCard = {
      name: customOption,
      emoji: "💳",
      amount: 20,
    };
    setSelected(newCard);
    setCustomOption("");
    setShowMore(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[950] bg-black/40 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-5 w-full max-w-md shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-700">🎁 Select a Gift Card</h2>
            <button
              onClick={onclose}
              className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around mb-4">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  category === cat
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gift cards grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {categories[category].map((card) => (
              <motion.div
                key={card.name}
                onClick={() => handleSelect(card)}
                whileTap={{ scale: 0.96 }}
                className={`border rounded-2xl p-3 cursor-pointer text-center ${
                  selected?.name === card.name
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <div className="text-3xl mb-1">{card.emoji}</div>
                <div className="font-semibold text-gray-700">{card.name}</div>
                <div className="text-sm text-gray-500">${card.amount}</div>
              </motion.div>
            ))}
          </div>

          {/* 🔽 Más opciones */}
          {!showMore ? (
            <button
              onClick={() => setShowMore(true)}
              className="w-full bg-gray-100 py-2 rounded-xl text-gray-600 hover:bg-gray-200 mb-3"
            >
              🔍 More Options
            </button>
          ) : (
            <div className="mb-3">
              <select
                onChange={(e) => setCustomOption(e.target.value)}
                value={customOption}
                className="w-full border rounded-xl p-2 text-gray-700"
              >
                <option value="">Select a store</option>
                {moreOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCustom}
                className="mt-2 w-full bg-pink-500 text-white font-semibold py-2 rounded-xl hover:bg-pink-600"
              >
                ➕ Add Gift Card
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setSelected(null);
                onselect(null);
              }}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Remove
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
                 }
