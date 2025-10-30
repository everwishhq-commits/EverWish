"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MAIN_CATEGORIES } from "@/lib/categories.js";

// 🧠 Sinónimos (idénticos al API)
const SYNONYMS = {
  zombies: "zombie", zombie: "zombie",
  ghosts: "ghost", ghost: "ghost",
  pumpkins: "pumpkin", pumpkin: "pumpkin",
  dogs: "dog", puppies: "dog",
  cats: "cat", kittens: "cat",
  turkeys: "turkey", hearts: "heart",
  flowers: "flower", turtles: "turtle",
  lions: "lion", tigers: "tiger", bears: "bear",
  halloween: "halloween", spooky: "halloween", boo: "halloween",
  valentine: "valentine", love: "love", heart: "love",
  christmas: "christmas", xmas: "christmas", santa: "christmas",
  thanksgiving: "thanksgiving", turkey: "thanksgiving",
  easter: "easter", bunny: "easter", egg: "easter",
};

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState(Object.entries(MAIN_CATEGORIES));

  // 📥 Cargar videos
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

  const normalize = (s) =>
    s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // 🔍 Filtro principal
  useEffect(() => {
    const q = normalize(search);
    if (!q) {
      setFiltered(Object.entries(MAIN_CATEGORIES));
      return;
    }

    const base = SYNONYMS[q] || q;
    const results = [];

    for (const [slug, cat] of Object.entries(MAIN_CATEGORIES)) {
      // Coincidencia en keywords o subcategorías
      const inCategory =
        cat.keywords.some((kw) => normalize(kw).includes(base)) ||
        cat.subcategories.some((sub) => normalize(sub).includes(base));

      // Coincidencia en videos (por objeto, categoría o sub)
      const inVideos = videos.some((v) => {
        const text = normalize(
          `${v.object} ${v.category} ${v.subcategory}`
        );
        return text.includes(base) && v.mainSlug === slug;
      });

      if (inCategory || inVideos) results.push([slug, cat]);
    }

    setFiltered(results);
  }, [search, videos]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🧭 Header breadcrumb */}
      <p className="text-gray-500 text-sm mb-3">
        Home › <span className="text-pink-500 font-semibold">Categories</span>
      </p>

      {/* 🌸 Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-3 text-center">
        Explore Main Categories 💌
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Discover every Everwish theme and celebration ✨
      </p>

      {/* 🔎 Search */}
      <div className="flex justify-center mb-10 w-full">
        <input
          type="text"
          placeholder="Search any theme — e.g. zombie, ghost, turtle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🌈 Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl justify-items-center">
        {filtered.length > 0 ? (
          filtered.map(([slug, cat], i) => (
            <Link key={i} href={`/categories/${slug}`}>
              <motion.div
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.2 }}
                className="w-[140px] sm:w-[160px] h-[120px] sm:h-[130px] rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: cat.mainColor }}
              >
                <motion.span
                  className="text-4xl sm:text-5xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {cat.mainEmoji}
                </motion.span>
                <p className="font-semibold text-gray-700 text-center text-sm sm:text-base px-2 leading-tight">
                  {cat.mainName}
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
