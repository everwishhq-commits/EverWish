"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

export default function Carousel() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/top10.json")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  return (
    <div className="relative mt-2 py-6 min-h-[520px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 10 },
          480: { slidesPerView: 1.4, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 h-[400px]">
              <img
                src={card.src}
                alt={card.title}
                className="w-full h-64 object-contain rounded-t-2xl"
              />
              <h3 className="mt-2 font-bold text-lg">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.category}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots */}
      <div className="flex justify-center mt-4 mb-2 custom-pagination" />
    </div>
  );
}
