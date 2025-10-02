"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const cards = [
  { id: 1, title: "Card 1", image: "/card1.png" },
  { id: 2, title: "Card 2", image: "/card2.png" },
  { id: 3, title: "Card 3", image: "/card3.png" },
  { id: 4, title: "Card 4", image: "/card4.png" },
  { id: 5, title: "Card 5", image: "/card5.png" },
];

export default function Carousel() {
  return (
    <div className="w-full py-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Top 10</h2>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full max-w-4xl"
      >
        {cards.map((card) => (
          <SwiperSlide
            key={card.id}
            className="w-64 h-80 flex items-center justify-center bg-pink-200 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={card.image}
              alt={card.title}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
