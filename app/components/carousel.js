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

  // Pantalla completa + envío al editor
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
        key={videos.length} // fuerza reinicio si cambia lista
        centeredSlides
        loop={true}
        rewind={false}
        grabCursor={true}
        speed={850}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 1.5, spaceBetween: 15 },
          768: { slidesPerView: 2, spaceBetween: 20 },
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
    </div>
  );
          }
