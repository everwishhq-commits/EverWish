"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "swiper/css";

const allCategories = [
  { name: "Holidays", emoji: "🎉", slug: "holidays", color: "#FFE0E9" },
  { name: "Celebrations", emoji: "🎂", slug: "celebrations", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💝", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Animal Lovers", emoji: "🐾", slug: "animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" }, 
  { name: "Connection", emoji: "🧩", slug: "connection", color: "#E7E9FF" },
  { name: "Sports", emoji: "🏟️", slug: "sports", color: "#FFE6FA" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "nature-life-journeys", color: "#E8FFF3" },
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
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error:", err);
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

    const matchingVideos = videos.filter(v => {
      const searchable = [
        v.name,
        v.object,
        v.subcategory,
        ...(v.tags || []),
      ].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(q);
    });

    const categoriesInVideos = new Set();
    matchingVideos.forEach(v => {
      if (v.categories && Array.isArray(v.categories)) {
        v.categories.forEach(cat => categoriesInVideos.add(cat));
      } else if (v.category) {
        categoriesInVideos.add(v.category);
      }
    });

    const matchedCategories = allCategories.filter(cat => {
      return [...categoriesInVideos].some(videoCat => {
        const normalized = videoCat.toLowerCase().replace(/[^a-z0-9]/g, "");
        const catNormalized = cat.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        return normalized.includes(catNormalized) || catNormalized.includes(normalized);
      });
    });

    const counts = {};
    matchedCategories.forEach(cat => {
      counts[cat.name] = matchingVideos.filter(v => {
        if (v.categories && Array.isArray(v.categories)) {
          return v.categories.some(vc => {
            const normalized = vc.toLowerCase().replace(/[^a-z0-9]/g, "");
            const catNormalized = cat.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            return normalized.includes(catNormalized) || catNormalized.includes(normalized);
          });
        }
        return false;
      }).length;
    });

    setFiltered(matchedCategories);
    setSearchResults({
      query: search,
      videosFound: matchingVideos.length,
      categoriesFound: matchedCategories.length,
      counts: counts,
    });
  }, [search, videos]);

  const handleCategoryClick = (cat) => {
    if (search.trim()) {
      router.push(`/categories/${cat.slug}?q=${encodeURIComponent(search)}`);
    } else {
      router.push(`/categories/${cat.slug}`);
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
          placeholder="Search any theme — e.g. zombie, love, turtle..."
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
              <p className="text-gray-400">No results for "<b>{searchResults.query}</b>"</p>
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
                    
                    {searchResults && searchResults.counts[cat.name] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                        {searchResults.counts[cat.name]}
                      </span>
                    )}
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
