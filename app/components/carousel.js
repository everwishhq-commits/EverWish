"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideos(data.slice(0, 10));
      } catch (e) {
        console.error("Error cargando /api/videos", e);
      }
    })();
  }, []);

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        centeredSlides
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
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
        {videos.map((item, i) => (
          <SwiperSlide key={item.slug ?? i}>
            {({ isActive }) => (
              <Link
                href={`/card/${encodeURIComponent(item.slug)}`}
                className={`block rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive ? "scale-105 z-50" : "scale-90 opacity-70 z-10"
                }`}
              >
                {/* Si es mp4 se muestra como video, si no, como imagen */}
                {String(item.src).toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[450px] object-cover"
                  />
                ) : (
                  // fallback por si algún día metes PNG/JPG en /videos
                  // (Next/Image no soporta rutas dinámicas sin configuración extra aquí)
                  <img
                    src={item.src}
                    alt={item.title || item.slug}
                    className="w-full h-[450px] object-cover"
                    loading="lazy"
                  />
                )}
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
}
