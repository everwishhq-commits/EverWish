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
    // 🔴 Contenedor más alto y con más espacio
    <div className="relative mt-14 py-16 min-h-[620px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 10 },   // móvil → 3 visibles, más compactas
          640: { slidesPerView: 3, spaceBetween: 25 },   // tablet
          1024: { slidesPerView: 3, spaceBetween: 50 },  // desktop
        }}
        className="w-full max-w-6xl overflow-visible"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 aspect-[3/4] ${card.color}
                ${isActive ? "scale-125 z-30" : "scale-95 opacity-70 z-10"}`}
              >
                <span className="text-7xl mb-6">{card.icon}</span>
                <h3
                  className={`font-semibold ${
                    isActive ? "text-2xl" : "text-lg"
                  }`}
                >
                  {card.title}
                </h3>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots más cerca de las tarjetas, y menos espacio con categorías */}
      <div className="flex justify-center mt-6 mb-6 custom-pagination" />
    </div>
  );
}
