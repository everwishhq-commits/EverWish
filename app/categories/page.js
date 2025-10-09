"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

const categorySections = [
  {
    title: "Seasonal & Holidays 🎉",
    items: [
      { name: "New Year’s Day", emoji: "🎆", color: "bg-blue-100", slug: "new-year" },
      { name: "Valentine’s Day", emoji: "💘", color: "bg-pink-200", slug: "valentines" },
      { name: "Easter", emoji: "🐣", color: "bg-purple-100", slug: "easter" },
      { name: "Halloween", emoji: "🎃", color: "bg-orange-200", slug: "halloween" },
      { name: "Thanksgiving", emoji: "🦃", color: "bg-amber-200", slug: "thanksgiving" },
      { name: "Christmas", emoji: "🎄", color: "bg-green-100", slug: "christmas" },
    ],
  },
  {
    title: "Love & Emotions 💖",
    items: [
      { name: "Love & Romance", emoji: "💌", color: "bg-rose-200", slug: "love-romance" },
      { name: "Anniversary", emoji: "💍", color: "bg-pink-100", slug: "anniversary" },
      { name: "I Miss You", emoji: "💭", color: "bg-sky-100", slug: "missing-you" },
      { name: "Apology", emoji: "💐", color: "bg-yellow-100", slug: "apology" },
      { name: "Thinking of You", emoji: "☁️", color: "bg-indigo-100", slug: "thinking-of-you" },
    ],
  },
  {
    title: "Family & Relationships 👨‍👩‍👧‍👦",
    items: [
      { name: "Mother’s Day", emoji: "🌸", color: "bg-pink-200", slug: "mothers-day" },
      { name: "Father’s Day", emoji: "👔", color: "bg-blue-200", slug: "fathers-day" },
      { name: "New Baby", emoji: "👶", color: "bg-sky-200", slug: "new-baby" },
      { name: "Grandparents", emoji: "👵", color: "bg-yellow-200", slug: "grandparents" },
    ],
  },
  {
    title: "Work & Professional 💼",
    items: [
      { name: "Teacher’s Day", emoji: "🍎", color: "bg-rose-100", slug: "teachers-day" },
      { name: "Nurses Week", emoji: "🩺", color: "bg-teal-200", slug: "nurses-week" },
      { name: "Doctor’s Day", emoji: "⚕️", color: "bg-blue-100", slug: "doctors-day" },
      { name: "Police Appreciation", emoji: "👮‍♂️", color: "bg-gray-100", slug: "police-day" },
      { name: "Firefighters Day", emoji: "🚒", color: "bg-orange-100", slug: "firefighters-day" },
    ],
  },
  {
    title: "Everyday Moments 🌞",
    items: [
      { name: "Good Morning", emoji: "🌅", color: "bg-orange-100", slug: "good-morning" },
      { name: "Good Night", emoji: "🌙", color: "bg-indigo-100", slug: "good-night" },
      { name: "Just Because", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
      { name: "Humor", emoji: "😂", color: "bg-rose-100", slug: "humor" },
      { name: "Pets & Animals", emoji: "🐾", color: "bg-green-100", slug: "pets" },
    ],
  },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  // Combinar todas las categorías para búsqueda global
  const allItems = categorySections.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title }))
  );

  const filteredItems = allItems.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim().length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pink-50 text-center pt-24 pb-16 px-4 transition-colors duration-700">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Explore our Categories</h1>
        <p className="text-gray-700 mb-8">Find the perfect card for every moment 💌</p>

        {/* Barra de búsqueda global */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full max-w-md mx-auto block p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Si hay búsqueda, mostrar solo resultados */}
        {isSearching ? (
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((cat, i) => (
                <Link key={i} href={`/categories/${cat.slug}`}>
                  <div
                    className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                  >
                    <span className="text-4xl mb-2">{cat.emoji}</span>
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{cat.section}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No matches found — try “Create with AI” 🤖
            </p>
          )
        ) : (
          // Diseño Netflix normal
          categorySections.map((section, index) => (
            <div key={index} className="mb-10 transition-all duration-500">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
                <span className="text-gray-400 text-sm">View all →</span>
              </div>

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
                {section.items.map((cat, i) => (
                  <SwiperSlide key={i}>
                    <Link href={`/categories/${cat.slug}`}>
                      <div
                        className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                      >
                        <span className="text-4xl mb-2">{cat.emoji}</span>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
