"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const dummyTexts = [
  "Loved how easy it was to send my card instantly.",
  "The personalization options were amazing!",
  "Quick and smooth checkout – will definitely use again.",
  "Best e-card platform I’ve tried so far.",
  "I shared my message online in seconds – loved it!",
  "Beautiful templates and super fast delivery.",
  "It felt special even though it was digital!",
  "Easy to use and the recipient was delighted.",
  "Perfect for birthdays and celebrations.",
  "The animations make it stand out from other sites.",
];

const dummyNames = [
  "Sophia R.",
  "Michael T.",
  "Emma L.",
  "Daniel K.",
  "Olivia M.",
  "Liam J.",
  "Isabella W.",
  "Ethan B.",
  "Ava C.",
  "James H.",
  "Mia S.",
  "Noah P.",
];

// 📅 Fecha aleatoria de los últimos 10 días
function getRandomDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 10);
  const newDate = new Date(today.setDate(today.getDate() - daysAgo));
  return newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// 🧩 Generador de reseñas
function generateReview() {
  return {
    text: dummyTexts[Math.floor(Math.random() * dummyTexts.length)],
    author: dummyNames[Math.floor(Math.random() * dummyNames.length)],
    stars: Math.floor(Math.random() * 2) + 4,
    date: getRandomDate(),
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, generateReview);
    setReviews(generated.sort((a, b) => b.stars - a.stars));
  }, []);

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <section className="bg-gradient-to-b from-pink-50 to-white rounded-3xl py-14 px-6 shadow-sm text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
        💬 What people say
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {visibleReviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700 border border-pink-100 hover:shadow-lg transition"
          >
            {/* ⭐ Estrellas */}
            <div className="flex justify-center mb-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`${
                    idx < review.stars ? "text-yellow-400" : "text-gray-300"
                  } text-lg`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* 🗣️ Texto */}
            <p className="italic leading-relaxed">“{review.text}”</p>

            {/* 👤 Autor */}
            <p className="mt-3 font-semibold text-gray-900">
              – {review.author}
            </p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔘 Ver más */}
      {visibleCount < reviews.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition text-sm font-semibold"
          >
            See more reviews
          </button>
        </div>
      )}
    </section>
  );
              }
