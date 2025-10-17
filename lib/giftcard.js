// /lib/giftcard.js
"use client";
import { useState } from "react";

const cards = {
  digital: ["Google Play", "Spotify", "Netflix", "Xbox", "Amazon", "Apple"],
  lifestyle: ["Sephora", "Starbucks", "IKEA", "Nike", "Adidas"],
  popular: ["Target", "Walmart", "Visa", "Uber Eats"],
};

export default function GiftCardModal({ onClose, onSelect }) {
  const [tab, setTab] = useState("digital");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const toggleSelect = (c) => {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const visible = cards[tab].filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-4 rounded-2xl w-80 text-center shadow-lg">
        <h2 className="font-semibold text-lg mb-2">Choose a Gift Card</h2>
        <div className="flex justify-around mb-2">
          {Object.keys(cards).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full ${
                tab === t ? "bg-pink-200" : "bg-gray-100"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="More options..."
          className="border rounded-lg px-2 py-1 w-full mb-2 text-sm"
        />

        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {visible.map((c) => (
            <button
              key={c}
              onClick={() => toggleSelect(c)}
              className={`border px-3 py-1 rounded-full text-sm ${
                selected.includes(c)
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          disabled={!selected.length}
          onClick={() => onSelect(selected)}
          className={`w-full py-2 rounded-xl text-white ${
            selected.length ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          Done
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-gray-500 text-sm underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
