"use client";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🔹 Archivos de /public/videos/
const templates = [
  { slug: "ghost_halloween_love_1A", src: "/videos/ghost_halloween_love_1A.mp4" },
  { slug: "pumpkin_halloween_general_1A", src: "/videos/pumpkin_halloween_general_1A.mp4" },
  { slug: "zombie_halloween_birthday_1A", src: "/videos/zombie_halloween_birthday_1A.mp4" },
];

export default function Carousel() {
  const router = useRouter();

  // Pantalla completa + redirección
  const handleClick = async (slug) => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="relative mt-8 mb-10 pb-8">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        grabCursor={true}
        speed={850}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          480: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full max-w-5xl select-none"
      >
        {templates.map((tpl, index) => (
          <SwiperSlide
            key={index}
            className="!w-[280px] sm:!w-[300px] md:!w-[340px] flex justify-center"
          >
            {({ isActive }) => (
              <div
                onClick={() => handleClick(tpl.slug)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isActive
                    ? "scale-105 opacity-100 z-50"
                    : "scale-90 opacity-60 z-10"
                }`}
              >
                {tpl.src.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={tpl.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-[420px] object-cover bg-white"
                  />
                ) : (
                  <img
                    src={tpl.src}
                    alt={tpl.slug}
                    className="w-full h-[420px] object-cover bg-white"
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
