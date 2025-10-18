"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [amount, setAmount] = useState(initial?.amount || 0);
  const [store, setStore] = useState(initial?.store || "Amazon");

  const handleConfirm = () => {
    if (amount > 0) {
      onSelect({ store, amount });
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-[90%] max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
          🎁 Add a Gift Card
        </h2>

        <div className="space-y-3">
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full rounded-xl border p-3 text-gray-600 focus:border-pink-400 focus:ring-pink-400"
          >
            <option>Amazon</option>
            <option>Target</option>
            <option>Starbucks</option>
            <option>Walmart</option>
            <option>Apple</option>
          </select>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border p-3 text-gray-600 focus:border-pink-400 focus:ring-pink-400"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-full bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
