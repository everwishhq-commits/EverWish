"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  filterByCategory, 
  getGroupsWithSubcategories,
  filterBySubcategory,
  searchVideos 
} from "@/lib/search-system";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  
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
        
        console.log(`📦 Total videos: ${all.length}`);
        
        // Filtrar por categoría
        let filtered = filterByCategory(all, slug);
        console.log(`✅ Videos en ${slug}: ${filtered.length}`);
        
        // Si hay búsqueda
        if (q) {
          filtered = searchVideos(filtered, q);
          console.log(`🔍 Después de buscar "${q}": ${filtered.length}`);
        }
        
        setCategoryVideos(filtered);
        
        // Obtener grupos con subcategorías
        const groupsWithSubs = getGroupsWithSubcategories(filtered, slug);
        console.log(`📂 Grupos:`, Object.keys(groupsWithSubs));
        setGroups(groupsWithSubs);
        
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, q]);

  const openModal = (sub) => {
    const videos = filterBySubcategory(categoryVideos, sub);
    console.log(`🎯 ${sub}: ${videos.length} videos`);
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

  const categoryTitle = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const groupNames = Object.keys(groups);

  return (
    <main className="min-h-screen bg-[#fff5f8] py-10 px-4">
      <button 
        onClick={() => router.push("/categories")} 
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center">
        {categoryTitle}
      </h1>

      {q && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Results for "<b>{q}</b>"
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
                    onClick={() => openModal(sub.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 hover:border-pink-400 hover:shadow-md font-semibold text-gray-700 flex items-center gap-2 transition-all"
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full font-bold">
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
          {q ? (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Try a different search term
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
                    <p className="text-gray-500 text-lg">No cards found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                    {modalVideos.map((video, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
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
