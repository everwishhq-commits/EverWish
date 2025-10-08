"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🔹 Categorías divididas por grupo tipo Netflix
const categoryGroups = [
  {
    title: "Seasonal 🎉",
    items: [
      { name: "New Year", emoji: "🎆", color: "bg-yellow-200", slug: "new-year" },
      { name: "Valentine’s Day", emoji: "❤️", color: "bg-pink-200", slug: "valentines" },
      { name: "Easter", emoji: "🐣", color: "bg-purple-200", slug: "easter" },
      { name: "Halloween", emoji: "🎃", color: "bg-orange-300", slug: "halloween" },
      { name: "Thanksgiving", emoji: "🦃", color: "bg-amber-200", slug: "thanksgiving" },
      { name: "Christmas", emoji: "🎄", color: "bg-green-200", slug: "christmas" },
      { name: "4th of July", emoji: "🇺🇸", color: "bg-blue-200", slug: "4th-of-july" },
    ],
  },
  {
    title: "Celebrations 🥳",
    items: [
      { name: "Birthday", emoji: "🎂", color: "bg-pink-200", slug: "birthday" },
      { name: "Graduation", emoji: "🎓", color: "bg-green-200", slug: "graduation" },
      { name: "Baby Shower", emoji: "👶", color: "bg-blue-200", slug: "baby" },
      { name: "Anniversary", emoji: "💍", color: "bg-yellow-100", slug: "anniversary" },
      { name: "New Home", emoji: "🏡", color: "bg-teal-200", slug: "new-home" },
      { name: "Job Promotion", emoji: "💼", color: "bg-indigo-200", slug: "promotion" },
    ],
  },
  {
    title: "Emotions 💖",
    items: [
      { name: "Love", emoji: "💌", color: "bg-red-200", slug: "love" },
      { name: "Friendship", emoji: "🤝", color: "bg-blue-100", slug: "friendship" },
      { name: "Motivation", emoji: "🚀", color: "bg-amber-100", slug: "motivation" },
      { name: "Condolences", emoji: "🕊️", color: "bg-gray-200", slug: "condolences" },
      { name: "Thank You", emoji: "🙏", color: "bg-lime-200", slug: "thank-you" },
    ],
  },
  {
    title: "Other Occasions 🌟",
    items: [
      { name: "Get Well Soon", emoji: "🌻", color: "bg-yellow-100", slug: "get-well-soon" },
      { name: "Just Because", emoji: "🌈", color: "bg-pink-100", slug: "just-because" },
      { name: "Apology", emoji: "💐", color: "bg-rose-100", slug: "apology" },
      { name: "Surprise", emoji: "🎁", color: "bg-purple-100", slug: "surprise" },
      { name: "Good Luck", emoji: "🍀", color: "bg-green-100", slug: "good-luck" },
    ],
  },
];

export default function Categories() {
  const router = useRouter();

  return (
    <div className="w-full space-y-14">
      {/* 🔍 Buscador global arriba */}
      <div className="mb-8 text-center">
        <input
          type="text"
          placeholder="Search any card or theme..."
          className="w-full max-w-md rounded-full px-5 py-3 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* 🔹 Carruseles por grupo */}
      {categoryGroups.map((group, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold mb-4 text-left">{group.title}</h2>

          <Swiper
            slidesPerView={2.2}
            spaceBetween={20}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 3.2, spaceBetween: 25 },
              1024: { slidesPerView: 5, spaceBetween: 35 },
            }}
            modules={[Pagination, Autoplay]}
            className="pb-6"
          >
            {group.items.map((cat, i) => (
              <SwiperSlide key={i}>
                <div
                  onClick={() => router.push(`/category/${cat.slug}`)}
                  className={`cursor-pointer flex flex-col items-center justify-center rounded-2xl shadow-lg ${cat.color} py-6 hover:scale-110 transition-transform`}
                >
                  <span className="text-5xl mb-2">{cat.emoji}</span>
                  <p className="text-sm font-semibold text-gray-800">
                    {cat.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
    }
