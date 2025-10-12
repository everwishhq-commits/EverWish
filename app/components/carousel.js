"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  // 🔹 Cargar los videos desde la API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Error al cargar los videos");
        const data = await res.json();
        setVideos(data.slice(0, 10)); // Top 10
      } catch (error) {
        console.error("❌ Error al obtener videos:", error);
      }
    }
    fetchVideos();
  }, []);

  // 🔹 Pantalla completa + redirección inmediata al editor
  const handleClick = async (slug) => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch (err) {
      console.warn("⚠️ Fullscreen not supported:", err);
    }
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        centeredSlides
        loop={true} // 🔁 Bucle infinito
        grabCursor={true} // ✋ Cursor tipo "grip" al pasar
        speed={900} // ⚡ Velocidad de transición entre slides
        autoplay={{
          delay: 3000, // ⏱️ Cada 3 segundos cambia
          disableOnInteraction: false, // sigue el autoplay incluso si el usuario toca
          pauseOnMouseEnter: true, // pausa al pasar el mouse
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 1.4, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl select-none"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                onClick={() => handleClick(video.slug)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive ? "scale-105 z-50" : "scale-90 opacity-70 z-10"
                }`}
              >
                {video.src?.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={video.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[450px] object-cover"
                  />
                ) : (
                  <img
                    src={video.src}
                    alt={video.title}
                    className="w-full h-[450px] object-cover"
                  />
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
                }
