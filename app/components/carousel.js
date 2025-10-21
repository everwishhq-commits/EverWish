"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Carousel() {
  const items = [
    { title: "Pumpkin Halloween", img: "/images/pumpkin_halloween.png" },
    { title: "Ghost Halloween", img: "/images/ghost_halloween.png" },
    { title: "Zombie Halloween", img: "/images/zombie_halloween.png" },
  ];

  return (
    <div className="w-full max-w-4xl">
      <Swiper spaceBetween={20} slidesPerView={1.2}>
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center">
              <img
                src={item.img}
                alt={item.title}
                className="rounded-lg mb-3 w-full h-64 object-cover"
              />
              <p className="font-medium text-gray-700">{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
