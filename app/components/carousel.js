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

  // 🔁 Autoplay (ahora cada 5 segundos)
  useEffect(() => {
    clearInterval(autoplayRef.current);
    if (videos.length > 0 && !pauseRef.current) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000); // ⏰ ← antes 3000, ahora 5000 ms
    }
    return () => clearInterval(autoplayRef.current);
  }, [videos, pauseRef.current]);

  // 🖐️ Interacción táctil: distinguir swipe vs tap
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    swipeDetected.current = false;
    pauseRef.current = true; // pausa el autoplay durante interacción
    clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    if (Math.abs(touchStartX.current - touchEndX.current) > 10) {
      swipeDetected.current = true;
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (swipeDetected.current && Math.abs(diff) > 50) {
      // 👉 Swipe detectado → mover carrusel
      setIndex((prev) =>
        diff > 0
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length
      );
    } else {
      // 👆 Tap corto → abrir imagen
      const tapped = videos[index];
      if (tapped?.slug) handleClick(tapped.slug);
    }

    // 🔁 Reanudar autoplay después de 4 s sin interacción
    setTimeout(() => {
      pauseRef.current = false;
    }, 4000);
  };

  // 🖱️ Click → fullscreen + /edit/[slug]
  const handleClick = async (slug) => {
    try {
      await document.documentElement.requestFullscreen?.();
      await new Promise((r) => setTimeout(r, 300));
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
              className={`absolute transition-all duration-500 ease-in-out ${positionClass}`}
            >
              {video.src?.endsWith(".mp4") ? (
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover sm:object-fill object-center bg-white overflow-hidden"
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover sm:object-fill object-center bg-white overflow-hidden"
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
