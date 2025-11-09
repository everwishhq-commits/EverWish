"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "swiper/css";

// 🔍 BÚSQUEDA INTELIGENTE INTEGRADA
function normalizeForSearch(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toSingular(word) {
  const normalized = normalizeForSearch(word);
  if (normalized.endsWith("ies")) return normalized.slice(0, -3) + "y";
  if (normalized.endsWith("es")) return normalized.slice(0, -2);
  if (normalized.endsWith("s") && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

function getSearchVariations(word) {
  const normalized = normalizeForSearch(word);
  const variations = new Set([normalized]);
  const singular = toSingular(normalized);
  variations.add(singular);
  if (!normalized.endsWith("s")) variations.add(normalized + "s");
  if (!normalized.endsWith("es")) variations.add(normalized + "es");
  return [...variations];
}

function videoMatchesSearch(video, searchTerm) {
  if (!video || !searchTerm) return false;
  const searchableFields = [
    video.name,
    video.object,
    video.subcategory,
    video.category,
    ...(video.categories || []),
    ...(video.tags || []),
  ].filter(Boolean);
  
  const variations = getSearchVariations(searchTerm);
  return searchableFields.some(field => {
    const normalizedField = normalizeForSearch(field);
    return variations.some(v => normalizedField.includes(v));
  });
}

const allCategories = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" }, 
  { name: "Connection", emoji: "🧩", slug: "diversity-connection", color: "#E7E9FF" },
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

  useEffect(() => {
    const q = search.toLowerCase().trim();
    
    if (!q) {
      setFiltered(allCategories);
      setSearchResults(null);
      return;
    }

    console.log("🔍 Buscando:", q);
    const matchingVideos = videos.filter(v => videoMatchesSearch(v, q));
    console.log(`🎯 Videos encontrados: ${matchingVideos.length}`);

    const categoriesSet = new Set();
    matchingVideos.forEach((v) => {
      if (v.categories && Array.isArray(v.categories)) {
        v.categories.forEach(cat => {
          console.log(`  📂 Categoría encontrada: "${cat}"`);
          categoriesSet.add(cat.toLowerCase());
        });
      } else if (v.category) {
        console.log(`  📂 Categoría encontrada: "${v.category}"`);
        categoriesSet.add(v.category.toLowerCase());
      }
    });

    console.log("📂 Categorías con resultados:", [...categoriesSet]);

    const matchedCategories = allCategories.filter((cat) => {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      return [...categoriesSet].some((matchCat) => {
        const normalized = matchCat.replace(/&/g, "and").replace(/\s+/g, "-");
        const mcWords = matchCat.toLowerCase().split(/\s+|&/);
        const catWords = catName.toLowerCase().split(/\s+|&/);
        
        if (normalized.includes(catSlug) || catSlug.includes(normalized)) return true;
        if (matchCat.includes(catName) || catName.includes(matchCat)) return true;
        
        const hasWordMatch = mcWords.some(word => 
          catWords.some(cw => cw.includes(word) || word.includes(cw))
        );
        if (hasWordMatch) return true;
        
        const specialMaps = {
          "seasonal": ["holidays"],
          "celebrations": ["celebrations", "birthdays"],
          "birthdays": ["celebrations"],
        };
        
        for (const [key, values] of Object.entries(specialMaps)) {
          if (matchCat.includes(key) && values.some(v => catName.includes(v) || catSlug.includes(v))) {
            return true;
          }
        }
        
        return false;
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

  const handleCategoryClick = (cat) => {
    if (search.trim()) {
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

      <div className="flex flex-col items-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, turtle, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-700 text-center transition-all"
        />
        
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

      {filtered.length > 0 ? (
        <Swiper
          slidesPerView={3.2}
          spaceBetween={16}
          centeredSlides={true}
          loop={filtered.length > 3}
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
          {filtered.map((cat, i) => (
            <SwiperSlide key={i}>
              <div onClick={() => handleCategoryClick(cat)}>
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
                    
                    {search && (() => {
                      const count = videos.filter(v => {
                        if (!videoMatchesSearch(v, search)) return false;
                        const catSlug = cat.slug.toLowerCase();
                        if (v.categories && Array.isArray(v.categories)) {
                          const hasMatch = v.categories.some(c => {
                            const normalized = c.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
                            return normalized.includes(catSlug) || catSlug.includes(normalized);
                          });
                          if (hasMatch) return true;
                        }
                        if (v.category) {
                          const normalized = v.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
                          if (normalized.includes(catSlug) || catSlug.includes(normalized)) return true;
                        }
                        return false;
                      }).length;
                      
                      return count > 0 ? (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                          {count}
                        </span>
                      ) : null;
                    })()}
                  </motion.div>
                  <p className="mt-2 font-semibold text-gray-800 text-sm md:text-base">
                    {cat.name}
                  </p>
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
