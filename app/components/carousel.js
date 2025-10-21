"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Carousel() {
  if (typeof window === "undefined") return null; // 🚫 Evita error en prerender

  const slides = [
    { img: "/cards/pumpkin_halloween_general.png", text: "Halloween Fun 🎃" },
    { img: "/cards/mother_mothersday_general.png", text: "Mother’s Love 💐" },
    { img: "/cards/zombie_halloween_birthday.png", text: "Spooky Birthday 🧁" },
  ];

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1.2}
        spaceBetween={15}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        modules={[Autoplay]}
        className="rounded-3xl overflow-hidden shadow-md"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
              <img
                src={slide.img}
                alt={slide.text}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-0 right-0 text-center text-white font-semibold text-lg drop-shadow-md">
                {slide.text}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
