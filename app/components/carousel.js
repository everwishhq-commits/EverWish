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

  // 🎬 Click = pantalla completa + redirección
  const handleClick = async (slug, e) => {
    e.preventDefault(); // 🚫 evita que el click interfiera con Swiper (corrige dots)
    e.stopPropagation();
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
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={25}
        speed={850}
        grabCursor={true}
        watchSlidesProgress={true}
        loop={true}
        loopAdditionalSlides={videos.length}
        initialSlide={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: false, // 🚫 evita desincronización
          renderBullet: (index, className) =>
            `<span class="${className}" style="
              background-color: #ffcce0;
              width: 8px;
              height: 8px;
              margin: 0 4px;
              border-radius: 50%;
              display: inline-block;
              opacity: 0.6;
            "></span>`,
        }}
        onSlideChange={(swiper) => {
          // 🔄 sincroniza manualmente los dots con el slide activo
          const bullets = document.querySelectorAll(".swiper-pagination-bullet");
          bullets.forEach((b, i) => {
            if (i === swiper.realIndex) {
              b.style.opacity = "1";
              b.style.backgroundColor = "#ff7eb9"; // 🌸 rosado activo Everwish
            } else {
              b.style.opacity = "0.5";
              b.style.backgroundColor = "#ffcce0";
            }
          });
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
                onClick={(e) => handleClick(video.slug, e)}
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
