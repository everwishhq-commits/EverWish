"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const top10 = [
  { img: "/top10/birthday.png" },
  { img: "/top10/love.png" },
  { img: "/top10/baby.png" },
  { img: "/top10/graduation.png" },
  { img: "/top10/gift.png" },
  { img: "/top10/condolences.png" },
  { img: "/top10/anniversary.png" },
  // ...agregas hasta 10
];

export default function Top10Carousel() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Swiper
        modules={[EffectCoverflow, Pagination, Autoplay]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2,
          scale: 0.8,
        }}
        pagination={{ clickable: true }}
        className="py-10"
      >
        {top10.map((item, index) => (
          <SwiperSlide
            key={index}
            className="w-[200px] md:w-[250px] lg:w-[280px] rounded-2xl shadow-lg"
          >
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={item.img}
                alt={`Top ${index + 1}`}
                width={300}
                height={400}
                className="object-contain w-full h-full rounded-2xl bg-white"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
