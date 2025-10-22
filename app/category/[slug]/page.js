"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryModalPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [groups, setGroups] = useState({});
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();

        // 🔹 Filtra todos los videos que pertenezcan a esta categoría principal
        const filtered = data.filter((v) =>
          (v.categories || []).some(
            (c) => c.toLowerCase().replace(/\s+/g, "-") === slug
          )
        );

        // 🔹 Agrupa por subcategoría o categoría (corrige mayúsculas, guiones, etc.)
        const grouped = {};
        for (const v of filtered) {
          const sub =
            (v.subcategory && v.subcategory.trim()) ||
            (v.category && v.category.trim()) ||
            "General";

          const clean = sub
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          if (!grouped[clean]) grouped[clean] = [];
          grouped[clean].push(v);
        }

        setGroups(grouped);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const subcategories = Object.keys(groups);
  const activeVideos = activeSub ? groups[activeSub] || [] : [];

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">
          Loading {slug.replace("-", " ")} celebrations ✨
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🔙 Volver */}
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      {/* 🏷️ Título principal */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-8 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>

      {/* 🌸 Subcategorías */}
      {subcategories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {subcategories.map((sub, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveSub(sub)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold flex items-center gap-2"
            >
              <span className="text-lg">{getEmojiForSubcategory(sub)}</span>
              <span className="capitalize">{sub}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No subcategories found.</p>
      )}

      {/* 💫 Modal elegante */}
      <AnimatePresence>
        {activeSub && (
          <>
            {/* Fondo con blur */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSub(null)} // 👈 cerrar al tocar fuera
            />
            {/* Contenedor modal */}
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white rounded-3xl shadow-xl w-[90%] max-w-5xl h-[70vh] overflow-y-auto border border-pink-100 p-6">
                {/* ✖ Cerrar */}
                <button
                  onClick={() => setActiveSub(null)}
                  className="absolute top-3 right-5 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                >
                  ×
                </button>

                {/* Título subcategoría */}
                <h2 className="text-2xl font-bold text-pink-600 mb-4 capitalize">
                  {getEmojiForSubcategory(activeSub)} {activeSub}
                </h2>

                {/* Tarjetas dentro del modal */}
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
                        onClick={() => router.push(`/edit/${video.name}`)}
                        className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
                      >
                        <video
                          src={video.file}
                          className="object-cover w-full h-auto aspect-[4/5]"
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

// 🌸 Emojis decorativos
function getEmojiForSubcategory(name) {
  const map = {
    halloween: "🎃",
    christmas: "🎄",
    thanksgiving: "🦃",
    "4th of july": "🦅",
    easter: "🐰",
    newyear: "🎆",
  };
  const key = name?.toLowerCase() || "";
  return map[key] || "✨";
          }
