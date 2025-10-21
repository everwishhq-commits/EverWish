"use client";
import { useEffect, useState } from "react";

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
  "The animations make it stand out from other sites."
];

const dummyNames = [
  "Sophia R.", "Michael T.", "Emma L.", "Daniel K.",
  "Olivia M.", "Liam J.", "Isabella W.", "Ethan B.",
  "Ava C.", "James H.", "Mia S.", "Noah P."
];

// función para generar fecha reciente (últimos 10 días)
function getRandomDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 10); 
  const newDate = new Date(today.setDate(today.getDate() - daysAgo));
  return newDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// genera un review aleatorio
function generateReview() {
  return {
    text: dummyTexts[Math.floor(Math.random() * dummyTexts.length)],
    author: dummyNames[Math.floor(Math.random() * dummyNames.length)],
    stars: Math.floor(Math.random() * 2) + 4, // 4 o 5 estrellas para parecer positivo
    date: getRandomDate(),
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // genera 5 reviews aleatorios cada carga
    const generated = Array.from({ length: 5 }, generateReview);
    setReviews(generated.sort((a, b) => b.stars - a.stars)); // ⭐ ordenados por puntuación
  }, []);

  return (
    <div className="bg-pink-50 rounded-3xl py-12 px-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6">What people say</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 text-sm text-gray-700"
          >
            <div className="flex mb-2">
              {Array.from({ length: review.stars }).map((_, idx) => (
                <span key={idx} className="text-yellow-500">★</span>
              ))}
              {Array.from({ length: 5 - review.stars }).map((_, idx) => (
                <span key={idx} className="text-gray-300">★</span>
              ))}
            </div>
            <p className="italic">"{review.text}"</p>
            <p className="mt-2 font-semibold text-gray-900">- {review.author}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition">
          See more reviews
        </button>
      </div>
    </div>
  );
}
