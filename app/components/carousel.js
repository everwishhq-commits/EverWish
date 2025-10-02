"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const cards = [
  { id: 1, title: "Birthday", img: "/cards/birthday.png" },
  { id: 2, title: "Congrats", img: "/cards/congrats.png" },
  { id: 3, title: "Baby", img: "/cards/baby.png" },
  { id: 4, title: "Love", img: "/cards/love.png" },
  { id: 5, title: "Graduation", img: "/cards/graduation.png" },
  { id: 6, title: "Condolences", img: "/cards/condolences.png" },
  { id: 7, title: "Gifts", img: "/cards/gifts.png" },
  { id: 8, title: "Anniversary", img: "/cards/anniversary.png" },
];

export default function Carousel() {
  return (
    <div className="w-full flex flex-col items-center py-6 bg-[#EAF6FA]">
      <Swiper
        centeredSlides={true}
        slidesPerView={3} // 🔑 siempre 3 visibles (dos lados + central)
        spaceBetween={-60} // 🔑 se superponen un poco
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        className="w-full max-w-5xl"
      >
        {cards.map((card) => (
          <SwiperSlide
            key={card.id}
            className="flex justify-center transition-all duration-500"
          >
            {({ isActive }) => (
              <div
                className={`${
                  isActive
                    ? "scale-125 shadow-2xl z-20" // 🔑 la central más grande
                    : "scale-90 opacity-70"
                } bg-white rounded-3xl p-4 flex items-center justify-center transition-all duration-500`}
                style={{ width: "260px", height: "360px" }} // 🔑 tamaño base
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
