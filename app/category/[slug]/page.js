"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🔍 Normalizar
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// 🎯 Filtrar videos por categoría
function filterByCategory(videos, categorySlug) {
  const normSlug = norm(categorySlug);
  return videos.filter(v => {
    const cats = v.categories || [v.category];
    return cats.some(c => {
      const normCat = norm(c);
      return normCat.includes(normSlug) || normSlug.includes(normCat);
    });
  });
}

// 🗂️ Extraer subcategorías únicas
function getSubcategories(videos) {
  const subs = new Set();
  videos.forEach(v => {
    if (v.subcategory && v.subcategory !== "General") {
      subs.add(v.subcategory);
    }
  });
  return Array.from(subs).sort();
}

// 🎯 Filtrar por subcategoría
function filterBySub(videos, sub) {
  const normSub = norm(sub);
  return videos.filter(v => {
    const vSub = norm(v.subcategory);
    const vName = norm(v.name);
    const vObj = norm(v.object);
    const vTags = (v.tags || []).map(t => norm(t));
    
    return vSub === normSub || vSub.includes(normSub) || normSub.includes(vSub) ||
           vName.includes(normSub) || vObj.includes(normSub) || vTags.includes(normSub);
  });
}

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
        
        // Filtrar por categoría
        const filtered = filterByCategory(all, slug);
        
        // Si hay búsqueda, filtrar más
        const final = q 
          ? filtered.filter(v => {
              const text = [v.name, v.object, v.subcategory, ...(v.tags || [])].join(" ");
              return norm(text).includes(norm(q));
            })
          : filtered;
        
        setAllVideos(all);
        setCategoryVideos(final);
        
        // Extraer subcategorías
        const subs = getSubcategories(final);
        setSubcategories(subs);
        
        console.log(`✅ ${slug}: ${final.length} videos, ${subs.length} subcategorías`);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, q]);

  // Abrir modal con videos de subcategoría
  const openModal = (sub) => {
    const videos = filterBySub(categoryVideos, sub);
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

  return (
    <main className="min-h-screen bg-[#fff5f8] py-10 px-4">
      <button onClick={() => router.push("/categories")} className="text-pink-500 hover:text-pink-600 font-semibold mb-6">
        ← Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 text-center capitalize">
        {slug.replace(/-/g, " ")}
      </h1>

      {q && (
        <p className="text-sm text-gray-500 text-center mb-8">
          Results for "<b>{q}</b>"
        </p>
      )}

      {subcategories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {subcategories.map((sub, i) => {
            const count = filterBySub(categoryVideos, sub).length;
            return (
              <motion.button
                key={i}
                onClick={() => openModal(sub)}
                whileHover={{ scale: 1.05 }}
                className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-300 hover:bg-pink-50 font-semibold flex items-center gap-2"
              >
                <span>{sub}</span>
                <span className="text-xs bg-pink-100 px-2 py-1 rounded-full">{count}</span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No subcategories found</p>
          {q && (
            <button onClick={() => router.push(`/category/${slug}`)} className="mt-4 text-pink-500 font-semibold">
              ← Clear search
            </button>
          )}
        </div>
      )}

      {/* 💫 Modal con videos */}
      <AnimatePresence>
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/50"
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
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
                <button
                  onClick={closeModal}
                  className="float-right bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold"
                >
                  ×
                </button>

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center clear-both">
                  {activeSub}
                </h2>

                {modalVideos.length === 0 ? (
                  <p className="text-center text-gray-500 py-20">No cards found</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                        className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-pink-100 hover:border-pink-300 overflow-hidden"
                      >
                        <video
                          src={video.file}
                          className="w-full aspect-[4/5] object-cover bg-pink-50"
                          playsInline
                          loop
                          muted
                          onMouseEnter={e => e.target.play().catch(() => {})}
                          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                        <div className="text-center py-3 px-2">
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
