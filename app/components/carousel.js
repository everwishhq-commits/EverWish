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

  // Auto slide cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (i) => setIndex(i);

  return (
    <div className="relative w-full flex flex-col items-center mt-6">
      {/* Carrusel */}
      <div className="relative h-64 w-full flex items-center justify-center overflow-hidden">
        {items.map((item, i) => {
          const offset = (i - index + items.length) % items.length;
          let style =
            "absolute transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center rounded-2xl shadow-md";

          // central
          if (offset === 0) {
            style +=
              " w-48 h-64 scale-110 z-20 opacity-100 shadow-xl bg-white";
          }
          // derecha inmediata
          else if (offset === 1) {
            style +=
              " w-40 h-56 translate-x-44 scale-90 z-10 opacity-80";
          }
          // izquierda inmediata
          else if (offset === items.length - 1) {
            style +=
              " w-40 h-56 -translate-x-44 scale-90 z-10 opacity-80";
          } else {
            style += " opacity-0 scale-75";
          }

          return (
            <div key={i} className={`${item.color} ${style}`}>
              <span className="text-4xl">{item.icon}</span>
              <p className="mt-2 font-semibold">{item.title}</p>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex mt-4 space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-pink-500" : "bg-gray-300"
            }`}
            onClick={() => handleDotClick(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
