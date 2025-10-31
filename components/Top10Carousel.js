"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* 🗓️ Palabras clave por mes */
function getSeasonalKeywords() {
  const m = new Date().getMonth() + 1;
  switch (m) {
    case 1:
      return ["newyear", "winter", "celebration", "snow"];
    case 2:
      return ["valentine", "love", "heart", "romance"];
    case 3:
      return ["spring", "flowers", "easter", "bunny"];
    case 4:
      return ["easter", "bunny", "pastel", "blossom"];
    case 5:
      return ["mother", "graduation", "bloom", "memorial"];
    case 6:
      return ["father", "summer", "beach", "vacation"];
    case 7:
      return ["independence", "freedom", "fireworks", "summer"];
    case 8:
      return ["friendship", "backtoschool", "sunshine", "vacation"];
    case 9:
      return ["labor", "fall", "harvest", "autumn"];
    case 10:
      return ["halloween", "pumpkin", "zombie", "spooky"];
    case 11:
      return ["thanksgiving", "turkey", "harvest", "gratitude"];
    case 12:
      return ["christmas", "holiday", "santa", "xmas"];
    default:
      return ["celebration", "general", "everwish"];
  }
}

/* 🏷️ Título dinámico */
function getSeasonalTitle() {
  const m = new Date().getMonth() + 1;
  switch (m) {
    case 1:
      return "New Year Vibes! 🎆";
    case 2:
      return "Love Is in the Air ❤️";
    case 3:
      return "Spring Is Blooming 🌸";
    case 4:
      return "Easter Joy! 🐰";
    case 5:
      return "Moments of Gratitude 🌷";
    case 6:
      return "Summer Begins ☀️";
    case 7:
      return "Freedom & Sunshine 🇺🇸";
    case 8:
      return "Happy Moments Ahead 🌻";
    case 9:
      return "Fall Feelings 🍂";
    case 10:
      return "It’s Halloween Time! 🎃";
    case 11:
      return "Time for Thanksgiving 🦃";
    case 12:
      return "Holiday Magic! 🎄";
    default:
      return "Share Moments That Last Forever ✨";
  }
}

/* 🎨 Colores de fondo por mes */
function getSeasonalBackground() {
  const m = new Date().getMonth() + 1;
  const colors = {
    1: "#F0F7FF",
    2: "#FFF0F5",
    3: "#EAFBF0",
    4: "#FFF8E6",
    5: "#FFF2F2",
    6: "#EAF9FF",
    7: "#FFF8E1",
    8: "#FFF9EB",
    9: "#FFF3E0",
    10: "#FFF0E5",
    11: "#FFF6E5",
    12: "#F7F8FF",
  };
  return colors[m] || "#FFF8FA";
}

/* 🧩 Analiza nombres tipo object_category_subcategory_value */
function parseFilename(filename) {
  const clean = filename.replace(".mp4", "");
  const parts = clean.split("_");
  return {
    slug: clean,
    object: parts[0] || "unknown",
    categories: parts.slice(1, -1),
    value: parts[parts.length - 1] || "1A",
  };
}

/* 🚀 Componente principal */
export default function Top10Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);

  const title = getSeasonalTitle();
  const bgColor = getSeasonalBackground();

  // 🧠 Cargar videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const cacheKey = `everwish_videos_${today}`;
        const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
        const seasonal = getSeasonalKeywords();

        if (cached) {
          setVideos(JSON.parse(cached));
          return;
        }

        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data.videos) ? data.videos : [];

        const parsed = list.map((v, i) => {
          const file = v.src?.split("/").pop() || `video-${i}.mp4`;
          const info = parseFilename(file);
          const lower = file.toLowerCase();
          const isSeasonal = seasonal.some((kw) => lower.includes(kw));
          return { id: i, src: v.src, ...info, isSeasonal };
        });

        let seasonalVideos = parsed.filter((v) => v.isSeasonal);
        if (seasonalVideos.length < 10) {
          const extra = parsed.filter((v) => !v.isSeasonal);
          seasonalVideos = [...seasonalVideos, ...extra].slice(0, 10);
        } else {
          seasonalVideos = seasonalVideos.slice(0, 10);
        }

        setVideos(seasonalVideos);
        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(seasonalVideos));
          Object.keys(localStorage)
            .filter((k) => k.startsWith("everwish_videos_") && k !== cacheKey)
            .forEach((k) => localStorage.removeItem(k));
        }
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }

    fetchVideos();
    const interval = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🎬 Autoplay
  useEffect(() => {
    clearInterval(autoplayRef.current);
    if (!pauseRef.current && videos.length > 0) {
      autoplayRef.current = setInterval(
        () => setIndex((prev) => (prev + 1) % videos.length),
        5000
      );
    }
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 🖐️ Swipe
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    moved.current = false;
    pauseRef.current = true;
    clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) moved.current = true;
  };

  const handleTouchEnd = (e) => {
    const dx = startX.current - e.changedTouches[0].clientX;
    if (!moved.current) {
      const current = videos[index];
      if (current?.slug) router.push(`/edit/${current.slug}`);
    } else if (Math.abs(dx) > 40) {
      setIndex((prev) =>
        dx > 0 ? (prev + 1) % videos.length : (prev - 1 + videos.length) % videos.length
      );
    }
    setTimeout(() => {
      pauseRef.current = false;
    }, 3000);
  };

  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none transition-colors duration-700"
      style={{
        touchAction: "pan-y",
        backgroundColor: bgColor,
      }}
    >
      {/* 🏷️ Título dinámico */}
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
        {videos.length === 0 && (
          <p className="text-gray-500 text-sm">Loading cards...</p>
        )}

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
              key={video.slug}
              className={`absolute transition-all duration-700 ease-in-out ${positionClass}`}
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload noplaybackrate"
                onClick={() => router.push(`/edit/${video.slug}`)}
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-3xl shadow-lg object-cover cursor-pointer transition-transform duration-500 hover:scale-[1.03] bg-white"
              />
            </div>
          );
        })}
      </div>

      {/* 🔘 Indicadores */}
      <div className="flex mt-6 gap-2">
        {videos.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === index ? "bg-pink-500 scale-125 shadow-md" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
    }
