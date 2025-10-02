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
    }, 4000); // autoplay
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative flex flex-col items-center mt-10">
      <div className="flex justify-center items-center relative w-full max-w-xl h-72 overflow-hidden">
        {items.map((item, i) => {
          const offset = (i - index + items.length) % items.length;

          // posición de cada tarjeta
          let style = "scale-0 opacity-0"; // ocultar por defecto
          if (offset === 0) style = "scale-100 opacity-100 z-20"; // central
          else if (offset === 1) style = "translate-x-40 scale-90 opacity-80 z-10"; // derecha
          else if (offset === items.length - 1) style = "-translate-x-40 scale-90 opacity-80 z-10"; // izquierda

          return (
            <div
              key={i}
              className={`absolute w-44 h-60 md:w-56 md:h-72 flex flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-700 ease-in-out ${item.color} ${style}`}
            >
              <span className="text-4xl">{item.icon}</span>
              <p className="mt-2 text-base md:text-lg font-semibold">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex mt-6 space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-pink-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
