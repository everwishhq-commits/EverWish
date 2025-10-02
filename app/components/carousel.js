"use client";
import { useState, useEffect } from "react";

const slides = [
  { title: "Anniversary", color: "bg-purple-200", icon: "💍" },
  { title: "Baby", color: "bg-blue-200", icon: "👶" },
  { title: "Love", color: "bg-red-200", icon: "❤️" },
  { title: "Graduation", color: "bg-green-200", icon: "🎓" },
  { title: "Condolences", color: "bg-gray-200", icon: "🕊️" },
  { title: "Birthday", color: "bg-pink-200", icon: "🎂" },
  { title: "Congrats", color: "bg-yellow-200", icon: "⭐" },
  { title: "Gifts", color: "bg-orange-200", icon: "🎁" },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  // autoplay cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // swipe para móvil
  let startX = 0;
  let endX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      setCurrent((prev) => (prev + 1) % slides.length); // swipe left
    } else if (endX - startX > 50) {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length); // swipe right
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto mt-8 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-center space-x-3">
        {slides.map((slide, index) => {
          const offset = (index - current + slides.length) % slides.length;

          let size = "scale-0 opacity-0 hidden";
          let zIndex = "z-0";

          if (offset === 0) {
            size = "scale-110 opacity-100 z-20"; // central grande
            zIndex = "z-20";
          } else if (offset === 1 || offset === slides.length - 1) {
            size = "scale-90 opacity-70 z-10"; // laterales más pequeñas
            zIndex = "z-10";
          }

          return (
            <div
              key={index}
              className={`transition-all duration-700 ease-in-out transform ${size} ${zIndex} w-52 h-72 md:w-64 md:h-80 rounded-2xl flex flex-col items-center justify-center shadow-lg ${slide.color}`}
            >
              <span className="text-6xl">{slide.icon}</span>
              <p className="mt-4 font-semibold text-gray-700">{slide.title}</p>
            </div>
          );
        })}
      </div>

      {/* dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-pink-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
