"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const router = useRouter();

  // 🔹 Cargar los videos desde la API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Error al cargar videos");
        const data = await res.json();
        setVideos(data.slice(0, 10)); // Solo 10
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
    fetchVideos();
  }, []);

  // 🔸 Efecto pantalla completa + redirección
  useEffect(() => {
    if (selectedVideo) {
      const timer = setTimeout(() => {
        router.push(`/edit/${selectedVideo.slug}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedVideo, router]);

  return (
    <div className="relative mt-8 mb-10">
      {/* 🌀 Carrusel principal */}
      <Swiper
        centeredSlides
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
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
        {videos.map((video, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div
                onClick={() => setSelectedVideo(video)}
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-500 cursor-pointer ${
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

      {/* 🔹 Modal de pantalla completa */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
          onClick={() => setSelectedVideo(null)}
        >
          <video
            src={selectedVideo.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
                }
