"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ✅ CATEGORÍAS PRINCIPALES ACTUALIZADAS
const allCategories = [
  { name: "Seasonal & Holidays", emoji: "🎉", slug: "seasonal-holidays", color: "#FFE0E9" },
  { name: "Birthday", emoji: "🎂", slug: "birthday", color: "#FFDDEE" },
  { name: "Love & Romance", emoji: "💘", slug: "love-romance", color: "#FFECEC" },
  { name: "Family & Relationships", emoji: "👨‍👩‍👧‍👦", slug: "family-relationships", color: "#E5EDFF" },
  { name: "Pets & Animal Lovers", emoji: "🐾", slug: "pets-animal-lovers", color: "#E9FFF4" },
  { name: "Health & Support", emoji: "🩺", slug: "health-support", color: "#DFFAFF" },
  { name: "Sympathy & Remembrance", emoji: "🕊️", slug: "sympathy-remembrance", color: "#F3F3F3" },
  { name: "Work & Professional", emoji: "💼", slug: "work-professional", color: "#E8FFF3" },
  { name: "School & Graduation", emoji: "🎓", slug: "school-graduation", color: "#E2FFD7" },
  { name: "Weddings & Anniversaries", emoji: "💍", slug: "weddings-anniversaries", color: "#F3E5FF" },
  { name: "Babies & Parenting", emoji: "🍼", slug: "babies-parenting", color: "#FDE6E6" },
  { name: "Thank You & Appreciation", emoji: "🙏", slug: "thank-you-appreciation", color: "#FFF0E5" },
  { name: "Encouragement & Motivation", emoji: "🌟", slug: "encouragement-motivation", color: "#FFF5D9" },
  { name: "Adventure & Nature", emoji: "🗺️", slug: "adventure-nature", color: "#E8ECFF" },
  { name: "Humor & Memes", emoji: "😄", slug: "humor-memes", color: "#E7F7FF" },
  { name: "House & Moving", emoji: "🏡", slug: "house-moving", color: "#FFD9E8" },
  { name: "Universal", emoji: "✨", slug: "universal", color: "#E5FFE2" }
];

export default function CategoriesGridPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase().trim())
  );

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
        Discover every Everwish theme and celebration ✨
      </p>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-center mb-12 w-full">
        <input
          type="text"
          placeholder="Search any theme — e.g. pumpkin, love, graduation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/80"
        />
      </div>

      {/* 🧩 Cuadrícula de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => router.push(`/categories/${cat.slug}`)} // ✅ RUTA ACTUALIZADA
              className="cursor-pointer flex flex-col items-center justify-center rounded-3xl shadow-md border border-pink-100 text-gray-800 font-semibold p-6 hover:border-pink-200 hover:bg-pink-50"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-5xl mb-3">{cat.emoji}</span>
              <span className="text-sm md:text-base text-center">{cat.name}</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-8">
            No matching categories for “{search}”
          </p>
        )}
      </div>
    </main>
  );
                }
