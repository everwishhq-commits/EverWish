"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const pauseTimeout = useRef(null); // 🔹 Nuevo: para pausar temporalmente

  // ✅ Carga de videos desde /api/videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("❌ Error al cargar videos:", error);
      }
    }

    fetchVideos();

    // 🔁 Refresca automáticamente cada 24h
    const refresh = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  // 🔁 Autoplay cada 3s con loop infinito
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % videos.length);
    }, 3000);
  };

  useEffect(() => {
    if (videos.length > 0) startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 👆 Swipe manual con pausa temporal
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    clearInterval(autoplayRef.current); // pausa inmediata
    clearTimeout(pauseTimeout.current);
  };

  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      setIndex((prev) =>
        diff > 0
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length
      );
    }
    // 🔹 Espera 4 segundos y reanuda autoplay
    pauseTimeout.current = setTimeout(startAutoplay, 4000);
  };

  // 🖱️ Click → fullscreen + /edit/[slug]
  const handleClick = async (slug) => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
      >
        {videos.map((video, i) => {
          const offset = (i - index + videos.length) % videos.length;
          let positionClass =
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
              className={`absolute transition-all duration-700 ease-in-out ${positionClass}`}
              onClick={() => handleClick(video.slug)}
            >
              {video.src?.endsWith(".mp4") ? (
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()} // ❌ evita menú descarga
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-contain p-3 bg-white select-none"
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()} // ❌ evita descarga
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-contain p-3 bg-white select-none"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex mt-5 gap-2">
        {videos.map((_, i) => (
          <span
            key={i}
            onClick={() => {
              setIndex(i);
              clearInterval(autoplayRef.current);
              clearTimeout(pauseTimeout.current);
              pauseTimeout.current = setTimeout(startAutoplay, 4000);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              i === index ? "bg-pink-500 scale-125" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
          }
