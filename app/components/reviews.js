"use client";

import { useState } from "react";

const reviews = [
  { text: "Everwish made my day truly special!", author: "Sophia R.", rating: 5 },
  { text: "Such a simple way to send love instantly.", author: "Michael T.", rating: 4 },
  { text: "Beautiful cards and smooth experience.", author: "Emma L.", rating: 5 },
  { text: "Fast and easy, loved the design!", author: "Daniel K.", rating: 4 },
  { text: "Great variety of cards, will use again!", author: "Laura P.", rating: 5 },
];

export default function Reviews() {
  const [visibleCount, setVisibleCount] = useState(3);

  return (
    <div className="bg-pink-50 rounded-3xl py-12 px-6 shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">What people say</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.slice(0, visibleCount).map((review, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 text-sm text-gray-700 text-center"
          >
            {/* ⭐ Estrellas con emoji */}
            <div className="flex justify-center mb-3">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-lg ${
                    index < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="italic">"{review.text}"</p>
            <p className="mt-2 font-semibold text-gray-900">- {review.author}</p>
          </div>
        ))}
      </div>

      {/* 📌 Botón Ver más */}
      {visibleCount < reviews.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount(reviews.length)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium transition"
          >
            View more reviews
          </button>
        </div>
      )}

      {/* 📝 Placeholder para comentarios futuros */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>✨ Soon you’ll be able to share your own experience here.</p>
      </div>
    </div>
  );
}
