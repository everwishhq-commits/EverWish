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
    }, 4000); // movimiento automático
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full flex flex-col items-center mt-10">
      {/* Contenedor del carrusel */}
      <div className="flex items-center justify-center w-full overflow-hidden">
        <div className="relative flex w-full justify-center">
          {items.map((item, i) => {
            const offset = (i - index + items.length) % items.length;

            let position =
              "absolute transition-all duration-700 ease-in-out scale-75 opacity-40";
            if (offset === 0)
              position =
                "absolute transition-all duration-700 ease-in-out scale-100 opacity-100 z-20";
            else if (offset === 1 || offset === items.length - 1)
              position =
                "absolute transition-all duration-700 ease-in-out scale-90 opacity-80 z-10";

            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center w-40 h-52 md:w-56 md:h-72 rounded-2xl shadow-lg ${item.color} ${position}`}
                style={{
                  left:
                    offset === 0
                      ? "50%"
                      : offset === 1
                      ? "70%"
                      : offset === items.length - 1
                      ? "30%"
                      : "-9999px",
                  transform: "translateX(-50%)",
                }}
              >
                <span className="text-4xl">{item.icon}</span>
                <p className="mt-2 text-base md:text-lg font-semibold">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
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
