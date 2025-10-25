"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  // 🧭 Control de gestos
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const direction = useRef(null);

  const TAP_THRESHOLD = 10;
  const SWIPE_THRESHOLD = 40;

  // 🕒 Autoplay
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (!pauseRef.current && videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  // 🎥 Cargar videos desde /api/videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        console.log("📂 Cargando videos desde /api/videos...");
        const res = await fetch("/api/videos", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // 🧹 Validación y fallback
        const validVideos = data
          .filter((v) => v?.file?.endsWith(".mp4"))
          .map((v) => ({
            ...v,
            src: v.file,
          }));

        setVideos(validVideos);
        setLoading(false);
        console.log(`✅ ${validVideos.length} videos cargados correctamente.`);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 🖐️ Control táctil
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    moved.current = false;
    direction.current = null;
    pauseRef.current = true;
    clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e) => {
    const t = e.touches[0];
    const deltaX = t.clientX - startX.current;
    const deltaY = t.clientY - startY.current;

    if (Math.abs(deltaX) > TAP_THRESHOLD || Math.abs(deltaY) > TAP_THRESHOLD) {
      moved.current = true;
      direction.current =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();

    if (!moved.current) {
      const tapped = videos[index];
      if (tapped?.slug) handleClick(tapped.slug);
    } else if (direction.current === "horizontal") {
      const diffX = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        setIndex((prev) =>
          diffX > 0
            ? (prev + 1) % videos.length
            : (prev - 1 + videos.length) % videos.length
        );
      }
    }

    setTimeout(() => {
      pauseRef.current = false;
      startAutoplay();
    }, 3000);
  };

  // 🎬 Abrir tarjeta en pantalla completa
  const handleClick = async (slug) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen)
        await elem.webkitRequestFullscreen();
      await new Promise((r) => setTimeout(r, 150));
      router.push(`/edit/${slug}`);
    } catch {
      router.push(`/edit/${slug}`);
    }
  };

  // 💬 Estado de carga
  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-400">
        ⏳ Loading videos...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full text-center py-10 text-red-400">
        ⚠️ No videos found in /api/videos
      </div>
    );
  }

  // 🎠 Carrusel
  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none"
      style={{ touchAction: "pan-y" }}
    >
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
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload noplaybackrate"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-white overflow-hidden"
              />
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
              }, 3000);
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
