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
  "Sophia R.", "Michael T.", "Emma L.", "Daniel K.",
  "Olivia M.", "Liam J.", "Isabella W.", "Ethan B.",
  "Ava C.", "James H.", "Mia S.", "Noah P.",
];

// 🗓️ Fecha aleatoria de los últimos 10 días
function getRandomDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 10);
  const date = new Date(today.setDate(today.getDate() - daysAgo));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// 🪶 Genera un review aleatorio
function generateReview() {
  return {
    text: dummyTexts[Math.floor(Math.random() * dummyTexts.length)],
    author: dummyNames[Math.floor(Math.random() * dummyNames.length)],
    stars: Math.floor(Math.random() * 2) + 4, // ⭐ 4 o 5
    date: getRandomDate(),
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const initial = Array.from({ length: 5 }, generateReview);
    setReviews(initial.sort((a, b) => b.stars - a.stars));
  }, []);

  // ➕ Añadir más reseñas sin recargar
  const addMore = () => {
    const more = Array.from({ length: 3 }, generateReview);
    setReviews((prev) => [...prev, ...more]);
  };

  return (
    <section className="bg-gradient-to-b from-pink-50 to-white rounded-3xl py-12 px-5 shadow-inner border border-pink-100 mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        💬 What People Are Saying
      </h2>

      {/* 💫 Grid responsiva con scroll en móvil */}
      <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory px-2 md:px-0">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="min-w-[250px] md:min-w-0 snap-center bg-white rounded-2xl shadow-md p-6 border border-pink-100"
          >
            {/* ⭐ Estrellas */}
            <div className="flex mb-2">
              {Array.from({ length: r.stars }).map((_, idx) => (
                <span key={idx} className="text-yellow-400 text-lg">★</span>
              ))}
              {Array.from({ length: 5 - r.stars }).map((_, idx) => (
                <span key={idx} className="text-gray-300 text-lg">★</span>
              ))}
            </div>

            {/* 📝 Texto */}
            <p className="italic text-gray-700">“{r.text}”</p>
            <p className="mt-3 font-semibold text-gray-900">– {r.author}</p>
            <p className="text-xs text-gray-500">{r.date}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔘 Botón para más reseñas */}
      <div className="flex justify-center mt-8">
        <button
          onClick={addMore}
          className="px-6 py-2.5 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition font-semibold"
        >
          See more reviews
        </button>
      </div>
    </section>
  );
                                                       }
