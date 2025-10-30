"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// 🌸 CATEGORÍAS PRINCIPALES
const ALL_CATEGORIES = [
  { name: "Holidays", slug: "holidays", emoji: "😊", color: "#FFF4E0" },
  { name: "Love & Romance", slug: "love", emoji: "❤️", color: "#FFE8EE" },
  { name: "Celebrations & Special Moments", slug: "celebrations", emoji: "🎉", color: "#FFF7FF" },
  { name: "Work & Professional Life", slug: "work", emoji: "💼", color: "#EAF4FF" },
  { name: "Condolences & Support", slug: "condolences", emoji: "🕊️", color: "#FDE6E6" },
  { name: "Animals & Nature", slug: "animals", emoji: "🐾", color: "#E8FFF3" },
  { name: "Seasons", slug: "seasons", emoji: "🍂", color: "#FFFBE5" },
  { name: "Inspirational & Friendship", slug: "inspirational", emoji: "🌟", color: "#FFFBE5" },
];

// 🔤 Normalizador
function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState(ALL_CATEGORIES);

  // 📥 Cargar videos desde API
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

  // 🔍 Filtro principal
  useEffect(() => {
    const q = normalize(search);
    if (!q) {
      setFiltered(ALL_CATEGORIES);
      return;
    }

    const singularQ = q.endsWith("s") ? q.slice(0, -1) : q;
    const matchedSlugs = new Set();

    videos.forEach((v) => {
      const fullText = normalize(
        [
          v.object,
          v.category,
          v.subcategory,
          v.mainSlug,
          v.categorySlug,
          v.src, // incluir nombre de archivo
        ]
          .filter(Boolean)
          .join(" ")
      );

      if (fullText.includes(q) || fullText.includes(singularQ)) {
        if (v.mainSlug) matchedSlugs.add(normalize(v.mainSlug));
        if (v.categorySlug) matchedSlugs.add(normalize(v.categorySlug));
      }
    });

    const result = ALL_CATEGORIES.filter((cat) =>
      matchedSlugs.has(normalize(cat.slug))
    );

    setFiltered(result);
  }, [search, videos]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-gray-800 flex flex-col items-center py-10 px-4">
      <p className="text-gray-500 text-sm mb-3">
        Home › <span className="text-pink-500 font-semibold">Categories</span>
      </p>

      <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-3 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Discover every Everwish theme and celebration ✨
      </p>

      {/* 🔎 Buscador */}
      <div className="flex justify-center mb-10 w-full">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, pumpkin, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🌈 Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <Link
              key={i}
              href={
                search.trim()
                  ? `/categories/${cat.slug}?q=${encodeURIComponent(search.trim())}`
                  : `/categories/${cat.slug}`
              }
            >
              <motion.div
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.2 }}
                className="w-[140px] sm:w-[160px] h-[120px] sm:h-[130px] rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: cat.color }}
              >
                <motion.span
                  className="text-4xl sm:text-5xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cat.emoji}
                </motion.span>
                <p className="font-semibold text-gray-700 text-center text-sm sm:text-base px-2 leading-tight">
                  {cat.name}
                </p>
              </motion.div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-6">
            No matching categories for “{search}”
          </p>
        )}
      </div>
    </main>
  );
                        }
