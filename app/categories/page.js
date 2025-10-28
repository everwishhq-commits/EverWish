"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// 🌸 Lista base de categorías (para colores y emojis)
const allCategories = [
  { name: "Seasonal & Global Celebrations", emoji: "🎉", slug: "seasonal-global-celebrations", color: "#FFE0E9" },
  { name: "Love, Weddings & Anniversaries", emoji: "💍", slug: "love-weddings-anniversaries", color: "#FFECEC" },
  { name: "Birthdays & Celebrations", emoji: "🎂", slug: "birthdays-celebrations", color: "#FFDDEE" },
  { name: "Family & Friendship", emoji: "👨‍👩‍👧‍👦", slug: "family-friendship", color: "#E5EDFF" },
  { name: "Babies & Parenting", emoji: "👶", slug: "babies-parenting", color: "#DFF7FF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#FFF3E0" },
  { name: "Support, Healing & Care", emoji: "🕊️", slug: "support-healing-care", color: "#F3F3F3" },
  { name: "Everyday & Appreciation", emoji: "💌", slug: "everyday-appreciation", color: "#FDE6E6" },
  { name: "Creativity & Expression", emoji: "🎨", slug: "creativity-expression", color: "#FFEDDF" },
  { name: "Kids & Teens", emoji: "🧸", slug: "kids-teens", color: "#FFE6FA" },
  { name: "Diversity & Connection", emoji: "🧩", slug: "diversity-connection", color: "#E7E9FF" },
  { name: "Life Journeys & Transitions", emoji: "🏡", slug: "life-journeys-transitions", color: "#E8FFF3" },
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" },
];

export default function CategoriesGridPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔍 Si no hay texto, mostrar todas las categorías
    if (!search.trim()) {
      setFilteredCategories(allCategories);
      return;
    }

    setLoading(true);

    async function fetchVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        const term = search.toLowerCase().trim();

        // Buscar coincidencias en object, subcategory o category
        const matches = data.filter(v =>
          (v.object?.toLowerCase().includes(term)) ||
          (v.subcategory?.toLowerCase().includes(term)) ||
          (v.category?.toLowerCase().includes(term))
        );

        // Extraer categorías únicas encontradas
        const matchedCats = [...new Set(matches.map(v => v.category).filter(Boolean))];

        // Asociar las categorías encontradas con las del array base
        const dynamicFiltered = allCategories.filter(cat =>
          matchedCats.some(mc => cat.name.toLowerCase().includes(mc.toLowerCase()) || mc.toLowerCase().includes(cat.slug))
        );

        setFilteredCategories(dynamicFiltered.length > 0 ? dynamicFiltered : []);
      } catch (err) {
        console.error("❌ Error loading index.json:", err);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [search]);

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer hover:text-pink-500"
        >
          Home
        </span>{" "}
        › <span className="text-gray-700">Categories</span>
      </nav>

      {/* 🏷️ Título */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Discover every Everwish theme, celebration, and life moment ✨
      </p>

      {/* 🔍 Search bar */}
      <div className="flex justify-center mb-12 w-full">
        <input
          type="text"
          placeholder="Search any theme — e.g. yeti, turtle, octopus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/80"
        />
      </div>

      {/* 🧩 Grid de categorías */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Searching...</p>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {filteredCategories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="cursor-pointer flex flex-col items-center justify-center rounded-3xl shadow-md border border-pink-100 text-gray-800 font-semibold p-6 hover:border-pink-200 hover:bg-pink-50"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-5xl mb-3">{cat.emoji}</span>
              <span className="text-sm md:text-base text-center">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-8 text-center">
          No matching categories for “{search}”
        </p>
      )}
    </main>
  );
            }
