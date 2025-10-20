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
  const pauseRef = useRef(false);
  const swipeDetected = useRef(false);
  const longPressTimeout = useRef(null);
  const longPressActive = useRef(false);

  // ✅ Autoplay control
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (videos.length > 0 && !pauseRef.current) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  // ✅ Cargar Top 10 desde /api/videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        // 🪄 Usa top10 si existe, sino usa all
        const list = Array.isArray(data)
          ? data
          : data.top10 || data.all || [];

        setVideos(list);
      } catch (error) {
        console.error("❌ Error al cargar videos:", error);
      }
    }

    fetchVideos();
    const refresh = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  // 🔁 Inicia autoplay
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 👆 Swipe + toque
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    swipeDetected.current = false;
    pauseRef.current = true;
    longPressActive.current = false;
    clearInterval(autoplayRef.current);

    // 🕒 Detecta long press
    longPressTimeout.current = setTimeout(() => {
      longPressActive.current = true;
    }, 800);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 20) swipeDetected.current = true;
    clearTimeout(longPressTimeout.current);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
    const diff = touchStartX.current - touchEndX.current;

    if (longPressActive.current) {
      longPressActive.current = false;
    } else if (swipeDetected.current && Math.abs(diff) > 50) {
      // 👉 Swipe
      setIndex((prev) =>
        diff > 0
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length
      );
    } else {
      // 👆 Tap → fullscreen y navegación
      const tapped = videos[index];
      if (tapped?.slug) handleClick(tapped.slug);
    }

    // 🕒 Reanuda autoplay
    setTimeout(() => {
      pauseRef.current = false;
      startAutoplay();
    }, 4000);
  };

  // 🔸 Navegación → fullscreen + redirect
  const handleClick = async (slug) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen)
        await elem.webkitRequestFullscreen();
      await new Promise((r) => setTimeout(r, 200));
      router.push(`/edit/${slug}`);
    } catch {
      router.push(`/edit/${slug}`);
    }
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
              {video.src?.endsWith(".mp4") ? (
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload noplaybackrate"
                  draggable="false"
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover bg-white overflow-hidden"
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover bg-white overflow-hidden"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🔘 Dots */}
      <div className="flex mt-5 gap-2">
        {videos.map((_, i) => (
          <span
            key={i}
            onClick={() => {
              setIndex(i);
              pauseRef.current = true;
              clearInterval(autoplayRef.current);
              setTimeout(() => {
                pauseRef.current = false;
                startAutoplay();
              }, 4000);
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
