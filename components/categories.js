"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BASE_CATEGORIES } from "@/lib/categories-config";
import { searchVideos, groupByCategory } from "@/lib/simple-search";
import "swiper/css";

const COLORS = [
  "#FFE0E9", "#FFDDEE", "#FFECEC", "#E5EDFF", "#EAF4FF", "#DFF7FF",
  "#FFF3E0", "#F3F3F3", "#E7E9FF", "#FFE6FA", "#EDEAFF", "#E8FFF3"
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [displayCategories, setDisplayCategories] = useState(
    BASE_CATEGORIES.map((cat, i) => ({ 
      ...cat, 
      color: COLORS[i % COLORS.length], 
      count: 0 
    }))
  );
  const [searchResults, setSearchResults] = useState(null);

  // 1️⃣ Cargar videos
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const allVideos = data.videos || [];
        setVideos(allVideos);
        setFilteredVideos(allVideos);
      } catch (err) {
        console.error("Error cargando videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 2️⃣ Filtrar cuando cambia la búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setFilteredVideos(videos);
      setSearchResults(null);
    } else {
      const results = searchVideos(videos, search);
      setFilteredVideos(results);
      setSearchResults({
        query: search,
        totalVideos: results.length,
      });
    }
  }, [search, videos]);

  // 3️⃣ Actualizar categorías (con ordenamiento)
  useEffect(() => {
    const grouped = groupByCategory(filteredVideos);
    
    let categoriesWithCounts = BASE_CATEGORIES.map((cat, i) => ({
      ...cat,
      color: COLORS[i % COLORS.length],
      count: grouped[cat.slug]?.length || 0
    }));

    // 🔥 Si hay búsqueda, ordenar: con resultados primero
    if (search.trim()) {
      categoriesWithCounts = categoriesWithCounts.sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        return 0; // Mantener orden original si ambos tienen o no tienen
      });
    }

    setDisplayCategories(categoriesWithCounts);
  }, [filteredVideos, search]);

  const handleCategoryClick = (cat) => {
    if (cat.count === 0 && search.trim()) {
      return; // No navegar si la categoría está vacía durante búsqueda
    }
    
    const url = search.trim() 
      ? `/category/${cat.slug}?q=${encodeURIComponent(search)}`
      : `/category/${cat.slug}`;
    
    router.push(url);
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      <div className="flex flex-col items-center mb-10">
        <input
          type="text"
          placeholder="Search: St Patrick, Diwali, Veterans Day..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-700 text-center transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="mt-2 text-pink-500 hover:text-pink-600 text-sm font-semibold"
          >
            × Clear search
          </button>
        )}

        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm"
          >
            {searchResults.totalVideos > 0 ? (
              <p className="text-gray-600">
                ✨ Found <b className="text-pink-600">{searchResults.totalVideos}</b> cards
              </p>
            ) : (
              <p className="text-gray-400">
                No results for "<b>{searchResults.query}</b>"
              </p>
            )}
          </motion.div>
        )}
      </div>

      {displayCategories.length > 0 ? (
        <Swiper
          slidesPerView={3.2}
          spaceBetween={16}
          centeredSlides={true}
          loop={displayCategories.length > 3}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 2.3, spaceBetween: 10 },
            640: { slidesPerView: 3.4, spaceBetween: 14 },
            1024: { slidesPerView: 5, spaceBetween: 18 },
          }}
          modules={[Autoplay]}
          className="overflow-visible"
        >
          {displayCategories.map((cat) => (
            <SwiperSlide key={cat.slug}>
              <button 
                onClick={() => handleCategoryClick(cat)}
                className={`w-full ${
                  search && cat.count === 0 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                disabled={search && cat.count === 0}
                aria-label={`View ${cat.name} category`}
              >
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer relative"
                  whileHover={search && cat.count === 0 ? {} : { scale: 1.07 }}
                  whileTap={search && cat.count === 0 ? {} : { scale: 0.95 }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md hover:shadow-lg transition-shadow relative"
                    style={{ backgroundColor: cat.color }}
                  >
                    <motion.span
                      className="text-4xl sm:text-5xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {cat.emoji}
                    </motion.span>
                    
                    {/* Badge SOLO cuando hay búsqueda Y resultados */}
                    {search && cat.count > 0 && (
                      <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                        {cat.count}
                      </div>
                    )}
                  </motion.div>
                  <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base text-center px-2">
                    {cat.name}
                  </p>
                </motion.div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm mb-4">
            {search 
              ? `No matching categories for "${search}"`
              : "Loading categories..."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-pink-500 hover:text-pink-600 font-semibold text-sm"
            >
              ← Clear search
            </button>
          )}
        </div>
      )}
    </section>
  );
            }
