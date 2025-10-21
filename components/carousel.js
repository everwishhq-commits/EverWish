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
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const pauseRef = useRef(false);
  const swipeDetected = useRef(false);
  const scrollDetected = useRef(false);
  const longPressTimeout = useRef(null);
  const longPressActive = useRef(false);

  // 🕹️ Autoplay control
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (videos.length > 0 && !pauseRef.current) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  // 📦 Cargar videos
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
    const refresh = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  // 🔁 Iniciar autoplay
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 👆 Manejo táctil mejorado
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;

    swipeDetected.current = false;
    scrollDetected.current = false;
    pauseRef.current = true;
    longPressActive.current = false;
    clearInterval(autoplayRef.current);

    // ⏳ Detectar long press
    longPressTimeout.current = setTimeout(() => {
      longPressActive.current = true;
    }, 800);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;

    const diffX = Math.abs(touchEndX.current - touchStartX.current);
    const diffY = Math.abs(touchEndY.current - touchStartY.current);

    // Si se mueve más vertical que horizontal → scroll, no clic
    if (diffY > diffX && diffY > 15) scrollDetected.current = true;
    if (diffX > 20) swipeDetected.current = true;

    clearTimeout(longPressTimeout.current);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = Math.abs(touchStartY.current - touchEndY.current);

    // 🚫 Evita acción si fue scroll vertical
    if (scrollDetected.current) {
      pauseRef.current = false;
      startAutoplay();
      return;
    }

    // 🚫 Evita acción si fue long press
    if (longPressActive.current) {
      longPressActive.current = false;
      return;
    }

    // 👉 Swipe horizontal
    if (swipeDetected.current && Math.abs(diffX) > 50) {
      setIndex((prev) =>
        diffX > 0
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length
      );
    } else {
      // 👆 Tap normal → abrir pantalla extendida
      const tapped = videos[index];
      if (tapped?.slug) handleClick(tapped.slug);
    }

    // ⏯️ Reanudar autoplay
    setTimeout(() => {
      pauseRef.current = false;
      startAutoplay();
    }, 3000);
  };

  // 🔗 Navegación + fullscreen
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
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-white overflow-hidden"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-white overflow-hidden"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🔘 Indicadores */}
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
