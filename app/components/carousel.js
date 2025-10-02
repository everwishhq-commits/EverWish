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

  // Auto slide cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (i) => setIndex(i);

  return (
    <div className="relative w-full flex flex-col items-center mt-6">
      {/* Carrusel */}
      <div className="relative h-56 w-full flex items-center justify-center overflow-hidden">
        {items.map((item, i) => {
          const offset = (i - index + items.length) % items.length;
          let style =
            "absolute transition-all duration-700 ease-in-out transform";

          // central resaltada
          if (offset === 0)
            style +=
              " scale-110 opacity-100 z-20 shadow-xl animate-bounce-slow";

          // tarjeta a la derecha
          else if (offset === 1)
            style += " translate-x-40 scale-90 opacity-70 z-10";

          // tarjeta a la izquierda
          else if (offset === items.length - 1)
            style += "-translate-x-40 scale-90 opacity-70 z-10";

          // resto ocultas
          else style += " opacity-0 scale-75";

          return (
            <div
              key={i}
              className={`${item.color} ${style} rounded-2xl w-40 h-52 flex flex-col items-center justify-center shadow-md`}
            >
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

      {/* Animación bounce sutil */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
