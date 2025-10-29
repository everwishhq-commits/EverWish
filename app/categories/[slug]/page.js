"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = data.videos || [];

        // Filtra por categoría principal (mainSlug)
        const filtered = all.filter(
          (v) => v.mainSlug?.toLowerCase() === slug?.toLowerCase()
        );

        setVideos(filtered);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [slug]);

  if (loading)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading cards ✨</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🔙 Back button */}
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Categories
      </button>

      {/* 🏷️ Title */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize text-center">
        {videos[0]?.mainEmoji || "✨"} {videos[0]?.mainName || slug}
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">
        Explore beautiful Everwish cards in this category 💌
      </p>

      {/* 🖼️ Grid de videos */}
      {videos.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No cards found in this category yet 💫
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center max-w-6xl">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
              onClick={() => router.push(`/edit/${v.slug}`)}
              className="bg-white rounded-3xl shadow-md border border-pink-100 hover:border-pink-200 hover:bg-pink-50 p-3 cursor-pointer flex flex-col items-center overflow-hidden w-[150px] sm:w-[200px]"
            >
              <video
                src={v.src}
                className="w-full h-[220px] object-cover rounded-2xl bg-gray-100"
                playsInline
                muted
                loop
                autoPlay
                onError={(e) => (e.target.poster = "/placeholder.png")}
              />
              <div className="text-center mt-2">
                <p className="text-gray-700 font-semibold text-sm truncate">
                  {v.object}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {v.subcategory}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
