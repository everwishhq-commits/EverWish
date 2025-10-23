"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SubcategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();

        // 🔍 Busca los videos que contengan la subcategoría en category o subcategory
        const matched = data.filter((v) =>
          [v.category, v.subcategory]
            .filter(Boolean)
            .some(
              (field) =>
                field.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
            )
        );

        setVideos(matched);
      } catch (err) {
        console.error("❌ Error cargando subcategoría:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">
          Loading {slug.replace("-", " ")} cards ✨
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      {/* 🔙 Volver */}
      <button
        onClick={() => router.back()}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Category
      </button>

      {/* 🏷️ Título */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Explore Everwish cards for {slug.replace("-", " ")} 🎉
      </p>

      {/* 🖼️ Grid de tarjetas */}
      {videos.length === 0 ? (
        <p className="text-gray-500 text-center">No cards found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {videos.map((video, i) => (
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
    </main>
  );
          }
