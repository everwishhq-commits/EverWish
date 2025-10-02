"use client";
import { useState, useEffect } from "react";

const cards = [
  { title: "Birthday", color: "bg-pink-200", emoji: "🎂" },
  { title: "Anniversary", color: "bg-purple-200", emoji: "💍" },
  { title: "Baby", color: "bg-blue-200", emoji: "👶" },
  { title: "Love", color: "bg-red-200", emoji: "❤️" },
  { title: "Graduation", color: "bg-green-200", emoji: "🎓" },
  { title: "Condolences", color: "bg-gray-200", emoji: "🕊️" },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % cards.length);
    }, 3000); // transición lenta 3s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center justify-center space-x-4">
        {cards.map((card, i) => {
          const isActive = i === current;
          const isPrev = i === (current - 1 + cards.length) % cards.length;
          const isNext = i === (current + 1) % cards.length;

          let scale = "scale-90 opacity-50";
          if (isActive) scale = "scale-110 opacity-100 z-10";
          else if (isPrev || isNext) scale = "scale-95 opacity-80";

          return (
            <div
              key={i}
              className={`${card.color} rounded-2xl shadow-lg p-10 transition-all duration-700 ${scale}`}
            >
              <div className="text-5xl mb-4">{card.emoji}</div>
              <p className="font-semibold text-lg">{card.title}</p>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-2 mt-4">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === current ? "bg-pink-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
