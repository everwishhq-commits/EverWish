"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

// 🎬 Datos organizados en secciones tipo Netflix
const categorySections = [
  {
    title: "Seasonal 🎉",
    items: [
      { name: "New Year", emoji: "🎆", color: "bg-blue-100", slug: "new-year" },
      { name: "Valentine’s Day", emoji: "💝", color: "bg-pink-200", slug: "valentines" },
      { name: "Easter", emoji: "🐣", color: "bg-purple-100", slug: "easter" },
      { name: "Halloween", emoji: "🎃", color: "bg-orange-200", slug: "halloween" },
      { name: "Thanksgiving", emoji: "🦃", color: "bg-amber-200", slug: "thanksgiving" },
      { name: "Christmas", emoji: "🎄", color: "bg-green-100", slug: "christmas" },
    ],
  },
  {
    title: "Love & Emotions 💖",
    items: [
      { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
      { name: "Apology", emoji: "💐", color: "bg-pink-100", slug: "apology" },
      { name: "Missing You", emoji: "💭", color: "bg-sky-100", slug: "missing-you" },
      { name: "Encouragement", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement" },
      { name: "Thank You", emoji: "🙏", color: "bg-violet-100", slug: "thank-you" },
      { name: "Condolences", emoji: "🕊️", color: "bg-gray-100", slug: "condolences" },
    ],
  },
  {
    title: "Celebrations & Events 🥳",
    items: [
      { name: "Baby Shower", emoji: "👶", color: "bg-sky-200", slug: "baby-shower" },
      { name: "Graduation", emoji: "🎓", color: "bg-lime-200", slug: "graduation" },
      { name: "Anniversary", emoji: "💍", color: "bg-yellow-200", slug: "anniversary" },
      { name: "Retirement", emoji: "🏖️", color: "bg-amber-100", slug: "retirement" },
      { name: "Job Promotion", emoji: "💼", color: "bg-cyan-200", slug: "promotion" },
      { name: "New Home", emoji: "🏡", color: "bg-emerald-100", slug: "new-home" },
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
      { name: "Good Luck", emoji: "🍀", color: "bg-lime-100", slug: "good-luck" },
    ],
  },
];

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EAF6FA] text-center pt-24 pb-16 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Explore our Categories
        </h1>
        <p className="text-gray-700 mb-10">
          Find the perfect card for every moment 💌
        </p>

        {/* Carruseles tipo Netflix */}
        {categorySections.map((section, index) => (
          <div key={index} className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                {expanded === index ? "Close" : "View all →"}
              </button>
            </div>

            {expanded === index ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {section.items.map((cat, i) => (
                  <Link key={i} href={`/categories/${cat.slug}`}>
                    <div
                      className={`${cat.color} rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                    >
                      <span className="text-4xl mb-2">{cat.emoji}</span>
                      <p className="font-semibold text-gray-800">{cat.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
    }
