"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { searchVideos, groupByCategory } from "@/lib/simple-search";
import "swiper/css";

const BASE_CATEGORIES = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care" },
  { name: "Connection", emoji: "🧩", slug: "hear-every-heart" },
  { name: "Sports", emoji: "🏟️", slug: "sports" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions" },
];

const COLORS = [
  "#FFE0E9", "#FFDDEE", "#FFECEC", "#E5EDFF", "#EAF4FF", "#DFF7FF",
  "#FFF3E0", "#F3F3F3", "#E7E9FF", "#FFE6FA", "#EDEAFF", "#E8FFF3"
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [displayCategories, setDisplayCategories] = useState(
    BASE_CATEGORIES.map((cat, i) => ({ ...cat, color: COLORS[i % COLORS.length], count: 0 }))
  );
  const [searchResults, setSearchResults] = useState(null);

  // Cargar videos
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const allVideos = data.videos || [];
        setVideos(allVideos);
        
        // Contar por categoría
        const grouped = groupByCategory(allVideos);
        const categoriesWithCounts = BASE_CATEGORIES.map((cat, i) => ({
          ...cat,
          color: COLORS[i % COLORS.length],
          count: grouped[cat.slug]?.length || 0
        }));
        
        setDisplayCategories(categoriesWithCounts);
        console.log(`📦 ${allVideos.length} videos cargados`);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
    loadVideos();
  }, []);

  // Procesar búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setDisplayCategories(
        BASE_CATEGORIES.map((cat, i) => ({ 
          ...cat, 
          color: COLORS[i % COLORS.length]
        }))
      );
      setSearchResults(null);
      return;
    }

    console.log(`🔍 Buscando: "${search}"`);

    const matchedVideos = searchVideos(videos, search);
    console.log(`✅ Videos encontrados: ${matchedVideos.length}`);
    
    const grouped = groupByCategory(matchedVideos);
    
    const categoriesWithResults = BASE_CATEGORIES
      .map((cat, index) => ({
        ...cat,
        color: COLORS[index % COLORS.length],
        count: grouped[cat.slug]?.length || 0
      }))
      .filter(cat => cat.count > 0);
    
    console.log(`📊 Categorías con resultados: ${categoriesWithResults.length}`);
    
    setDisplayCategories(categoriesWithResults);
    setSearchResults({
      query: search,
      totalVideos: matchedVideos.length,
      categoriesCount: categoriesWithResults.length
    });
  }, [search, videos]);

  // 🎯 FUNCIÓN ACTUALIZADA: Pantalla completa ANTES de navegar
  const handleCategoryClick = async (cat) => {
    try {
      // 🚀 Activar pantalla completa ANTES de navegar
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
      
      // Pequeña pausa para asegurar que pantalla completa se active
      await new Promise(r => setTimeout(r, 150));
      
      // Construir URL con búsqueda si existe
      const url = search.trim() 
        ? `/category/${cat.slug}?q=${encodeURIComponent(search)}`
        : `/category/${cat.slug}`;
      
      console.log(`🎯 Navegando a: ${url}`);
      router.push(url);
    } catch (error) {
      // Si pantalla completa falla, navegar de todos modos
      console.log("⚠️ Fullscreen no disponible, navegando normalmente");
      const url = search.trim() 
        ? `/category/${cat.slug}?q=${encodeURIComponent(search)}`
        : `/category/${cat.slug}`;
      router.push(url);
    }
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* Barra de búsqueda */}
      <div className="flex flex-col items-center mb-10">
        <input
          type="text"
          placeholder="Search: zombie, turtle, love, birthday..."
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
                in <b className="text-pink-600">{searchResults.categoriesCount}</b>{" "}
                {searchResults.categoriesCount === 1 ? 'category' : 'categories'}
              </p>
            ) : (
              <p className="text-gray-400">
                No results for "<b>{searchResults.query}</b>"
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Carrusel */}
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
                className="w-full"
                aria-label={`View ${cat.name} category`}
              >
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer relative"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
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
                    
                    {cat.count > 0 && searchResults && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white z-10">
                        {cat.count}
                      </span>
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
