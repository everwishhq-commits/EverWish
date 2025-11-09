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
        console.log("📦 Total videos disponibles:", list.length);

        // Función de normalización simple
        const normalize = (str) => {
          if (!str) return "";
          return str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]/g, ""); // elimina todo excepto letras y números
        };

        const targetNormalized = normalize(slug);
        console.log("🎯 Slug normalizado:", targetNormalized);

        // Búsqueda flexible
        const filtered = list.filter((v) => {
          // Normalizar todos los campos del video
          const subNorm = normalize(v.subcategory);
          const nameNorm = normalize(v.name);
          const categoryNorm = normalize(v.category);
          
          // Normalizar arrays
          const categoriesNorm = (v.categories || []).map(c => normalize(c));
          const tagsNorm = (v.tags || []).map(t => normalize(t));
          
          // Debug para el primer video
          if (list.indexOf(v) === 0) {
            console.log("📹 Ejemplo de normalización:");
            console.log("  Original subcategory:", v.subcategory, "→", subNorm);
            console.log("  Original name:", v.name, "→", nameNorm);
          }
          
          // Coincidencia en subcategoría (exacta o parcial)
          if (subNorm === targetNormalized) {
            console.log("✅ Match en subcategory:", v.name);
            return true;
          }
          if (subNorm.includes(targetNormalized) || targetNormalized.includes(subNorm)) {
            console.log("✅ Match parcial en subcategory:", v.name);
            return true;
          }
          
          // Coincidencia en nombre
          if (nameNorm.includes(targetNormalized)) {
            console.log("✅ Match en name:", v.name);
            return true;
          }
          
          // Coincidencia en tags
          if (tagsNorm.some(tag => tag === targetNormalized || tag.includes(targetNormalized))) {
            console.log("✅ Match en tags:", v.name);
            return true;
          }
          
          // Coincidencia en categorías
          if (categoriesNorm.some(cat => cat === targetNormalized || cat.includes(targetNormalized))) {
            console.log("✅ Match en categories:", v.name);
            return true;
          }
          
          return false;
        });

        console.log(`✅ Videos encontrados: ${filtered.length}`);
        
        if (filtered.length > 0) {
          console.log("📹 Videos encontrados:");
          filtered.forEach(v => {
            console.log(`  - ${v.name} (${v.subcategory})`);
          });
        } else {
          console.log("⚠️ No se encontraron videos");
          console.log("💡 Verifica que el slug coincida con alguna subcategoría");
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

      {/* Contenido */}
      {videos.length === 0 ? (
        <div className="text-center max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <p className="text-gray-500 mb-4 text-lg">
            No cards found for this subcategory.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Searched for: "<strong>{slug.replace(/-/g, " ")}</strong>"
          </p>
          <button
            onClick={() => router.push("/categories")}
            className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 shadow-md"
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
                className="object-cover w-full aspect-[4/5]"
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
