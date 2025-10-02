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

  // autoplay lento
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5s entre cada slide
    return () => clearInterval(interval);
  }, []);

  // manejar manual click
  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-8 overflow-hidden">
      <div className="flex items-center justify-center space-x-6">
        {slides.map((slide, index) => {
          // calcular posición relativa al slide actual
          const offset = (index - current + slides.length) % slides.length;

          let scale = "scale-0 opacity-0 hidden"; // por defecto no se muestra
          let zIndex = "z-0";
          if (offset === 0) {
            scale = "scale-100 opacity-100 z-20"; // principal
            zIndex = "z-20";
          } else if (offset === 1 || offset === slides.length - 1) {
            scale = "scale-90 opacity-80 z-10"; // laterales
            zIndex = "z-10";
          }

          return (
            <div
              key={index}
              className={`transition-all duration-700 ease-in-out transform ${scale} ${zIndex} w-48 h-64 rounded-2xl flex flex-col items-center justify-center shadow-lg ${slide.color}`}
            >
              <span className="text-5xl">{slide.icon}</span>
              <p className="mt-4 font-semibold text-gray-700">
                {slide.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* dots abajo */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-pink-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
