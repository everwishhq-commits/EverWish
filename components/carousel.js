"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Carousel() {
  const slides = ["🎉", "💌", "🎃", "🐰"];
  return (
    <div className="w-full max-w-2xl">
      <Swiper spaceBetween={20} slidesPerView={1} loop>
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="text-center text-4xl p-10">{s}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
