"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const autoplayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ✅ Altura visible sin barras (móviles + tablets)
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      setViewportHeight(`${vh}px`);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, []);

  // ✅ Carga de videos
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

  // 🔁 Autoplay + loop infinito
  useEffect(() => {
    clearInterval(autoplayRef.current);
    if (videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 3000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 👆 Swipe manual
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
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
  };

  // 🖱️ Click → fullscreen sin tabs en móvil y abrir /edit
  const handleClick = async (slug) => {
    try {
      // Detectar dispositivo móvil
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        // Solicitar fullscreen real sobre el cuerpo (oculta tabs en Chrome/Safari)
        const elem = document.body;
        if (elem.requestFullscreen) await elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen)
          await elem.webkitRequestFullscreen();
      } else {
        // Desktop normal
        await document.documentElement.requestFullscreen?.();
      }
    } catch (err) {
      console.warn("⚠️ Fullscreen no soportado:", err);
    }
    router.push(`/edit/${slug}`);
  };

  return (
    <div
      className="w-full flex flex-col items-center overflow-hidden select-none bg-[#fffaf7]"
      style={{ height: viewportHeight }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative flex justify-center items-center w-full h-full"
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
                  className="w-[90vw] max-w-[380px] h-auto rounded-3xl shadow-xl object-contain bg-white"
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  className="w-[90vw] max-w-[380px] h-auto rounded-3xl shadow-xl object-contain bg-white"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 flex gap-2">
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
