"use client";
import { useState, useEffect } from "react";

const images = [
  "/top1.png",
  "/top2.png",
  "/top3.png",
  "/top4.png",
  "/top5.png",
  "/top6.png",
  "/top7.png",
  "/top8.png",
  "/top9.png",
  "/top10.png",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prev = (current - 1 + images.length) % images.length;
  const next = (current + 1) % images.length;

  return (
    <div className="relative flex flex-col items-center">
      {/* Imágenes */}
      <div className="flex items-center justify-center gap-4">
        <img
          src={images[prev]}
          alt="prev"
          className="w-40 h-56 object-cover rounded-xl opacity-70"
        />
        <img
          src={images[current]}
          alt="current"
          className="w-60 h-80 object-cover rounded-xl shadow-lg"
        />
        <img
          src={images[next]}
          alt="next"
          className="w-40 h-56 object-cover rounded-xl opacity-70"
        />
      </div>

      {/* Dots */}
      <div className="flex mt-4 gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-pink-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
