"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [videos, setVideos] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Error al cargar los videos");
        const data = await res.json();
        setVideos(data.slice(0, 10));
        setTimeout(() => setReady(true), 300); // 🕐 Espera corta para asegurar carga total
      } catch (error) {
        console.error("❌ Error al obtener videos:", error);
      }
    }
    fetchVideos();
  }, []);

  if (!ready || videos.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 py-10">
        Loading Everwish moments...
      </div>
    );
  }

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        key={videos.length} // 🔹 fuerza a Swiper a reconstruirse cuando cambia el número de videos
        centeredSlides
        loop={true} // 🔹 asegura el ciclo infinito
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 1.4, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
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
