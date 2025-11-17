"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  searchVideos,
  filterByCategory,
  filterBySubcategory,
  getUniqueSubcategories 
} from "@/lib/simple-search";
import { SUBCATEGORY_GROUPS } from "@/lib/categories-config";

export const dynamic = 'force-dynamic';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const subFromUrl = searchParams.get("sub");
  
  const [categoryVideos, setCategoryVideos] = useState([]);
  const [groups, setGroups] = useState({});
  const [activeSub, setActiveSub] = useState(null);
  const [modalVideos, setModalVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = data.videos || [];
        
        console.log(`📊 Total videos: ${all.length}`);
        console.log(`🔍 Categoría: ${slug}`);
        
        // PASO 1: Filtrar por categoría
        let filtered = filterByCategory(all, slug);
        
        console.log(`✅ Videos en categoría: ${filtered.length}`);
        
        // PASO 2: Si hay búsqueda, aplicar filtro adicional
        if (q) {
          console.log(`🔍 Aplicando búsqueda: "${q}"`);
          filtered = searchVideos(filtered, q);
          console.log(`✅ Videos después de búsqueda: ${filtered.length}`);
        }
        
        setCategoryVideos(filtered);
        
        // PASO 3: Obtener subcategorías únicas
        const uniqueSubs = getUniqueSubcategories(filtered);
        
        // PASO 4: Agrupar subcategorías según SUBCATEGORY_GROUPS
        const groupsData = {};
        const subGroups = SUBCATEGORY_GROUPS[slug] || {};
        
        Object.entries(subGroups).forEach(([groupName, subList]) => {
          const subsWithCount = subList.map(subName => {
            const count = filterBySubcategory(filtered, subName).length;
            return { name: subName, count };
          });
          
          // Solo agregar grupos con al menos una subcategoría con videos
          if (subsWithCount.some(s => s.count > 0)) {
            groupsData[groupName] = subsWithCount;
          }
        });
        
        console.log(`📂 Grupos encontrados:`, Object.keys(groupsData));
        
        setGroups(groupsData);
        
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, q]);

  // Auto-abrir modal si hay subcategoría en URL
  useEffect(() => {
    if (subFromUrl && categoryVideos.length > 0 && !activeSub) {
      setActiveSub(subFromUrl);
      const videos = filterBySubcategory(categoryVideos, subFromUrl);
      setModalVideos(videos);
      console.log(`📂 Modal abierto: ${subFromUrl} (${videos.length} videos)`);
    }
  }, [subFromUrl, categoryVideos, activeSub]);

  const openModal = (sub) => {
    setActiveSub(sub);
    const videos = filterBySubcategory(categoryVideos, sub);
    setModalVideos(videos);
    console.log(`📂 Abriendo modal: ${sub} (${videos.length} videos)`);
  };

  const closeModal = () => {
    setActiveSub(null);
    setModalVideos([]);
  };

  const handleCardClick = async (videoName) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
      await new Promise(r => setTimeout(r, 150));
      router.push(`/edit/${videoName}`);
    } catch {
      router.push(`/edit/${videoName}`);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#fff5f8]">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </main>
    );
  }

  const categoryTitle = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  const groupNames = Object.keys(groups);

  return (
    <main className="min-h-screen bg-[#fff5f8] py-10 px-4">
      <button 
        onClick={() => router.push("/categories")} 
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        {categoryTitle}
      </h1>

      {q && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Results for &quot;{q}&quot;
        </p>
      )}

      <p className="text-center text-gray-500 mb-10 text-sm">
        {categoryVideos.length} {categoryVideos.length === 1 ? 'card' : 'cards'} available
      </p>

      {groupNames.length > 0 ? (
        <div className="max-w-6xl mx-auto space-y-8">
          {groupNames.map((groupName, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-pink-500">📂</span>
                {groupName}
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {groups[groupName].map((sub, j) => (
                  <motion.button
                    key={j}
                    onClick={() => sub.count > 0 && openModal(sub.name)}
                    whileHover={sub.count > 0 ? { scale: 1.05 } : {}}
                    whileTap={sub.count > 0 ? { scale: 0.95 } : {}}
                    className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-2 transition-all ${
                      sub.count > 0
                        ? "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:border-pink-400 hover:shadow-md text-gray-700 cursor-pointer"
                        : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      sub.count > 0
                        ? "bg-pink-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}>
                      {sub.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
          <p className="text-gray-500 text-lg mb-4">No subcategories found</p>
          {q && (
            <button
              onClick={() => router.push(`/category/${slug}`)}
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              ← Clear search
            </button>
          )}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence mode="wait">
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 relative" 
                onClick={(e) => e.stopPropagation()}
              >
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
                    <p className="text-gray-500 text-lg">No cards yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                    {modalVideos.map((video, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleCardClick(video.name)}
                        className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-pink-100 hover:border-pink-300 overflow-hidden"
                      >
                        <div className="relative w-full aspect-[4/5] bg-pink-50">
                          <video
                            src={video.file}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            loop
                            muted
                            preload="metadata"
                            onMouseEnter={e => e.target.play().catch(() => {})}
                            onMouseLeave={e => { 
                              e.target.pause(); 
                              e.target.currentTime = 0; 
                            }}
                          />
                        </div>
                        <div className="text-center py-3 px-2">
                          <p className="text-sm font-semibold text-gray-700">
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
