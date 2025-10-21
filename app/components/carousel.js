"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  // ✅ Cargar videos desde /api/videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : data.all || []);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }
    fetchVideos();
  }, []);

  // 🎬 Autoplay cada 5s
  useEffect(() => {
    clearInterval(autoplayRef.current);
    if (videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        if (!pauseRef.current) {
          setIndex((prev) => (prev + 1) % videos.length);
        }
      }, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // 👉 Click para ir a edición
  const handleClick = async (slug) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      router.push(`/edit/${slug}`);
    } catch {
      router.push(`/edit/${slug}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      <div className="relative w-full max-w-5xl flex justify-center items-center h-[440px]">
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
              key={i}
              className={`absolute transition-all duration-500 ease-in-out ${pos}`}
            >
              {video.src?.endsWith(".mp4") ? (
                <video
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover bg-white overflow-hidden"
                  onClick={() => handleClick(video.slug)}
                />
              ) : (
                <img
                  src={video.src}
                  alt={video.title}
                  draggable="false"
                  onClick={() => handleClick(video.slug)}
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] rounded-2xl shadow-lg object-cover bg-white overflow-hidden"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🔘 Dots */}
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
