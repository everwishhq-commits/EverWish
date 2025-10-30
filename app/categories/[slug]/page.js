"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [groups, setGroups] = useState({});
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();

        const normalize = (str) =>
          str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-").trim();

        const grouped = {};

        for (const v of data.videos) {
          const videoCategories = [
            v.mainSlug,
            v.categorySlug,
            ...(v.extraCategories || []),
          ]
            .filter(Boolean)
            .map((c) => normalize(c));

          // ✅ Si pertenece a esta categoría
          if (videoCategories.includes(normalize(slug))) {
            const matchByQuery =
              !query ||
              v.object?.toLowerCase().includes(query) ||
              v.subcategory?.toLowerCase().includes(query) ||
              v.category?.toLowerCase().includes(query);

            if (matchByQuery) {
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
          }
        }

        // 🧠 Si no hay resultados, mostrar subcategorías vacías desde lib
        if (Object.keys(grouped).length === 0) {
          const res2 = await fetch("/api/videos", { cache: "no-store" });
          const data2 = await res2.json();
          const categoryData = data2.videos.find(
            (v) => normalize(v.mainSlug) === normalize(slug)
          );

          if (categoryData?.mainName && categoryData?.mainSlug) {
            grouped["No cards yet"] = [];
          }
        }

        setGroups(grouped);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [slug, query]);

  const subcategories = Object.keys(groups);
  const activeVideos = activeSub ? groups[activeSub] || [] : [];

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading {slug} ✨</p>
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
        ← Back to Categories
      </button>

      {/* 🏷️ Title */}
      <h1 className="text-3xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace(/-/g, " ")}
      </h1>

      {query && (
        <p className="text-gray-500 mb-8 text-center">
          Showing results for <strong>“{query}”</strong>
        </p>
      )}

      {/* 🌸 Subcategories */}
      {subcategories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {subcategories.map((sub, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveSub(sub)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className={`px-5 py-3 rounded-full bg-white shadow-sm border ${
                activeSub === sub
                  ? "border-pink-300 bg-pink-50"
                  : "border-pink-100 hover:border-pink-200 hover:bg-pink-50"
              } text-gray-700 font-semibold`}
            >
              {sub}
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-8 italic">
          No subcategories found yet for this category ✨
        </p>
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
                  {activeSub}
                </h2>

                {activeVideos.length === 0 ? (
                  <p className="text-gray-400 text-center mt-10 italic">
                    No cards found for this subcategory yet.
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
