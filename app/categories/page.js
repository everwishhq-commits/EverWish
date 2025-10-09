"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";

const sections = [
  {
    title: "Seasonal 🎉",
    cards: [
      { name: "Easter", emoji: "🐣", color: "bg-purple-100" },
      { name: "Halloween", emoji: "🎃", color: "bg-orange-200" },
      { name: "Thanksgiving", emoji: "🦃", color: "bg-yellow-200" },
      { name: "New Year", emoji: "🎆", color: "bg-blue-100" },
    ],
  },
  {
    title: "Celebrations 🥳",
    cards: [
      { name: "Anniversary", emoji: "💍", color: "bg-yellow-100" },
      { name: "New Home", emoji: "🏡", color: "bg-teal-100" },
      { name: "Job Promotion", emoji: "💼", color: "bg-cyan-100" },
      { name: "Graduation", emoji: "🎓", color: "bg-lime-100" },
    ],
  },
  {
    title: "Emotions 💖",
    cards: [
      { name: "Motivation", emoji: "🚀", color: "bg-yellow-100" },
      { name: "Condolences", emoji: "🕊️", color: "bg-gray-100" },
      { name: "Thank You", emoji: "🙏", color: "bg-green-100" },
      { name: "Forgiveness", emoji: "🤝", color: "bg-blue-100" },
    ],
  },
  {
    title: "Other Occasions 🌟",
    cards: [
      { name: "Apology", emoji: "💐", color: "bg-pink-100" },
      { name: "Surprise", emoji: "🎁", color: "bg-violet-100" },
      { name: "Good Luck", emoji: "🍀", color: "bg-green-200" },
      { name: "Pets & Animal Lovers", emoji: "🐾", color: "bg-orange-100" },
    ],
  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 max-w-6xl mx-auto w-full">
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800">
          Explore Our Categories ✨
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover cards for every emotion, celebration, and special moment.
        </p>

        {/* Secciones de categorías */}
        {sections.map((section, i) => (
          <section key={i} className="mb-14">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {section.title}
              </h2>
              <Link
                href="#"
                className="text-sm md:text-base text-blue-500 font-semibold hover:underline"
              >
                View all →
              </Link>
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
              {section.cards.map((card, j) => (
                <SwiperSlide key={j}>
                  <div
                    className={`${card.color} rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform flex flex-col items-center justify-center p-6 aspect-square`}
                  >
                    <span className="text-5xl mb-3">{card.emoji}</span>
                    <p className="font-semibold text-sm md:text-base text-gray-800">
                      {card.name}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
    }
