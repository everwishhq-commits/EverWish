"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const cards = [
  { img: "/cards/unicorn.png", title: "Magical Day" },
  { img: "/cards/birthday.png", title: "Happy Birthday" },
  { img: "/cards/baby.png", title: "Welcome Baby" },
  { img: "/cards/love.png", title: "With Love" },
  { img: "/cards/graduation.png", title: "Congrats!" },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  // autoplay cada 3 seg
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setIndex(i);

  return (
    <div className="flex flex-col items-center mt-6 relative">
      <div className="flex items-center justify-center gap-4 relative w-full max-w-4xl">
        {/* Left card */}
        <div className="w-40 h-56 opacity-60 scale-90 rounded-2xl shadow-md overflow-hidden bg-white">
          <Image
            src={cards[(index - 1 + cards.length) % cards.length].img}
            alt="left card"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center card */}
        <div className="w-60 h-80 rounded-2xl shadow-xl overflow-hidden border-2 border-pink-200 bg-white transition-transform duration-500">
          <Image
            src={cards[index].img}
            alt={cards[index].title}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right card */}
        <div className="w-40 h-56 opacity-60 scale-90 rounded-2xl shadow-md overflow-hidden bg-white">
          <Image
            src={cards[(index + 1) % cards.length].img}
            alt="right card"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-4">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-pink-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
