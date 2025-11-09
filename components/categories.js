"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "swiper/css";

// 🎯 CATEGORÍAS BASE
const BASE_CATEGORIES = [
  { name: "Holidays", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💝", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Family & Friendship", emoji: "🫶", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Work & Professional Life", emoji: "💼", slug: "work", color: "#EAF4FF" },
  { name: "Babies & Parenting", emoji: "🧸", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" },
  { name: "Connection", emoji: "🧩", slug: "hear-every-heart", color: "#E7E9FF" },
  { name: "Sports", emoji: "🏟️", slug: "sports", color: "#FFE6FA" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
  { name: "Nature & Life Journeys", emoji: "🏕️", slug: "life-journeys-transitions", color: "#E8FFF3" },
];

// 🔍 Normalizar texto
function normalize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 🎯 Buscar videos
function searchVideos(videos, term) {
  const normalized = normalize(term);
  return videos.filter(v => {
    const text = [v.name, v.object, v.subcategory, v.category, ...(v.categories || []), ...(v.tags || [])].join(" ");
    return normalize(text).includes(normalized);
  });
}

// 📊 Agrupar por categoría
function groupByCategory(videos) {
  const groups = {};
  BASE_CATEGORIES.forEach(c => groups[c.slug] = []);
  
  videos.forEach(v => {
    (v.categories || [v.category]).forEach(cat => {
      const normCat = normalize(cat);
      BASE_CATEGORIES.forEach(base => {
        const normSlug = normalize(base.slug);
        const normName = normalize(base.name);
        if (normCat.includes(normSlug) || normSlug.includes(normCat) || 
            normCat.includes(normName) || normName.includes(normCat)) {
          if (!groups[base.slug].some(x => x.name === v.name)) {
            groups[base.slug].push(v);
          }
        }
      });
    });
  });
  
  return groups;
}

export default function Categories() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [display, setDisplay] = useState(BASE_CATEGORIES);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch("/api/videos").then(r => r.json()).then(d => setVideos(d.videos || []));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setDisplay(BASE_CATEGORIES);
      setResults(null);
      return;
    }

    const matched = searchVideos(videos, search);
    const grouped = groupByCategory(matched);
    
    const withCounts = BASE_CATEGORIES
      .map(c => ({ ...c, count: grouped[c.slug].length }))
      .filter(c => c.count > 0);
    
    setDisplay(withCounts);
    setResults({
      total: matched.length,
      categories: withCounts.length,
      counts: withCounts.reduce((acc, c) => ({ ...acc, [c.name]: c.count }), {})
    });
  }, [search, videos]);

  return (
    <section className="text-center py-10 px-3 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Categories</h2>

      <div className="flex flex-col items-center mb-10">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, love, turtle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-700 text-center"
        />
        
        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-gray-600">
            {results.total > 0 ? (
              <p>✨ Found <b className="text-pink-600">{results.total}</b> cards in <b className="text-pink-600">{results.categories}</b> {results.categories === 1 ? 'category' : 'categories'}</p>
            ) : (
              <p className="text-gray-400">No results for "<b>{search}</b>"</p>
            )}
          </motion.div>
        )}
      </div>

      {display.length > 0 ? (
        <Swiper
          slidesPerView={3.2}
          spaceBetween={16}
          centeredSlides={true}
          loop={display.length > 3}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 2.3 },
            640: { slidesPerView: 3.4 },
            1024: { slidesPerView: 5 },
          }}
          modules={[Autoplay]}
        >
          {display.map((cat, i) => (
            <SwiperSlide key={i}>
              <div onClick={() => router.push(search ? `/category/${cat.slug}?q=${search}` : `/category/${cat.slug}`)}>
                <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                  <motion.div
                    className="rounded-full flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] mx-auto shadow-md hover:shadow-lg relative"
                    style={{ backgroundColor: cat.color }}
                  >
                    <span className="text-4xl sm:text-5xl">{cat.emoji}</span>
                    {cat.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cat.count}
                      </span>
                    )}
                  </motion.div>
                  <p className="mt-2 font-semibold text-gray-800 text-sm">{cat.name}</p>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No results for "<b>{search}</b>"</p>
          <button onClick={() => setSearch("")} className="mt-4 text-pink-500 hover:text-pink-600 font-semibold">
            ← Clear search
          </button>
        </div>
      )}
    </section>
  );
            }
