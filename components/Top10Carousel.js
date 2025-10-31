"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Top10Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  // refs para touch
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const direction = useRef(null);

  const TAP_THRESHOLD = 10;
  const SWIPE_THRESHOLD = 40;

  // ===========================
  // 1. cargar desde /cards/index.json
  // ===========================
  useEffect(() => {
    async function loadVideos() {
      try {
        // 👀 este archivo DEBE existir: public/cards/index.json
        const res = await fetch("/cards/index.json", { cache: "no-store" });
        const data = await res.json();

        // puede venir como {videos: [...] } o como [...]
        const raw = Array.isArray(data) ? data : data.videos || [];

        // nos quedamos con los 10 primeros
        const top10 = raw.slice(0, 10).map((item, i) => {
          // aseguramos campos
          const src =
            item.src ||
            (item.slug ? `/cards/${item.slug}.mp4` : null);

          return {
            id: i,
            slug: item.slug || item.baseSlug || `video-${i}`,
            src,
            title:
              item.title ||
              item.combinedName ||
              item.category ||
              "Everwish card",
          };
        });

        setVideos(top10);
      } catch (err) {
        console.error("❌ No se pudo leer /cards/index.json", err);
        setVideos([]);
      }
    }

    loadVideos();

    // refresco cada 24 h
    const interval = setInterval(loadVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ===========================
  // 2. autoplay
  // ===========================
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (!pauseRef.current && videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // ===========================
  // 3. touch para tablet
  // ===========================
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
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      moved.current = true;
      direction.current =
        Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      // para que no se mueva toda la página
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();

    // TAP
    if (!moved.current) {
      const current = videos[index];
      if (current?.slug) handleClick(current.slug);
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

    // reanudar
    setTimeout(() => {
      pauseRef.current = false;
      startAutoplay();
    }, 3000);
  };

  // ===========================
  // 4. ir a /edit/[slug] con pantalla extendida
  // ===========================
  const handleClick = async (slug) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen)
        await elem.webkitRequestFullscreen();
      await new Promise((r) => setTimeout(r, 150));
      router.push(`/edit/${slug}`);
    } catch (e) {
      router.push(`/edit/${slug}`);
    }
  };

  // ===========================
  // 5. render
  // ===========================
  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none"
      style={{ touchAction: "pan-y" }} // deja hacer scroll vertical
    >
      {/* título dinámico, lo puedes quitar si quieres */}
      <h2 className="text-pink-500 text-3xl font-bold mb-4">
        It&apos;s Halloween Time! 🎃
      </h2>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
      >
        {videos.length === 0 && (
          <p className="text-gray-500 text-sm">Loading cards...</p>
        )}

        {videos.map((video, i) => {
          const offset = (i - index + videos.length) % videos.length;
          const positionClass =
            offset === 0
              ? "translate-x-0 scale-100 z-20 opacity-100"
              : offset === 1
              ? "translate-x-full scale-90 z-10 opacity-40"
              : offset === videos.length - 1
              ? "-translate-x-full scale-90 z-10 opacity-40"
              : "opacity-0 z-0";

          return (
            <div
              key={video.slug || i}
              className={`absolute transition-all duration-700 ease-in-out ${positionClass}`}
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
                onClick={() => handleClick(video.slug)}
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-3xl shadow-lg object-cover object-center bg-white overflow-hidden cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* dots */}
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
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === index ? "bg-pink-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
          }
