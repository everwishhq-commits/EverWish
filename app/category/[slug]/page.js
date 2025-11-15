"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 FORZAR REGENERACIÓN SIN CACHE
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // 🎯 SUBCATEGORÍAS HARDCODED (aparecen siempre)
  const SUBCATEGORY_GROUPS = {
    "seasonal-global-celebrations": {
      "Holiday Seasons": ["Halloween", "Thanksgiving", "Christmas", "Easter", "New Year", "St Patrick's Day", "Cinco de Mayo"],
      "Cultural Days": ["Valentine's Day", "Independence Day", "Mother's Day", "Father's Day"],
      "Seasonal": ["Spring", "Summer", "Fall", "Winter"],
    },
    "birthdays-celebrations": {
      "Birthday": ["Birthday", "Sweet 16", "21st Birthday"],
      "Celebrations": ["Party", "Surprise"],
    },
    "love-weddings-anniversaries": {
      "Romance": ["Love", "Hugs", "Valentine's Day"],
      "Wedding": ["Wedding", "Anniversary"],
    },
    "family-friendship": {
      "Family": ["Mother's Day", "Father's Day", "Parents"],
      "Friendship": ["Friends", "Best Friends"],
    },
    "work": {
      "Career": ["New Job", "Promotion", "Retirement"],
      "Education": ["Graduation", "School"],
    },
    "babies-parenting": {
      "Baby": ["Newborn", "Baby Shower", "Pregnancy"],
      "Parenting": ["Mom Life", "Dad Life"],
    },
    "pets-animal-lovers": {
      "Companion Animals": ["Dogs", "Cats"],
      "Sea Animals": ["Sea Animals"],
      "Farm Animals": ["Farm Animals"],
      "Flying Animals": ["Flying Animals"],
      "Wild Animals": ["Wild Animals"],
    },
    "support-healing-care": {
      "Support": ["Get Well", "Thinking of You"],
      "Sympathy": ["Condolences", "Loss"],
    },
    "hear-every-heart": {
      "Diversity": ["Inclusivity", "Unity", "Peace"],
    },
    "sports": {
      "Sports": ["Soccer", "Basketball", "Football"],
      "Fitness": ["Gym", "Yoga"],
    },
    "wellness-mindful-living": {
      "Wellness": ["Self-Care", "Meditation"],
    },
    "life-journeys-transitions": {
      "New Beginnings": ["New Home", "Moving"],
      "Everyday": ["Thank You", "Just Because"],
    },
  };

  function filterByCategory(videos, categorySlug) {
    return videos.filter(v => {
      if (v.categories && Array.isArray(v.categories)) {
        return v.categories.includes(categorySlug);
      }
      return false;
    });
  }

  function filterBySubcategory(videos, sub) {
    return videos.filter(v => {
      if (v.subcategory === sub) return true;
      if (v.subcategories && Array.isArray(v.subcategories)) {
        return v.subcategories.includes(sub);
      }
      return false;
    });
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = data.videos || [];
        
        let filtered = filterByCategory(all, slug);
        
        if (q) {
          const searchTerm = q.toLowerCase();
          filtered = filtered.filter(v => {
            const searchable = [
              v.name,
              v.object,
              v.subcategory,
              ...(v.tags || []),
              ...(v.categories || [])
            ].filter(Boolean).join(" ").toLowerCase();
            
            return searchable.includes(searchTerm);
          });
        }
        
        setCategoryVideos(filtered);
        
        // Construir grupos
        const groupsData = {};
        const availableGroups = SUBCATEGORY_GROUPS[slug] || {};
        
        Object.entries(availableGroups).forEach(([groupName, subcategories]) => {
          const subsWithCounts = subcategories.map(sub => {
            const count = filterBySubcategory(filtered, sub).length;
            return { name: sub, count };
          });
          
          if (q) {
            const withResults = subsWithCounts.filter(s => s.count > 0);
            if (withResults.length > 0) {
              groupsData[groupName] = withResults;
            }
          } else {
            groupsData[groupName] = subsWithCounts;
          }
        });
        
        setGroups(groupsData);
        
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, q]);

  useEffect(() => {
    if (subFromUrl && categoryVideos.length > 0 && !activeSub) {
      openModal(subFromUrl);
    }
  }, [subFromUrl, categoryVideos]);

  const openModal = (sub) => {
    setActiveSub(sub);
    setModalVideos([]);
    
    setTimeout(() => {
      const videos = filterBySubcategory(categoryVideos, sub);
      setModalVideos(videos);
    }, 100);
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

      <AnimatePresence mode="wait">
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
            />
            
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 relative" 
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="sticky top-0 float-right bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-md z-10 transition-all"
                >
                  ×
                </button>

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center clear-both pt-2">
                  {activeSub}
                </h2>

                {modalVideos.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading cards...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                    {modalVideos.map((video, i) => (
                      <motion.div
                        key={`${video.name}-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onClick={() => {
                          router.push(`/edit/${video.name}`);
                        }}
                        className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl overflow-hidden transition-all"
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
