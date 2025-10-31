"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MAIN_CATEGORIES } from "@/lib/categories";

function normalize(str = "") {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-").trim();
}

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [groups, setGroups] = useState({});
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const { videos } = await res.json();
        const grouped = {};
        const current = normalize(slug);

        const validVideos = videos.filter(v => normalize(v.mainSlug) === current);

        for (const v of validVideos) {
          const sub = normalize(v.subcategory || v.category || "general");
          if (!grouped[sub]) grouped[sub] = [];
          grouped[sub].push(v);
        }

        // si la categoría tiene subcategories predefinidas en lib, asegúralas aunque estén vacías
        const predefinedSubs = MAIN_CATEGORIES[slug]?.subcategories || [];
        for (const s of predefinedSubs) {
          const key = normalize(s);
          if (!grouped[key]) grouped[key] = [];
        }

        setGroups(grouped);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const subcategories = Object.keys(groups);
  const activeVideos = activeSub ? groups[activeSub] || [] : [];

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        Loading {slug} ✨
      </main>
    );

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 py-10 px-4 flex flex-col items-center">
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Categories
      </button>

      <h1 className="text-3xl font-extrabold text-pink-600 mb-6 capitalize text-center">
        {MAIN_CATEGORIES[slug]?.mainName || slug}
      </h1>

      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mb-10">
        {subcategories.map((sub, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveSub(sub)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`px-5 py-3 rounded-full text-gray-700 font-semibold border ${
              activeSub === sub
                ? "border-pink-300 bg-pink-50"
                : "border-pink-100 hover:border-pink-200 hover:bg-pink-50"
            }`}
          >
            {sub.replace(/-/g, " ")}
          </motion.button>
        ))}
      </div>

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
                  {activeSub.replace(/-/g, " ")}
                </h2>

                {activeVideos.length === 0 ? (
                  <p className="text-gray-400 text-center mt-10 italic">
                    No cards found for this subcategory yet ✨
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
