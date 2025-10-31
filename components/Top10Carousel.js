"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* 🔹 Palabras clave por mes (filtro automático) */
function getSeasonalKeywords() {
  const month = new Date().getMonth() + 1;
  switch (month) {
    case 1: return ["newyear", "winter", "celebration", "snow"];
    case 2: return ["valentine", "love", "heart", "romance"];
    case 3: return ["spring", "flowers", "easter", "bunny"];
    case 4: return ["easter", "bunny", "pastel", "blossom"];
    case 5: return ["mother", "graduation", "bloom", "memorial"];
    case 6: return ["father", "summer", "beach", "vacation"];
    case 7: return ["independence", "freedom", "fireworks", "summer"];
    case 8: return ["friendship", "backtoschool", "sunshine", "vacation"];
    case 9: return ["labor", "fall", "harvest", "autumn"];
    case 10: return ["halloween", "pumpkin", "zombie", "spooky"];
    case 11: return ["thanksgiving", "turkey", "harvest", "gratitude"];
    case 12: return ["christmas", "holiday", "santa", "xmas"];
    default: return ["celebration", "general", "everwish"];
  }
}

/* ✨ Título de temporada */
function getSeasonalTitle() {
  const month = new Date().getMonth() + 1;
  switch (month) {
    case 10: return "It’s Halloween Time! 🎃";
    case 11: return "Time for Thanksgiving 🦃";
    case 12: return "Holiday Magic! 🎄";
    case 1: return "New Year Vibes! 🎆";
    case 2: return "Love Is in the Air ❤️";
    case 3: return "Spring Is Blooming 🌸";
    default: return "Share Moments That Last Forever ✨";
  }
}

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);
  const title = getSeasonalTitle();

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

  // 🎥 Cargar videos + filtro por mes + top10
  useEffect(() => {
    async function loadAndFilter() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = data.videos || data || [];
        const seasonal = getSeasonalKeywords();

        // 🧩 Agrupar por baseSlug
        const grouped = {};
        allVideos.forEach((v) => {
          const base = v.slug?.replace(/_\d+[A-Z]?$/i, "") || "";
          if (!grouped[base]) grouped[base] = [];
          grouped[base].push(v);
        });

        // 🏆 Tomar el mejor de cada grupo
        const uniqueVideos = Object.values(grouped).map((arr) =>
          arr.sort((a, b) => {
            const aDate = a.updatedAt || a.date || 0;
            const bDate = b.updatedAt || b.date || 0;
            const aPop = a.popularity || 0;
            const bPop = b.popularity || 0;
            return bPop - aPop || bDate - aDate;
          })[0]
        );

        // 🎯 Filtro mensual (prioriza palabras del mes)
        const monthVideos = uniqueVideos.filter((v) =>
          seasonal.some((kw) => v.slug?.toLowerCase().includes(kw))
        );

        // 🔝 Tomar top 10: prioriza del mes, luego rellena
        let top10 = monthVideos.slice(0, 10);
        if (top10.length < 10) {
          const extras = uniqueVideos.filter(
            (v) => !monthVideos.includes(v)
          );
          top10 = [...top10, ...extras.slice(0, 10 - top10.length)];
        }

        setVideos(top10);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }

    loadAndFilter();
    const interval = setInterval(loadAndFilter, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 🖐️ Gestos táctiles
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

  // 🎬 Pantalla extendida
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

  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none"
      style={{ touchAction: "pan-y" }}
    >
      {/* 🏷️ Título de temporada */}
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4 text-center">
        {title}
      </h2>

      {/* 🎞️ Carrusel */}
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
