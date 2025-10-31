"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 🗓️ Palabras clave por mes
function getSeasonalKeywords(month) {
  const M = month + 1;
  if (M === 1) return ["newyear", "winter", "snow"];
  if (M === 2) return ["valentine", "love", "heart"];
  if (M === 3) return ["spring", "flowers", "bunny", "easter"];
  if (M === 4) return ["easter", "bunny", "blossom"];
  if (M === 5) return ["mother", "mom", "flowers"];
  if (M === 6) return ["father", "summer", "vacation"];
  if (M === 7) return ["freedom", "fireworks", "independence"];
  if (M === 8) return ["summer", "beach", "sun"];
  if (M === 9) return ["fall", "autumn", "leaves"];
  if (M === 10) return ["halloween", "pumpkin", "spooky"];
  if (M === 11) return ["thanksgiving", "turkey", "harvest"];
  if (M === 12) return ["christmas", "holiday", "santa"];
  return ["general", "celebration"];
}

// 🎃 Título dinámico según el mes
function getSeasonalTitle(month) {
  const M = month + 1;
  if (M === 1) return "New Year Vibes! 🎆";
  if (M === 2) return "It’s Valentine Time! ❤️";
  if (M === 3 || M === 4) return "Spring Time! 🌸";
  if (M === 5) return "Happy Mother’s Month! 🌷";
  if (M === 6) return "Father’s Day Season! 👔";
  if (M === 7) return "Summer Celebrations! ☀️";
  if (M === 8) return "Sunny Days & Smiles! 😎";
  if (M === 9) return "Autumn Moments 🍁";
  if (M === 10) return "It’s Halloween Time! 🎃";
  if (M === 11) return "Thanksgiving Season! 🦃";
  if (M === 12) return "Christmas Magic! 🎄";
  return "Share Happy Moments! ✨";
}

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  const currentMonth = new Date().getMonth();
  const keywords = getSeasonalKeywords(currentMonth);
  const title = getSeasonalTitle(currentMonth);

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
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = data.videos || [];

        // 🧩 Agrupar por baseSlug (pumpkin_halloween_1A → pumpkin_halloween)
        const grouped = {};
        allVideos.forEach((v) => {
          const base = v.src.split("/").pop().replace(/_\d+[A-Z]?\.mp4$/, "");
          if (!grouped[base]) grouped[base] = [];
          grouped[base].push(v);
        });

        // 🧠 Seleccionar una por grupo (última o más relevante)
        let unique = Object.values(grouped).map((arr) => arr[arr.length - 1]);

        // 🎯 Filtrar según temporada
        const filtered = unique.filter((v) => {
          const name = v.src.toLowerCase();
          return keywords.some((k) => name.includes(k));
        });

        // 🏆 Si no hay suficientes, rellena con otras
        if (filtered.length < 10) {
          const extras = unique.filter(
            (v) => !filtered.includes(v)
          );
          unique = [...filtered, ...extras].slice(0, 10);
        } else {
          unique = filtered.slice(0, 10);
        }

        setVideos(unique);
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

  // 🎬 Ir al editor con pantalla extendida
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
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      {/* 🎃 Encabezado dinámico */}
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        {title}
      </h2>

      {/* 🎠 Carrusel visible completo */}
      <div className="relative w-full max-w-6xl flex justify-center items-center overflow-x-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${videos.length * 100}%`,
          }}
        >
          {videos.map((video, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex justify-center items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
            >
              <div className="flex flex-col items-center">
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
                  className="w-[260px] h-[380px] md:w-[320px] md:h-[420px] rounded-3xl shadow-lg object-cover bg-white transition-transform hover:scale-[1.03]"
                />
              </div>
            </div>
          ))}
        </div>
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
