"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const categories = [
  { name: "Birthday", color: "bg-pink-200", emoji: "🎂", slug: "birthday" },
  { name: "Congrats", color: "bg-yellow-200", emoji: "⭐", slug: "congrats" },
  { name: "Baby", color: "bg-blue-200", emoji: "👶", slug: "baby" },
  { name: "Love", color: "bg-red-200", emoji: "❤️", slug: "love" },
  { name: "Graduation", color: "bg-green-200", emoji: "🎓", slug: "graduation" },
  { name: "Gifts", color: "bg-purple-200", emoji: "🎁", slug: "gifts" },
  { name: "Christmas", color: "bg-green-300", emoji: "🎄", slug: "christmas" },
  { name: "Halloween", color: "bg-orange-300", emoji: "🎃", slug: "halloween" },
  { name: "Thank You", color: "bg-lime-200", emoji: "🙏", slug: "thank-you" },
];

export default function Categories() {
  const router = useRouter();

  return (
    <div className="w-full text-center">
      {/* 🔹 Título principal */}
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {/* 🔹 Carrusel horizontal tipo Netflix */}
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 25 }, // celulares grandes
          768: { slidesPerView: 5, spaceBetween: 30 }, // tablet
          1024: { slidesPerView: 6, spaceBetween: 35 }, // desktop
        }}
        modules={[Pagination, Autoplay]}
        className="pb-6"
      >
        {categories.map((cat, i) => (
          <SwiperSlide key={i}>
            <div
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center shadow-md text-3xl group-hover:scale-110 transition-transform`}
              >
                {cat.emoji}
              </div>
              <p className="mt-2 text-sm font-semibold">{cat.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
                }
