"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const templates = [
  { title: "Birthday", icon: "🎂", color: "bg-yellow-100" },
  { title: "Baby", icon: "👶", color: "bg-blue-100" },
  { title: "Love", icon: "❤️", color: "bg-pink-100" },
  { title: "Graduation", icon: "🎓", color: "bg-green-100" },
  { title: "Condolences", icon: "🕊️", color: "bg-gray-100" },
  { title: "Gifts", icon: "🎁", color: "bg-orange-100" },
  { title: "Thank You", icon: "🙏", color: "bg-purple-100" },
];

export default function Carousel() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <Swiper
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 20 }, // 📱 móvil → una tarjeta al centro y bordes a los lados
          640: { slidesPerView: 2.5, spaceBetween: 30 }, // tablet
          1024: { slidesPerView: 3, spaceBetween: 40 },  // desktop
        }}
        className="w-full max-w-md"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-3xl flex flex-col items-center justify-center 
                  transition-all duration-500 ${card.color}
                  ${isActive ? "scale-105 shadow-lg" : "scale-95 opacity-70"}
                  w-full aspect-[3/4]`}
              >
                <span className="text-6xl mb-3">{card.icon}</span>
                <h3
                  className={`font-bold ${
                    isActive ? "text-xl" : "text-base text-gray-600"
                  }`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots cerca de la tarjeta */}
      <div className="custom-pagination mt-3" />
    </div>
  );
}
