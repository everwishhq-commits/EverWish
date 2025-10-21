"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Carousel() {
  return (
    <Swiper spaceBetween={20} slidesPerView={1.2}>
      {[1, 2, 3].map((i) => (
        <SwiperSlide key={i}>
          <div className="bg-pink-50 rounded-xl p-6 text-center shadow-sm">
            <p>Card {i}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
