"use client";
import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const categoryGroups = [
  {
    title: "Seasonal & Holidays",
    slug: "seasonal",
    categories: [
      { name: "Christmas", emoji: "🎄" },
      { name: "New Year", emoji: "🎆" },
      { name: "Valentine’s Day", emoji: "💘" },
      { name: "Easter", emoji: "🐣" },
      { name: "Halloween", emoji: "🎃" },
      { name: "Thanksgiving", emoji: "🦃" },
      { name: "4th of July", emoji: "🇺🇸" },
    ],
  },
  {
    title: "Love & Emotions",
    slug: "emotions",
    categories: [
      { name: "Romantic", emoji: "❤️" },
      { name: "Friendship", emoji: "🤝" },
      { name: "Apology", emoji: "😔" },
      { name: "Missing You", emoji: "💭" },
      { name: "Encouragement", emoji: "🌟" },
      { name: "Thank You", emoji: "🙏" },
    ],
  },
  {
    title: "Celebrations & Events",
    slug: "celebrations",
    categories: [
      { name: "Birthday", emoji: "🎂" },
      { name: "Wedding", emoji: "💍" },
      { name: "Baby Shower", emoji: "👶" },
      { name: "Graduation", emoji: "🎓" },
      { name: "Anniversary", emoji: "💞" },
      { name: "Retirement", emoji: "🏆" },
    ],
  },
  {
    title: "Everyday Moments",
    slug: "everyday",
    categories: [
      { name: "Motivation", emoji: "🔥" },
      { name: "Pets", emoji: "🐾" },
      { name: "Good Morning", emoji: "🌅" },
      { name: "Good Night", emoji: "🌙" },
      { name: "Just Because", emoji: "💌" },
      { name: "Humor", emoji: "😂" },
    ],
  },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  // Filtrado global por texto
  const filteredGroups = categoryGroups.map(group => ({
    ...group,
    categories: group.categories.filter(cat =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const hasResults = filteredGroups.some(group => group.categories.length > 0);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      {/* 🔍 Barra de búsqueda */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Categories</h1>
        <input
          type="text"
          placeholder="Search for any category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 px-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-700"
        />
      </div>

      {/* 🎞️ Carruseles */}
      <div className="space-y-14">
        {hasResults ? (
          filteredGroups.map((group, i) =>
            group.categories.length > 0 ? (
              <div key={i}>
                {/* Título de grupo */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {group.title}
                  </h2>
                  <Link
                    href={`/categories/${group.slug}`}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View all →
                  </Link>
                </div>

                {/* Carrusel tipo Netflix */}
                <Swiper
                  slidesPerView={2.3}
                  spaceBetween={15}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 3.5, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 25 },
                  }}
                  modules={[Autoplay]}
                  className="overflow-visible"
                >
                  {group.categories.map((cat, j) => (
                    <SwiperSlide key={j}>
                      <Link
                        href={`/categories/${group.slug}/${cat.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center justify-center aspect-square">
                          <span className="text-5xl mb-2">{cat.emoji}</span>
                          <p className="font-semibold text-sm text-gray-800">
                            {cat.name}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : null
          )
        ) : (
          <p className="text-center text-gray-500">No categories found 😢</p>
        )}
      </div>
    </main>
  );
  }
