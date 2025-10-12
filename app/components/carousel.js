"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [videos, setVideos] = useState([]);

  // 🔹 Cargar los videos desde la API (sin caché)
  async function fetchVideos() {
    try {
      const res = await fetch("/api/videos", { cache: "no-store" });
      if (!res.ok) throw new Error("Error al cargar los videos");
      const data = await res.json();
      setVideos(data.slice(0, 10)); // Muestra los 10 más recientes
    } catch (error) {
      console.error("❌ Error al obtener videos:", error);
    }
  }

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 60000); // Actualiza cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        centeredSlides
        loop={videos.length > 1} // 🔹 evita errores si solo hay un video
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 15 },
          480: { slidesPerView: 1.5, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-500 bg-white ${
                  isActive ? "scale-105 z-50" : "scale-90 opacity-70 z-10"
                }`}
              >
                <video
                  src={video.src}
                  title={video.title}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[4/5] object-cover" // 🔹 relación flexible (mantiene forma de tarjeta)
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {videos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No hay tarjetas disponibles aún.
        </p>
      )}
    </div>
  );
              }
