// /lib/giftcard.js
"use client";
import { useState } from "react";

const cards = {
  popular: ["Amazon", "Target", "Starbucks", "Visa", "Walmart"],
  digital: ["Spotify", "Netflix", "Apple", "Google Play"],
  fashion: ["Nike", "Adidas", "Sephora", "H&M", "IKEA"],
};

export default function GiftCardModal({ onClose, onSelect }) {
  const [tab, setTab] = useState("popular");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const toggleSelect = (c) => {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const filtered = cards[tab].filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center">
      <div className="bg-white rounded-2xl w-80 p-4 shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-2">Choose a Gift Card</h2>
        <div className="flex justify-around mb-3">
          {Object.keys(cards).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-3 py-1 rounded-full ${
                tab === k ? "bg-pink-500 text-white" : "bg-gray-100"
              }`}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-2 py-1 mb-3 text-sm"
        />

        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {filtered.map((c) => (
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
          onClick={() =>
            onSelect(selected.map((name) => ({ name, amount: 50 })))
          }
          className={`w-full py-2 rounded-xl text-white ${
            selected.length ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          Add Selected
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
