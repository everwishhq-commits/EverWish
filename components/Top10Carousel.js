"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 🎃 Palabras clave por mes
function getSeasonalKeywords() {
  const m = new Date().getMonth() + 1;
  switch (m) {
    case 10: return ["halloween", "pumpkin", "spooky", "zombie"];
    case 11: return ["thanksgiving", "turkey", "harvest", "fall"];
    case 12: return ["christmas", "holiday", "santa", "xmas"];
    case 2: return ["valentine", "love", "romance", "heart"];
    default: return ["birthday", "celebration", "general"];
  }
}

function getSeasonalTitle() {
  const m = new Date().getMonth() + 1;
  switch (m) {
    case 10: return "It’s Halloween Time! 🎃";
    case 11: return "Time for Thanksgiving 🦃";
    case 12: return "Holiday Magic! 🎄";
    case 2: return "Love Is in the Air ❤️";
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

  // 🧭 Control táctil
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

  // 🎥 Cargar y filtrar
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = Array.isArray(data.videos) ? data.videos : [];

        const seasonal = getSeasonalKeywords();
        const parsed = all.map((v, i) => {
          const src = v.src || "";
          const filename = src.split("/").pop()?.replace(".mp4", "") || `video-${i}`;
          const slug = v.slug || filename;
          const lower = slug.toLowerCase();
          const isSeasonal = seasonal.some((kw) => lower.includes(kw));
          return { ...v, slug, src, isSeasonal };
        });

        let seasonalVideos = parsed.filter((v) => v.isSeasonal);
        const extras = parsed.filter((v) => !v.isSeasonal);
        while (seasonalVideos.length < 10 && extras.length > 0) {
          seasonalVideos.push(extras.shift());
        }

        setVideos(seasonalVideos.slice(0, 10));
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }

    loadVideos();
    const interval = setInterval(loadVideos, 24 * 60 * 60 * 1000);
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
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      moved.current = true;
      direction.current =
        Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
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

  // 🎬 Fullscreen + redirección
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

  // 🧩 Render
  return (
    <div
      className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none"
      style={{ touchAction: "pan-y" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4 text-center">
        {title}
      </h2>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
      >
        {videos.length === 0 && (
          <p className="text-gray-400 text-sm">Loading cards...</p>
        )}

        {videos.map((video, i) => {
          const offset = (i - index + videos.length) % videos.length;
          const pos =
            offset === 0
              ? "translate-x-0 scale-100 z-20 opacity-100"
              : offset === 1
              ? "translate-x-full scale-90 z-10 opacity-50"
              : offset === videos.length - 1
              ? "-translate-x-full scale-90 z-10 opacity-50"
              : "opacity-0 z-0";
          return (
            <div
              key={video.slug || i}
              className={`absolute transition-all duration-500 ease-in-out ${pos}`}
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
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-white overflow-hidden"
              />
            </div>
          );
        })}
      </div>

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
