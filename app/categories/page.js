"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const allCategories = [
  {
    name: "Holidays",
    emoji: "🎄",
    slug: "holidays",
    color: "#FFF4E0",
  },
  {
    name: "Love & Romance",
    emoji: "❤️",
    slug: "love",
    color: "#FFE8EE",
  },
  {
    name: "Celebrations & Special Moments",
    emoji: "🎉",
    slug: "celebrations",
    color: "#FFF7FF",
  },
  {
    name: "Work & Professional Life",
    emoji: "💼",
    slug: "work",
    color: "#EAF4FF",
  },
  {
    name: "Condolences & Support",
    emoji: "🕊️",
    slug: "condolences",
    color: "#F8F8F8",
  },
  {
    name: "Animals & Nature",
    emoji: "🐾",
    slug: "animals",
    color: "#E8FFF3",
  },
  {
    name: "Seasons",
    emoji: "🍂",
    slug: "seasons",
    color: "#FFFBE5",
  },
  {
    name: "Inspirational & Friendship",
    emoji: "🌟",
    slug: "inspirational",
    color: "#FFFBE5",
  },
];

export default function CategoriesPage() {
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

      {/* 🌸 Título principal */}
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
          placeholder="Search any category — e.g. birthday, halloween, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white/80"
        />
      </div>

      {/* 🧩 Cuadrícula de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 20px rgba(255,182,193,0.35)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => router.push(`/category/${cat.slug}`)} // ✅ Enlace directo
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
