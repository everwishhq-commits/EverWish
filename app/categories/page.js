"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

export default function CategoriesGridPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStats, setSearchStats] = useState(null);

  // Cargar videos al inicio
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

  useEffect(() => {
    // Si no hay texto, mostrar todas las categorías
    if (!search.trim()) {
      setFilteredCategories(allCategories);
      setSearchStats(null);
      return;
    }

    setLoading(true);
    const term = search.toLowerCase().trim();

    // 🔍 Buscar en todos los campos
    const matches = videos.filter(v => {
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
      
      return searchable.includes(term);
    });

    console.log(`🔍 "${term}": ${matches.length} videos encontrados`);

    // Extraer categorías únicas
    const matchedCatsSet = new Set();
    matches.forEach((v) => {
      if (v.categories && Array.isArray(v.categories)) {
        v.categories.forEach(cat => {
          console.log(`  📂 Video "${v.name}" tiene categoría: "${cat}"`);
          matchedCatsSet.add(cat.toLowerCase());
        });
      } else if (v.category) {
        console.log(`  📂 Video "${v.name}" tiene categoría: "${v.category}"`);
        matchedCatsSet.add(v.category.toLowerCase());
      }
    });

    console.log("📂 Set de categorías:", [...matchedCatsSet]);
    // Filtrar categorías base
    const dynamicFiltered = allCategories.filter(cat => {
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      // Buscar coincidencias más flexibles
      return [...matchedCatsSet].some(mc => {
        const normalized = mc.replace(/&/g, "and").replace(/\s+/g, "-");
        const mcWords = mc.toLowerCase().split(/\s+|&/);
        const catWords = catName.toLowerCase().split(/\s+|&/);
        
        // Coincidencia por slug
        if (normalized.includes(catSlug) || catSlug.includes(normalized)) {
          return true;
        }
        
        // Coincidencia por nombre
        if (mc.includes(catName) || catName.includes(mc)) {
          return true;
        }
        
        // Coincidencia por palabras clave
        const hasWordMatch = mcWords.some(word => 
          catWords.some(cw => cw.includes(word) || word.includes(cw))
        );
        
        if (hasWordMatch) {
          return true;
        }
        
        // Mapeo especial para casos conocidos
        const specialMaps = {
          "seasonal": ["holidays"],
          "celebrations": ["celebrations", "birthdays"],
          "birthdays": ["celebrations"],
        };
        
        for (const [key, values] of Object.entries(specialMaps)) {
          if (mc.includes(key) && values.some(v => catName.includes(v) || catSlug.includes(v))) {
            return true;
          }
        }
        
        return false;
      });
    });

    console.log("✅ Categorías filtradas:", dynamicFiltered.map(c => c.name));

    setFilteredCategories(dynamicFiltered);
    setSearchStats({
      query: search,
      totalVideos: matches.length,
      totalCategories: dynamicFiltered.length, // ✅ Solo las filtradas
    });
    setLoading(false);
  }, [search, videos]);

  // Calcular cuántos videos por categoría
  const getVideoCount = (cat) => {
    if (!search.trim()) return null;
    
    const term = search.toLowerCase();
    return videos.filter(v => {
      const searchable = [v.name, v.object, v.subcategory, ...(v.categories || [v.category]), ...(v.tags || [])].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = searchable.includes(term);
      const inCategory = v.categories?.some(c => c.toLowerCase().includes(cat.slug.toLowerCase())) || v.category?.toLowerCase().includes(cat.slug.toLowerCase());
      return matchesSearch && inCategory;
    }).length;
  };

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer hover:text-pink-500"
        >
          Home
        </span>{" "}
        › <span className="text-gray-700">Categories</span>
      </nav>

      {/* Título */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Discover every Everwish theme, celebration, and life moment ✨
      </p>

      {/* 🔍 Barra de búsqueda mejorada */}
      <div className="flex flex-col items-center justify-center mb-12 w-full">
        <div className="relative w-80 md:w-96">
          <input
            type="text"
            placeholder="Search any theme — e.g. zombie, turtle, octopus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-700 bg-white text-center transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Estadísticas de búsqueda */}
        {searchStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            {searchStats.totalVideos > 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-full px-6 py-2">
                <p className="text-green-700 font-semibold">
                  ✨ Found <span className="text-pink-600">{searchStats.totalVideos}</span> cards 
                  in <span className="text-pink-600">{searchStats.totalCategories}</span> {searchStats.totalCategories === 1 ? 'category' : 'categories'}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-full px-6 py-2">
                <p className="text-gray-500">
                  No results for "<b className="text-gray-700">{searchStats.query}</b>"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Grid de categorías */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Searching...</p>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {filteredCategories.map((cat, i) => {
            const count = getVideoCount(cat);
            return (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  if (search.trim()) {
                    router.push(`/category/${cat.slug}?q=${encodeURIComponent(search)}`);
                  } else {
                    router.push(`/category/${cat.slug}`);
                  }
                }}
                className="cursor-pointer flex flex-col items-center justify-center rounded-3xl shadow-md border border-pink-100 text-gray-800 font-semibold p-6 hover:border-pink-200 hover:bg-pink-50 transition-all relative"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-5xl mb-3">{cat.emoji}</span>
                <span className="text-sm md:text-base text-center">{cat.name}</span>
                
                {/* Mostrar cantidad si hay búsqueda */}
                {count !== null && count > 0 && (
                  <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm mb-4">
            No matching categories for "<b>{search}</b>"
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            ← Clear search
          </button>
        </div>
      )}
    </main>
  );
                }
