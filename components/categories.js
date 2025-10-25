"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";

// 🗂️ CATEGORÍAS PRINCIPALES ACTUALIZADAS
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#E9FFF4" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance", color: "#F3F3F3" },
  { name: "Work & Professional", emoji: "💼", slug: "work-professional", color: "#E8FFF3" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Babies & Parenting", emoji: "🍼", slug: "babies-parenting", color: "#FDE6E6" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#FFF0E5" },
  { name: "Encouragement & Motivation", emoji: "🌟", slug: "encouragement-motivation", color: "#FFF5D9" },
  { name: "Adventure & Nature", emoji: "🗺️", slug: "adventure-nature", color: "#E8ECFF" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "House & Moving", emoji: "🏡", slug: "house-moving", color: "#FFD9E8" },
  { name: "Universal", emoji: "✨", slug: "universal", color: "#E5FFE2" }
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // 📥 Cargar videos reales del JSON
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error loading /videos/index.json:", err);
      }
    }
    loadVideos();
  }, []);

  // 🎬 Activar animación de entrada al montar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // 🔍 Buscar coincidencias dentro de los videos
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
        ...(item.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      if (searchableText.includes(q) && item.category) {
        foundCategories.add(item.category.trim().toLowerCase());
      }
    });

    const matches = allCategories.filter((cat) =>
      [...foundCategories].some((found) =>
        found.includes(cat.slug.replace("-", " "))
      )
    );

    setFiltered(matches.length > 0 ? matches : []);
  }, [search, videos]);

  return (
    <motion.section
      id="categories"
      className="text-center py-10 px-3 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Explore Categories 💌
      </h2>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. pumpkin, love, graduation..."
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
          0: { slidesPerView: 2.4, spaceBetween: 10 },
          640: { slidesPerView: 3.4, spaceBetween: 14 },
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
    </motion.section>
  );
}
