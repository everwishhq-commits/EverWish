"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const cards = [
  { slug: "zombie_halloween_birthday_1A", src: "/videos/zombie_halloween_birthday_1A.mp4" },
  { slug: "ghost_halloween_love_1A", src: "/videos/ghost_halloween_love_1A.mp4" },
  { slug: "pumpkin_halloween_general_1A", src: "/videos/pumpkin_halloween_general_1A.mp4" },
];

export default function Carousel() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayRef = useRef(null);

  // 🔁 autoplay con loop infinito
  useEffect(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 2800);
    return () => clearInterval(autoplayRef.current);
  }, []);

  // 👆 Swipe manual con el dedo
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      setIndex((prev) =>
        diff > 0
          ? (prev + 1) % cards.length
          : (prev - 1 + cards.length) % cards.length
      );
    }
  };

  // 🖱️ Clic → fullscreen + /edit/[slug]
  const handleClick = async (slug) => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
      >
        {cards.map((card, i) => {
          const offset = (i - index + cards.length) % cards.length;
          let positionClass = "";

          if (offset === 0) positionClass = "translate-x-0 scale-100 z-20 opacity-100";
          else if (offset === 1) positionClass = "translate-x-full scale-90 z-10 opacity-50";
          else if (offset === cards.length - 1) positionClass = "-translate-x-full scale-90 z-10 opacity-50";
          else positionClass = "opacity-0 z-0";

          return (
            <div
              key={i}
              className={`absolute transition-all duration-700 ease-in-out ${positionClass}`}
              onClick={() => handleClick(card.slug)}
            >
              {card.src.endsWith(".mp4") ? (
                <video
                  src={card.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover bg-white"
                />
              ) : (
                <img
                  src={card.src}
                  alt={card.slug}
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover bg-white"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🔘 Dots */}
      <div className="flex mt-5 gap-2">
        {cards.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              i === index ? "bg-pink-500 scale-125" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
            }
