"use client";
import "swiper/css";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { name: "Holidays", emoji: "🎄", slug: "holidays", color: "#FFF4E0" },
  { name: "Love & Romance", emoji: "❤️", slug: "love", color: "#FFE8EE" },
  { name: "Celebrations", emoji: "🎉", slug: "celebrations", color: "#FFF7FF" },
  { name: "Work & Professional", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Condolences", emoji: "🕊️", slug: "condolences", color: "#F8F8F8" },
  { name: "Animals & Nature", emoji: "🐾", slug: "animals", color: "#E8FFF3" },
  { name: "Seasons", emoji: "🍂", slug: "seasons", color: "#FFFBE5" },
  { name: "Inspirational", emoji: "🌟", slug: "inspirational", color: "#FFFBE5" },
];

export default function Carousel() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(CATEGORIES);

  // 🔍 Filtrado local
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) return setFiltered(CATEGORIES);
    setFiltered(CATEGORIES.filter((cat) => cat.name.toLowerCase().includes(q)));
  }, [search]);

  return (
    <section id="categories" className="text-center py-12 px-3 overflow-visible bg-[#fff7f5]">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Explore by Category ✨
      </h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search — e.g. birthday, love, condolences..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/90"
        />
      </div>

      {/* 🎠 Carrusel de categorías */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides
        loop
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={900}
        breakpoints={{
          0: { slidesPerView: 2.2, spaceBetween: 10 },
          640: { slidesPerView: 3.4, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.map((cat, i) => (
          <SwiperSlide key={i}>
            <Link href={`/category/${cat.slug}`}>
              <motion.div
                className="flex flex-col items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.08 }}
              >
                <div
                  className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md"
                  style={{ backgroundColor: cat.color }}
                >
                  <motion.span
                    className="text-4xl sm:text-5xl"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {cat.emoji}
                  </motion.span>
                </div>
                <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                  {cat.name}
                </p>
              </motion.div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
