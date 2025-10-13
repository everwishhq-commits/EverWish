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

        // 🔸 Si hay menos de 10, repite para mantener loop fluido
        const filled =
          data.length < 10 ? [...data, ...data, ...data].slice(0, 10) : data;
        setVideos(filled);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }
    fetchVideos();
  }, []);

  // 🔹 Al hacer click → pantalla completa + redirección
  const handleClick = async (slug, e) => {
    e.preventDefault();
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
    <div className="relative mt-8 mb-10 pb-8">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1.2}
        spaceBetween={15}
        centeredSlides={true}
        loop={true} // ✅ loop real
        loopAdditionalSlides={10} // fuerza a duplicar slides para looping suave
        speed={850}
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false, // 🔁 sigue moviéndose aunque lo toques
        }}
        pagination={{
          clickable: false,
          renderBullet: (index, className) =>
            `<span class="${className}" style="
              background-color: #ffcce0;
              width: 7px;
              height: 7px;
              margin: 0 5px;
              border-radius: 50%;
              display: inline-block;
              opacity: 0.5;
              transition: all 0.3s ease;
            "></span>`,
        }}
        onSlideChange={(swiper) => {
          const bullets = document.querySelectorAll(".swiper-pagination-bullet");
          bullets.forEach((b, i) => {
            if (i === swiper.realIndex % videos.length) {
              b.style.opacity = "1";
              b.style.backgroundColor = "#ff7eb9";
              b.style.boxShadow = "0 0 6px 2px rgba(255,126,185,0.4)";
              b.style.transform = "scale(1.3)";
            } else {
              b.style.opacity = "0.5";
              b.style.backgroundColor = "#ffcce0";
              b.style.boxShadow = "none";
              b.style.transform = "scale(1)";
            }
          });
        }}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          480: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full max-w-5xl select-none"
      >
        {videos.map((video, index) => (
          <SwiperSlide
            key={index}
            className="!w-[280px] sm:!w-[300px] md:!w-[340px] flex justify-center"
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
