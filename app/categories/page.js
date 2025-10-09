"use client";

import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";

const mainCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", color: "bg-yellow-200", slug: "seasonal-holidays" },
  { name: "Birthdays", emoji: "🎂", color: "bg-pink-200", slug: "birthdays" },
  { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-200", slug: "family-relationships" },
  { name: "Babies & Parenting", emoji: "👶", color: "bg-sky-200", slug: "babies-parenting" },
  { name: "Weddings & Anniversaries", emoji: "💍", color: "bg-indigo-200", slug: "weddings-anniversaries" },
  { name: "Congratulations & Milestones", emoji: "🏆", color: "bg-amber-200", slug: "congrats-milestones" },
  { name: "School & Graduation", emoji: "🎓", color: "bg-lime-200", slug: "school-graduation" },
  { name: "Work & Professional", emoji: "💼", color: "bg-cyan-200", slug: "work-professional" },
  { name: "House & Moving", emoji: "🏡", color: "bg-emerald-200", slug: "house-moving" },
  { name: "Health & Support", emoji: "🩺", color: "bg-teal-200", slug: "health-support" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", color: "bg-gray-200", slug: "sympathy-remembrance" },
  { name: "Encouragement & Motivation", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement-motivation" },
  { name: "Thank You & Appreciation", emoji: "🙏", color: "bg-violet-200", slug: "thank-you-appreciation" },
  { name: "Invitations & Events", emoji: "✉️", color: "bg-fuchsia-200", slug: "invitations-events" },
  { name: "Spiritual & Mindfulness", emoji: "🕯️", color: "bg-orange-200", slug: "spiritual-mindfulness" },
  { name: "Art & Cultural", emoji: "🎨", color: "bg-stone-200", slug: "art-cultural" },
  { name: "Kids & Teens", emoji: "🧸", color: "bg-purple-200", slug: "kids-teens" },
  { name: "Humor & Memes", emoji: "😄", color: "bg-rose-100", slug: "humor-memes" },
  { name: "Pets & Animal Lovers", emoji: "🐾", color: "bg-green-100", slug: "pets" },
  { name: "Just Because & Everyday", emoji: "💌", color: "bg-blue-100", slug: "just-because" },
  { name: "Gifts & Surprises", emoji: "🎁", color: "bg-purple-100", slug: "gifts-surprises" },
  { name: "Inspirations & Quotes", emoji: "📝", color: "bg-slate-200", slug: "inspirations-quotes" },
  { name: "Custom & AI Creations", emoji: "🤖", color: "bg-teal-100", slug: "custom-ai" },
];

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="relative min-h-screen">
      {/* 🌈 Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 bg-[length:400%_400%] animate-[gradientShift_25s_ease_infinite]" />

      {/* Contenido principal */}
      <div className="relative z-10">
        <Header />

        <main className="pt-28 px-4 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800">
            Explore All Categories
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Discover every reason to send love, joy, and celebration 🎉
          </p>

          {/* Carruseles tipo Netflix */}
          {mainCategories.map((cat, i) => (
            <section key={i} className="mb-14">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {cat.name}
                </h2>
                <button
                  onClick={() =>
                    setExpanded(expanded === i ? null : i)
                  }
                  className="text-sm md:text-base font-semibold text-blue-600 hover:underline transition"
                >
                  {expanded === i ? "Close ↑" : "View all →"}
                </button>
              </div>

              {expanded === i ? (
                // Grid expanded
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div
                      key={j}
                      className={`${cat.color} rounded-3xl shadow-md p-6 flex flex-col items-center justify-center aspect-square`}
                    >
                      <span className="text-5xl mb-3">{cat.emoji}</span>
                      <p className="font-semibold text-gray-700">{cat.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                // Carrusel horizontal
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
                  {Array.from({ length: 8 }).map((_, j) => (
                    <SwiperSlide key={j}>
                      <Link href={`/categories/${cat.slug}`}>
                        <div
                          className={`${cat.color} rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                        >
                          <span className="text-5xl mb-3">{cat.emoji}</span>
                          <p className="font-semibold text-sm md:text-base text-gray-800">
                            {cat.name}
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </section>
          ))}
        </main>

        <Footer />
      </div>
    </div>
  );
    }
