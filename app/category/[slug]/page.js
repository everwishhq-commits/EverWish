"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 🗂️ Grupos de subcategorías por categoría
const SUBCATEGORY_GROUPS = {
  "seasonal-global-celebrations": {
    "Seasons": ["Spring", "Summer", "Fall", "Winter"],
    "Cultural Celebrations": ["Lunar New Year", "Valentine's Day", "St. Patrick's Day", "Carnival", "Cinco de Mayo", "Oktoberfest", "Day of the Dead"],
    "Family Days": ["Mother's Day", "Father's Day", "Grandparents Day", "Easter"],
    "Holiday Season": ["Halloween", "Thanksgiving", "Christmas", "Hanukkah", "Kwanzaa"],
    "American Holidays": ["MLK Day", "Presidents' Day", "Memorial Day", "Independence Day", "Labor Day", "Veterans Day", "Columbus Day", "Juneteenth"],
  },
  "birthdays-celebrations": {
    "Ages": ["Baby", "Kids", "Teens", "Adult"],
    "Milestones": ["Sweet 16", "18th", "21st", "30th", "40th", "50th"],
    "Styles": ["Funny", "Belated", "Surprise"],
  },
  "love-weddings-anniversaries": {
    "Romance": ["Love", "I Love You", "Miss You", "Hugs"],
    "Wedding": ["Wedding", "Engagement", "Proposal"],
    "Anniversary": ["Anniversary", "1 Year", "5 Years", "10 Years"],
  },
  "family-friendship": {
    "Friendship": ["Best Friends", "Friend"],
    "Parents": ["Mom", "Dad"],
    "Siblings": ["Sister", "Brother"],
    "Extended Family": ["Grandparents", "Aunt", "Uncle"],
  },
  "work": {
    "Achievements": ["New Job", "Promotion", "New Business"],
    "Graduation": ["Graduation", "College", "High School"],
    "Professions": ["Teacher", "Nurse", "Firefighter", "Police", "Military"],
    "Appreciation": ["Coworker", "Boss", "Team"],
  },
  "babies-parenting": {
    "Arrival": ["Pregnancy", "Baby Shower", "Newborn", "Twins"],
    "Parents": ["New Parents", "Mom Life", "Dad Life"],
  },
  "pets-animal-lovers": {
    "Dogs": ["Dog", "Puppy"],
    "Cats": ["Cat", "Kitten"],
    "Other": ["Pet", "Cute", "Funny"],
  },
  "support-healing-care": {
    "Health": ["Get Well", "Recovery", "Hospital"],
    "Support": ["Thinking of You", "Stay Strong"],
    "Loss": ["Sympathy", "Condolences"],
  },
  "diversity-connection": {
    "Inclusion": ["Diversity", "All Welcome", "Multicultural"],
    "Values": ["Kindness", "Peace", "Unity"],
  },
  "sports": {
    "Team Sports": ["Soccer", "Basketball", "Football"],
    "Fitness": ["Gym", "Yoga"],
  },
  "wellness-mindful-living": {
    "Wellness": ["Self-Care", "Meditation", "Gratitude"],
    "Lifestyle": ["Healthy Living", "Nature"],
  },
  "life-journeys-transitions": {
    "Achievements": ["Congratulations", "Good Luck"],
    "Moving": ["New Home", "Housewarming"],
    "Everyday": ["Just Because", "Thank You"],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  
  const [allVideos, setAllVideos] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();

        console.log("📦 API Response:", data);

        const normalize = (str) =>
          str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-").trim();

        const currentCategory = normalize(slug);

        const filtered = (data.videos || []).filter((v) => {
          const mainMatch = normalize(v.category).includes(currentCategory) || 
                           currentCategory.includes(normalize(v.category));
          
          if (mainMatch) return true;
          
          if (v.categories && Array.isArray(v.categories)) {
            return v.categories.some(cat => {
              const normCat = normalize(cat);
              return normCat.includes(currentCategory) || currentCategory.includes(normCat);
            });
          }
          
          return false;
        });

        console.log(`✅ Videos filtrados para ${slug}:`, filtered.length);
        console.log("📹 Videos:", filtered);
        setAllVideos(filtered);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [slug, searchTerm]);

  const groups = SUBCATEGORY_GROUPS[slug] || {};
  const groupNames = Object.keys(groups);

  // 🎯 FILTRADO MEJORADO - Busca en múltiples campos
  const activeVideos = activeSub
    ? allVideos.filter(v => {
        const searchTerm = activeSub.toLowerCase().replace(/\s+/g, "");
        
        // 1. Buscar en el nombre del archivo
        const fileName = (v.name || "").toLowerCase().replace(/_/g, "");
        if (fileName.includes(searchTerm)) {
          console.log(`✅ Match por nombre: ${v.name}`);
          return true;
        }
        
        // 2. Buscar en subcategoría
        const vSub = (v.subcategory || "").toLowerCase().replace(/\s+/g, "");
        if (vSub.includes(searchTerm) || searchTerm.includes(vSub)) {
          console.log(`✅ Match por subcategoría: ${v.name} (${v.subcategory})`);
          return true;
        }
        
        // 3. Buscar en objeto
        const vObj = (v.object || "").toLowerCase().replace(/\s+/g, "");
        if (vObj.includes(searchTerm) || searchTerm.includes(vObj)) {
          console.log(`✅ Match por objeto: ${v.name} (${v.object})`);
          return true;
        }
        
        // 4. Buscar en tags
        if (v.tags && Array.isArray(v.tags)) {
          const hasTag = v.tags.some(tag => {
            const normalizedTag = tag.toLowerCase().replace(/\s+/g, "");
            return normalizedTag.includes(searchTerm) || searchTerm.includes(normalizedTag);
          });
          if (hasTag) {
            console.log(`✅ Match por tag: ${v.name}`);
            return true;
          }
        }
        
        // 5. Buscar palabra clave en el nombre (ej: "halloween" en "ghost_halloween_love_1A")
        const nameParts = (v.name || "").toLowerCase().split("_");
        if (nameParts.some(part => part === searchTerm || part.includes(searchTerm) || searchTerm.includes(part))) {
          console.log(`✅ Match por parte del nombre: ${v.name}`);
          return true;
        }
        
        return false;
      })
    : [];

  console.log(`🎯 Subcategoría seleccionada: "${activeSub}"`);
  console.log(`📊 Total videos en categoría: ${allVideos.length}`);
  console.log(`🎬 Videos encontrados para "${activeSub}": ${activeVideos.length}`);
  
  if (activeVideos.length > 0) {
    console.log("📹 Videos que coinciden:");
    activeVideos.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.name} - ${v.subcategory} - ${v.object}`);
    });
  }

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8] text-gray-600">
        <p className="animate-pulse text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff5f8] text-gray-800 flex flex-col items-center py-10 px-4">
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-6"
      >
        ← Back to Main Categories
      </button>

      <h1 className="text-4xl font-extrabold text-pink-600 mb-3 capitalize text-center">
        {slug.replace(/-/g, " ")}
      </h1>

      {/* Mostrar grupos si no hay grupo activo */}
      {!activeGroup && (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
          {groupNames.map((groupName, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveGroup(groupName)}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold"
            >
              {groupName}
            </motion.button>
          ))}
        </div>
      )}

      {/* Mostrar subcategorías del grupo activo */}
      {activeGroup && !activeSub && (
        <>
          <button
            onClick={() => setActiveGroup(null)}
            className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
          >
            ← Back to Groups
          </button>
          
          <h2 className="text-2xl font-bold text-pink-600 mb-6">{activeGroup}</h2>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
            {groups[activeGroup].map((subName, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  console.log("🎯 Seleccionando subcategoría:", subName);
                  setActiveSub(subName);
                }}
                whileHover={{ scale: 1.05 }}
                className="px-5 py-3 rounded-full bg-white shadow-sm border border-pink-100 hover:border-pink-200 hover:bg-pink-50 text-gray-700 font-semibold"
              >
                {subName}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* Modal con videos - MEJORADO */}
      <AnimatePresence>
        {activeSub && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSub(null)}
            />
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-pink-200 p-4 sm:p-6">
                {/* Botón cerrar */}
                <button
                  onClick={() => setActiveSub(null)}
                  className="sticky top-0 right-0 float-right bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-md z-10"
                >
                  ×
                </button>

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center clear-both pt-2">
                  {activeSub}
                </h2>

                {activeVideos.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-2">No cards found for this subcategory.</p>
                    <p className="text-gray-400 text-sm">Try another option</p>
                    <div className="mt-4 text-xs text-gray-400">
                      <p>Debug info:</p>
                      <p>Category: {slug}</p>
                      <p>Subcategory: {activeSub}</p>
                      <p>Total videos in category: {allVideos.length}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pb-4">
                    {activeVideos.map((video, i) => {
                      return (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => {
                            console.log("🎬 Navegando a:", video.name);
                            router.push(`/edit/${video.name}`);
                          }}
                          className="cursor-pointer bg-white rounded-2xl shadow-md border-2 border-pink-100 overflow-hidden hover:shadow-xl hover:border-pink-300"
                        >
                          <video
                            src={video.file}
                            className="object-cover w-full aspect-[4/5] bg-pink-50"
                            playsInline
                            loop
                            muted
                            onMouseEnter={(e) => e.target.play().catch(() => {})}
                            onMouseLeave={(e) => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                            onError={(e) => {
                              console.error("❌ Error cargando:", video.file);
                            }}
                          />
                          <div className="text-center py-3 px-2 bg-gradient-to-t from-pink-50 to-white">
                            <p className="text-gray-700 font-semibold text-sm line-clamp-2">
                              {video.object || video.name}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
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
