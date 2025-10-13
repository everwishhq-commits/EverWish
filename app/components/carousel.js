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

  // 👉 Pantalla completa + envío al editor
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
        key={videos.length}
        modules={[Pagination, Autoplay]}
        loop={true}
        centeredSlides={true}
        watchSlidesProgress={true}
        grabCursor={true}
        speed={900}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active bg-pink-500",
        }}
        slidesPerView={"auto"}
        spaceBetween={25}
        initialSlide={1} // 👈 empieza desde la segunda tarjeta
        loopedSlides={videos.length} // 🔁 mantiene loop continuo
        onSwiper={(swiper) => {
          // Asegura que el autoplay arranque en la correcta
          setTimeout(() => swiper.slideToLoop(1, 0), 150);
        }}
        className="w-full max-w-5xl select-none"
      >
        {videos.map((video, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: "300px",
              maxWidth: "80vw",
            }}
          >
            {({ isActive }) => (
              <div
                onClick={() => handleClick(video.slug)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive
                    ? "scale-105 opacity-100 z-50"
                    : "scale-90 opacity-60 z-10"
                }`}
              >
                {video.src?.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={video.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[420px] object-cover"
                  />
                ) : (
                  <img
                    src={video.src}
                    alt={video.title || `card-${index}`}
                    className="w-full h-[420px] object-cover"
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
