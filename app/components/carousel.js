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
    <div className="relative py-16 min-h-[520px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true} // 🔄 ciclo infinito
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 10 },   // móvil
          640: { slidesPerView: 3, spaceBetween: 20 },   // tablet
          1024: { slidesPerView: 3, spaceBetween: 40 },  // desktop
        }}
        className="w-full max-w-5xl overflow-visible"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 aspect-[3/4] ${card.color}
                ${isActive ? "scale-120 z-30" : "scale-90 opacity-70 z-10"}`}
              >
                <span className="text-6xl mb-4">{card.icon}</span>
                <h3
                  className={`font-semibold ${
                    isActive ? "text-xl" : "text-base"
                  }`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots debajo del carrusel */}
      <div className="flex justify-center mt-6 custom-pagination" />
    </div>
  );
}
