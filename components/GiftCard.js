"use client";
import { useState } from "react";

/**
 * 🎁 GiftCardPopup.js
 * Permite seleccionar el valor del regalo y confirmar.
 */
export default function GiftCardPopup({ initial, onSelect, onClose }) {
  const [amount, setAmount] = useState(initial?.amount || 0);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 0) setAmount(val);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md text-center">
        <h3 className="text-lg font-semibold mb-3 text-pink-600">
          🎁 Add a Gift Card
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the amount you want to include.
        </p>

        <input
          type="number"
          min="0"
          step="0.01"
          className="w-2/3 rounded-xl border p-3 text-center text-gray-700 mb-4 focus:ring-2 focus:ring-pink-300"
          value={amount}
          onChange={handleChange}
        />

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSelect({ amount })}
            className="rounded-full bg-pink-500 px-6 py-2 font-semibold text-white hover:bg-pink-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
              }
