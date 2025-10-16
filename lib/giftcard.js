"use client";
import React, { useState } from "react";

export function GiftCardPopup({ selected, onSelect, onClose }) {
  const cards = [
    { id: 1, name: "Amazon", amount: 10 },
    { id: 2, name: "Target", amount: 25 },
    { id: 3, name: "Starbucks", amount: 15 },
  ];

  const [chosen, setChosen] = useState(selected);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-5 shadow-xl w-80">
        <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">
          Choose a Gift Card 🎁
        </h2>
        <div className="space-y-2">
          {cards.map((c) => (
            <div
              key={c.id}
              onClick={() => setChosen(c)}
              className={`border rounded-lg p-2 cursor-pointer text-center ${
                chosen?.id === c.id
                  ? "bg-yellow-100 border-yellow-400"
                  : "hover:bg-gray-100"
              }`}
            >
              {c.name} - ${c.amount}
            </div>
          ))}
        </div>

        {chosen && (
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">
              Selected: {chosen.name} (${chosen.amount})
            </span>
            <button
              onClick={() => setChosen(null)}
              className="text-red-500 text-xs underline"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(chosen);
              onClose();
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
