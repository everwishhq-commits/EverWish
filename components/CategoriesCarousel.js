"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const ALL_CATEGORIES = [
  { name: "Holidays & Festivities", emoji: "🎄", slug: "holidays", color: "#FFF4E0" },
  { name: "Love & Romance", emoji: "❤️", slug: "love", color: "#FFE8EE" },
  { name: "Celebrations & Special Moments", emoji: "🎉", slug: "celebrations", color: "#FFF7FF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Condolences & Support", emoji: "🕊️", slug: "appreciation", color: "#FDE6E6" },
  { name: "Animals & Nature", emoji: "🐾", slug: "animals", color: "#E8FFF3" },
  { name: "Seasons", emoji: "🍂", slug: "seasons", color: "#FFFBE5" },
  { name: "Inspirational & Friendship", emoji: "🌟", slug: "inspirational", color: "#FFFBE5" },
];

export default function CategoriesCarousel() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [level, setLevel] = useState("categories");
  const [selectedCat, setSelectedCat] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  // 📥 Cargar videos
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

  // 🔍 Filtrar categorías según búsqueda
  const filteredCategories = (() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_CATEGORIES;

    const matchedSlugs = new Set();
    videos.forEach((v) => {
      const text = [v.object, v.category, v.subcategory]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (text.includes(q)) matchedSlugs.add(v.mainSlug);
    });

    return ALL_CATEGORIES.filter((cat) => matchedSlugs.has(cat.slug));
  })();

  // 🔹 Mostrar subcategorías relevantes
  const handleCategoryClick = (slug) => {
    setSelectedCat(slug);
    setLevel("subcategories");

    const related = new Set();
    videos.forEach((v) => {
      if (v.mainSlug === slug) related.add(v.subcategory || "general");
    });
    setSubcategories([...related]);
  };

  // 🔹 Mostrar las tarjetas
  const handleSubClick = (sub) => {
    const filtered = videos.filter(
      (v) => v.subcategory === sub && v.mainSlug === selectedCat
    );
    setFilteredVideos(filtered);
    setLevel("cards");
  };

  const goBack = () => {
    if (level === "cards") setLevel("subcategories");
    else if (level === "subcategories") setLevel("categories");
  };

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

      {level !== "categories" && (
        <button
          onClick={goBack}
          className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
        >
          ← Back
        </button>
      )}

      {level === "categories" && (
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search any theme — e.g. turtle, halloween, love..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
          />
        </div>
      )}

      {level === "categories" && (
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
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.07 }}
                  onClick={() => handleCategoryClick(cat.slug)}
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
              </SwiperSlide>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-8">
              No matching categories for “{search}”
            </p>
          )}
        </Swiper>
      )}

      {level === "subcategories" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {subcategories.map((sub) => (
            <motion.div
              key={sub}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSubClick(sub)}
              className="cursor-pointer flex flex-col items-center justify-center bg-white shadow border border-pink-100 rounded-2xl py-6"
            >
              <p className="font-semibold text-gray-700 capitalize">
                {sub.replace(/-/g, " ")}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {level === "cards" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl justify-items-center">
          {filteredVideos.map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-md border border-pink-100 hover:border-pink-200 hover:bg-pink-50 p-3 cursor-pointer flex flex-col items-center overflow-hidden w-[150px] sm:w-[200px]"
            >
              <video
                src={v.src}
                className="w-full h-[220px] object-cover rounded-2xl bg-gray-100"
                playsInline
                muted
                loop
                autoPlay
                onError={(e) => (e.target.poster = "/placeholder.png")}
              />
              <div className="text-center mt-2">
                <p className="text-gray-700 font-semibold text-sm truncate">
                  {v.object}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {v.subcategory}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
        }
