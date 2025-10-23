"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🔠 Normalizar texto para ignorar acentos y mayúsculas
function normalizeText(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CategoryPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Cargar todos los videos del JSON
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error loading /videos/index.json:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // 🔍 Filtrar según categoría + palabra buscada
  useEffect(() => {
    if (!videos.length) return;
    const q = normalizeText(search.trim());
    const filteredVideos = videos.filter((v) => {
      const belongsToCategory =
        normalizeText(v.category || "") === normalizeText(slug) ||
        (v.categories || []).some((c) => normalizeText(c) === normalizeText(slug));

      if (!belongsToCategory) return false;
      if (!q) return true;

      const allText = normalizeText(
        [v.name, v.object, v.subcategory, v.category, ...(v.tags || [])].join(" ")
      );

      return allText.includes(q);
    });

    setFiltered(filteredVideos);
  }, [videos, search, slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading {slug} ✨</p>
      </main>
    );
  }

  // 🧁 Agrupar por subcategoría
  const groups = {};
  filtered.forEach((v) => {
    const sub =
      (v.subcategory && v.subcategory.trim()) ||
      (v.category && v.category.trim()) ||
      "General";
    if (!groups[sub]) groups[sub] = [];
    groups[sub].push(v);
  });

  const subcategories = Object.keys(groups);

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🔙 Back */}
      <button
        onClick={() => router.push("/")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Categories
      </button>

      {/* 🏷️ Title */}
      <h1 className="text-3xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>

      {/* 🔎 Barra de búsqueda persistente */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Filter cards — e.g. turtle, love, halloween..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </div>

      {/* 🌸 Subcategorías */}
      {subcategories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {subcategories.map((sub, i) => (
            <motion.div
              key={i}
              className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="capitalize text-lg mb-2 text-center">
                {sub}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                {groups[sub].map((video, j) => (
                  <motion.div
                    key={j}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => router.push(`/edit/${video.name}`)}
                    className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
                  >
                    <video
                      src={video.file}
                      className="object-cover w-full aspect-[4/5]"
                      playsInline
                      loop
                      muted
                    />
                    <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                      {video.object}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No matching cards for “{search}” in this category.
        </p>
      )}
    </main>
  );
}
