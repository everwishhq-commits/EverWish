"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * GiftCardPopup.js
 * Modal para seleccionar o editar el valor del regalo 🎁
 */
export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [amount, setAmount] = useState(initial?.amount || 0);

  // Bloquear scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-6 shadow-2xl w-[90%] max-w-md text-center border border-pink-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🎁 Título */}
        <h3 className="text-xl font-semibold mb-2 text-pink-600">
          Add a Gift Card
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Choose how much you’d like to include in your Everwish.
        </p>

        {/* 💵 Input de cantidad */}
        <div className="relative mb-6">
          <span className="absolute left-1/2 -translate-x-[140%] top-3 text-gray-400 font-medium">
            $
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-2/3 rounded-full border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 p-3 text-center text-gray-700 font-semibold text-lg shadow-sm"
          />
        </div>

        {/* 🔘 Botones */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect({ amount })}
            disabled={amount <= 0}
            className={`rounded-full px-6 py-2 font-semibold text-white transition ${
              amount > 0
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
