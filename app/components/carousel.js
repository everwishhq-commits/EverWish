"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const templates = [
  { title: "Birthday", icon: "🎂", color: "bg-yellow-200" },
  { title: "Baby", icon: "👶", color: "bg-blue-200" },
  { title: "Love", icon: "❤️", color: "bg-pink-200" },
  { title: "Graduation", icon: "🎓", color: "bg-green-200" },
  { title: "Condolences", icon: "🕊️", color: "bg-gray-200" },
  { title: "Gifts", icon: "🎁", color: "bg-orange-200" },
  { title: "Thank You", icon: "🙏", color: "bg-purple-200" },
];

export default function Carousel() {
  return (
    <div className="relative pt-12 pb-24 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 min-h-[600px] overflow-visible">
      <Swiper
        centeredSlides
        loop                     // ➜ ciclo infinito
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320:  { slidesPerView: 3, spaceBetween: 12 }, // móvil: 3 visibles
          640:  { slidesPerView: 3, spaceBetween: 20 }, // tablet
          1024: { slidesPerView: 3, spaceBetween: 32 }, // desktop
        }}
        className="w-full max-w-6xl overflow-visible"
      >
        {templates.map((card, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div
                className={[
                  "rounded-2xl shadow-lg flex flex-col items-center justify-center",
                  "transition-all duration-500",
                  "aspect-[3/4]",          // formato vertical
                  card.color,
                  isActive
                    ? "scale-[1.25] z-30" // centro más grande
                    : "scale-90 opacity-70 z-10",
                ].join(" ")}
              >
                <span className="text-6xl mb-4">{card.icon}</span>
                <h3 className={`font-semibold ${isActive ? "text-xl" : "text-base"}`}>
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots debajo del carrusel (pegados) */}
      <div className="custom-pagination flex justify-center mt-6" />
    </div>
  );
}
