"use client";
import { useEffect, useState } from "react";

const cards = [
  { title: "Mágico Unicornio", emoji: "🦄", bg: "from-pink-100 to-purple-100" },
  { title: "Feliz Cumple", emoji: "🎂", bg: "from-rose-100 to-orange-100" },
  { title: "Te Quiero", emoji: "❤️", bg: "from-red-100 to-pink-100" },
  { title: "Nuevo Bebé", emoji: "👶", bg: "from-blue-100 to-cyan-100" },
  { title: "Graduación", emoji: "🎓", bg: "from-green-100 to-emerald-100" },
  { title: "Amistad", emoji: "🤝", bg: "from-sky-100 to-indigo-100" },
  { title: "Súper Mamá", emoji: "👩‍👧", bg: "from-fuchsia-100 to-pink-100" },
  { title: "Gracias", emoji: "🙏", bg: "from-amber-100 to-yellow-100" },
  { title: "Aniversario", emoji: "💍", bg: "from-violet-100 to-purple-100" },
  { title: "Mejórate", emoji: "🌼", bg: "from-lime-100 to-green-100" },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  // Avance automático
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % cards.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const left = (i) => (i - 1 + cards.length) % cards.length;
  const right = (i) => (i + 1) % cards.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Viewport */}
      <div className="relative w-full max-w-3xl h-72 md:h-80 overflow-hidden flex items-center justify-center">
        {cards.map((c, i) => {
          let pos = "opacity-0 scale-75 pointer-events-none";
          let translate = "translate-x-0";
          let z = "z-0";
          if (i === index) {
            pos = "opacity-100 scale-100";
            translate = "translate-x-0";
            z = "z-20";
          } else if (i === left(index)) {
            pos = "opacity-90 scale-95";
            translate = "-translate-x-28 md:-translate-x-36";
            z = "z-10";
          } else if (i === right(index)) {
            pos = "opacity-90 scale-95";
            translate = "translate-x-28 md:translate-x-36";
            z = "z-10";
          }

          return (
            <div
              key={i}
              className={`absolute transition-all duration-500 ease-out ${z} ${pos} ${translate}`}
            >
              <div className={`w-56 h-72 md:w-64 md:h-80 rounded-3xl shadow-xl bg-gradient-to-br ${c.bg} flex flex-col items-center justify-center ring-1 ring-black/5`}>
                <div className="text-6xl mb-3">{c.emoji}</div>
                <div className="text-base md:text-lg font-semibold text-gray-700 px-3 text-center">
                  {c.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-4 flex gap-2">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-pink-500" : "w-3 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
