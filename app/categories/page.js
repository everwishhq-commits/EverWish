"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import "swiper/css";

// 🪄 Datos organizados en secciones tipo Netflix
const categorySections = [
  {
    title: "Seasonal 🎉",
    items: [
      { name: "New Year", emoji: "🎆", color: "bg-blue-100", slug: "new-year" },
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
      { name: "Love & Romance", emoji: "💘", color: "bg-rose-200", slug: "love-romance" },
      { name: "Apology", emoji: "😔", color: "bg-gray-100", slug: "apology" },
      { name: "Encouragement", emoji: "🌟", color: "bg-yellow-100", slug: "encouragement" },
      { name: "Missing You", emoji: "💭", color: "bg-blue-100", slug: "missing-you" },
      { name: "Thank You", emoji: "🙏", color: "bg-violet-200", slug: "thank-you" },
      { name: "Condolences", emoji: "🕊️", color: "bg-gray-200", slug: "condolences" },
    ],
  },
  {
    title: "Celebrations 🥳",
    items: [
      { name: "Baby Shower", emoji: "👶", color: "bg-sky-200", slug: "baby-shower" },
      { name: "Graduation", emoji: "🎓", color: "bg-lime-200", slug: "graduation" },
      { name: "Anniversary", emoji: "💍", color: "bg-indigo-200", slug: "anniversary" },
      { name: "Retirement", emoji: "🧓", color: "bg-orange-100", slug: "retirement" },
      { name: "New Home", emoji: "🏡", color: "bg-emerald-200", slug: "new-home" },
      { name: "Job Promotion", emoji: "💼", color: "bg-cyan-200", slug: "promotion" },
    ],
  },
  {
    title: "Everyday Moments 🌞",
    items: [
      { name: "Good Morning", emoji: "🌅", color: "bg-yellow-100", slug: "good-morning" },
      { name: "Good Night", emoji: "🌙", color: "bg-indigo-100", slug: "good-night" },
      { name: "Just Because", emoji: "💌", color: "bg-pink-100", slug: "just-because" },
      { name: "Surprise", emoji: "🎁", color: "bg-purple-100", slug: "surprise" },
      { name: "Good Luck", emoji: "🍀", color: "bg-green-100", slug: "good-luck" },
      { name: "Motivation", emoji: "🚀", color: "bg-orange-100", slug: "motivation" },
    ],
  },
];

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const [showAI, setShowAI] = useState(false);

  // 🔍 Filtra por nombre
  const filteredSections = categorySections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white text-center pt-28 px-4 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          Explore our Categories
        </h1>
        <p className="text-gray-500 mb-8">
          Find the perfect card for every moment 💝
        </p>

        {/* 🔍 Buscador */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAI(false);
            }}
            className="w-full max-w-md border border-gray-300 rounded-full px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 🎞️ Carruseles tipo Netflix */}
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <div key={index} className="mb-14">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-2xl font-bold text-left">{section.title}</h2>
                <Link
                  href="#"
                  className="text-blue-500 hover:underline text-sm font-medium"
                >
                  View all →
                </Link>
              </div>

              <Swiper
                slidesPerView={2.3}
                spaceBetween={15}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className={`${cat.color} rounded-3xl shadow-md hover:shadow-xl flex flex-col items-center justify-center p-6 aspect-square`}
                      >
                        <span className="text-5xl mb-3">{cat.emoji}</span>
                        <p className="font-semibold text-sm md:text-base text-gray-800">
                          {cat.name}
                        </p>
                      </motion.div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        ) : (
          <div className="text-center mt-20">
            <p className="text-gray-600 mb-4">
              No results found for “{query}”
            </p>
            <button
              onClick={() => setShowAI(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
            >
              Create with AI 💫
            </button>
          </div>
        )}

        {/* 💫 Modal Create with AI */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              key="ai-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 text-center w-80 max-w-sm"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Create your unique card ✨
                </h2>
                <p className="text-gray-600 mb-6">
                  Let Everwish AI design a card for{" "}
                  <b>{query || "you"}</b>!
                </p>
                <button
                  onClick={() => alert("✨ Opening AI Creator...")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
                >
                  Start Now
                </button>
                <button
                  onClick={() => setShowAI(false)}
                  className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
      }
