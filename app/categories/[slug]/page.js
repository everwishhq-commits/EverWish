"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // 🔹 Leer datos desde la API dinámica
        const res = await fetch("/api/videos", { cache: "no-store" });
        const payload = await res.json();

        // El API devuelve { videos: [...], categories: {...} }
        const data = payload.videos || [];

        const normalize = (str) =>
          str?.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and").trim();

        const currentCategory = normalize(slug);

        // 🔍 Filtrar videos por categoría
        const filtered = data.filter((v) => {
          const cat = normalize(v.category);
          return cat.includes(currentCategory) || currentCategory.includes(cat);
        });

        // 🧩 Subcategorías únicas
        const foundSubs = Array.from(
          new Set(filtered.map((v) => v.subcategory).filter(Boolean))
        );

        setSubcategories(foundSubs);
        setVideos(filtered);

        console.log("📁 Categoría actual:", currentCategory);
        console.log("📂 Subcategorías detectadas:", foundSubs);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and").trim();

  const filteredVideos = videos.filter((v) =>
    v.object?.toLowerCase().includes(search.toLowerCase())
  );

  const activeVideos = activeSub
    ? videos.filter((v) => normalize(v.subcategory) === normalize(activeSub))
    : [];

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-[#fff5f8]">
        <p className="animate-pulse text-lg">
          Loading Everwish cards for <b>{slug}</b>...
        </p>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-start min-h-screen bg-[#fff5f8] text-gray-800 px-4 py-10 select-none touch-none"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer hover:text-pink-500"
        >
          Home
        </span>{" "}
        ›{" "}
        <span
          onClick={() => router.push("/categories")}
          className="cursor-pointer hover:text-pink-500"
        >
          Categories
        </span>{" "}
        ›{" "}
        <span className="text-gray-700 capitalize">
          {slug.replaceAll("-", " ")}
        </span>
      </nav>

      {/* 🔙 Back button */}
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
      >
        ← Back to Categories
      </button>

      {/* 🏷️ Title */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize text-center">
        {slug.replaceAll("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Explore the celebrations and life moments in this category ✨
      </p>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-10 rounded-full border border-pink-200 bg-white/70 px-4 py-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      {/* 🎨 Subcategories */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full mb-12">
          {subcategories.map((sub, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveSub(sub)}
              className={`cursor-pointer bg-white rounded-3xl shadow-md border ${
                activeSub === sub
                  ? "border-pink-300 bg-pink-50"
                  : "border-pink-100 hover:border-pink-200 hover:bg-pink-50"
              } p-6 flex flex-col items-center justify-center`}
            >
              <span className="text-5xl mb-2">
                {getEmojiForSubcategory(sub)}
              </span>
              <span className="text-gray-800 font-semibold capitalize text-center">
                {sub}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No matching subcategories found.
        </p>
      )}

      {/* 💫 Modal with cards */}
      <AnimatePresence>
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSub(null)}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white rounded-3xl shadow-xl w-[90%] max-w-5xl h-[75vh] overflow-y-auto border border-pink-100 p-6">
                <button
                  onClick={() => setActiveSub(null)}
                  className="absolute top-3 right-5 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-pink-600 mb-4 capitalize">
                  {getEmojiForSubcategory(activeSub)} {activeSub}
                </h2>

                {activeVideos.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    No cards found for this subcategory.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
                    {activeVideos.map((video, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => router.push(`/edit/${video.slug}`)}
                        className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
                      >
                        <video
                          src={video.src}
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
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

// 🌸 Emojis para subcategorías
function getEmojiForSubcategory(name) {
  const map = {
    halloween: "🎃",
    christmas: "🎄",
    thanksgiving: "🦃",
    "4th of july": "🦅",
    easter: "🐰",
    newyear: "🎆",
    wildlife: "🐾",
    love: "💘",
    birthday: "🎂",
    baby: "👶",
    family: "👨‍👩‍👧‍👦",
  };
  const key = name?.toLowerCase() || "";
  return map[key] || "✨";
}
