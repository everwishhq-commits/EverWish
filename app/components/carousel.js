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
    <div className="relative py-14 overflow-visible"> 
      <Swiper
        loop={true}
        centeredSlides={true}
        slidesPerView={3}
        spaceBetween={30}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl overflow-visible" // 🔥 importante: no cortar
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center aspect-[3/4] transition-all duration-500 ${card.color}
                ${
                  isActive
                    ? "scale-110 z-50"   // zoom central
                    : "scale-90 opacity-70 z-10"
                }`}
              >
                <span className="text-5xl md:text-6xl mb-4">{card.icon}</span>
                <h3
                  className={`font-semibold ${
                    isActive ? "text-lg md:text-xl" : "text-sm md:text-base"
                  }`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots más cerca del carrusel */}
      <div className="flex justify-center mt-6 mb-6 custom-pagination" />
    </div>
  );
}
