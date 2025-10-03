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
    <div className="py-10">
      <Swiper
        loop={true}
        centeredSlides={true}
        slidesPerView={3}
        spaceBetween={-60}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive, isPrev, isNext }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center aspect-[3/4] transition-all duration-500 ${card.color}
                ${
                  isActive
                    ? "scale-110 z-30" // central siempre adelante
                    : (isPrev || isNext)
                    ? "scale-95 opacity-70 z-10" // laterales siempre detrás
                    : "scale-90 opacity-50 z-0"
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

      {/* Dots */}
      <div className="flex justify-center mt-3 mb-6 custom-pagination" />
    </div>
  );
}
