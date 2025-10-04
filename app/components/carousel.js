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
    <div className="relative mt-2 py-6 min-h-[520px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 15 },   // móvil
          640: { slidesPerView: 1.6, spaceBetween: 20 },   // tablet
          1024: { slidesPerView: 2.5, spaceBetween: 30 },  // desktop medio
          1280: { slidesPerView: 3, spaceBetween: 40 },    // desktop grande
        }}
        className="w-full overflow-visible"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 ${card.color}
                ${isActive
                  ? "scale-110 z-50 h-[400px] md:h-[420px] lg:h-[480px]"  // central más grande
                  : "scale-90 opacity-70 z-10 h-[320px] md:h-[360px] lg:h-[400px]"}`}
              >
                <span className={`${isActive ? "text-7xl" : "text-5xl"} mb-4`}>
                  {card.icon}
                </span>
                <h3
                  className={`font-semibold ${
                    isActive ? "text-2xl" : "text-base"
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
      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
}
