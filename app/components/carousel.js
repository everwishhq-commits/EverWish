"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const cards = [
  { id: 1, title: "Template 1", img: "/cards/birthday.png" },
  { id: 2, title: "Template 2", img: "/cards/congrats.png" },
  { id: 3, title: "Template 3", img: "/cards/baby.png" },
  { id: 4, title: "Template 4", img: "/cards/love.png" },
  { id: 5, title: "Template 5", img: "/cards/graduation.png" },
  { id: 6, title: "Template 6", img: "/cards/condolences.png" },
  { id: 7, title: "Template 7", img: "/cards/gifts.png" },
  { id: 8, title: "Template 8", img: "/cards/anniversary.png" },
];

export default function Carousel() {
  return (
    <div className="w-full flex flex-col items-center py-10 bg-[#EAF6FA]">
      <h2 className="text-2xl font-bold mb-6">Top 10</h2>
      <Swiper
        centeredSlides={true}
        slidesPerView={3} // 🔑 se ven 3 (2 lados + 1 centro)
        spaceBetween={-40} // 🔑 se superponen un poco
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl"
      >
        {cards.map((card, i) => (
          <SwiperSlide
            key={card.id}
            className="flex justify-center transition-all duration-500"
          >
            {({ isActive }) => (
              <div
                className={`${
                  isActive ? "scale-110 shadow-2xl z-20" : "scale-90 opacity-70"
                } bg-white rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-500`}
                style={{ width: "260px", height: "340px" }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
