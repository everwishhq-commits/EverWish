"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const templates = [
  { title: "Have a Magical Day", category: "Birthday", image: "/top10/unicorn.png" },
  { title: "Welcome Little One", category: "Baby", image: "/top10/elephant.png" },
  { title: "Besos y Abrazos", category: "Love", image: "/top10/besos.png" },
  { title: "Graduation Day", category: "Graduation", image: "/top10/graduation.png" },
  { title: "Thank You", category: "Thanks", image: "/top10/thankyou.png" },
  { title: "Love Forever", category: "Love", image: "/top10/love.png" },
  { title: "Baby Celebration", category: "Baby", image: "/top10/baby.png" },
  { title: "Special Gift", category: "Gifts", image: "/top10/gifts.png" },
  { title: "Condolences", category: "Condolences", image: "/top10/condolences.png" },
  { title: "Birthday Wishes", category: "Birthday", image: "/top10/birthday.png" }
];

export default function Carousel() {
  return (
    <div className="relative mt-4 py-6 min-h-[480px] overflow-visible">
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 10 },
          480: { slidesPerView: 1.5, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="w-full max-w-5xl overflow-visible"
      >
        {templates.map((card, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-500 bg-white
                ${isActive ? "scale-110 z-50 h-[420px]" : "scale-90 opacity-70 z-10 h-[360px]"}`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-3/4 object-contain rounded-t-2xl"
                />
                <h3 className={`font-bold mt-2 ${isActive ? "text-xl" : "text-base"}`}>
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500">{card.category}</p>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots */}
      <div className="flex justify-center mt-4 mb-4 custom-pagination" />
    </div>
  );
}
