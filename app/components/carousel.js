"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const cards = [
  { id: 1, title: "Birthday", color: "bg-pink-200", img: "/cards/birthday.png" },
  { id: 2, title: "Congrats", color: "bg-yellow-200", img: "/cards/congrats.png" },
  { id: 3, title: "Baby", color: "bg-blue-200", img: "/cards/baby.png" },
  { id: 4, title: "Love", color: "bg-red-200", img: "/cards/love.png" },
  { id: 5, title: "Graduation", color: "bg-green-200", img: "/cards/graduation.png" },
  { id: 6, title: "Condolences", color: "bg-gray-200", img: "/cards/condolences.png" },
  { id: 7, title: "Gifts", color: "bg-purple-200", img: "/cards/gifts.png" },
  { id: 8, title: "Anniversary", color: "bg-indigo-200", img: "/cards/anniversary.png" },
];

export default function Carousel() {
  return (
    <div className="w-full flex flex-col items-center py-10 bg-[#EAF6FA]">
      <h2 className="text-2xl font-bold mb-6">Top 10</h2>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 300,   // 🔑 más profundidad
          modifier: 3,  // 🔑 agranda más la del centro
          scale: 0.7,   // 🔑 laterales más pequeñas
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full max-w-5xl"
      >
        {cards.map((card) => (
          <SwiperSlide
            key={card.id}
            className="!w-40 !h-56 md:!w-64 md:!h-80 flex items-center justify-center"
          >
            <div
              className={`${card.color} w-full h-full rounded-3xl flex flex-col items-center justify-center shadow-xl`}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-16 h-16 mb-4 object-contain"
              />
              <p className="font-semibold text-lg">{card.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
