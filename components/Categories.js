"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// 🌸 CATEGORÍAS ACTUALIZADAS
const allCategories = [
  { name: "Holidays & Festivities", emoji: "🎄", slug: "holidays", color: "#FFF4E0" },
  { name: "Love & Romance", emoji: "❤️", slug: "love", color: "#FFE8EE" },
  { name: "Celebrations & Special Moments", emoji: "🎉", slug: "celebrations", color: "#FFF7FF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Condolences & Support", emoji: "🕊️", slug: "condolences", color: "#F8F8F8" },
  { name: "Animals & Nature", emoji: "🐾", slug: "animals", color: "#E8FFF3" },
  { name: "Seasons", emoji: "🍂", slug: "seasons", color: "#FFFBE5" },
  { name: "Inspirational & Friendship", emoji: "🌟", slug: "inspirational", color: "#FFFBE5" },
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar los videos (para búsqueda)
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Filtrar por búsqueda
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(allCategories);
      return;
    }

    const foundCategories = new Set();

    videos.forEach((item) => {
      const searchableText = [
        item.name,
        item.object,
        item.subcategory,
        item.category,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      if (searchableText.includes(q)) {
        if (item.category) foundCategories.add(item.category.trim());
      }
    });

    const matches = allCategories.filter((cat) =>
      [...foundCategories].some((f) =>
        f.toLowerCase().replace("&", "and").includes(cat.slug)
      )
    );

    setFiltered(matches.length > 0 ? matches : []);
  }, [search, videos]);

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔎 Búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. wedding, halloween, baby..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        speed={1000}
        breakpoints={{
          0: { slidesPerView: 2.3, spaceBetween: 10 },
          640: { slidesPerView: 3.3, spaceBetween: 14 },
          1024: { slidesPerView: 5, spaceBetween: 18 },
        }}
        modules={[Autoplay]}
        className="overflow-visible"
      >
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <Link href={`/category/${cat.slug}`}>
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.07 }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md"
                    style={{ backgroundColor: cat.color }}
                  >
                    <motion.span
                      className="text-4xl sm:text-5xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {cat.emoji}
                    </motion.span>
                  </motion.div>
                  <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                    {cat.name}
                  </p>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matching categories for “{search}”
          </p>
        )}
      </Swiper>
    </section>
  );
                     }
