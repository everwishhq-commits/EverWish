"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🔹 Categorías principales resumidas
const mainCategories = [
  { name: "Seasonal", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal" },
  { name: "Celebrations", emoji: "🥳", color: "bg-pink-200", slug: "celebrations" },
  { name: "Emotions", emoji: "💖", color: "bg-red-200", slug: "emotions" },
  { name: "Other Occasions", emoji: "🌟", color: "bg-blue-200", slug: "other-occasions" },
  { name: "Gifts", emoji: "🎁", color: "bg-purple-200", slug: "gifts" },
  { name: "AI Creations", emoji: "🤖", color: "bg-green-200", slug: "ai-creations" },
];

export default function CategoriesHome() {
  const router = useRouter();

  return (
    <div className="w-full text-center mt-12">
      {/* 🔹 Título principal */}
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {/* 🔹 Carrusel compacto tipo Netflix */}
      <Swiper
        slidesPerView={2.2}
        spaceBetween={20}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        modules={[Pagination, Autoplay]}
        className="pb-6"
      >
        {mainCategories.map((cat, i) => (
          <SwiperSlide key={i}>
            <div
              onClick={() => router.push("/categories")}
              className={`cursor-pointer flex flex-col items-center justify-center rounded-2xl shadow-md ${cat.color} py-6 hover:scale-110 transition-transform`}
            >
              <span className="text-5xl mb-2">{cat.emoji}</span>
              <p className="text-sm font-semibold">{cat.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
          }
