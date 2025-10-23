"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();

        // 🔹 Filtra videos relacionados a la categoría (por slug)
        const related = data.filter(
          (v) =>
            v.categories?.some(
              (cat) => cat.toLowerCase().replace(/\s+/g, "-") === slug
            ) ||
            v.category?.toLowerCase().replace(/\s+/g, "-") === slug ||
            v.subcategory?.toLowerCase().replace(/\s+/g, "-") === slug
        );

        setVideos(related);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-700">
        <p className="animate-pulse text-lg">
          Loading {slug.replace("-", " ")} cards...
        </p>
      </main>
    );
  }

  // 🧩 Filtrado dinámico con búsqueda
  const filtered = videos.filter((v) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      v.object?.toLowerCase().includes(q) ||
      v.name?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q) ||
      v.subcategory?.toLowerCase().includes(q) ||
      v.categories?.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Search or explore cards related to this category ✨
      </p>

      {/* 🔍 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search anything — e.g. yeti, turtle, love..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-10 rounded-full border border-pink-200 bg-white/80 px-4 py-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      {/* 🖼️ Resultados */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center">No matching cards found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl">
          {filtered.map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/edit/${video.name}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
            >
              <video
                src={video.file}
                className="object-cover w-full aspect-[4/5]"
                playsInline
                muted
                loop
              />
              <div className="text-center py-3 text-gray-700 font-semibold text-sm">
                {video.object}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
          }
