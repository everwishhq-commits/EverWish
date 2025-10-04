"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const [templates, setTemplates] = useState([]);

  // Llamada a la API
  useEffect(() => {
    fetch("/api/top10")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  return (
    <div className="relative mt-6">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 10 },
          640: { slidesPerView: 2.2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        className="w-full max-w-5xl"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
              <img
                src={card.src}
                alt={card.title}
                className="w-full h-64 object-cover"
              />
              <h3 className="text-lg font-semibold text-center py-2">
                {card.title}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
