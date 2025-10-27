"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  { name: "Wellness & Mindful Living", emoji: "🕯️", slug: "wellness-mindful-living", color: "#EDEAFF" }
];

export default function CategoriesGridPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Buscar coincidencias en videos cuando hay texto
  useEffect(() => {
    if (!search.trim()) {
      setMatchedCategories([]);
      return;
    }

    async function findMatches() {
      setLoading(true);
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();

        const query = search.toLowerCase();
        const matched = new Set();

        // Buscar coincidencias en título o slug del video
        (data.videos || []).forEach((v) => {
          if (v.slug.toLowerCase().includes(query) || v.title.toLowerCase().includes(query)) {
            matched.add(v.category);
          }
        });

        // Convertir en array y mapear al formato de categorías
        const results = allCategories.filter((cat) =>
          Array.from(matched).some(
            (m) => cat.name.toLowerCase() === m.toLowerCase()
          )
        );

        setMatchedCategories(results);
      } catch (err) {
        console.error("❌ Error searching videos:", err);
      } finally {
        setLoading(false);
      }
    }

    findMatches();
  }, [search]);

  const displayCategories = search.trim() ? matchedCategories : allCategories;

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
          placeholder="Search any theme — e.g. love, halloween, zombie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/80"
        />
      </div>

      {/* 🧩 Category grid */}
      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : displayCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {displayCategories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => {
                const query = search.trim();
                if (query) {
                  router.push(`/category/${cat.slug}?q=${query}`);
                } else {
                  router.push(`/category/${cat.slug}`);
                }
              }}
              className="cursor-pointer flex flex-col items-center justify-center rounded-3xl shadow-md border border-pink-100 text-gray-800 font-semibold p-6 hover:border-pink-200 hover:bg-pink-50"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-5xl mb-3">{cat.emoji}</span>
              <span className="text-sm md:text-base text-center">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-8">
          No matching categories for “{search}”
        </p>
      )}
    </main>
  );
        }
