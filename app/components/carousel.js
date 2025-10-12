"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carousel() {
  const [videos, setVideos] = useState([]);

  // 🔹 Cargar los videos desde la API dinámica
  async function fetchVideos() {
    try {
      const res = await fetch("/api/videos", { cache: "no-store" }); // sin caché
      if (!res.ok) throw new Error("Error al cargar los videos");
      const data = await res.json();
      setVideos(data.slice(0, 10)); // solo los 10 primeros
    } catch (error) {
      console.error("❌ Error al obtener videos:", error);
    }
  }

  useEffect(() => {
    fetchVideos();
    // Verifica cada 60 segundos si hay nuevos archivos
    const interval = setInterval(fetchVideos, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        centeredSlides
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay, EffectFade]}
        className="w-full max-w-5xl"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ease-in-out ${
                  isActive ? "scale-105 opacity-100" : "scale-95 opacity-70"
                }`}
              >
                <video
                  src={video.src}
                  title={video.title}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[450px] object-cover"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
                }
