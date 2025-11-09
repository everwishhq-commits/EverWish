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

        console.log("🔍 Buscando subcategoría:", slug);
        console.log("📦 Total videos:", list.length);

        // Normalizador mejorado
        const normalize = (s) =>
          s?.toLowerCase()
            .replace(/&/g, "and")
            .replace(/\s+/g, "-")
            .replace(/_/g, "-")
            .trim();

        const targetSlug = normalize(slug);
        
        console.log("🎯 Slug normalizado:", targetSlug);

        // ✅ Búsqueda flexible: coincidencia en subcategory, name, tags o categories
        const filtered = list.filter((v) => {
          const sub = normalize(v.subcategory);
          const name = normalize(v.name);
          const categories = (v.categories || [v.category]).map(c => normalize(c));
          const tags = (v.tags || []).map(t => normalize(t));
          
          // Coincidencia directa en subcategoría
          if (sub === targetSlug) return true;
          
          // Coincidencia parcial en subcategoría
          if (sub.includes(targetSlug) || targetSlug.includes(sub)) return true;
          
          // Coincidencia en el nombre del archivo
          if (name.includes(targetSlug)) return true;
          
          // Coincidencia en tags
          if (tags.some(tag => tag === targetSlug || tag.includes(targetSlug) || targetSlug.includes(tag))) return true;
          
          // Coincidencia en categorías
          if (categories.some(cat => cat === targetSlug || cat.includes(targetSlug) || targetSlug.includes(cat))) return true;
          
          return false;
        });

        console.log(`✅ Videos encontrados: ${filtered.length}`);
        
        if (filtered.length > 0) {
          console.log("📹 Primeros 3 videos:");
          filtered.slice(0, 3).forEach(v => {
            console.log(`  - ${v.name}`);
            console.log(`    Sub: ${v.subcategory}`);
            console.log(`    Categories: ${v.categories?.join(", ")}`);
          });
        }
        
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
        <p className="animate-pulse text-lg">Loading {slug.replace(/-/g, " ")} cards...</p>
      </main>
    );
  }

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

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-2xl">
          <p className="text-sm text-gray-600">
            <strong>Debug:</strong> Buscando "{slug}" en {videos.length} videos
          </p>
        </div>
      )}

      {/* Contenido */}
      {videos.length === 0 ? (
        <div className="text-center max-w-md">
          <p className="text-gray-500 mb-4">No cards found for this subcategory.</p>
          <p className="text-sm text-gray-400">
            Searched for: "{slug.replace(/-/g, " ")}"
          </p>
          <button
            onClick={() => router.push("/categories")}
            className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600"
          >
            Browse All Categories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center max-w-5xl">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                console.log("🎬 Navegando a:", v.name);
                router.push(`/edit/${v.name}`);
              }}
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
                onTouchStart={(e) => e.target.play()}
                onTouchEnd={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
                onError={(e) => {
                  console.error("❌ Error cargando video:", v.file);
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
