"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  filterByCategory, 
  extractSubcategories, 
  filterBySubcategory,
  searchVideos 
} from "@/lib/search-system";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  
  const [allVideos, setAllVideos] = useState([]);
  const [categoryVideos, setCategoryVideos] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [modalVideos, setModalVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar videos
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = data.videos || [];
        
        console.log(`📦 Total videos: ${all.length}`);
        console.log(`📂 Filtrando categoría: ${slug}`);
        
        // Filtrar por categoría (cada video tiene contextSubcategories para ESTA categoría)
        let filtered = filterByCategory(all, slug);
        console.log(`✅ Videos en ${slug}: ${filtered.length}`);
        
        // Debug: mostrar primeros 3 videos
        if (filtered.length > 0) {
          console.log("📹 Ejemplos:");
          filtered.slice(0, 3).forEach(v => {
            console.log(`  - ${v.name}`);
            console.log(`    Subs para esta categoría: ${v.contextSubcategories?.join(", ")}`);
          });
        }
        
        // Si hay búsqueda, filtrar adicionalmente
        if (q) {
          filtered = searchVideos(filtered, q);
          console.log(`🔍 Después de buscar "${q}": ${filtered.length}`);
        }
        
        setAllVideos(all);
        setCategoryVideos(filtered);
        
        // Extraer subcategorías (ya vienen correctas del contexto)
        const subs = extractSubcategories(filtered, slug);
        console.log(`🗂️ Subcategorías: ${subs.join(", ")}`);
        setSubcategories(subs);
        
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, q]);

  // Abrir modal
  const openModal = (sub) => {
    const videos = filterBySubcategory(categoryVideos, sub, slug);
    console.log(`🎯 ${sub}: ${videos.length} videos`);
    
    if (videos.length === 0) {
      console.warn(`⚠️ No videos para "${sub}"`);
    } else {
      console.log("📹 Videos en modal:");
      videos.forEach(v => console.log(`  - ${v.name}`));
    }
    
    setModalVideos(videos);
    setActiveSub(sub);
  };

  const closeModal = () => {
    setActiveSub(null);
    setModalVideos([]);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#fff5f8]">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </main>
    );
  }

  // Título de categoría
  const categoryTitle = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#fff5f8] py-10 px-4">
      <button 
        onClick={() => router.push("/categories")} 
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6 flex items-center gap-2"
      >
        <span>←</span> Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        {categoryTitle}
      </h1>

      {q && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Results for "<b>{q}</b>"
        </p>
      )}

      <p className="text-center text-gray-500 mb-8 text-sm">
        {categoryVideos.length} {categoryVideos.length === 1 ? 'card' : 'cards'} available
      </p>

      {subcategories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {subcategories.map((sub, i) => {
            const count = filterBySubcategory(categoryVideos, sub, slug).length;
            return (
              <motion.button
                key={i}
                onClick={() => openModal(sub)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-300 hover:bg-pink-50 font-semibold flex items-center gap-2 transition-all"
              >
                <span>{sub}</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
          <p className="text-gray-500 text-lg mb-4">No subcategories found</p>
          {q ? (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Try a different search term or browse without filters
              </p>
              <button 
                onClick={() => router.push(`/category/${slug}`)} 
                className="text-pink-500 hover:text-pink-600 font-semibold"
              >
                ← Clear search
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              This category doesn't have any cards yet
            </p>
          )}
        </div>
      )}

      {/* 💫 Modal */}
      <AnimatePresence>
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                  onClick={closeModal}
                  className="sticky top-0 float-right bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-md z-10"
                >
                  ×
                </button>

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center clear-both pt-2">
                  {activeSub}
                </h2>

                {modalVideos.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-2">No cards found</p>
                    <p className="text-gray-400 text-sm">Try another subcategory</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                    {modalVideos.map((video, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.2 }}
                        onClick={async () => {
                          try {
                            const elem = document.documentElement;
                            if (elem.requestFullscreen) await elem.requestFullscreen();
                            await new Promise(r => setTimeout(r, 150));
                          } catch {}
                          router.push(`/edit/${video.name}`);
                        }}
                        className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl overflow-hidden transition-all"
                      >
                        <video
                          src={video.file}
                          className="w-full aspect-[4/5] object-cover bg-pink-50"
                          playsInline
                          loop
                          muted
                          preload="metadata"
                          poster={video.file + "#t=0.1"}
                          onMouseEnter={e => e.target.play().catch(() => {})}
                          onMouseLeave={e => { 
                            e.target.pause(); 
                            e.target.currentTime = 0; 
                          }}
                          onTouchStart={e => e.target.play().catch(() => {})}
                          onTouchEnd={e => { 
                            e.target.pause(); 
                            e.target.currentTime = 0; 
                          }}
                        />
                        <div className="text-center py-3 px-2 bg-gradient-to-t from-pink-50 to-white">
                          <p className="text-sm font-semibold text-gray-700 line-clamp-2">
                            {video.object || video.name}
                          </p>
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
