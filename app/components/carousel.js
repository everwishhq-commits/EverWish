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
    <div className="relative mt-6 py-8 min-h-[520px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },   // 📱 móvil → 1 y parte de los lados
          640: { slidesPerView: 2.2, spaceBetween: 20 },   // 📲 tablet
          1024: { slidesPerView: 3, spaceBetween: 40 },    // 💻 desktop
        }}
        className="w-full max-w-6xl overflow-visible"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center 
                            transition-all duration-500 aspect-[3/4] ${card.color}
                ${isActive 
                  ? "scale-125 z-50 h-[480px]"   // 🔥 la del medio más grande
                  : "scale-90 opacity-70 z-10 h-[400px]"}`
                }
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

      {/* Dots fijos */}
      <div className="flex justify-center mt-6 mb-4 custom-pagination" />
    </div>
  );
}
