"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [videos, setVideos] = useState([]);
  const [ready, setReady] = useState(false);

  // Cargar videos desde la API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Error al cargar los videos");
        const data = await res.json();

        // Si hay menos de 5 videos, completar con templates vacíos
        const filled = [
          ...data,
          ...Array.from({ length: Math.max(0, 5 - data.length) }).map(
            (_, i) => ({
              title: "New Everwish Card Coming Soon ✨",
              src: null,
              slug: `placeholder-${i}`,
              placeholder: true,
            })
          ),
        ];

        setVideos(filled);
        setTimeout(() => setReady(true), 300);
      } catch (error) {
        console.error("❌ Error al obtener videos:", error);
      }
    }
    fetchVideos();
  }, []);

  if (!ready) {
    return (
      <div className="w-full text-center text-gray-500 py-10">
        Loading Everwish moments...
      </div>
    );
  }

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        key={videos.length}
        centeredSlides
        loop={true}
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
                className={`rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-white transition-all duration-500 ${
                  isActive ? "scale-105 z-50" : "scale-90 opacity-70 z-10"
                }`}
                style={{ height: "450px" }}
              >
                {video.placeholder ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-400 p-6">
                    <img
                      src="/logo.png"
                      alt="Everwish Logo"
                      className="w-16 h-16 mb-4 opacity-70"
                    />
                    <p className="text-lg font-semibold">
                      {video.title}
                    </p>
                  </div>
                ) : (
                  <video
                    src={video.src}
                    title={video.title}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
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
