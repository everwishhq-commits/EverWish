"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [groups, setGroups] = useState({});
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);

  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  useEffect(() => {
    async function loadData() {
      try {
        const [videosRes, subsRes] = await Promise.all([
          fetch("/videos/index.json", { cache: "no-store" }),
          fetch("/data/subcategories.json", { cache: "no-store" }),
        ]);

        const [videos, subsData] = await Promise.all([
          videosRes.json(),
          subsRes.json(),
        ]);

        // 🗂️ Subcategorías del archivo
        const subList = subsData[slug] || [];
        setSubcategories(subList.map((s) => s.name_en || s.name || "General"));

        // 🧹 Normalizador universal
        const normalize = (str) =>
          str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-").trim();

        // 🎯 Filtrar videos de esta categoría (también los que tienen "+")
        let filtered = videos.filter((v) => {
          const categories = (v.categories || [])
            .join("+")
            .toLowerCase()
            .split("+")
            .map((c) => normalize(c));
          return categories.includes(normalize(slug));
        });

        // 🔍 Buscar dentro de texto y tags
        if (searchQuery) {
          filtered = filtered.filter((v) => {
            const text = [
              v.name,
              v.object,
              v.subcategory,
              v.category,
              ...(v.tags || []),
              ...(v.categories || []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return text.includes(searchQuery);
          });
        }

        // 🧩 Agrupar por subcategoría
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

        // ✅ Agregar subcategorías vacías
        subList.forEach((sub) => {
          const subName = sub.name_en || sub.name || "General";
          if (!grouped[subName]) grouped[subName] = [];
        });

        setGroups(grouped);
      } catch (err) {
        console.error("❌ Error loading category:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, searchQuery]);

  const activeVideos = activeSub ? groups[activeSub] || [] : [];

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">
          Loading {slug.replace("-", " ")} ✨
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🔙 Back */}
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      {/* 🏷️ Title */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {getEmojiForSubcategory(slug)} {slug.replaceAll("-", " ")}
      </h1>

      {/* 🔍 Search info */}
      {searchQuery && (
        <p className="text-gray-500 italic text-center mb-6">
          Showing results for “{searchQuery}”
        </p>
      )}

      {/* 🌸 Subcategories */}
      {Object.keys(groups).length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {Object.keys(groups).map((sub, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveSub(sub)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className={`px-5 py-3 rounded-full bg-white shadow-sm border ${
                activeSub === sub
                  ? "border-pink-400 bg-pink-50"
                  : "border-pink-100 hover:border-pink-200 hover:bg-pink-50"
              } text-gray-700 font-semibold flex items-center gap-2`}
            >
              <span className="text-lg">{getEmojiForSubcategory(sub)}</span>
              <span className="capitalize">{sub}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10">No subcategories available yet.</p>
      )}

      {/* 💫 Modal */}
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
              <div className="relative bg-white rounded-3xl shadow-xl w-[90%] max-w-5xl h-[70vh] overflow-y-auto border border-pink-100 p-6">
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
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

// 🧁 Emojis actualizados por subcategoría / tema
function getEmojiForSubcategory(name) {
  const map = {
    halloween: "🎃",
    christmas: "🎄",
    thanksgiving: "🦃",
    independence: "🦅",
    valentine: "💘",
    easter: "🐰",
    newyear: "🎆",
    love: "💖",
    romance: "💞",
    family: "👨‍👩‍👧‍👦",
    parenting: "🍼",
    birthday: "🎂",
    wedding: "💍",
    anniversary: "💐",
    baby: "👶",
    school: "🎓",
    graduation: "📜",
    home: "🏡",
    sympathy: "🕊️",
    support: "💗",
    health: "🩺",
    wellness: "🌿",
    gift: "🎁",
    surprise: "🎉",
    humor: "😄",
    meme: "🤣",
    adventure: "🗺️",
    nature: "🌲",
    pet: "🐾",
    animals: "🐕",
    ocean: "🐙",
    travel: "✈️",
  };
  const key = name?.toLowerCase() || "";
  return map[key] || "✨";
          }
