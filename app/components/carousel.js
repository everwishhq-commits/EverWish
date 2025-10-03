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
  { title: "Anniversary", icon: "💍", color: "bg-red-200" },
  { title: "Get Well", icon: "🌸", color: "bg-teal-200" },
  { title: "New Home", icon: "🏡", color: "bg-indigo-200" },
];

export default function Carousel() {
  return (
    <div className="py-12">
      <Swiper
        loop={true}  // 🔄 ciclo infinito
        centeredSlides={true}
        initialSlide={0}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 20 },   // móvil
          640: { slidesPerView: 2.2, spaceBetween: 30 },   // tablet
          1024: { slidesPerView: 3, spaceBetween: 40 },    // desktop
        }}
        className="w-full max-w-5xl"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 aspect-[3/4] ${card.color}
                ${isActive ? "scale-105 z-30" : "scale-95 opacity-70 z-10"}`}
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

      {/* Dots más cerca de categorías */}
      <div className="flex justify-center mt-4 mb-4 custom-pagination" />
    </div>
  );
}
