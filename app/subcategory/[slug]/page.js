"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SubcategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const list = data.videos || data || [];

        // Normalizador
        const normalize = (s) =>
          s?.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-").trim();

        // ✅ Filtrar coincidencias amplias (no exactas)
        const filtered = list.filter((v) => {
          const sub = normalize(v.subcategory);
          const name = normalize(v.name);
          return (
            sub === slug ||
            name.includes(slug) ||
            slug.includes(sub)
          );
        });

        setVideos(filtered);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  // Estado de carga
  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading {slug} cards...</p>
      </main>
    );
  }

  // Render principal
  return (
    <main className="min-h-screen bg-[#fff5f8] flex flex-col items-center py-10 px-4">
      {/* Botón de regreso */}
      <button
        onClick={() => router.back()}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back
      </button>

      {/* Título */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-6 capitalize text-center">
        {slug.replace(/-/g, " ")}
      </h1>

      {/* Contenido */}
      {videos.length === 0 ? (
        <p className="text-gray-500">No cards found for this subcategory.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center max-w-5xl">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/edit/${v.name}`)}
              className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
            >
              <video
                src={v.file}
                className="object-cover w-full aspect-[4/5] rounded-3xl"
                playsInline
                muted
                preload="metadata"
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
                onTouchStart={(e) => e.target.play()} // móvil
                onTouchEnd={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
              />
              <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                {v.object || v.name}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
          }
