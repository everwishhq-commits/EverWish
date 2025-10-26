"use client";
import { useState, useRef, useEffect } from "react";

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  // 🧠 Lista de videos actuales en /public/videos/
  const videos = [
    { src: "/videos/bunny_easter_general_1a.mp4", slug: "bunny_easter_general_1a" },
    { src: "/videos/dog_pets_thanksgiving_1a.mp4", slug: "dog_pets_thanksgiving_1a" },
    { src: "/videos/eagle_independence_general_1a.mp4", slug: "eagle_independence_general_1a" },
    { src: "/videos/ghost_halloween_love_1a.mp4", slug: "ghost_halloween_love_1a" },
    { src: "/videos/hugs_love_anniversary_1a.mp4", slug: "hugs_love_anniversary_1a" },
    { src: "/videos/mother_mothersday_celebration_1a.mp4", slug: "mother_mothersday_celebration_1a" },
    { src: "/videos/octopus_pets_general_1a.mp4", slug: "octopus_pets_general_1a" },
    { src: "/videos/pumpkin_halloween_general_1a.mp4", slug: "pumpkin_halloween_general_1a" },
    { src: "/videos/turkey_thanksgiving_general_1a.mp4", slug: "turkey_thanksgiving_general_1a" },
    { src: "/videos/turtle_christmas_general_1a.mp4", slug: "turtle_christmas_general_1a" },
    { src: "/videos/yeti_christmas_general_1a.mp4", slug: "yeti_christmas_general_1a" },
    { src: "/videos/zombie_halloween_birthday_1a.mp4", slug: "zombie_halloween_birthday_1a" },
  ];

  // 🎞 Autoplay
  useEffect(() => {
    const start = () => {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    };
    start();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 🖐 Swipe lateral
  const startX = useRef(0);
  const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setIndex((prev) =>
        diff > 0
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      <div
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, i) => {
          const offset = (i - index + videos.length) % videos.length;
          const positionClass =
            offset === 0
              ? "translate-x-0 scale-100 z-20 opacity-100"
              : offset === 1
              ? "translate-x-full scale-90 z-10 opacity-50"
              : offset === videos.length - 1
              ? "-translate-x-full scale-90 z-10 opacity-50"
              : "opacity-0 z-0";

          return (
            <div
              key={i}
              className={`absolute transition-all duration-500 ease-in-out ${positionClass}`}
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover object-center bg-white overflow-hidden"
              />
            </div>
          );
        })}
      </div>

      {/* 🔘 Dots */}
      <div className="flex mt-5 gap-2">
        {videos.map((_, i) => (
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
