"use client";
import { useState, useEffect } from "react";

const items = [
  { title: "Anniversary", color: "bg-purple-200", icon: "💍" },
  { title: "Baby", color: "bg-blue-200", icon: "👶" },
  { title: "Love", color: "bg-pink-200", icon: "❤️" },
  { title: "Graduation", color: "bg-green-200", icon: "🎓" },
  { title: "Condolences", color: "bg-gray-200", icon: "🕊️" },
  { title: "Birthday", color: "bg-yellow-200", icon: "🎂" },
  { title: "Gifts", color: "bg-orange-200", icon: "🎁" },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000); // transición lenta
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full flex flex-col items-center mt-8">
      {/* Carrusel */}
      <div className="flex items-center justify-center space-x-4 transition-all duration-700 ease-in-out">
        {items.map((item, i) => {
          let position = "scale-75 opacity-50";
          if (i === index) position = "scale-100 opacity-100 z-10";
          else if (i === (index - 1 + items.length) % items.length || i === (index + 1) % items.length) {
            position = "scale-90 opacity-80";
          }

          return (
            <div
              key={i}
              className={`transition-all duration-700 ease-in-out w-40 h-52 md:w-56 md:h-72 rounded-2xl shadow-lg flex flex-col items-center justify-center ${item.color} ${position}`}
            >
              <span className="text-4xl">{item.icon}</span>
              <p className="mt-2 text-base md:text-lg font-semibold">{item.title}</p>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex mt-4 space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-pink-500" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
