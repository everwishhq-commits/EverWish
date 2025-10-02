"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// 👉 Tus imágenes en /public/cards/
const items = [
  { title: "Anniversary", img: "/cards/anniversary.png" },
  { title: "Baby", img: "/cards/baby.png" },
  { title: "Love", img: "/cards/love.png" },
  { title: "Graduation", img: "/cards/graduation.png" },
  { title: "Condolences", img: "/cards/condolences.png" },
  { title: "Birthday", img: "/cards/birthday.png" },
  { title: "Gifts", img: "/cards/gifts.png" },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  // ⏱ auto slide cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (i) => setIndex(i);

  // 👉 Swipe touch
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      // swipe left
      setIndex((prev) => (prev + 1) % items.length);
    } else if (diff < -50) {
      // swipe right
      setIndex((prev) => (prev - 1 + items.length) % items.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full flex flex-col items-center mt-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carrusel */}
      <div className="relative h-72 w-full flex items-center justify-center overflow-hidden">
        {items.map((item, i) => {
          const offset = (i - index + items.length) % items.length;
          let style =
            "absolute transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center rounded-2xl shadow-md bg-white overflow-hidden";

          if (offset === 0) {
            // central (grande)
            style += " w-56 h-72 scale-125 z-20 opacity-100 shadow-xl";
          } else if (offset === 1) {
            // derecha
            style += " w-40 h-60 translate-x-48 scale-90 z-10 opacity-80";
          } else if (offset === items.length - 1) {
            // izquierda
            style += " w-40 h-60 -translate-x-48 scale-90 z-10 opacity-80";
          } else {
            style += " opacity-0 scale-75";
          }

          return (
            <div key={i} className={style}>
              <Image
                src={item.img}
                alt={item.title}
                width={224}
                height={288}
                className="object-cover w-full h-full"
              />
              <p className="absolute bottom-2 text-sm font-semibold bg-white/70 px-2 py-1 rounded">
                {item.title}
              </p>
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
