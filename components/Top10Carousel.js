"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 🗓️ Define temas según el mes
function getSeasonalKeywords() {
  const month = new Date().getMonth() + 1;
  if (month === 10) return ["halloween", "spooky", "pumpkin", "zombie"];
  if (month === 11) return ["thanksgiving", "turkey", "harvest", "fall"];
  if (month === 12) return ["christmas", "holiday", "santa", "xmas"];
  if (month === 2) return ["valentine", "love", "romance", "heart"];
  return ["birthday", "celebration", "general"];
}

// 🔧 Analiza nombre del archivo (nuevo formato)
function parseFilename(filename) {
  const parts = filename.replace(".mp4", "").split("_");

  // Estructura: object_category1_category2_subcategory1_subcategory2_value
  const object = parts[0] || "unknown";
  const category1 = parts[1] || "general";
  const category2 = parts[2] || null;
  const subcategory1 = parts[3] || null;
  const subcategory2 = parts[4] || null;
  const value = parts[5] || "1A";

  return {
    object,
    category1,
    category2,
    subcategory1,
    subcategory2,
    value,
  };
}

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  const TAP_THRESHOLD = 10;
  const SWIPE_THRESHOLD = 40;

  // 🧠 Cargar videos desde API y filtrar según el mes actual
  useEffect(() => {
    async function fetchVideos() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const cacheKey = `everwish_videos_${today}`;
        const cached = localStorage.getItem(cacheKey);
        const seasonal = getSeasonalKeywords();

        if (cached) {
          console.log("📦 Cargando videos desde cache diario");
          setVideos(JSON.parse(cached));
          return;
        }

        console.log("🌐 Cargando videos desde /api/videos");
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data.videos) ? data.videos : [];

        // 📂 Convertir nombres de archivos con formato nuevo
        const parsed = list.map((v, i) => {
          const filename =
            v.src?.split("/").pop()?.replace(".mp4", "") || `video-${i}`;
          const info = parseFilename(filename);
          const allText = filename.toLowerCase();

          return {
            id: i,
            slug: `${filename}-${i}`,
            src: v.src,
            ...info,
            mainName: v.mainName || "General",
            matchScore: seasonal.some((kw) => allText.includes(kw)) ? 1 : 0,
          };
        });

        // 🎯 Filtrar por temporada primero
        let seasonalVideos = parsed.filter((v) => v.matchScore === 1);

        // Si hay menos de 10, rellena con otros
        if (seasonalVideos.length < 10) {
          const extra = parsed.filter((v) => !seasonalVideos.includes(v));
          seasonalVideos = [...seasonalVideos, ...extra].slice(0, 10);
        } else {
          seasonalVideos = seasonalVideos.slice(0, 10);
        }

        setVideos(seasonalVideos);
        localStorage.setItem(cacheKey, JSON.stringify(seasonalVideos));

        // 🧹 Limpia caches anteriores
        Object.keys(localStorage)
          .filter((k) => k.startsWith("everwish_videos_") && k !== cacheKey)
          .forEach((k) => localStorage.removeItem(k));
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }

    fetchVideos();
    // Actualiza cada 24 horas
    const interval = setInterval(fetchVideos, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🕒 Autoplay
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

  // 🖐️ Control táctil (swipe)
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const direction = useRef(null);

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

  // 🎬 Navegar al editor
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

  // 🎨 Render principal
  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none"
      style={{
        touchAction: "pan-y",
        background:
          "linear-gradient(to bottom, #fff8fa 0%, #fff5f7 30%, #ffffff 100%)",
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
      >
        {videos.length === 0 && (
          <p className="text-gray-500 text-sm">Loading seasonal cards...</p>
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
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-3xl shadow-lg object-cover object-center bg-white overflow-hidden transition-transform duration-500 hover:scale-[1.03]"
              />
              <div className="text-center mt-2 text-sm text-gray-600 font-medium">
                {video.object} • {video.category1}
                {video.category2 ? ` / ${video.category2}` : ""} —{" "}
                {video.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔘 Dots */}
      <div className="flex mt-6 gap-2">
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
              i === index
                ? "bg-pink-500 scale-125 shadow-md"
                : "bg-gray-300 hover:bg-pink-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
          }
