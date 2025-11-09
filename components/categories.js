"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "swiper/css";

const allCategories = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" }, 
  { name: "Diversity & Connection", emoji: "🧩", slug: "diversity-connection", color: "#E7E9FF" },
  { name: "Sports", emoji: "🏟️", slug: "sports", color: "#FFE6FA" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions", color: "#E8FFF3" },
];

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(allCategories);
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // 📥 Cargar videos desde API
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        
        console.log("📹 Total videos cargados:", data.videos?.length || 0);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error cargando /api/videos:", err);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Filtrar categorías según búsqueda
  useEffect(() => {
    const q = search.toLowerCase().trim();
    
    // Sin búsqueda → mostrar todas
    if (!q) {
      setFiltered(allCategories);
      setSearchResults(null);
      return;
    }

    console.log("🔍 Buscando:", q);

    // Buscar videos que coincidan
    const matchingVideos = videos.filter((v) => {
      const searchable = [
        v.name,
        v.object,
        v.subcategory,
        v.category,
        ...(v.categories || []),
        ...(v.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return searchable.includes(q);
    });

    console.log(`🎯 Videos encontrados: ${matchingVideos.length}`);

    // Extraer categorías únicas de los videos encontrados
    const categoriesSet = new Set();
    matchingVideos.forEach((v) => {
      if (v.categories && Array.isArray(v.categories)) {
        v.categories.forEach(cat => categoriesSet.add(cat.toLowerCase()));
      } else if (v.category) {
        categoriesSet.add(v.category.toLowerCase());
      }
    });

    console.log("📂 Categorías con resultados:", [...categoriesSet]);

    // Filtrar categorías principales que tienen videos
    const matchedCategories = allCategories.filter((cat) => {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      // Buscar si alguna categoría del video coincide
      return [...categoriesSet].some((matchCat) => {
        const normalized = matchCat.replace(/&/g, "and").replace(/\s+/g, "-");
        return (
          normalized.includes(catSlug) ||
          catSlug.includes(normalized) ||
          matchCat.includes(catName) ||
          catName.includes(matchCat)
        );
      });
    });

    console.log("✅ Categorías filtradas:", matchedCategories.map(c => c.name));

    setFiltered(matchedCategories);
    setSearchResults({
      query: search,
      videosFound: matchingVideos.length,
      categoriesFound: matchedCategories.length,
    });
  }, [search, videos]);

  // 🎯 Navegar con query de búsqueda
  const handleCategoryClick = (cat) => {
    if (search.trim()) {
      // Si hay búsqueda, pasar el término en la URL
      router.push(`/category/${cat.slug}?q=${encodeURIComponent(search)}`);
    } else {
      router.push(`/category/${cat.slug}`);
    }
  };

  return (
    <section id="categories" className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categories
      </h2>

      {/* 🔎 Barra de búsqueda mejorada */}
      <div className="flex flex-col items-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, turtle, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-700 text-center transition-all"
        />
        
        {/* Resultados de búsqueda */}
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-gray-600"
          >
            {searchResults.videosFound > 0 ? (
              <p>
                ✨ Found <b className="text-pink-600">{searchResults.videosFound}</b> cards 
                in <b className="text-pink-600">{searchResults.categoriesFound}</b> {searchResults.categoriesFound === 1 ? 'category' : 'categories'}
              </p>
            ) : (
              <p className="text-gray-400">
                No results for "<b>{searchResults.query}</b>"
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* 🎠 Carrusel de categorías */}
      {filtered.length > 0 ? (
        <Swiper
          slidesPerView={3.2}
          spaceBetween={16}
          centeredSlides={true}
          loop={filtered.length > 3}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 2.3, spaceBetween: 10 },
            640: { slidesPerView: 3.4, spaceBetween: 14 },
            1024: { slidesPerView: 5, spaceBetween: 18 },
          }}
          modules={[Autoplay]}
          className="overflow-visible"
        >
          {filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <div onClick={() => handleCategoryClick(cat)}>
                <motion.div
                  className="flex flex-col items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md hover:shadow-lg transition-shadow"
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
                  
                  {/* Mostrar cantidad de resultados si hay búsqueda */}
                  {search && (
                    <p className="text-xs text-pink-500 mt-1">
                      {videos.filter(v => {
                        const searchable = [v.name, v.object, v.subcategory, v.category, ...(v.categories || []), ...(v.tags || [])].filter(Boolean).join(" ").toLowerCase();
                        const inThisCat = v.categories?.some(c => c.toLowerCase().includes(cat.slug.toLowerCase())) || v.category?.toLowerCase().includes(cat.slug.toLowerCase());
                        return searchable.includes(search.toLowerCase()) && inThisCat;
                      }).length} cards
                    </p>
                  )}
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">
            No matching categories for "<b>{search}</b>"
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-4 text-pink-500 hover:text-pink-600 font-semibold text-sm"
          >
            ← Clear search
          </button>
        </div>
      )}
    </section>
  );
                 }
