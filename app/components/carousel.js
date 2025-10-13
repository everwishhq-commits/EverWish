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

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data.slice(0, 10));
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }
    fetchVideos();
  }, []);

  // 🔹 Pantalla completa + envío al editor
  const handleClick = async (slug) => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch (err) {
      console.warn("⚠️ Fullscreen no soportado:", err);
    }
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10">
      <Swiper
        key={videos.length} // asegura actualización limpia
        centeredSlides={true}
        loop={true} // 🔁 loop infinito real
        grabCursor={true}
        speed={900}
        autoplay={{
          delay: 2600,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false, // 🔹 evita que se detenga
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active bg-pink-500",
        }}
        modules={[Pagination, Autoplay]}
        slidesPerView={1.2}
        spaceBetween={15}
        breakpoints={{
          480: { slidesPerView: 1.6, spaceBetween: 20 },
          768: { slidesPerView: 2.2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        onAutoplayStop={(swiper) => swiper.autoplay.start()} // seguridad extra
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
                    alt={video.title || `card-${index}`}
                    className="w-full h-[450px] object-cover"
                  />
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
                }
