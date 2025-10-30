"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// 🌸 CATEGORÍAS PRINCIPALES (colores Everwish)
const ALL_CATEGORIES = [
  { name: "Holidays & Festivities", emoji: "🎄", slug: "holidays", color: "#FFF4E0" },
  { name: "Love & Romance", emoji: "❤️", slug: "love", color: "#FFE8EE" },
  { name: "Celebrations & Special Moments", emoji: "🎉", slug: "celebrations", color: "#FFF7FF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Condolences & Support", emoji: "🕊️", slug: "condolences", color: "#F8F8F8" },
  { name: "Animals & Nature", emoji: "🐾", slug: "animals", color: "#E8FFF3" },
  { name: "Seasons", emoji: "🍂", slug: "seasons", color: "#FFFBE5" },
  { name: "Inspirational & Friendship", emoji: "🌟", slug: "inspirational", color: "#FFFBE5" },
];

export default function CategoriesCarousel() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(ALL_CATEGORIES);
  const [videos, setVideos] = useState([]);

  // 📥 Cargar videos del API
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

  // 🔍 Filtrar categorías en tiempo real
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(ALL_CATEGORIES);
      return;
    }

    const matchedSlugs = new Set();

    videos.forEach((v) => {
      const searchableText = [
        v.object,
        v.category,
        v.subcategory,
        v.mainName,
        v.mainSlug,
      ]
        .join(" ")
        .toLowerCase();

      if (searchableText.includes(q)) {
        matchedSlugs.add(v.mainSlug);
      }
    });

    const result = ALL_CATEGORIES.filter((cat) => matchedSlugs.has(cat.slug));
    setFiltered(result.length > 0 ? result : []);
  }, [search, videos]);

  return (
    <section
      id="categories"
      className="text-center py-10 px-3 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #fff8fa 0%, #fff5f7 50%, #ffffff 100%)",
      }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Explore by Category ✨
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. wedding, halloween, turtle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🎠 Carrusel */}
      <Swiper
        slidesPerView={3.2}
        spaceBetween={16}
        centeredSlides
        loop
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
              <Link href={`/categories/${cat.slug}`}>
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
